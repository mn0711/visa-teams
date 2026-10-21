'use strict';
// Zero-framework server: Node http + JSON file storage + qrcode.
// Env: PORT (3000), ADMIN_USER (admin), ADMIN_PASSWORD (required in prod), BASE_URL (public URL for the QR), DATA_FILE.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const BASE_URL = (process.env.BASE_URL || '').replace(/\/+$/, '');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');
const PUBLIC = path.join(__dirname, 'public');

if (!process.env.ADMIN_PASSWORD) console.warn('WARNING: ADMIN_PASSWORD not set, using default "admin123". Set it before deploying.');

// ---- storage ----
// Rule: team = last digit of the order number (11 -> 1, 33 -> 3, 20 -> 0).
const teamOf = (order) => order % 10;
// Funny team names, index = team digit (0-9). Override with TEAM_NAMES="a,b,c,...,j" (10 comma-separated names).
const DEFAULT_TEAM_NAMES = ['Bánh Chưng Bánh Giầy', 'Phở Không Hành', 'Trà Đá Vỉa Hè', 'Cà Phê Muối', 'Chú Cuội Cung Trăng',
  'Thánh Gióng Phi Ngựa', 'Sơn Tinh Thủy Tinh', 'Trạng Quỳnh', 'Ông Táo Lên Trời', 'Cóc Kiện Trời'];
const custom = (process.env.TEAM_NAMES || '').split(',').map((n) => n.trim());
const TEAM_NAMES = custom.length === 10 && custom.every(Boolean) ? custom : DEFAULT_TEAM_NAMES;
const named = (e) => ({ ...e, teamName: TEAM_NAMES[e.team] });
// Comparison key: Unicode-normalised, lower case, all whitespace removed ("Anna  Le" == "annale").
const norm = (name) => name.normalize('NFC').toLowerCase().replace(/\s+/g, '');

// File backend (single process => assigning the next order is atomic).
function fileStore() {
  let entries = [];
  try { entries = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { entries = []; }
  const save = () => {
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(entries, null, 2));
    fs.renameSync(tmp, DATA_FILE);
  };
  return {
    async register(name) {
      const existing = entries.find((e) => norm(e.name) === norm(name));
      if (existing) return { entry: existing, duplicate: true };
      const order = entries.length + 1;
      const entry = { order, name, team: teamOf(order), createdAt: new Date().toISOString() };
      entries.push(entry);
      save();
      return { entry, duplicate: false };
    },
    async get(order) { return entries.find((e) => e.order === order) || null; },
    async list() { return entries; },
    async reset() { entries = []; save(); },
  };
}

// Upstash Redis backend (REST API, survives restarts on hosts with ephemeral disks).
function redisStore(url, token) {
  const cmd = async (...args) => {
    const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(args) });
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    return d.result;
  };
  const K = { counter: 'vt:counter', names: 'vt:names', entries: 'vt:entries' };
  const getByOrder = async (order) => JSON.parse(await cmd('HGET', K.entries, String(order)));
  return {
    async register(name) {
      const prev = await cmd('HGET', K.names, norm(name));
      if (prev) return { entry: await getByOrder(prev), duplicate: true };
      const order = await cmd('INCR', K.counter); // atomic
      // Claim the name; if a concurrent request with the same name won, return theirs.
      const won = await cmd('HSETNX', K.names, norm(name), String(order));
      if (!won) {
        const o = await cmd('HGET', K.names, norm(name));
        const entry = await getByOrder(o);
        if (entry) return { entry, duplicate: true };
      }
      const entry = { order, name, team: teamOf(order), createdAt: new Date().toISOString() };
      await cmd('HSET', K.entries, String(order), JSON.stringify(entry));
      return { entry, duplicate: false };
    },
    async get(order) { return getByOrder(order); },
    async list() {
      const vals = await cmd('HVALS', K.entries);
      return vals.map((v) => JSON.parse(v)).sort((a, b) => a.order - b.order);
    },
    async reset() { await cmd('DEL', K.counter, K.names, K.entries); },
  };
}

