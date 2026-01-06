# 📋 TODO.md — CoinCoach Hackonomics 2026 Winning Checklist

This TODO list is **laser-focused on winning Hackonomics 2026**, not just “finishing a project”.
Order matters — this is ranked by **judge impact**.

---

## 🧠 1. THEME ALIGNMENT — Financial Literacy & Economics (HIGH PRIORITY)

Judges must immediately understand **what economic problem this solves**.

- [ ] Write a **1–2 sentence problem statement**  
  *Example:* “Unexpected bill spikes (‘bill shock’) cause people to overspend, miss payments, and lose financial stability.”

- [ ] Add a **Financial Literacy section** to README:
  - What users *learn* (spending patterns, trends, anomalies)
  - Why this matters economically (budgeting, cash flow, planning)

- [ ] Update UI text to explain insights in **plain language**
  - “This bill is higher than usual because…”
  - “This trend shows your spending growing faster than income”

---

## 🔧 2. CORE MVP COMPLETION (MUST WORK FLAWLESSLY)

If this breaks, you don’t win.

### App Stability
- [ ] Fix **all known bugs** (especially CSRF, form submissions, auth edge cases)
- [ ] Validate all user inputs server-side
- [ ] Ensure sessions & cookies are secure (`httpOnly`, `sameSite`, `secure`)

### Demo Readiness
- [ ] Create **demo user account**
- [ ] Add **seeded demo data** (transactions, bills, trends)
- [ ] Ensure dashboard looks meaningful immediately after login

### Import / Export
- [ ] CSV import works with validation + error feedback
- [ ] XLSX import works
- [ ] Export produces correct, clean files

---

## 🚀 3. DEPLOYMENT (NON-NEGOTIABLE)

Localhost projects lose hackathons.

- [ ] Deploy backend + frontend (Render / Railway / Fly / Heroku)
- [ ] Use MongoDB Atlas (free tier)
- [ ] Add live demo URL to:
  - README
  - Devpost submission

- [ ] Confirm:
  - No secrets in repo
  - `.env` is ignored
  - App boots cleanly in production

## 📘 5. README.md (CRITICAL FOR JUDGES)

Your README is your **silent pitch**.

- [ ] Clear one-line description at the top
- [ ] Problem → Solution explanation
- [ ] Features list (what actually works)
- [ ] Screenshots / GIFs
- [ ] Tech stack
- [ ] How to run locally
- [ ] Live demo link
- [ ] Demo credentials

---

## 🎥 6. DEMO VIDEO (1–3 MIN MAX)

This often decides winners.

- [ ] 10s — Problem statement
- [ ] 60s — Live app walkthrough:
  - Login
  - Import data
  - View insights
  - Bill shock example
- [ ] 20s — Why this improves financial decision-making
- [ ] 10s — Future impact

🎯 Goal: A judge should understand everything **without running the app**.

---

## 🌍 7. IMPACT & SCALABILITY

Show this isn’t a toy.

- [ ] Add **Impact section**:
  - Target users (students, freelancers, families)
  - Financial behaviors improved
- [ ] Mention scalability:
  - Alerts
  - Mobile
  - More predictive models
  - Multi-currency support

---

## 💡 8. INNOVATION HIGHLIGHT

Make your “wow” obvious.

- [ ] Clearly explain:
  - Bill shock detection logic
  - Spending trend analysis
- [ ] Add tooltips or small explanations in UI
- [ ] Explain why this is better than simple expense trackers

---

## 📦 9. DEVPOST SUBMISSION CHECKLIST

- [ ] Strong title (not generic)
- [ ] Short description tied to **Hackonomics theme**
- [ ] Live demo link
- [ ] GitHub repo
- [ ] Screenshots / GIFs
- [ ] Demo video
- [ ] Tech stack listed
- [ ] Tags: `financial-literacy`, `economics`, `analytics`, `education`

---

## 🧪 10. FINAL SANITY CHECK (DO THIS LAST)

- [ ] Can a judge try it in under **2 minutes**?
- [ ] Does the app clearly solve a **real financial problem**
- [ ] Is the value obvious without reading code?
- [ ] Does it feel like a product, not a tutorial?

---

## ⏱ Estimated Focused Time
- Deployment + demo data: 2 hrs
- Bug fixing + polish: 3 hrs
- README + screenshots: 1 hr
- Demo video: 1 hr

**Total: ~7–8 hours of focused execution**

---

If you complete **everything above**, CoinCoach becomes a **legit Hackonomics winner candidate**, not just a good project.