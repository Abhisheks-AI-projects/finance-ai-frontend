"use client";

import { TrendingUp, TrendingDown, Wallet, Activity, Target } from "lucide-react";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  start_date: string;
  end_date: string;
}

interface StatsCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  budget?: Budget | null;
}

export default function StatsCards({
  totalIncome,
  totalExpense,
  balance,
  transactionCount,
  budget,
}: StatsCardsProps) {
  const firstCard = budget
    ? {
        label: "Monthly Budget",
        value: `₹${budget.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        sub: `${budget.start_date} — ${budget.end_date}`,
        icon: Target,
        color: "text-primary",
        bg: "bg-primary/10",
      }
    : {
        label: "Total Income",
        value: `₹${totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        icon: TrendingUp,
        color: "text-accent",
        bg: "bg-accent/10",
      };

  const stats = [
    firstCard,
    {
      label: "Total Expenses",
      value: `₹${totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: budget ? "Remaining" : "Balance",
      value: budget
        ? `₹${budget.remaining.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
        : `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      color: (budget ? budget.remaining : balance) < 0 ? "text-danger" : "text-accent",
      bg: (budget ? budget.remaining : balance) < 0 ? "bg-danger/10" : "bg-accent/10",
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: Activity,
      color: "text-muted",
      bg: "bg-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted">{stat.label}</span>
            <div
              className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          {"sub" in stat && stat.sub && (
            <p className="text-[10px] text-muted mt-1">{stat.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
