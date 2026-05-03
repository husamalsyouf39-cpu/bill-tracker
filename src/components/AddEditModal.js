import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, FREQUENCIES } from '../utils';

const EMPTY_FORM = {
  name: '',
  amount: '',
  dueDay: '',
  category: 'other',
  frequency: 'monthly',
  notes: '',
  wasteful: false,
  active: true,
};

export default function AddEditModal({ bill, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);
  const isEdit = !!bill;

  useEffect(() => {
    if (bill) {
      setForm({
        name: bill.name || '',
        amount: bill.amount !== undefined ? String(bill.amount) : '',
        dueDay: bill.dueDay !== undefined ? String(bill.dueDay) : '',
        category: bill.category || 'other',
        frequency: bill.frequency || 'monthly',
        notes: bill.notes || '',
        wasteful: bill.wasteful || false,
        active: bill.active !== false,
      });
    } else {
      setForm(EMPTY_FORM);
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [bill]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount || !form.dueDay) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        amount: parseFloat(form.amount),
        dueDay: parseInt(form.dueDay, 10),
        category: form.category,
        frequency: form.frequency,
        notes: form.notes.trim(),
        wasteful: form.wasteful,
        active: form.active,
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#1c1c1c',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 14px',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: '#111',
        borderRadius: '20px 20px 0 0',
        zIndex: 101,
        paddingBottom: `env(safe-area-inset-bottom, 0px)`,
        animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Title */}
        <div style={{ padding: '4px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit bill' : 'Add bill'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', fontSize: 22, lineHeight: 1, padding: '4px 8px' }}>
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Bill name */}
          <div>
            <label style={labelStyle}>Bill name</label>
            <input
              ref={nameRef}
              style={inputStyle}
              type="text"
              placeholder="e.g. Netflix"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          {/* Amount + Due day */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Amount ($)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Due day</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="1–31"
                min="1"
                max="31"
                value={form.dueDay}
                onChange={e => set('dueDay', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category + Frequency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Frequency</label>
              <select style={inputStyle} value={form.frequency} onChange={e => set('frequency', e.target.value)}>
                {FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea
              style={{ ...inputStyle, resize: 'none', minHeight: 64 }}
              placeholder="Any notes..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={2}
            />
          </div>

          {/* Wasteful toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#1c1c1c',
            border: `1px solid ${form.wasteful ? 'rgba(224,85,85,0.4)' : 'var(--border)'}`,
            borderRadius: 10,
            padding: '14px 16px',
            transition: 'border-color 0.2s',
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: form.wasteful ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                Not using / wasteful
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Flag this as a subscription you don't need</p>
            </div>
            <Toggle checked={form.wasteful} onChange={v => set('wasteful', v)} danger />
          </div>

          {/* Active toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#1c1c1c',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Active</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Paused bills won't count toward your total</p>
            </div>
            <Toggle checked={form.active} onChange={v => set('active', v)} />
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: 16,
              padding: '15px',
              borderRadius: 12,
              marginTop: 4,
              opacity: saving ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {saving ? 'Saving...' : (isEdit ? 'Save changes' : 'Add bill')}
          </button>

          {/* Delete */}
          {isEdit && onDelete && (
            <div style={{ textAlign: 'center', paddingBottom: 4 }}>
              {!deleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  style={{ color: 'var(--status-critical)', fontSize: 14, padding: '8px 16px' }}
                >
                  Delete bill
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Are you sure?</p>
                  <button type="button" onClick={() => setDeleteConfirm(false)} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                    Cancel
                  </button>
                  <button type="button" onClick={onDelete} style={{ fontSize: 13, color: '#fff', background: 'var(--status-critical)', padding: '6px 12px', borderRadius: 8, fontWeight: 600 }}>
                    Yes, delete
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

function Toggle({ checked, onChange, danger }) {
  const activeColor = danger ? 'var(--status-critical)' : '#4caf7d';
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: checked ? activeColor : '#333',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 3,
        left: checked ? 23 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  );
}
