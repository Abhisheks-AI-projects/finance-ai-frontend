"use client";

import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";

interface StatsCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export default function StatsCards({
  totalIncome,
  totalExpense,
  balance,
  transactionCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Income",
      value: `$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Total Expenses",
      value: `$${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: "Balance",
      value: `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
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
        </div>
      ))}
    </div>
  );
}
