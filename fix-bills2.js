const DB_URL = 'https://bill-tracker-678ba-default-rtdb.firebaseio.com';

const UPDATES = {
  'AT&T':          { amount: 55.33, dueDay: 7 },
  'Apple Storage': { name: 'iCloud+', amount: 9.99, dueDay: 10 },
  'Costco':        { frequency: 'yearly', dueDay: 9 },
};

async function run() {
  const res = await fetch(`${DB_URL}/bills.json`);
  if (!res.ok) throw new Error(`Failed to fetch bills: HTTP ${res.status}`);
  const data = await res.json();
  if (!data) throw new Error('No bills found in database');

  const nameToKey = Object.fromEntries(Object.entries(data).map(([k, v]) => [v.name, k]));

  let updated = 0;
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
    updated++;
  }

  console.log(`\n${updated}/3 bills updated.`);
}

run().catch(err => { console.error(err); process.exit(1); });
