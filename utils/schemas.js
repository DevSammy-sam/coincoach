const Joi = require('joi');

// ==================== AUTH SCHEMAS ====================

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  fullName: Joi.string().trim().optional().allow(''),
  displayName: Joi.string().trim().optional().allow(''),
  preferredCurrency: Joi.string().length(3).optional().default('CAD')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const sendResetCodeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

const confirmCodeSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'any.required': 'Reset code is required'
  })
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'New password is required'
  }),
  confirmPassword: Joi.string().required().messages({
    'any.required': 'Password confirmation is required'
  })
}).custom((value, helpers) => {
  if (value.newPassword !== value.confirmPassword) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'password match').messages({
  'any.invalid': 'Passwords do not match'
});

// ==================== TRANSACTION SCHEMAS ====================

const transactionSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Transaction name cannot be empty',
    'any.required': 'Transaction name is required'
  }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be either "income" or "expense"',
    'any.required': 'Type is required'
  }),
  date: Joi.date().required().messages({
    'date.base': 'Please provide a valid date',
    'any.required': 'Date is required'
  }),
  category: Joi.string().trim().required().messages({
    'string.empty': 'Category cannot be empty',
    'any.required': 'Category is required'
  }),
  description: Joi.string().trim().optional().allow(''),
  currency: Joi.string().length(3).optional().default('CAD'),
  recurring: Joi.boolean().optional().default(false),
  recurrence: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').optional().allow('')
});

const bulkUploadJSONSchema = Joi.object({
  transactions: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid('income', 'expense').required(),
      date: Joi.alternatives().try(Joi.date(), Joi.string().isoDate()).required(),
      category: Joi.string().trim().required(),
      description: Joi.string().trim().optional().allow(''),
      currency: Joi.string().length(3).optional().default('CAD'),
      recurring: Joi.boolean().optional().default(false),
      recurrence: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').optional().allow('')
    })
  ).required().messages({
    'array.base': 'Transactions must be an array',
    'any.required': 'Transactions array is required'
  })
});

// ==================== GOALS SCHEMAS ====================

const goalExplanationSchema = Joi.object({
  explanation: Joi.string().trim().min(10).max(1000).required().messages({
    'string.empty': 'Goal explanation cannot be empty',
    'string.min': 'Goal explanation must be at least 10 characters',
    'string.max': 'Goal explanation must be less than 1000 characters',
    'any.required': 'Goal explanation is required'
  })
});

const updateGoalStatusSchema = Joi.object({
  status: Joi.string().valid('in_progress', 'completed', 'paused', 'abandoned').required().messages({
    'any.only': 'Status must be one of: in_progress, completed, paused, abandoned',
    'any.required': 'Status is required'
  })
});

// ==================== CHAT SCHEMAS ====================

const createMessageSchema = Joi.object({
  role: Joi.string().valid('user', 'assistant').required().messages({
    'any.only': 'Role must be either "user" or "assistant"',
    'any.required': 'Role is required'
  }),
  content: Joi.string().trim().min(1).max(5000).required().messages({
    'string.empty': 'Message content cannot be empty',
    'string.max': 'Message content must be less than 5000 characters',
    'any.required': 'Message content is required'
  })
});

const updateMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).required().messages({
    'string.empty': 'Message content cannot be empty',
    'string.max': 'Message content must be less than 5000 characters',
    'any.required': 'Message content is required'
  })
});

const updateSessionTitleSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must be less than 200 characters',
    'any.required': 'Title is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  sendResetCodeSchema,
  confirmCodeSchema,
  resetPasswordSchema,
  transactionSchema,
  bulkUploadJSONSchema,
  goalExplanationSchema,
  updateGoalStatusSchema,
  createMessageSchema,
  updateMessageSchema,
  updateSessionTitleSchema
};
