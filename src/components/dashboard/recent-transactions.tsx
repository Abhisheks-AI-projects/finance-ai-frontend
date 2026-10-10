"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <p className="text-muted text-sm text-center py-8">
          No transactions yet. Start a chat with AI to add your first
          transaction!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  t.transaction_type === "income"
                    ? "bg-accent/10"
                    : "bg-danger/10"
                }`}
              >
                {t.transaction_type === "income" ? (
                  <ArrowUpRight className="w-5 h-5 text-accent" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-danger" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{t.category}</p>
                <p className="text-xs text-muted">
                  {t.description || t.transaction_date}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold ${
                t.transaction_type === "income"
                  ? "text-accent"
                  : "text-danger"
              }`}
            >
              {t.transaction_type === "income" ? "+" : "-"}$
              {t.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
