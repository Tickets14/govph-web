import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login — GovPH Tracker',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center mb-4 shadow-lg shadow-navy/20">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <h1 className="font-display font-bold text-lg text-navy">GovPH Tracker</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 animate-fade-in-up animation-delay-100">
          <h2 className="font-semibold text-gray-900 text-base mb-6">Sign in to continue</h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-300 mt-5">GovPH Tracker · Admin Access Only</p>
      </div>
    </div>
  );
}
