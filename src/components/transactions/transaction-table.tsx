"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted text-sm">
          No transactions found. Use the AI chat to add transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-6 py-3">
              Type
            </th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-6 py-3">
              Category
            </th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-6 py-3">
              Description
            </th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-6 py-3">
              Date
            </th>
            <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-6 py-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      t.transaction_type === "income"
                        ? "bg-accent/10"
                        : "bg-danger/10"
                    }`}
                  >
                    {t.transaction_type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-danger" />
                    )}
                  </div>
                  <span className="text-sm capitalize">
                    {t.transaction_type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm capitalize bg-secondary px-2.5 py-1 rounded-md">
                  {t.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted">
                {t.description || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-muted">
                {t.transaction_date}
              </td>
              <td className="px-6 py-4 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
