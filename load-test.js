'use strict';
// Usage: node load-test.js [baseUrl] [count]   (default http://localhost:3000, 50)
// Fires `count` simultaneous submissions with different names and checks the result.
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const count = Number(process.argv[3] || 50);
const run = Date.now().toString(36);

(async () => {
  const t0 = Date.now();
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      fetch(`${base}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Load ${run} #${i + 1}` }),
      }).then(async (r) => ({ status: r.status, body: await r.json() }))
    )
  );
  const ms = Date.now() - t0;

  const ok = results.filter((r) => r.status === 201).map((r) => r.body);
  const orders = ok.map((e) => e.order).sort((a, b) => a - b);
  const unique = new Set(orders).size;
  const consecutive = orders.every((o, i) => i === 0 || o === orders[i - 1] + 1);
  const wrongTeam = ok.filter((e) => e.team !== e.order % 10).length;

  console.log(`Sent ${count} in ${ms} ms | created: ${ok.length} | failed: ${count - ok.length}`);
  console.log(`Unique order numbers: ${unique}/${ok.length} | consecutive: ${consecutive} | range ${orders[0]}..${orders[orders.length - 1]}`);
  console.log(`Wrong team: ${wrongTeam}`);
  const pass = ok.length === count && unique === count && consecutive && wrongTeam === 0;
  console.log(pass ? 'PASS' : 'FAIL');
  process.exit(pass ? 0 : 1);
})();
