const DB_URL = 'https://bill-tracker-678ba-default-rtdb.firebaseio.com';

const UPDATES = {
  'Netflix':         { amount: 8.75 },
  'Cricket Service': { amount: 201, dueDay: 19 },
  'Spotify':         { amount: 18.99, dueDay: 20 },
  'Comcast':         { dueDay: 11 },
  'Equifax':         { dueDay: 14 },
  'Car Insurance':   { dueDay: 25 },
};

const NEW_BILLS = [
  { name: 'Rent',   amount: 2200, category: 'rent',  dueDay: 30, frequency: 'monthly', active: true, wasteful: false, notes: '' },
  { name: 'Bassam', amount: 500,  category: 'other', dueDay: 2,  frequency: 'weekly',  active: true, wasteful: false, notes: 'Every Monday' },
];

async function run() {
  // 1. Fetch all existing bills
  const res = await fetch(`${DB_URL}/bills.json`);
  if (!res.ok) throw new Error(`Failed to fetch bills: HTTP ${res.status}`);
  const data = await res.json();
  if (!data) throw new Error('No bills found in database');

  // Build a name → key map
  const nameToKey = {};
  for (const [key, bill] of Object.entries(data)) {
    nameToKey[bill.name] = key;
  }

  // 2. Apply updates
  console.log('Updating existing bills:');
  for (const [name, changes] of Object.entries(UPDATES)) {
    const key = nameToKey[name];
    if (!key) { console.log(`  ✗ "${name}" not found — skipped`); continue; }

    const patch = await fetch(`${DB_URL}/bills/${key}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    if (!patch.ok) throw new Error(`Failed to update "${name}": HTTP ${patch.status}`);

    const summary = Object.entries(changes).map(([k, v]) => `${k}: ${v}`).join(', ');
    console.log(`  ✓ ${name.padEnd(16)}  ${summary}`);
  }

  // 3. Add new bills
  console.log('\nAdding new bills:');
  for (const bill of NEW_BILLS) {
    const payload = { ...bill, createdAt: Date.now() };
    const post = await fetch(`${DB_URL}/bills.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!post.ok) throw new Error(`Failed to add "${bill.name}": HTTP ${post.status}`);
    const { name: key } = await post.json();
    console.log(`  ✓ ${bill.name.padEnd(16)} $${String(bill.amount).padStart(7)}  →  ${key}`);
  }

  console.log('\nDone.');
}

run().catch(err => { console.error(err); process.exit(1); });
