import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';
import Summary from './components/Summary';
import TabBar from './components/TabBar';
import BillList from './components/BillList';
import AddEditModal from './components/AddEditModal';
import { sortBillsByDue, getDaysUntil } from './utils';

export default function App() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  useEffect(() => {
    const billsRef = ref(db, '/bills');
    const unsub = onValue(billsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setBills(sortBillsByDue(list));
      } else {
        setBills([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (formData) => {
    await push(ref(db, '/bills'), {
      ...formData,
      createdAt: Date.now(),
    });
    setModalOpen(false);
  };

  const handleEdit = async (id, formData) => {
    await update(ref(db, `/bills/${id}`), formData);
    setModalOpen(false);
    setEditingBill(null);
  };

  const handleDelete = async (id) => {
    await remove(ref(db, `/bills/${id}`));
    setModalOpen(false);
    setEditingBill(null);
  };

  const openAdd = () => {
    setEditingBill(null);
    setModalOpen(true);
  };

  const openEdit = (bill) => {
    setEditingBill(bill);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBill(null);
  };

  const filteredBills = () => {
    switch (activeTab) {
      case 'upcoming': return bills.filter(b => b.active !== false && getDaysUntil(b) <= 7);
      case 'notusing': return bills.filter(b => b.wasteful);
      case 'paused': return bills.filter(b => b.active === false);
      default: return bills;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#555', fontFamily: 'var(--font-ui)' }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Summary bills={bills} />
        <TabBar activeTab={activeTab} onChange={setActiveTab} bills={bills} />
        <BillList
          bills={filteredBills()}
          activeTab={activeTab}
          onCardClick={openEdit}
        />
      </div>

      {/* FAB */}
      <button
        onClick={openAdd}
        aria-label="Add bill"
        style={{
          position: 'fixed',
          bottom: `calc(24px + env(safe-area-inset-bottom, 0px))`,
          right: '20px',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#0a0a0a',
          fontSize: 28,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(232,201,122,0.4)',
          zIndex: 50,
          lineHeight: 1,
        }}
      >
        +
      </button>

      {modalOpen && (
        <AddEditModal
          bill={editingBill}
          onSave={editingBill ? (data) => handleEdit(editingBill.id, data) : handleAdd}
          onDelete={editingBill ? () => handleDelete(editingBill.id) : null}
          onClose={closeModal}
        />
      )}
    </>
  );
}
