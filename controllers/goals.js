const Goals = require('../models/goals');
const Transactions = require('../models/transactions');
const goalsAI = require('../services/goalsAI');
const validator = require('validator');
const { goalExplanationSchema, updateGoalStatusSchema } = require('../utils/schemas');
const ExpressError = require('../utils/ExpressError');

const recalculateGoalProgress = require('../utils/recalculateGoalProgress');


/**
 * =========================
 * INDEX
 * =========================
 */
module.exports.index = async (req, res) => {
  const goals = await Goals.find({ user: req.user._id });
  res.render('goals/index', { goals });
};

/**
 * =========================
 * CREATE GOAL
 * =========================
 */
module.exports.goals = async (req, res) => {
  const { error, value } = goalExplanationSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  let { explanation } = value;

  // Sanitize user input (safe for storage & AI)
  explanation = validator.escape(explanation.trim());

  const transactions = await Transactions.find({
    userId: req.user._id
  }).lean();

  const aiResult = await goalsAI(explanation, transactions);

  // ---- Normalize AI Output ----
  const {
    title,
    goalSummary,
    financialAnalysis,
    feasibility,
    plan,
    progressTracking,
    motivationTip
  } = aiResult;

  const normalizedGoal = {
    user: req.user._id,
    title,
    userInput: explanation,

    goalSummary: {
      targetAmount: goalSummary.targetAmount,
      currentSavings: goalSummary.currentSavings,
      timeframeValue: goalSummary.timeframeValue,
      timeframeUnit: goalSummary.timeframeUnit,
      assumptions: goalSummary.assumptions || []
    },

    financialAnalysis: {
      averageIncomePerPeriod: financialAnalysis.averageIncomePerPeriod,
      averageExpensesPerPeriod: financialAnalysis.averageExpensesPerPeriod,
      averageSavingsPerPeriod: financialAnalysis.averageSavingsPerPeriod,
      spendingInsights: financialAnalysis.spendingInsights || []
    },

    feasibility: {
      isAchievable: feasibility.isAchievable,
      reason: feasibility.reason,
      suggestedAdjustments: feasibility.suggestedAdjustments || []
    },

    plan: plan.map(step => ({
      periodNumber: step.periodNumber,
      amountToSave: step.amountToSave,
      recommendedActions: step.recommendedActions || []
    })),

    progressTracking: {
      targetPerPeriod: progressTracking.targetPerPeriod,
      milestones: progressTracking.milestones.map(m => ({
        periodNumber: m.periodNumber,
        expectedSavings: m.expectedSavings
      })),
      reviewFrequency: progressTracking.reviewFrequency
    },

    motivationTip
  };

  const goal = new Goals(normalizedGoal);
  await goal.save();

  req.flash('success', 'Goal created successfully!');
  res.redirect(`/goals/${goal._id}`);
};

/**
 * =========================
 * SHOW
 * =========================
 */
module.exports.show = async (req, res) => {
  const goal = await Goals.findById(req.params.id);

  if (!goal) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  res.render('goals/show', { goal });
};

/**
 * =========================
 * DELETE
 * =========================
 */
module.exports.deleteGoal = async (req, res) => {
  const goal = await Goals.findByIdAndDelete(req.params.id);

  if (!goal) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  req.flash('success', `Deleted the ${goal.title}`);
  res.redirect('/goals');
};

/**
 * =========================
 * UPDATE STATUS
 * =========================
 */
module.exports.updateGoalStatus = async (req, res) => {
  const { error, value } = updateGoalStatusSchema.validate(req.body);
  if (error) {
    req.flash('error', error.details.map(d => d.message).join(', '));
    return res.redirect(`/goals/${req.params.id}`);
  }
  
  const goal = await Goals.findById(req.params.id);

  if (!goal || goal.user.toString() !== req.user._id.toString()) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  goal.status = validator.escape(value.status);
  await goal.save();

  req.flash('success', `Goal status updated to ${goal.status}`);
  res.redirect(`/goals/${req.params.id}`);
};

/**
 * =========================
 * COMPLETE A PLAN PERIOD
 * =========================
 */
module.exports.completePeriod = async (req, res) => {
    const { id, periodNumber } = req.params;
  
    const goal = await Goals.findById(id);
  
    if (!goal || goal.user.toString() !== req.user._id.toString()) {
      req.flash('error', 'Goal not found');
      return res.redirect('/goals');
    }
  
    const step = goal.plan.find(
      p => p.periodNumber === Number(periodNumber)
    );
  
    if (!step) {
      req.flash('error', 'Plan step not found');
      return res.redirect(`/goals/${id}`);
    }
  
    if (!step.completed) {
      step.completed = true;
      step.completedAt = new Date();
    }
  
    recalculateGoalProgress(goal);
    await goal.save();
  
    req.flash(
      'success',
      `${goal.goalSummary.timeframeUnit} ${periodNumber} marked as completed`
    );
  
    res.redirect(`/goals/${id}`);
  };
  