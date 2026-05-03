const DB_URL = 'https://bill-tracker-678ba-default-rtdb.firebaseio.com';

const bills = [
  { name: 'Car Insurance',  amount: 534.36, category: 'insurance',    dueDay: 23, frequency: 'monthly', notes: '' },
  { name: 'Comcast',        amount: 14.95,  category: 'utilities',    dueDay: 9,  frequency: 'monthly', notes: '' },
  { name: 'Cricket Service',amount: 219,    category: 'phone',        dueDay: 17, frequency: 'monthly', notes: '' },
  { name: 'AT&T',           amount: 55.23,  category: 'phone',        dueDay: 4,  frequency: 'monthly', notes: '' },
  { name: 'Apple Storage',  amount: 10,     category: 'subscription', dueDay: 30, frequency: 'monthly', notes: '' },
  { name: 'Netflix',        amount: 9,      category: 'streaming',    dueDay: 9,  frequency: 'monthly', notes: '' },
  { name: 'Spotify',        amount: 13.13,  category: 'streaming',    dueDay: 21, frequency: 'monthly', notes: '' },
  { name: 'Gym',            amount: 40,     category: 'other',        dueDay: 8,  frequency: 'monthly', notes: '' },
  { name: 'Equifax',        amount: 9.95,   category: 'subscription', dueDay: 13, frequency: 'monthly', notes: '' },
  { name: 'Office 365',     amount: 10.96,  category: 'subscription', dueDay: 20, frequency: 'monthly', notes: '' },
  { name: 'Costco',         amount: 65,     category: 'subscription', dueDay: 9,  frequency: 'monthly', notes: '' },
  { name: 'Claude AI',      amount: 21.95,  category: 'subscription', dueDay: 26, frequency: 'monthly', notes: '' },
  { name: 'Math AI',        amount: 9.99,   category: 'subscription', dueDay: 28, frequency: 'monthly', notes: '' },
  { name: 'Ria Grandpa',    amount: 208,    category: 'other',        dueDay: 5,  frequency: 'weekly',  notes: 'Every Friday' },
];

async function seed() {
  let added = 0;
  for (const bill of bills) {
    const payload = { ...bill, wasteful: false, active: true, createdAt: Date.now() };
    const res = await fetch(`${DB_URL}/bills.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${bill.name}`);
    const { name: key } = await res.json();
    console.log(`  ✓ ${bill.name.padEnd(16)} $${String(bill.amount).padStart(7)}  →  ${key}`);
    added++;
  }
  console.log(`\n${added}/${bills.length} bills added.`);
}

seed().catch(err => { console.error(err); process.exit(1); });
