import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login — GovPH Tracker",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-display font-bold text-xl text-navy">GovPH Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-semibold text-gray-900 text-lg mb-6">Sign in</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