const store = process.env.UPSTASH_REDIS_REST_URL
  ? redisStore(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)
  : fileStore();
console.log(`Storage: ${process.env.UPSTASH_REDIS_REST_URL ? 'Upstash Redis' : 'local file ' + DATA_FILE}`);

// ---- helpers ----
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 10_000) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); } });
  });
}
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}
function isAdmin(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const [u, ...p] = Buffer.from(h.slice(6), 'base64').toString().split(':');
  return safeEqual(u, ADMIN_USER) && safeEqual(p.join(':'), ADMIN_PASSWORD);
}
function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Admin"', 'Content-Type': 'text/plain' });
  res.end('Authentication required');
  return false;
}
function publicBase(req) {
  if (BASE_URL) return BASE_URL;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`;
}
function serveFile(res, file) {
  fs.readFile(path.join(PUBLIC, file), (err, buf) => {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, buf, MIME[path.extname(file)] || 'application/octet-stream');
  });
}
const csvCell = (s) => `"${String(s).replace(/"/g, '""')}"`;

// ---- routes ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && p === '/avatars.js') return serveFile(res, 'avatars.js');
    if (req.method === 'GET' && p === '/api/check') {
      // Is a result saved on a phone still in the list? (false after an admin Reset)
      const order = Number(url.searchParams.get('order'));
      const name = String(url.searchParams.get('name') || '');
      const entry = Number.isInteger(order) ? await store.get(order) : null;
      return send(res, 200, entry && norm(entry.name) === norm(name) ? { valid: true, entry: named(entry) } : { valid: false });
    }
    if (req.method === 'GET' && p === '/api/teams') return send(res, 200, TEAM_NAMES);
    if (p === '/health') return send(res, 200, 'ok', 'text/plain');
    // End-user
    if (req.method === 'GET' && (p === '/' || p === '/join')) return serveFile(res, 'index.html');
    if (req.method === 'POST' && p === '/api/register') {
      const body = await readJson(req);
      const name = String(body.name || '').trim().replace(/\s+/g, ' ');
      if (!name || name.length > 60) return send(res, 400, { error: 'Please enter a visa name (max 60 characters).' });
      // A name already in the list (compared by norm()) is rejected, no new number is issued.
      const { entry, duplicate } = await store.register(name);
      if (duplicate) return send(res, 409, { error: 'This visa name is already registered. Please check your name.' });
      return send(res, 201, named(entry));
    }

    // Admin
    if (p === '/admin' && req.method === 'GET') return requireAdmin(req, res) && serveFile(res, 'admin.html');
    if (p === '/api/admin/entries' && req.method === 'GET') return requireAdmin(req, res) && send(res, 200, (await store.list()).map(named));
    if (p === '/api/admin/qr' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const joinUrl = `${publicBase(req)}/join`;
      const svg = await QRCode.toString(joinUrl, { type: 'svg', margin: 1, width: 320 });
      return send(res, 200, { url: joinUrl, svg });
    }
    if (p === '/api/admin/export.csv' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const entries = (await store.list()).map(named);
      const rows = ['order,visa_name,team,team_name,submitted_at', ...entries.map((e) => [e.order, csvCell(e.name), e.team, csvCell(e.teamName), e.createdAt].join(','))];
      res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="visa-teams.csv"' });
      return res.end('﻿' + rows.join('\n')); // BOM so Excel reads UTF-8 accents
    }
    if (p === '/api/admin/reset' && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      await store.reset();
      return send(res, 200, { ok: true });
    }

    send(res, 404, 'Not found', 'text/plain');
  } catch (e) {
    console.error(e);
    send(res, e instanceof SyntaxError ? 400 : 500, { error: e instanceof SyntaxError ? 'Bad request' : 'Server error, please try again.' });
  }
});

server.listen(PORT, () => console.log(`Listening on :${PORT}  (user: /join   admin: /admin)`));
