"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Filter } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import TransactionTable from "@/components/transactions/transaction-table";

export default function TransactionsPage() {
  const { transactions } = useAppSelector((state) => state.transaction);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = [
    ...new Set(transactions.map((t) => t.category)),
  ];

  const filtered = transactions.filter((t) => {
    if (filterType !== "all" && t.transaction_type !== filterType) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted text-sm mt-1">
            View and filter all your transactions
          </p>
        </div>
        <Link
          href="/home"
          className="btn-secondary flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Add via Chat
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Filter className="w-4 h-4" />
          Filters:
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <TransactionTable transactions={filtered} />
    </div>
  );
}
