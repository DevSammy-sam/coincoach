const Transaction = require('../models/transactions');
const Goals = require('../models/goals');

const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

const generateInsights = require('../utils/generateInsights');
const updateGoalProgressFromTransaction = require('../services/updateGoalProgress');
const conversion = require('../services/conversion');
const { transactionSchema, bulkUploadJSONSchema } = require('../utils/schemas');
const ExpressError = require('../utils/ExpressError');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
};

module.exports.createTransaction = async (req, res) => {
    const { error, value } = transactionSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
    }
    const { amount, type, date, description, category, name, recurrence, recurring, currency } = value;
    const goals = await Goals.find({user : req.user._id});

    const conversionRate = await conversion(currency, req.user.preferredCurrency);
    const convertedAmount = Math.abs(amount * conversionRate);

    const transaction = new Transaction({
        userId: req.user._id,
        amount,
        type,
        date,
        description,
        category,
        name,
        recurring,
        recurrence,
        currency,
        convertedAmount,
        inputMethod: 'manual'
    });

    await transaction.save();

    await updateGoalProgressFromTransaction(transaction);

    await generateInsights(req.user._id).catch(console.error);

    req.flash('success', 'Transaction recorded successfully!');
    res.redirect(`/transactions/${transaction._id}`);
};

module.exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id });
    const count = await Transaction.countDocuments({ userId: req.user._id });
    res.render('transactions/index', { transactions, count });
};

module.exports.getTransactionById = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || !transaction.userId.equals(req.user._id)) {
        req.flash('error', 'Transaction not found');
        return res.redirect('/transactions');
    }

    res.render('transactions/show', { transaction });
};

module.exports.deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || !transaction.userId.equals(req.user._id)) {
        req.flash('error', 'Transaction not found');
        return res.redirect('/transactions');
    };

    await Transaction.findByIdAndDelete(req.params.id);

    await Goals.updateMany(
        { user: req.user._id },
        { $set: { 'progress.totalSavedSoFar': 0, 'progress.completionPercentage': 0 } }
    );

    req.flash('success', 'Transaction deleted successfully');
    res.redirect('/transactions');
};

module.exports.editTransactionsForm = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || !transaction.userId.equals(req.user._id)) {
        req.flash('error', 'Transaction not found');
        return res.redirect('/transactions');
    }

    res.render('transactions/edit', { transaction });
};

module.exports.updateTransaction = async (req, res) => {
    const { amount, type, date, description, category, name, currency } = req.body;
    const conversionRate = await conversion(currency, req.user.preferredCurrency);
    const convertedAmount = Math.abs(amount * conversionRate);

    const transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        { amount, type, date, description, category, name, convertedAmount, currency },
        { new: true }
    );

    // Update goal progress
    await updateGoalProgressFromTransaction(transaction);

    req.flash('success', 'Transaction updated successfully');
    res.redirect(`/transactions/${transaction._id}`);
};

/* ======================
   BULK UPLOAD (CSV / XLSX)
====================== */

function parseExcelDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        return new Date(excelEpoch.getTime() + value * 86400000);
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
}

module.exports.bulkUploadForm = (req, res) => {
    res.render('transactions/bulkUpload');
};

module.exports.bulkUpload = async (req, res) => {
    const results = [];
    const errors = [];
    const filePath = req.file.path;
    const ext = req.file.originalname.split('.').pop().toLowerCase();

    let data = [];

    try {
        if (ext === 'csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', row => data.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            data = rows.slice(1).map(r => ({
                date: r[0],
                type: r[1],
                category: r[2],
                amount: r[3],
                description: r[4],
                name: r[5],
                recurring: r[6],
                recurrence: r[7],
                currency: r[8]
            }));
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            const transaction = new Transaction({
                userId: req.user._id,
                date: parseExcelDate(row.date),
                type: String(row.type || '').toLowerCase(),
                category: row.category,
                amount: Number(row.amount),
                description: row.description,
                name: row.name,
                recurring: row.recurring === true || row.recurring === 'true',
                recurrence: row.recurrence,
                currency: row.currency || 'CAD',
                inputMethod: 'CSV'
            });

            if (!transaction.date || isNaN(transaction.amount)) {
                errors.push(`Row ${i + 2}: Invalid data`);
                continue;
            }

            await transaction.save();
            await updateGoalProgressFromTransaction(transaction);

            results.push(transaction);
        }

        generateInsights(req.user._id).catch(console.error);

        req.flash('success', `Imported ${results.length} transactions`);
        if (errors.length) req.flash('error', errors.slice(0, 3).join(', '));

        res.redirect('/transactions');
    } catch (err) {
        req.flash('error', err.message);
        console.error(err);
        res.redirect('/transactions/bulk-upload');
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
};

/* ======================
   BULK UPLOAD JSON
====================== */

module.exports.bulkUploadJSONFrontend = (req, res) => {
    res.render('transactions/bulkUploadJSON');
};

module.exports.bulkUploadJSON = async (req, res) => {
    const { error, value } = bulkUploadJSONSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details.map(d => d.message).join(', '));
      return res.redirect('/transactions/bulk-upload-json');
    }

    const { transactions } = value;

    for (const t of transactions) {
        const transaction = new Transaction({
            userId: req.user._id,
            date: parseExcelDate(t.date),
            type: t.type,
            category: t.category,
            amount: Number(t.amount),
            description: t.description,
            name: t.name,
            recurring: t.recurring,
            recurrence: t.recurrence,
            currency: t.currency || 'CAD',
            inputMethod: 'JSON'
        });

        await transaction.save();
        await updateGoalProgressFromTransaction(transaction);
    }

    generateInsights(req.user._id).catch(console.error);

    req.flash('success', 'Transactions imported successfully');
    res.redirect('/transactions');
};
