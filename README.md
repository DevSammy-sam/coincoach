# CoinCoach

CoinCoach is a comprehensive financial management application built with Node.js, Express.js, and MongoDB. It helps users track transactions, set financial goals, gain insights into spending habits, manage bills, and interact with AI-powered features for personalized financial advice.

## Problem Statement

Many people struggle with managing their personal finances effectively, leading to poor spending habits, missed bill payments, and unachieved savings goals. CoinCoach addresses this by providing an intuitive platform that combines transaction tracking, AI-driven insights, and educational tools to empower users to take control of their financial future.

## Financial Literacy

CoinCoach helps users build essential financial literacy skills by providing clear, actionable insights into their spending patterns and financial health. Users learn to understand concepts like budgeting, expense tracking, bill management, and goal setting through interactive tools and AI-powered explanations. This education is crucial because financial literacy directly impacts long-term wealth building, reduces financial stress, and enables better decision-making for major life purchases like homes, cars, and retirement planning.

## Features

- **User Authentication**: Secure registration, login, logout, and password reset functionality with rate limiting.
- **Transaction Management**: Create, view, edit, delete, and bulk upload transactions (CSV/JSON support).
- **Financial Goals**: Set and track progress towards financial goals with AI-powered updates.
- **Insights**: Generate personalized financial insights using AI to analyze spending patterns.
- **Bill Management**: Track and predict bills with automated email alerts.
- **Currency Conversion**: Convert between different currencies for international transactions.
- **Chat AI**: Interact with an AI assistant for financial advice and queries.
- **Receipt Analysis**: Upload and analyze receipts using OCR and AI.
- **Export Data**: Export financial data to Excel or PDF formats.
- **Dashboard**: Personalized user dashboard with financial summaries.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Templating**: EJS
- **File Uploads**: Multer
- **AI Integration**: Groq SDK for AI features
- **Email**: Nodemailer for notifications
- **Image Processing**: Sharp, Tesseract.js for OCR
- **Validation**: Joi
- **Security**: Helmet, Express Rate Limit, XSS protection
- **Other**: Cloudinary for image storage, ExcelJS for exports, PDFKit for PDFs

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DevOlabode/coincoach
   cd coincoach
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/coincoach
   SESSION_SECRET=your-session-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   GROQ_API_KEY=your-groq-api-key
   ```

4. Start the application:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Registration**: Create an account with email and password.
2. **Complete Profile**: Fill in additional details like full name, display name, and preferred currency.
3. **Add Transactions**: Manually add transactions or bulk upload via CSV/JSON.
4. **Set Goals**: Create financial goals and track progress.
5. **View Insights**: Analyze spending patterns with AI-generated insights.
6. **Manage Bills**: Add bills and receive automated alerts.
7. **Chat with AI**: Ask financial questions to the AI assistant.
8. **Export Data**: Download financial reports in Excel or PDF format.

## API Endpoints

### Authentication
- `GET /` - Home page
- `GET /register` - Registration form
- `POST /register` - Register user
- `GET /login` - Login form
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /enter-email` - Password reset email form
- `POST /send-reset-code` - Send reset code
- `GET /confirm-code` - Confirm reset code form
- `POST /confirm-code` - Confirm reset code
- `GET /reset-password` - Reset password form
- `POST /reset-password` - Reset password

### Transactions
- `GET /transactions` - List all transactions
- `GET /transactions/new` - New transaction form
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Show transaction
- `GET /transactions/:id/edit` - Edit transaction form
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/bulk-upload` - Bulk upload form
- `POST /transactions/bulk-upload` - Bulk upload CSV
- `GET /transactions/bulk-json` - Bulk upload JSON form
- `POST /transactions/bulk-json` - Bulk upload JSON

### Other Features
- `/user/*` - User profile management
- `/goals/*` - Goal setting and tracking
- `/insights/*` - Financial insights
- `/conversion/*` - Currency conversion
- `/chat/*` - AI chat sessions
- `/reciept/*` - Receipt analysis
- `/export/*` - Data export
- `/` - Bill management

## Project Structure

```
coincoach/
├── config/          # Database, email, session configuration
├── controllers/     # Route handlers
├── models/          # Mongoose schemas
├── routes/          # Express routes
├── services/        # Business logic and external services
├── utils/           # Utility functions
├── views/           # EJS templates
├── public/          # Static assets (CSS, JS, images)
├── uploads/         # Temporary file uploads
├── middleware.js    # Custom middleware
├── index.js         # Application entry point
└── package.json     # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue on the GitHub repository.
