# 🏆 CoinCoach Hackathon Execution Plan + README

---

# 🎯 Core Positioning

**One-liner:**
> CoinCoach helps you understand where your money is going, why it’s happening, and what to do about it — automatically.

**Demo Story:**
1. Import transactions / upload receipt  
2. CoinCoach detects patterns (subscriptions, spikes, unusual spending)  
3. AI explains it in plain English  
4. User gets actionable recommendations  

---

# 📅 11-Day Checklist

## ✅ Day 1 — Narrow the Scope
- [ ] Define core flow:
  - Transactions → Insights → Recommendation
- [ ] Remove/ignore:
  - Chat (optional)
  - Currency converter
  - Extra pages not needed
- [ ] Write rough demo script

---

## ✅ Day 2 — Demo Data System
- [ ] Create seed data (realistic transactions)
- [ ] Add Demo Mode button (auto-login demo user)
- [ ] Ensure:
  - No empty states
  - No API failures
  - Minimal loading delays

---

## ✅ Day 3 — Insights That “Wow”
- [ ] Show clearly:
  - Income vs expenses
  - Top categories
  - Recurring payments
  - Unusual activity
- [ ] Add human-readable explanations
  - Example:
    > "You spent 35% more on food this month than usual"

---

## ✅ Day 4 — Make It Visual
- [ ] Add charts (pie/bar)
- [ ] Highlight key stats (cards)
- [ ] Reduce text clutter

---

## ✅ Day 5 — Receipt OCR Flow
- [ ] Ensure smooth:
  - Upload → Extract → Save
- [ ] Test with real receipts
- [ ] Preload demo receipts if slow

---

## ✅ Day 6 — AI Insight Polish
- [ ] Structure AI output:
  - Summary
  - Problems
  - Recommendations
- [ ] Avoid generic responses
- [ ] Cache/pre-generate demo results

---

## ✅ Day 7 — UI Polish (High Impact)
- [ ] Fix navigation (especially mobile)
- [ ] Improve spacing & typography
- [ ] Focus only on:
  - Home
  - Dashboard
  - Insights

---

## ✅ Day 8 — README + Docs
- [ ] Write full README
- [ ] Add screenshots
- [ ] Add architecture diagram
- [ ] Add “judge walkthrough”

---

## ✅ Day 9 — Record Demo Video 🎥
- [ ] 2–3 minutes max
- [ ] Structure:
  1. Problem
  2. Solution
  3. Demo
  4. Impact
- [ ] Show “aha moment”

---

## ✅ Day 10 — Dry Run + Fixes
- [ ] Run demo 3–5 times
- [ ] Fix bugs & UI issues
- [ ] Ensure stable local demo

---

## ✅ Day 11 — Final Polish
- [ ] Clean repo
- [ ] Fix naming issues (e.g., receipt spelling)
- [ ] Verify video + README
- [ ] Submit

---

# 📄 README

## 🚀 CoinCoach

> Understand where your money goes — and take control of it.

---

## 🧠 Problem

Many people see money leaving their accounts but **don’t understand why**.

- Hidden subscriptions  
- Irregular spending habits  
- No clear financial insights  

---

## 💡 Solution

CoinCoach analyzes your transactions and provides:

- Clear spending breakdowns  
- Detection of unusual activity  
- AI-powered explanations  
- Actionable financial recommendations  

---

## ✨ Features

- 📊 Transaction tracking & categorization  
- 🤖 AI-powered financial insights  
- 🧾 Receipt scanning (OCR → transaction)  
- 📈 Spending analysis dashboard  
- 📤 Export (CSV / Excel / Google Sheets)  
- 📄 PDF reports  

---

## 🎬 Demo

👉 *Add your video link here*

**Demo Flow:**
1. Load demo account  
2. View transactions  
3. Generate insights  
4. See recommendations  

---

## 🖼 Screenshots

*(Add images here)*

- Dashboard  
- Insights  
- Receipt upload  

---

## 🏗 Architecture

**Tech Stack:**
- Backend: Node.js, Express  
- Database: MongoDB  
- AI: Groq API  
- OCR: Tesseract.js  
- Files: multer, PDFKit, ExcelJS  

**Flow:**
