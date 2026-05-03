import React from 'react';
import BillCard from './BillCard';

const EMPTY_STATES = {
  upcoming: { icon: '✅', title: 'No upcoming bills', sub: 'Add your first bill with the + button below.' },
  all: { icon: '📋', title: 'No bills yet', sub: 'Tap + to add your first bill.' },
  notusing: { icon: '💤', title: 'Nothing flagged', sub: "Mark bills as \"not using\" to track wasteful spend." },
  paused: { icon: '⏸️', title: 'No paused bills', sub: 'Paused bills won\'t count toward your monthly total.' },
};

export default function BillList({ bills, activeTab, onCardClick }) {
  if (bills.length === 0) {
    const state = EMPTY_STATES[activeTab] || EMPTY_STATES.all;
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 40 }}>{state.icon}</span>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{state.title}</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{state.sub}</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: '8px 16px 100px' }}>
      {bills.map(bill => (
        <BillCard key={bill.id} bill={bill} onClick={() => onCardClick(bill)} />
      ))}
    </div>
  );
}
