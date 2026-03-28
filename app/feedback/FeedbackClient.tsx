'use client';

import { useState } from 'react';
import { Bug, Lightbulb, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { submitFeedback } from '@/lib/api';

type FeedbackType = 'bug' | 'feature_request' | 'general';

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: typeof Bug; description: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Something is broken or not working right' },
  {
    value: 'feature_request',
    label: 'Feature Request',
    icon: Lightbulb,
    description: 'Suggest a new feature or improvement',
  },
  { value: 'general', label: 'General', icon: MessageSquare, description: 'General feedback or comment' },
];

export function FeedbackClient() {
  const [type, setType] = useState<FeedbackType>('general');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required.');
      return;
    }

    setSubmitting(true);
    const result = await submitFeedback({
      type,
      subject: subject.trim(),
      description: description.trim(),
      email: email.trim() || undefined,
    });
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message ?? 'Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <Card className="animate-fade-in-up">
        <CardContent className="flex flex-col items-center text-center py-12 gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="font-display text-xl font-semibold text-navy dark:text-white">Thank you!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
            Your feedback has been submitted. We appreciate you helping us improve.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="mt-2"
            onClick={() => {
              setSubmitted(false);
              setSubject('');
              setDescription('');
              setEmail('');
              setType('general');
            }}
          >
            Submit another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      {/* Feedback type selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-navy dark:text-white">Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEEDBACK_TYPES.map((ft) => {
            const Icon = ft.icon;
            const selected = type === ft.value;
            return (
              <button
                key={ft.value}
                type="button"
                onClick={() => setType(ft.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200',
                  selected
                    ? 'border-gold bg-gold/5 ring-1 ring-gold/30 dark:bg-gold/10'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                )}
              >
                <Icon
                  className={cn('w-5 h-5', selected ? 'text-gold' : 'text-gray-400 dark:text-gray-500')}
                  strokeWidth={2}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    selected ? 'text-navy dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {ft.label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{ft.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-navy dark:text-white">
          Subject
        </label>
        <Input
          id="subject"
          placeholder="Brief summary of your feedback"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={255}
          className="h-10"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-navy dark:text-white">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Tell us more about the issue or your idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 resize-none"
        />
      </div>

      {/* Email (optional) */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-white">
          Email <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com — so we can follow up"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" disabled={submitting} className="w-full gap-2">
        <Send className="w-4 h-4" />
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}
