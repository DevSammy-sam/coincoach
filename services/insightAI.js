const Groq = require("groq-sdk");

const transactionInsight = async (transactions, goals) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
  You are a financial analytics and insight engine.
  
  You will receive a list of user transactions and also goals in JSON format.
  Each transaction includes:
  - name
  - type ("income" or "expense")
  - amount
  - currency
  - date (ISO format)
  - category
  - description
  - recurring (boolean)
  - recurrence (optional)
  - inputMethod
  
  Each goal includes:
  - id
  - title
  - userInput
  - goalSummary (targetAmount, currentSavings, timeframeValue, timeframeUnit, assumptions)
  - any additional metadata relevant to the user's objective
  
  Your task is to analyze ALL transactions in the context of the provided goals and return a structured JSON object containing computed metrics AND intelligent insights that reference the goals where relevant.
  
  ────────────────────────────────────────
  REQUIRED OUTPUT FORMAT (JSON ONLY)
  ────────────────────────────────────────
  
  {
    "incomeVsExpenses": {
      "totalIncome": number,
      "totalExpenses": number,
      "net": number,
      "chart": "Income vs Expenses Over Time"
    },
  
    "expenseBreakdown": {
      "categories": [
        { "category": string, "total": number }
      ],
      "chart": "Expense Categories Pie Chart"
    },
  
    "topExpenses": [
      { "name": string, "amount": number, "date": string, "category": string }
    ],
  
    "monthlyAverages": {
      "averageMonthlyIncome": number,
      "averageMonthlySpend": number,
      "averageMonthlyNet": number
    },
  
    "incomeSources": {
      "sources": [
        { "category": string, "total": number }
      ],
      "chart": "Income Categories"
    },
  
    "recentLargeTransactions": [
      { "name": string, "amount": number, "date": string, "type": string }
    ],
  
    "spendingEfficiencyScore": number,
  
    "recurringInsights": {
      "totalRecurringIncome": number,
      "totalRecurringExpenses": number,
      "recurringIncomePercentage": number,
      "notes": string
    },
  
    "riskSignals": [
      {
        "type": string,
        "message": string,
        "severity": "low" | "medium" | "high"
      }
    ],
  
    "optimizationSuggestions": [
      {
        "area": string,
        "suggestion": string
      }
    ],
  
    "behaviorPatterns": {
      "highestIncomeMonth": string | null,
      "highestExpenseMonth": string | null,
      "notes": string
    },
  
    "futureProjection": {
      "projectedMonthlyNet": number,
      "projectedYearlyNet": number,
      "confidence": "low" | "medium" | "high"
    },
  
    "goalAssessment": {
      "goalId": string | null,
      "goalTitle": string | null,
      "targetAmount": number | null,
      "currentSavings": number | null,
      "timeframeMonths": number | null,
      "isAchievable": boolean | null,
      "requiredMonthlySavings": number | null,
      "recommendedAdjustments": [ string ],
      "notes": string | null
    },
  
    "summary": string
  }
  
  ────────────────────────────────────────
  RULES
  ────────────────────────────────────────
  
  - Return ONLY valid JSON. No markdown, no explanations.
  - Valid JSON and Valid JSON only. Nothing else.
  - All numbers must be numeric (no strings).
  - Dates must remain in ISO format.
  - Ignore transactions with invalid or missing amounts or dates.
  - Group monthly calculations by calendar month (YYYY-MM).
  - “Large transactions” = top 5 highest-value transactions in the last 90 days.
  - If a section has no data, return empty arrays or null values.
  - Do NOT invent data.
  - Do NOT infer categories that do not exist.
  - Category names are case-sensitive; do not auto-merge them.
  - Use the full transaction list for all calculations.
  - If you don't have a value for something, return NULL
  - When assessing goals, use the provided goal object(s). If multiple goals are provided, evaluate each and return the most relevant goal in goalAssessment (match by goal id or the first goal if no id).
  - For goal timeframe conversions, normalize timeframeUnit to months (e.g., "year" -> 12 months) and compute required monthly savings accordingly.
  
  ────────────────────────────────────────
  TRANSACTIONS INPUT
  ────────────────────────────────────────
  ${JSON.stringify(transactions)}
  
  ────────────────────────────────────────
  GOALS INPUT
  ────────────────────────────────────────
  ${JSON.stringify(goals)}
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", 
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const raw = response.choices[0].message.content;

    // Parse JSON safely with multiple fallback strategies
    let jsonString = raw;
    let parsedData;

    // Helper function to validate and sanitize the parsed data
    const validateAndSanitizeData = (data) => {
        if (!data || typeof data !== 'object') {
            return null;
        }

        // Ensure all required fields exist with proper defaults
        const sanitized = {
            incomeVsExpenses: data.incomeVsExpenses || {
                totalIncome: 0,
                totalExpenses: 0,
                net: 0,
                chart: "Income vs Expenses Over Time"
            },
            expenseBreakdown: data.expenseBreakdown || {
                categories: [],
                chart: "Expense Categories Pie Chart"
            },
            topExpenses: Array.isArray(data.topExpenses) ? data.topExpenses : [],
            monthlyAverages: data.monthlyAverages || {
                averageMonthlyIncome: 0,
                averageMonthlySpend: 0,
                averageMonthlyNet: 0
            },
            incomeSources: data.incomeSources || {
                sources: [],
                chart: "Income Categories"
            },
            recentLargeTransactions: Array.isArray(data.recentLargeTransactions) ? data.recentLargeTransactions : [],
            spendingEfficiencyScore: typeof data.spendingEfficiencyScore === 'number' ? data.spendingEfficiencyScore : 0,
            recurringInsights: data.recurringInsights || {
                totalRecurringIncome: 0,
                totalRecurringExpenses: 0,
                recurringIncomePercentage: 0,
                notes: "Unable to parse detailed insights from AI response"
            },
            riskSignals: Array.isArray(data.riskSignals) ? data.riskSignals : [],
            optimizationSuggestions: Array.isArray(data.optimizationSuggestions) ? data.optimizationSuggestions : [],
            behaviorPatterns: data.behaviorPatterns || {
                highestIncomeMonth: null,
                highestExpenseMonth: null,
                notes: "Unable to analyze behavior patterns due to parsing error"
            },
            futureProjection: data.futureProjection || {
                projectedMonthlyNet: 0,
                projectedYearlyNet: 0,
                confidence: "low"
            },
            goalAssessment: data.goalAssessment || {
                goalId: null,
                goalTitle: null,
                targetAmount: null,
                currentSavings: null,
                timeframeMonths: null,
                isAchievable: null,
                requiredMonthlySavings: null,
                recommendedAdjustments: [],
                notes: "Unable to assess goals due to parsing error"
            },
            summary: typeof data.summary === 'string' ? data.summary : "Unable to generate insights due to a parsing error. Please try again."
        };

        return sanitized;
    };

    try {
        // First, try to parse the raw response directly
        parsedData = JSON.parse(raw);
        const validatedData = validateAndSanitizeData(parsedData);
        if (validatedData) {
            return validatedData;
        } else {
            throw new Error("Parsed data is invalid or missing required structure");
        }
    } catch (parseError) {
        // If direct parsing fails, try to extract JSON from the response
        try {
            // Look for JSON object boundaries
            const jsonStart = raw.indexOf("{");
            const jsonEnd = raw.lastIndexOf("}");
            
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                jsonString = raw.substring(jsonStart, jsonEnd + 1);
                parsedData = JSON.parse(jsonString);
                return parsedData;
            }
        } catch (extractError) {
            // If substring parsing fails, try to clean the JSON string
            try {
                // Remove any markdown code block markers
                jsonString = jsonString.replace(/```json\s*|```/g, '');
                
                // Remove any leading/trailing whitespace and newlines
                jsonString = jsonString.trim();
                
                // Try to fix common JSON issues
                // Replace single quotes with double quotes (basic fix)
                jsonString = jsonString.replace(/'/g, '"');
                
                // Ensure proper comma placement and remove trailing commas
                jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
                
                parsedData = JSON.parse(jsonString);
                return parsedData;
            } catch (cleanError) {
                console.error("Failed to parse AI response after all attempts:", cleanError);
                console.error("Raw response:", raw);
                console.error("Extracted JSON string:", jsonString);
                
                // Return a fallback structure with the available data
                return {
                    incomeVsExpenses: {
                        totalIncome: 0,
                        totalExpenses: 0,
                        net: 0,
                        chart: "Income vs Expenses Over Time"
                    },
                    expenseBreakdown: {
                        categories: [],
                        chart: "Expense Categories Pie Chart"
                    },
                    topExpenses: [],
                    monthlyAverages: {
                        averageMonthlyIncome: 0,
                        averageMonthlySpend: 0,
                        averageMonthlyNet: 0
                    },
                    incomeSources: {
                        sources: [],
                        chart: "Income Categories"
                    },
                    recentLargeTransactions: [],
                    spendingEfficiencyScore: 0,
                    recurringInsights: {
                        totalRecurringIncome: 0,
                        totalRecurringExpenses: 0,
                        recurringIncomePercentage: 0,
                        notes: "Unable to parse detailed insights from AI response"
                    },
                    riskSignals: [
                        {
                            type: "Parsing Error",
                            message: "Failed to parse AI response. Please try generating insights again.",
                            severity: "medium"
                        }
                    ],
                    optimizationSuggestions: [
                        {
                            area: "System",
                            suggestion: "The AI response could not be parsed properly. This may be a temporary issue with the AI service."
                        }
                    ],
                    behaviorPatterns: {
                        highestIncomeMonth: null,
                        highestExpenseMonth: null,
                        notes: "Unable to analyze behavior patterns due to parsing error"
                    },
                    futureProjection: {
                        projectedMonthlyNet: 0,
                        projectedYearlyNet: 0,
                        confidence: "low"
                    },
                    goalAssessment: {
                        goalId: null,
                        goalTitle: null,
                        targetAmount: null,
                        currentSavings: null,
                        timeframeMonths: null,
                        isAchievable: null,
                        requiredMonthlySavings: null,
                        recommendedAdjustments: [],
                        notes: "Unable to assess goals due to parsing error"
                    },
                    summary: "Unable to generate insights due to a parsing error. Please try again."
                };
            }
        }
    }
} catch (error) {
    console.error("Groq Insight Error:", error);
    throw new Error("Failed to generate transaction insights");
  }
};

module.exports = transactionInsight;