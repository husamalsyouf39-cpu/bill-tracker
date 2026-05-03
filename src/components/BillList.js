import React from 'react';
import BillCard from './BillCard';

const EMPTY_STATES = {
  upcoming: { icon: '✅', title: 'No upcoming bills', sub: 'Add your first bill with the + button below.' },
  all: { icon: '📋', title: 'No bills yet', sub: 'Tap + to add your first bill.' },
  notusing: { icon: '💤', title: 'Nothing flagged', sub: 'Mark bills as "not using" to track wasteful spend.' },
  paused: { icon: '⏸️', title: 'No paused bills', sub: "Paused bills won't count toward your monthly total." },
};

const SECTIONS = [
  {
    key: 'monthly',
    label: 'Monthly',
    filter: b => b.frequency === 'monthly',
    sort: (a, b) => a.dueDay - b.dueDay,
  },
  {
    key: 'weekly',
    label: 'Weekly',
    filter: b => b.frequency === 'weekly',
    sort: (a, b) => a.dueDay - b.dueDay,
  },
  {
    key: 'yearly',
    label: 'Yearly',
    filter: b => b.frequency === 'yearly',
    sort: (a, b) => ((a.dueMonth || 1) - (b.dueMonth || 1)) || (a.dueDay - b.dueDay),
  },
  {
    key: 'quarterly',
    label: 'Quarterly',
    filter: b => b.frequency === 'quarterly',
    sort: (a, b) => a.dueDay - b.dueDay,
  },
];

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

  const sections = SECTIONS.map(s => ({
    ...s,
    bills: bills.filter(s.filter).sort(s.sort),
  })).filter(s => s.bills.length > 0);

  return (
    <div style={{ flex: 1, padding: '8px 16px 100px' }}>
      {sections.map((section, si) => (
        <div key={section.key}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 8,
            marginTop: si === 0 ? 4 : 16,
          }}>
            {section.label}
          </p>
          {section.bills.map(bill => (
            <BillCard key={bill.id} bill={bill} onClick={() => onCardClick(bill)} />
          ))}
        </div>
      ))}
    </div>
  );
}
