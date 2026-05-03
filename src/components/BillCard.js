import React from 'react';
import { getCategoryMeta, getDaysUntil, getDueStatus, formatCurrency } from '../utils';

function DueBadge({ bill }) {
  const status = getDueStatus(bill);
  if (status === 'paused') {
    return <Badge text="Paused" bg="var(--card-hover)" color="var(--text-secondary)" />;
  }
  if (status === 'overdue') {
    return <Badge text="Overdue" bg="rgba(224,85,85,0.15)" color="var(--status-critical)" />;
  }
  const days = getDaysUntil(bill);
  if (status === 'critical') {
    return <Badge text={`${days}d left`} bg="rgba(224,85,85,0.15)" color="var(--status-critical)" />;
  }
  if (status === 'soon') {
    return <Badge text={`${days}d left`} bg="rgba(224,140,58,0.15)" color="var(--status-soon)" />;
  }
  return <Badge text={`in ${days}d`} bg="transparent" color="var(--text-secondary)" border />;
}

function Badge({ text, bg, color, border }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 20,
      background: bg,
      color,
      border: border ? '1px solid var(--border)' : 'none',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  );
}

export default function BillCard({ bill, onClick }) {
  const cat = getCategoryMeta(bill.category);
  const status = getDueStatus(bill);
  const isCritical = status === 'critical' || status === 'overdue';
  const freqLabel = {
    monthly: 'mo', weekly: 'wk', yearly: 'yr', quarterly: 'qtr',
  }[bill.frequency] || bill.frequency;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        borderLeft: isCritical ? '3px solid var(--status-critical)' : '1px solid var(--border)',
        padding: '14px 14px 14px',
        marginBottom: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.15s',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
      onTouchStart={e => e.currentTarget.style.background = 'var(--card-hover)'}
      onTouchEnd={e => e.currentTarget.style.background = 'var(--card)'}
    >
      {/* Category icon */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: `${cat.color}22`,
        border: `1px solid ${cat.color}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
        marginTop: 1,
      }}>
        {cat.icon}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>
          {bill.name}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {cat.label} · {bill.frequency} · day {bill.dueDay}
        </p>
        {bill.notes && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4, lineHeight: 1.4 }}>
            {bill.notes}
          </p>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        {bill.wasteful && (
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--status-critical)',
            background: 'rgba(224,85,85,0.12)',
            padding: '2px 6px',
            borderRadius: 4,
          }}>
            NOT USING
          </span>
        )}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {formatCurrency(bill.amount)}
        </p>
        {bill.frequency !== 'monthly' && (
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            /{freqLabel}
          </p>
        )}
        <DueBadge bill={bill} />
      </div>
    </div>
  );
}
