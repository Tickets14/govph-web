import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Bug, Lightbulb, MessageSquare, Mail } from 'lucide-react';
import { getPaginatedFeedbacks } from '@/lib/api';
import { FeedbackActions } from '@/components/admin/FeedbackActions';
import { Pagination } from '@/components/admin/Pagination';
import { AdminSearch } from '@/components/admin/AdminSearch';

export const metadata: Metadata = { title: 'Manage Feedback' };

const TYPE_CONFIG = {
  bug: { label: 'Bug', icon: Bug, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40' },
  feature_request: {
    label: 'Feature',
    icon: Lightbulb,
    color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
  },
  general: {
    label: 'General',
    icon: MessageSquare,
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40',
  },
};

export default async function AdminFeedbacksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const query = params.q ?? '';
  const { data: feedbacks, total, totalPages } = await getPaginatedFeedbacks(page, 10, query);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 animate-fade-in-up">
        <div>
          <h1 className="font-display font-bold text-xl text-navy dark:text-white">Feedback</h1>
          <p className="text-xs text-gray-400 mt-1">
            {total} {query ? 'results' : 'feedback total'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 animate-fade-in-up animation-delay-50">
        <Suspense>
          <AdminSearch placeholder="Search feedback..." />
        </Suspense>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/[0.07] overflow-hidden animate-fade-in-up animation-delay-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.07]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Date
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {feedbacks.map((feedback, i) => {
              const config = TYPE_CONFIG[feedback.type];
              const Icon = config.icon;
              return (
                <tr
                  key={feedback.id}
                  className="hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 30 + 150}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${config.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{feedback.subject}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{feedback.description}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-500 dark:text-gray-400">
                    {feedback.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {feedback.email}
                      </span>
                    ) : (
                      <span className="text-gray-200 dark:text-gray-700">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-gray-400">
                    {feedback.createdAt
                      ? new Date(feedback.createdAt).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <FeedbackActions id={feedback.id} subject={feedback.subject} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {feedbacks.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">{query ? 'No feedback matches your search.' : 'No feedback yet.'}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/feedbacks" />
    </div>
  );
}
