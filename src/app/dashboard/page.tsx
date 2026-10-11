"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserMetadata } from "@/store/slices/authSlice";
import { fetchDashboard, fetchTransactions } from "@/store/slices/transactionSlice";
import { useAuthReady } from "@/components/auth-sync";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import BudgetCard from "@/components/dashboard/budget-card";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const authReady = useAuthReady();
  const { user } = useAppSelector((state) => state.auth);
  const { dashboard, transactions, loading } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (authReady) {
      dispatch(fetchUserMetadata());
      dispatch(fetchDashboard());
      dispatch(fetchTransactions());
    }
  }, [dispatch, authReady]);

  if (loading && !dashboard) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

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
          href="/chat"
          className="btn-primary flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Chat with AI
        </Link>
      </div>

      {/* Stats */}
      <StatsCards
        totalIncome={dashboard?.month_income ?? 0}
        totalExpense={dashboard?.month_expense ?? 0}
        balance={dashboard?.balance ?? 0}
        transactionCount={dashboard?.transaction_count ?? 0}
        budget={dashboard?.budget}
      />

      {/* Budget */}
      {dashboard?.budget && <BudgetCard budget={dashboard.budget} />}

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
