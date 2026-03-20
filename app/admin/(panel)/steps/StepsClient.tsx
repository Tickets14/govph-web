'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, Loader2, Save, X, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Agency, Service, Step } from '@/types';
import { cn } from '@/lib/utils';
import { adminClientFetch } from '@/lib/admin-fetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

interface StepsClientProps {
  services: Service[];
  agencies: Agency[];
}

interface StepDraft {
  title: string;
  description: string;
}

interface PendingStep extends StepDraft {
  localId: string;
}

const emptyDraft: StepDraft = { title: '', description: '' };
let localCounter = 0;
const newLocalId = () => `local-${++localCounter}`;

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-white';

// Map API step shape → Step type
function mapStep(s: { id: string; order: number; title: string; description: string }): Step {
  return { id: s.id, order: s.order, title: s.title, description: s.description };
}

export function StepsClient({ services, agencies }: StepsClientProps) {
  const router = useRouter();

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(agencies[0]?.id ?? '');
  const agencyServices = services.filter((s) => s.agencyId === selectedAgencyId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(agencyServices[0]?.id ?? '');

  // Saved steps state — loaded from API on service change
  const [steps, setSteps] = useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<StepDraft>(emptyDraft);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);

  // Pending (unsaved) queue
  const [pending, setPending] = useState<PendingStep[]>([]);
  const [currentDraft, setCurrentDraft] = useState<StepDraft>(emptyDraft);
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── fetch steps for selected service ─────────────────────

  const fetchSteps = useCallback(
    async (serviceId: string) => {
      if (!serviceId) return;
      setLoadingSteps(true);

      try {
        const service = services.find((s) => s.id === serviceId);
        const identifier = service?.slug ?? serviceId;
        const res = await fetch(`${API_URL}/services/${identifier}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load service');
        const json = await res.json();
        const data = json.data ?? json;
        const raw: { id: string; order: number; title: string; description: string }[] = data.steps ?? [];
        setSteps([...raw].sort((a, b) => a.order - b.order).map(mapStep));
      } catch {
        toast.error('Could not load steps for this service.');
      } finally {
        setLoadingSteps(false);
      }
    },
    [services]
  );

  // Load steps on mount and whenever the selected service changes
  useEffect(() => {
    setEditingId(null);
    setPending([]);
    setCurrentDraft(emptyDraft);
    setShowDraftForm(false);
    setOrderDirty(false);
    fetchSteps(selectedServiceId);
  }, [selectedServiceId, fetchSteps]);

  // ── agency / service switch ───────────────────────────────

  function switchAgency(agencyId: string) {
    setSelectedAgencyId(agencyId);
    const first = services.find((s) => s.agencyId === agencyId);
    setSelectedServiceId(first?.id ?? '');
  }

  function switchService(serviceId: string) {
    setSelectedServiceId(serviceId);
  }

  // ── pending queue (local only) ────────────────────────────

  function queueStep(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDraft.title.trim()) return;
    setPending((prev) => [...prev, { ...currentDraft, localId: newLocalId() }]);
    setCurrentDraft(emptyDraft);
  }

  function removePending(localId: string) {
    setPending((prev) => prev.filter((p) => p.localId !== localId));
  }

  function updatePending(localId: string, field: keyof StepDraft, value: string) {
    setPending((prev) => prev.map((p) => (p.localId === localId ? { ...p, [field]: value } : p)));
  }

  // ── submit all pending to API (bulk POST) ─────────────────

  async function submitPending() {
    if (pending.length === 0) return;
    setSubmitting(true);

    const payload = pending.map((p, i) => ({
      order: steps.length + i + 1,
      title: p.title,
      description: p.description,
      is_optional: false,
    }));

    const res = await adminClientFetch(`/api/admin/services/${selectedServiceId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to save steps.');
      return;
    }

    toast.success(`${pending.length} ${pending.length === 1 ? 'step' : 'steps'} saved.`);
    setPending([]);
    setShowDraftForm(false);
    setCurrentDraft(emptyDraft);
    router.refresh();
    fetchSteps(selectedServiceId);
  }

  function discardPending() {
    setPending([]);
    setCurrentDraft(emptyDraft);
    setShowDraftForm(false);
  }

  // ── inline edit ───────────────────────────────────────────

  function startEdit(step: Step) {
    setEditingId(step.id);
    setEditDraft({ title: step.title, description: step.description });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  async function saveEdit(stepId: string) {
    if (!editDraft.title.trim()) return;
    setSavingId(stepId);

    const res = await adminClientFetch(`/api/admin/steps/${stepId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editDraft.title, description: editDraft.description }),
    });

    setSavingId(null);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to update step.');
      return;
    }

    toast.success('Step updated.');
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, title: editDraft.title, description: editDraft.description } : s))
    );
    setEditingId(null);
  }

  // ── delete ────────────────────────────────────────────────

  async function deleteStep(stepId: string) {
    setDeletingId(stepId);
    setConfirmDeleteId(null);

    const res = await adminClientFetch(`/api/admin/steps/${stepId}`, { method: 'DELETE' });

    setDeletingId(null);

    if (!res.ok && res.status !== 204) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to delete step.');
      return;
    }

    toast.success('Step deleted.');
    setSteps((prev) => prev.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 })));
  }

  // ── reorder ───────────────────────────────────────────────

  function moveStep(stepId: string, direction: 'up' | 'down') {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === steps.length - 1) return;

    const next = [...steps];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setSteps(next.map((s, i) => ({ ...s, order: i + 1 })));
    setOrderDirty(true);
  }

  async function saveOrder() {
    setReordering(true);

    const res = await adminClientFetch(`/api/admin/services/${selectedServiceId}/steps/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step_ids: steps.map((s) => s.id) }),
    });

    setReordering(false);

    if (!res.ok && res.status !== 204) {
      toast.error('Failed to save order.');
      return;
    }

    toast.success('Order saved.');
    setOrderDirty(false);
  }

  // ── render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Agency → Service selectors */}
      <div className="flex flex-col gap-3 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 w-14 shrink-0">Agency</label>
          <select
            value={selectedAgencyId}
            onChange={(e) => switchAgency(e.target.value)}
            className="flex-1 max-w-sm px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-white"
          >
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.acronym} — {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 w-14 shrink-0">Service</label>
          <select
            value={selectedServiceId}
            onChange={(e) => switchService(e.target.value)}
            disabled={agencyServices.length === 0}
            className="flex-1 max-w-sm px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-white disabled:opacity-50"
          >
            {agencyServices.length === 0 ? (
              <option>No services for this agency</option>
            ) : (
              agencyServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* ── Saved steps ───────────────────────────────────── */}
      <div className="animate-fade-in-up animation-delay-100">
        {loadingSteps ? (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className="w-7 h-7 rounded-full animate-shimmer shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
                  <div className="h-3 w-1/2 rounded-lg animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : steps.length === 0 && pending.length === 0 && !showDraftForm ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
            <p className="text-sm text-gray-400">No steps for this service yet.</p>
            <button
              onClick={() => setShowDraftForm(true)}
              className="text-xs text-navy mt-1 inline-block hover:underline"
            >
              Add the first step
            </button>
          </div>
        ) : steps.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={cn(
                  'group flex items-start gap-3 px-5 py-4 transition-colors duration-150 animate-fade-in-up',
                  editingId === step.id ? 'bg-gray-50/70' : 'hover:bg-gray-50/40'
                )}
                style={{ animationDelay: `${idx * 25}ms` }}
              >
                <div className="w-7 h-7 rounded-full bg-navy/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-navy/50">{step.order}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {editingId === step.id ? (
                    <div className="space-y-2">
                      <input
                        autoFocus
                        value={editDraft.title}
                        onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                        placeholder="Step title"
                        className={inputCls}
                      />
                      <textarea
                        value={editDraft.description}
                        onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                        placeholder="Step description"
                        rows={2}
                        className={cn(inputCls, 'resize-none')}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(step.id)}
                          disabled={savingId === step.id || !editDraft.title.trim()}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy/90 disabled:opacity-50 transition-all duration-200 active:scale-95"
                        >
                          {savingId === step.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{step.title}</p>
                      {step.description && (
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.description}</p>
                      )}
                    </>
                  )}
                </div>

                {editingId !== step.id && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                    <button
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={idx === 0 || reordering}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-100 disabled:opacity-20 transition-all duration-150"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={idx === steps.length - 1 || reordering}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-100 disabled:opacity-20 transition-all duration-150"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startEdit(step)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-100 transition-all duration-150"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(step.id)}
                      disabled={deletingId === step.id}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-40 transition-all duration-150"
                      title="Delete"
                    >
                      {deletingId === step.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Pending queue ─────────────────────────────────── */}
      {pending.length > 0 && (
        <div className="space-y-2 animate-fade-in-up">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Unsaved — {pending.length} {pending.length === 1 ? 'step' : 'steps'} queued
          </p>

          <div className="bg-amber-50/60 rounded-2xl border border-amber-100 divide-y divide-amber-100/80 overflow-hidden">
            {pending.map((p, idx) => (
              <div key={p.localId} className="flex items-start gap-3 px-5 py-3.5 group animate-fade-in-up">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-amber-500">{steps.length + idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    value={p.title}
                    onChange={(e) => updatePending(p.localId, 'title', e.target.value)}
                    placeholder="Step title"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all duration-200 bg-white"
                  />
                  <input
                    value={p.description}
                    onChange={(e) => updatePending(p.localId, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs text-gray-700 placeholder:text-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all duration-200 bg-white"
                  />
                </div>
                <button
                  onClick={() => removePending(p.localId)}
                  className="p-1.5 rounded-lg text-amber-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Draft input form ──────────────────────────────── */}
      {showDraftForm && (
        <form
          onSubmit={queueStep}
          className="bg-white rounded-2xl border border-navy/10 p-5 space-y-3 animate-scale-in"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Step {steps.length + pending.length + 1}
          </p>
          <input
            autoFocus
            value={currentDraft.title}
            onChange={(e) => setCurrentDraft({ ...currentDraft, title: e.target.value })}
            placeholder="Step title"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50"
          />
          <textarea
            value={currentDraft.description}
            onChange={(e) => setCurrentDraft({ ...currentDraft, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!currentDraft.title.trim()}
              className="inline-flex items-center gap-1.5 bg-navy/10 text-navy text-sm font-medium px-4 py-2 rounded-xl hover:bg-navy/15 active:scale-95 transition-all duration-200 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Queue step
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentDraft.title.trim()) {
                  setPending((prev) => [...prev, { ...currentDraft, localId: newLocalId() }]);
                }
                setShowDraftForm(false);
                setCurrentDraft(emptyDraft);
              }}
              className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              Done adding
            </button>
          </div>
        </form>
      )}

      {/* ── Bottom action bar ─────────────────────────────── */}
      {!loadingSteps && (
        <div className="flex items-center gap-3">
          {!showDraftForm && (
            <button
              onClick={() => setShowDraftForm(true)}
              className="flex items-center gap-2 py-2.5 px-4 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400 hover:text-navy hover:border-navy/20 hover:bg-white transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              Add step
            </button>
          )}

          {orderDirty && (
            <>
              <button
                onClick={saveOrder}
                disabled={reordering}
                className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {reordering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {reordering ? 'Saving…' : 'Save order'}
              </button>
              <button
                onClick={() => {
                  fetchSteps(selectedServiceId);
                  setOrderDirty(false);
                }}
                disabled={reordering}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
              >
                Discard
              </button>
            </>
          )}

          {pending.length > 0 && (
            <>
              <button
                onClick={submitPending}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {submitting ? 'Saving…' : `Save ${pending.length} ${pending.length === 1 ? 'step' : 'steps'}`}
              </button>
              <button
                onClick={discardPending}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                Discard
              </button>
            </>
          )}
        </div>
      )}
      {/* Delete confirmation dialog */}
      {confirmDeleteId &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setConfirmDeleteId(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm mx-4 p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Delete step</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-600">
                      {steps.find((s) => s.id === confirmDeleteId)?.title}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteStep(confirmDeleteId)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
