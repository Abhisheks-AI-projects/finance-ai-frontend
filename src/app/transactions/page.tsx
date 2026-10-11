"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Filter, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions } from "@/store/slices/transactionSlice";
import { useAuthReady } from "@/components/auth-sync";
import TransactionTable from "@/components/transactions/transaction-table";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const authReady = useAuthReady();
  const { transactions, loading } = useAppSelector((state) => state.transaction);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    if (authReady) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, authReady]);

  const categories = [
    ...new Set(transactions.map((t) => t.category)),
  ];

  const filtered = transactions
    .filter((t) => {
      if (filterType !== "all" && t.transaction_type !== filterType) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : new Date(a.transaction_date).getTime();
      const dateB = b.created_at ? new Date(b.created_at).getTime() : new Date(b.transaction_date).getTime();
      return dateB - dateA;
    });

  if (loading && transactions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted text-sm mt-1">
            View and filter all your transactions
          </p>
        </div>
        <Link
          href="/chat"
          className="btn-secondary flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Add via Chat
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-6 shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Filter className="w-4 h-4" />
          Filters:
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-secondary border border-border rounded-lg pl-3 pr-10 py-2 text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_12px_center] bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-secondary border border-border rounded-lg pl-3 pr-10 py-2 text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_12px_center] bg-no-repeat focus:outline-none focus:ring-2 focus:ring-primary/50"
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
      <div className="mt-4 md:mt-6 flex-1 min-h-0">
        <TransactionTable transactions={filtered} />
      </div>
    </div>
  );
}
