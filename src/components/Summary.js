import React from 'react';
import { getMonthlyAmount, formatCurrency } from '../utils';

export default function Summary({ bills }) {
  const activeBills = bills.filter(b => b.active !== false);
  const totalMonthly = activeBills.reduce((sum, b) => sum + getMonthlyAmount(b.amount, b.frequency), 0);
  const wastefulBills = activeBills.filter(b => b.wasteful);
  const wastefulTotal = wastefulBills.reduce((sum, b) => sum + getMonthlyAmount(b.amount, b.frequency), 0);

  const today = new Date();
  const dueThisWeek = activeBills.filter(b => {
    const day = b.dueDay;
    const end = new Date(today); end.setDate(end.getDate() + 7);
    const due = new Date(today.getFullYear(), today.getMonth(), day);
    if (due < today) due.setMonth(due.getMonth() + 1);
    return due <= end;
  });

  return (
    <div style={{
      padding: '20px 16px 0',
      paddingTop: `calc(20px + env(safe-area-inset-top, 0px))`,
      background: 'var(--bg)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
        Monthly spend
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>
        {formatCurrency(totalMonthly)}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {activeBills.length} active bill{activeBills.length !== 1 ? 's' : ''}
        </span>
        {wastefulTotal > 0 && (
          <span style={{ fontSize: 13, color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(wastefulTotal)}/mo wasted
          </span>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 4 }}>
        <StatCard label="Active" value={activeBills.length} />
        <StatCard
          label="Due this week"
          value={dueThisWeek.length}
          valueColor={dueThisWeek.length > 0 ? 'var(--status-soon)' : undefined}
        />
        <StatCard
          label="Not using"
          value={wastefulBills.length}
          valueColor={wastefulBills.length > 0 ? 'var(--status-critical)' : undefined}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 22,
        fontWeight: 500,
        color: valueColor || 'var(--text-primary)',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.2 }}>{label}</p>
    </div>
  );
}
