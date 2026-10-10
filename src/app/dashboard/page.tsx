"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserMetadata } from "@/store/slices/authSlice";
import { useAuthReady } from "@/components/auth-sync";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentTransactions from "@/components/dashboard/recent-transactions";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const authReady = useAuthReady();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (authReady) {
      dispatch(fetchUserMetadata());
    }
  }, [dispatch, authReady]);

  const totalIncome = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted text-sm mt-1">
            Here&apos;s your financial overview
          </p>
        </div>
        <Link
          href="/home"
          className="btn-primary flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Chat with AI
        </Link>
      </div>

      {/* Stats */}
      <StatsCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={totalIncome - totalExpense}
        transactionCount={transactions.length}
      />

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
