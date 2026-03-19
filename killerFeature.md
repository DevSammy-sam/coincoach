# App Idea

This app helps users clearly understand where their money is going. Many people see funds leave their accounts without knowing why, and this tool is designed to fix that. It tracks transactions, organizes spending, and provides clear, meaningful insights into financial habits.

For the MVP, users will be able to:

- Manually track and categorize their transactions  
- Receive a clean, easy‑to‑read monthly analysis of their spending patterns  
- Get notified by email when unusual or suspicious activity occurs in their account  

The long‑term vision is to allow users to securely connect their bank accounts so the app can automatically pull transactions, generate smarter insights, and deliver proactive alerts when something looks off.

---

# Killer Feature: Money Leak Detector

## Core Idea

Automatically detects where and why money is silently slipping away — and explains it in plain English.

This is not budgeting.  
This is not just analytics.  

This is:  
**"You are losing money here — and here’s exactly why."**

---

## What It Does (User Experience)

### Step 1: User Opens Insights

They immediately see:

**Money Leaks Detected**

---

### Step 2: The App Shows Specific Findings

**Leak 1 — Subscription Creep**  
"You are paying for 4 subscriptions totaling $47/month. Two of them haven’t been used recently."

---

**Leak 2 — Food Spending Spike**  
"Your food spending increased by 38% this month — mostly from takeout (12 extra orders)."

---

**Leak 3 — Duplicate Charges**  
"You were charged $9.99 by Spotify 3 times this month."

---

**Leak 4 — Micro-Spending**  
"You spent $86 on small purchases under $10. These added up without being noticeable."

---

### Step 3: Actionable Suggestions

Each leak includes a clear recommendation:

- Cancel unused subscriptions  
- Reduce takeout frequency  
- Review duplicate charges  
- Set limits for small purchases  

---

## Why This Feature Wins

Judges think:  
- This is actually useful  
- This solves a real problem  
- This feels like a real product  

Users think:  
- *Wait… I didn’t realize that*  

That moment creates impact.

---

## How It Works (Logic Overview)

This feature analyzes transaction patterns and detects financial inefficiencies.

---

### 1. Subscription Detector

**Logic:**  
- Same merchant  
- Same amount  
- Repeats monthly  

```js
if (sameName && sameAmount && appearsMonthly) {
  markAsSubscription();
}
```


### 2. Spending Spike Detector
**Logic**: Compare this month vs last month.

```
js
if (currentMonth > lastMonth * 1.3) {
  flagSpike();
}
```
### 3. Duplicate Charge Detector
**Logic**:

- Same merchant

- Same amount

- Within short time frame

```
js
if (sameName && sameAmount && withinDays(3)) {
  flagDuplicate();
}
```
### 4. Micro-Spending Detector
**Logic**:

- Transactions under $10

- Accumulate total

js
if (amount < 10) {
  accumulateMicroSpending();
}
UI Design
Create a dedicated section called:

Money Leak Detector
Each leak should be displayed as a card containing:

Title (e.g., Subscription Creep)

Short explanation

Highlighted numbers

Suggested action

Keep it:

Simple

Visual

Easy to scan

Demo Script (For Hackathon)
Say this:

“Most finance apps show you numbers.
CoinCoach tells you where your money is leaking — and why.”

Then:

Open Insights

Scroll to Money Leaks

Walk through each example

Pause after each insight

Optional Enhancements
Add severity levels: Low, Medium, High

Show potential savings: “You could save approximately $120/month.”

Final Positioning
Do not say:
“We track transactions.”

Say:
“We detect where your money is leaking and explain it.”
