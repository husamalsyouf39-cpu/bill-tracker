import React from 'react';
import { formatCurrency, getDaysUntil, getMonthlyAmount } from '../utils';

export default function Summary({ bills }) {
  const activeBills = bills.filter(b => b.active !== false);
  const wastefulBills = activeBills.filter(b => b.wasteful);
  const wastefulTotal = wastefulBills.reduce((sum, b) => sum + getMonthlyAmount(b.amount, b.frequency), 0);

  const monthlyTotal = activeBills.filter(b => b.frequency === 'monthly')
    .reduce((sum, b) => sum + b.amount, 0);
  const weeklyTotal = activeBills.filter(b => b.frequency === 'weekly')
    .reduce((sum, b) => sum + b.amount, 0);
  const yearlyTotal = activeBills.filter(b => b.frequency === 'yearly')
    .reduce((sum, b) => sum + b.amount, 0);

  const dueThisWeek = activeBills.filter(b => {
    const days = getDaysUntil(b);
    return days >= 0 && days <= 7;
  });

  return (
    <div style={{
      padding: '20px 16px 0',
      paddingTop: `calc(20px + env(safe-area-inset-top, 0px))`,
      background: 'var(--bg)',
    }}>
      {/* Spend totals by frequency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        <SpendCard label="Monthly" amount={monthlyTotal} />
        <SpendCard label="Weekly" amount={weeklyTotal} />
        <SpendCard label="Yearly" amount={yearlyTotal} />
      </div>

      {/* Active count + wasteful callout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
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

function SpendCard({ label, amount }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1 }}>
        {formatCurrency(amount)}
      </p>
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
