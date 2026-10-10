"use client";

import {
  ArrowRight,
  Bot,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { openSignIn, openSignUp } from "@/store/slices/modalSlice";
import SignInModal from "@/components/modals/SignInModal";
import SignUpModal from "@/components/modals/SignUpModal";

export default function HomePage() {
  const dispatch = useAppDispatch();

  return (
    <div className="md:h-screen md:overflow-hidden bg-background">
      {/* Auth Modals */}
      <SignInModal />
      <SignUpModal />

      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Finance AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(openSignIn())}
              className="text-base font-medium text-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => dispatch(openSignUp())}
              className="btn-primary text-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-8 md:pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Bot className="w-4 h-4" />
          AI-Powered Finance Assistant
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-[family-name:var(--font-lora)] italic">
          Manage Your Finances
          <br />
          <span className="text-primary">With AI</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          Track income, expenses, and budgets through natural conversation.
          Just tell our AI what you spent or earned, and it handles the rest.
        </p>
        <button
          onClick={() => dispatch(openSignUp())}
          className="btn-primary inline-flex items-center gap-2 text-lg cursor-pointer"
        >
          Start Free <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-6 md:py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Bot className="w-6 h-6 text-primary" />}
            title="AI Chat Interface"
            description="Talk to your finance assistant naturally. Add transactions, check balances, and get insights through conversation."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="Instant Tracking"
            description="No forms to fill. Just say 'spent $50 on groceries' and it's recorded with the right category and date."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-primary" />}
            title="Secure & Private"
            description="Your financial data is encrypted and isolated. Only you can access your transactions and insights."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}
