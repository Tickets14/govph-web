'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, Loader2, Save, X, Upload } from 'lucide-react';
import type { Agency, Service } from '@/types';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

interface RequirementsClientProps {
  services: Service[];
  agencies: Agency[];
}

interface ApiRequirement {
  id: string;
  name: string;
  description?: string | null;
  is_optional?: boolean;
  notes?: string | null;
}

interface ApiStep {
  id: string;
  order: number;
  title: string;
  requirements?: ApiRequirement[];
}

interface ReqDraft {
  name: string;
  description: string;
  is_optional: boolean;
  notes: string;
}

interface PendingReq extends ReqDraft {
  localId: string;
}

const emptyDraft: ReqDraft = { name: '', description: '', is_optional: false, notes: '' };
let localCounter = 0;
const newLocalId = () => `local-${++localCounter}`;

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-white';

export function RequirementsClient({ services, agencies }: RequirementsClientProps) {
  const router = useRouter();

  // ── selection state ───────────────────────────────────────
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(agencies[0]?.id ?? '');
  const agencyServices = services.filter((s) => s.agencyId === selectedAgencyId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(agencyServices[0]?.id ?? '');

  const [steps, setSteps] = useState<ApiStep[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>('');

  // ── requirements state ────────────────────────────────────
  const [requirements, setRequirements] = useState<ApiRequirement[]>([]);

  // inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ReqDraft>(emptyDraft);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // pending queue
  const [pending, setPending] = useState<PendingReq[]>([]);
  const [currentDraft, setCurrentDraft] = useState<ReqDraft>(emptyDraft);
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ── fetch steps for selected service ─────────────────────

  const fetchSteps = useCallback(
    async (serviceId: string) => {
      if (!serviceId) return;
      setLoadingSteps(true);
      setError(null);

      try {
        const service = services.find((s) => s.id === serviceId);
        const identifier = service?.slug ?? serviceId;
        const res = await fetch(`${API_URL}/services/${identifier}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load service');
        const json = await res.json();
        const data = json.data ?? json;
        const raw: ApiStep[] = (data.steps ?? []).sort((a: ApiStep, b: ApiStep) => a.order - b.order);
        setSteps(raw);
        const firstId = raw[0]?.id ?? '';
        setSelectedStepId(firstId);
        setRequirements(raw[0]?.requirements ?? []);
      } catch {
        setError('Could not load steps for this service.');
      } finally {
        setLoadingSteps(false);
      }
    },
    [services]
  );

  // ── reset + reload on service change ─────────────────────

  useEffect(() => {
    setSteps([]);
    setSelectedStepId('');
    setRequirements([]);
    setEditingId(null);
    setPending([]);
    setCurrentDraft(emptyDraft);
    setShowDraftForm(false);
    setError(null);
    fetchSteps(selectedServiceId);
  }, [selectedServiceId, fetchSteps]);

  // ── update requirements when step changes ─────────────────

  useEffect(() => {
    const step = steps.find((s) => s.id === selectedStepId);
    setRequirements(step?.requirements ?? []);
    setEditingId(null);
    setPending([]);
    setCurrentDraft(emptyDraft);
    setShowDraftForm(false);
    setError(null);
  }, [selectedStepId, steps]);

  // ── agency / service switch ───────────────────────────────

  function switchAgency(agencyId: string) {
    setSelectedAgencyId(agencyId);
    const first = services.find((s) => s.agencyId === agencyId);
    setSelectedServiceId(first?.id ?? '');
    setError(null);
  }

  function switchService(serviceId: string) {
    setSelectedServiceId(serviceId);
    setError(null);
  }

  function switchStep(stepId: string) {
    setSelectedStepId(stepId);
    setError(null);
  }

  // ── pending queue ─────────────────────────────────────────

  function queueReq(e: React.FormEvent) {
    e.preventDefault();
    if (!currentDraft.name.trim()) return;
    setPending((prev) => [...prev, { ...currentDraft, localId: newLocalId() }]);
    setCurrentDraft(emptyDraft);
  }

  function removePending(localId: string) {
    setPending((prev) => prev.filter((p) => p.localId !== localId));
  }

  function updatePending(localId: string, field: keyof ReqDraft, value: string | boolean) {
    setPending((prev) => prev.map((p) => (p.localId === localId ? { ...p, [field]: value } : p)));
  }

  // ── submit pending (sequential POSTs) ────────────────────

  async function submitPending() {
    if (pending.length === 0) return;
    setSubmitting(true);
    setError(null);

    for (const p of pending) {
      const res = await fetch(`/api/admin/steps/${selectedStepId}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: selectedServiceId,
          name: p.name,
          description: p.description || null,
          is_optional: p.is_optional,
          notes: p.notes || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error?.message ?? `Failed to save "${p.name}".`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
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

  function startEdit(r: ApiRequirement) {
    setEditingId(r.id);
    setEditDraft({
      name: r.name,
      description: r.description ?? '',
      is_optional: r.is_optional ?? false,
      notes: r.notes ?? '',
    });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  async function saveEdit(reqId: string) {
    if (!editDraft.name.trim()) return;
    setSavingId(reqId);
    setError(null);

    const res = await fetch(`/api/admin/requirements/${reqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editDraft.name,
        description: editDraft.description || null,
        is_optional: editDraft.is_optional,
        notes: editDraft.notes || null,
      }),
    });

    setSavingId(null);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json?.error?.message ?? 'Failed to update requirement.');
      return;
    }

    setRequirements((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              name: editDraft.name,
              description: editDraft.description || null,
              is_optional: editDraft.is_optional,
              notes: editDraft.notes || null,
            }
          : r
      )
    );
    setEditingId(null);
  }

  // ── delete ────────────────────────────────────────────────

  async function deleteReq(reqId: string) {
    if (!confirm('Delete this requirement? This cannot be undone.')) return;
    setDeletingId(reqId);
    setError(null);

    const res = await fetch(`/api/admin/requirements/${reqId}`, { method: 'DELETE' });

    setDeletingId(null);

    if (!res.ok && res.status !== 204) {
      const json = await res.json().catch(() => ({}));
      setError(json?.error?.message ?? 'Failed to delete requirement.');
      return;
    }

    setRequirements((prev) => prev.filter((r) => r.id !== reqId));
  }

  // ── render ────────────────────────────────────────────────

  const selectedStep = steps.find((s) => s.id === selectedStepId);

  return (
    <div className="space-y-6">
      {/* Agency → Service → Step selectors */}
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

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-500 w-14 shrink-0">Step</label>
          {loadingSteps ? (
            <div className="h-9 w-64 rounded-xl animate-shimmer" />
          ) : (
            <select
              value={selectedStepId}
              onChange={(e) => switchStep(e.target.value)}
              disabled={steps.length === 0}
              className="flex-1 max-w-sm px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-white disabled:opacity-50"
            >
              {steps.length === 0 ? (
                <option>No steps for this service</option>
              ) : (
                steps.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.order}. {s.title}
                  </option>
                ))
              )}
            </select>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl animate-scale-in">
          {error}
        </p>
      )}

      {/* ── Requirements list ──────────────────────────────── */}
      {!loadingSteps && selectedStep && (
        <div className="animate-fade-in-up animation-delay-100">
          {requirements.length === 0 && pending.length === 0 && !showDraftForm ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
              <p className="text-sm text-gray-400">No requirements for this step yet.</p>
              <button
                onClick={() => setShowDraftForm(true)}
                className="text-xs text-navy mt-1 inline-block hover:underline"
              >
                Add the first requirement
              </button>
            </div>
          ) : requirements.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {requirements.map((req, idx) => (
                <div
                  key={req.id}
                  className={cn(
                    'group flex items-start gap-3 px-5 py-4 transition-colors duration-150 animate-fade-in-up',
                    editingId === req.id ? 'bg-gray-50/70' : 'hover:bg-gray-50/40'
                  )}
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  <div className="w-7 h-7 rounded-full bg-navy/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-navy/50">{idx + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingId === req.id ? (
                      <div className="space-y-2">
                        <input
                          autoFocus
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          placeholder="Requirement name"
                          className={inputCls}
                        />
                        <textarea
                          value={editDraft.description}
                          onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                          placeholder="Description (optional)"
                          rows={2}
                          className={cn(inputCls, 'resize-none')}
                        />
                        <input
                          value={editDraft.notes}
                          onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
                          placeholder="Notes, e.g. Original + photocopy (optional)"
                          className={inputCls}
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editDraft.is_optional}
                            onChange={(e) => setEditDraft({ ...editDraft, is_optional: e.target.checked })}
                            className="rounded border-gray-300 text-navy focus:ring-navy/20"
                          />
                          <span className="text-xs text-gray-500">Optional</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(req.id)}
                            disabled={savingId === req.id || !editDraft.name.trim()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy/90 disabled:opacity-50 transition-all duration-200 active:scale-95"
                          >
                            {savingId === req.id ? (
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 leading-snug">{req.name}</p>
                          {req.is_optional && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400">
                              optional
                            </span>
                          )}
                        </div>
                        {req.description && (
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{req.description}</p>
                        )}
                        {req.notes && <p className="text-xs text-amber-600/80 mt-0.5 italic">{req.notes}</p>}
                      </>
                    )}
                  </div>

                  {editingId !== req.id && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                      <button
                        onClick={() => startEdit(req)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-100 transition-all duration-150"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteReq(req.id)}
                        disabled={deletingId === req.id}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-40 transition-all duration-150"
                        title="Delete"
                      >
                        {deletingId === req.id ? (
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
      )}

      {/* ── Pending queue ─────────────────────────────────── */}
      {pending.length > 0 && (
        <div className="space-y-2 animate-fade-in-up">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Unsaved — {pending.length} {pending.length === 1 ? 'requirement' : 'requirements'} queued
          </p>

          <div className="bg-amber-50/60 rounded-2xl border border-amber-100 divide-y divide-amber-100/80 overflow-hidden">
            {pending.map((p) => (
              <div key={p.localId} className="flex items-start gap-3 px-5 py-3.5 group animate-fade-in-up">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    value={p.name}
                    onChange={(e) => updatePending(p.localId, 'name', e.target.value)}
                    placeholder="Requirement name"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all duration-200 bg-white"
                  />
                  <input
                    value={p.notes}
                    onChange={(e) => updatePending(p.localId, 'notes', e.target.value)}
                    placeholder="Notes (optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs text-gray-700 placeholder:text-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all duration-200 bg-white"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.is_optional}
                      onChange={(e) => updatePending(p.localId, 'is_optional', e.target.checked)}
                      className="rounded border-amber-300 text-amber-500 focus:ring-amber-400/20"
                    />
                    <span className="text-xs text-gray-500">Optional</span>
                  </label>
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
        <form onSubmit={queueReq} className="bg-white rounded-2xl border border-navy/10 p-5 space-y-3 animate-scale-in">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Requirement {requirements.length + pending.length + 1}
          </p>
          <input
            autoFocus
            value={currentDraft.name}
            onChange={(e) => setCurrentDraft({ ...currentDraft, name: e.target.value })}
            placeholder="Requirement name"
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
          <input
            value={currentDraft.notes}
            onChange={(e) => setCurrentDraft({ ...currentDraft, notes: e.target.value })}
            placeholder="Notes, e.g. Original + photocopy (optional)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentDraft.is_optional}
              onChange={(e) => setCurrentDraft({ ...currentDraft, is_optional: e.target.checked })}
              className="rounded border-gray-300 text-navy focus:ring-navy/20"
            />
            <span className="text-xs text-gray-500">Optional requirement</span>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!currentDraft.name.trim()}
              className="inline-flex items-center gap-1.5 bg-navy/10 text-navy text-sm font-medium px-4 py-2 rounded-xl hover:bg-navy/15 active:scale-95 transition-all duration-200 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Queue requirement
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentDraft.name.trim()) {
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
      {!loadingSteps && selectedStep && (
        <div className="flex items-center gap-3">
          {!showDraftForm && (
            <button
              onClick={() => setShowDraftForm(true)}
              className="flex items-center gap-2 py-2.5 px-4 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400 hover:text-navy hover:border-navy/20 hover:bg-white transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              Add requirement
            </button>
          )}

          {pending.length > 0 && (
            <>
              <button
                onClick={submitPending}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {submitting
                  ? 'Saving…'
                  : `Save ${pending.length} ${pending.length === 1 ? 'requirement' : 'requirements'}`}
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
    </div>
  );
}
