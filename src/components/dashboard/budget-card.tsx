"use client";

import { Target } from "lucide-react";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  start_date: string;
  end_date: string;
}

export default function BudgetCard({ budget }: { budget: Budget }) {
  const percentSpent = Math.min((budget.spent / budget.amount) * 100, 100);
  const isOverBudget = budget.spent > budget.amount;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Monthly Budget</h2>
            <p className="text-xs text-muted">
              {budget.start_date} — {budget.end_date}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            ₹{budget.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted">Total Budget</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${
            isOverBudget ? "bg-danger" : percentSpent > 80 ? "bg-yellow-500" : "bg-primary"
          }`}
          style={{ width: `${percentSpent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className={isOverBudget ? "text-danger font-medium" : "text-muted"}>
          Spent: ₹{budget.spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        <span className={isOverBudget ? "text-danger font-medium" : "text-accent"}>
          {isOverBudget
            ? `Over by ₹${(budget.spent - budget.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
            : `Remaining: ₹${budget.remaining.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </span>
      </div>
    </div>
  );
}
