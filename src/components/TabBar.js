import React from 'react';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All' },
  { key: 'notusing', label: 'Not using' },
  { key: 'paused', label: 'Paused' },
];

export default function TabBar({ activeTab, onChange, bills }) {
  const notUsingCount = bills.filter(b => b.wasteful).length;
  const pausedCount = bills.filter(b => b.active === false).length;

  const getLabel = (tab) => {
    if (tab.key === 'notusing' && notUsingCount > 0) return `Not using (${notUsingCount})`;
    if (tab.key === 'paused' && pausedCount > 0) return `Paused (${pausedCount})`;
    return tab.label;
  };

  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      paddingTop: 12,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              paddingBottom: 11,
              paddingTop: 2,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {getLabel(tab)}
          </button>
        );
      })}
    </div>
  );
}
