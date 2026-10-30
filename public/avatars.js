// Chibi team avatars (inline SVG), keyed by team digit 0-9 (digit 0 = Team 10). Shared by the user, admin and game pages.
// 1 FIFA · 2 UEFA · 3 AELTC (Wimbledon) · 4 THE OPEN · 5 ECB (cricket) · 6 AJAX (dish soap) · 7 PALEO Festival · 8 ONP (Opéra de Paris) · 9 Silverstone · 0/10 KSI (Iceland)
(function () {
  const S = '#5a3a2a'; // outline
  const svg = (bg, inner) =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img"><defs><clipPath id="av-clip"><circle cx="50" cy="50" r="48"/></clipPath></defs><g clip-path="url(#av-clip)"><circle cx="50" cy="50" r="48" fill="${bg}"/><g transform="translate(50 49) scale(.8) translate(-50 -52)">${inner}</g></g></svg>`;
  const head = (skin = '#ffe3c8') => `<ellipse cx="50" cy="58" rx="30" ry="27" fill="${skin}" stroke="${S}" stroke-width="2"/>`;
  const eyes = (y = 60) =>
    `<ellipse cx="39" cy="${y}" rx="4" ry="5.5" fill="#2b2118"/><ellipse cx="61" cy="${y}" rx="4" ry="5.5" fill="#2b2118"/>` +
    `<circle cx="40.5" cy="${y - 2}" r="1.7" fill="#fff"/><circle cx="62.5" cy="${y - 2}" r="1.7" fill="#fff"/>`;
  const blush = (y = 69) =>
    `<ellipse cx="29" cy="${y}" rx="5" ry="3" fill="#ff8fa3" opacity=".75"/><ellipse cx="71" cy="${y}" rx="5" ry="3" fill="#ff8fa3" opacity=".75"/>`;
  const smile = (y = 70) => `<path d="M44 ${y} Q50 ${y + 6} 56 ${y}" stroke="${S}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const face = (skin) => head(skin) + eyes() + blush() + smile();
  const hair = (c = '#3a2a22') => `<path d="M20 56 Q20 28 50 28 Q80 28 80 56 Q68 42 50 44 Q32 42 20 56Z" fill="${c}"/>`;

  // little shape helpers
  const ngon = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, k) => { const a = (rot + k * 360 / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const poly = (pts, fill, stroke, sw) => `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw || 1}"` : ''}/>`;
  const star = (cx, cy, r, fill) => {
    const pts = []; for (let k = 0; k < 10; k++) { const a = (-90 + k * 36) * Math.PI / 180, rr = k % 2 ? r * 0.45 : r; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
    return poly(pts, fill);
  };
  const ball = (cx, cy, r, tint) => {   // classic football
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tint || '#fff'}" stroke="#2b2118" stroke-width="2"/>` + poly(ngon(cx, cy, r * 0.36, 5), '#2b2118');
    ngon(cx, cy, r * 0.36, 5).forEach((pt, k) => {
      const a = (-90 + k * 72) * Math.PI / 180, q = [cx + r * 0.78 * Math.cos(a), cy + r * 0.78 * Math.sin(a)];
      s += `<line x1="${pt[0].toFixed(1)}" y1="${pt[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="#2b2118" stroke-width="1.6"/>` + poly(ngon(q[0], q[1], r * 0.2, 5, -90 + k * 72 + 36), '#2b2118');
    });
    return s;
  };
  const snow = (x, y, r, c = '#fff') => [0, 60, 120].map((d) => `<line x1="${x - r}" y1="${y}" x2="${x + r}" y2="${y}" transform="rotate(${d} ${x} ${y})" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`).join('');
  const bubble = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffffaa" stroke="#7cc4ee" stroke-width="1.5"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.22}" fill="#fff"/>`;

  window.TEAM_AVATARS = {
    // 1 - Hội Đá Banh Toàn Cầu (FIFA): chibi hugging a football
    1: svg('#dff3e0',
      `<path d="M0 86 Q50 74 100 86 V100 H0Z" fill="#79c66b"/>` +
      head() + hair('#5b3a22') + eyes() + blush() + smile() +
      `<rect x="30" y="20" width="40" height="8" rx="4" fill="#fff"/><circle cx="50" cy="24" r="6" fill="#2d6cdf"/>` +   // headband with a globe dot
      ball(50, 88, 17)),
    // 2 - Quả Bóng Châu Âu (UEFA): ball + ring of gold stars on blue
    2: svg('#d6e4ff',
      ngon(50, 50, 44, 12, -90).map((p) => star(p[0], p[1], 5.5, '#ffcc00')).join('') +
      head() + hair('#2b2118') + eyes() + blush() + smile() +
      `<path d="M28 34 Q50 20 72 34" stroke="#1b4fb3" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      ball(78, 86, 16)),
    // 3 - Hội Đánh Vợt Bãi Cỏ (AELTC, Wimbledon): tennis racket on the lawn
    3: svg('#d4f0c4',
      `<path d="M0 84 Q50 72 100 84 V100 H0Z" fill="#5fb85a"/><path d="M0 92 H100 M0 96 H100" stroke="#fff" stroke-width="1.5" opacity=".7"/>` +
      head() + hair('#a65a2a') + eyes() + blush() + smile() +
      `<rect x="27" y="32" width="46" height="9" rx="4.5" fill="#fff" stroke="${S}" stroke-width="1.5"/>` +
      `<g transform="rotate(28 82 58)"><ellipse cx="82" cy="52" rx="12" ry="16" fill="none" stroke="#2f7d3a" stroke-width="3.5"/>` +
      `<path d="M72 52 H92 M82 38 V66 M75 44 H89 M75 60 H89" stroke="#cfe9c4" stroke-width="1"/><rect x="79.5" y="67" width="5" height="22" rx="2.5" fill="#7b4a22"/></g>` +
      `<circle cx="22" cy="86" r="8" fill="#d7e83a" stroke="#8aa31c" stroke-width="1.5"/><path d="M15 83 Q22 88 29 83 M15 89 Q22 84 29 89" stroke="#fff" stroke-width="1.5" fill="none"/>`),
    // 4 - Giải Mở Cửa (THE OPEN): an open door with light streaming out
    4: svg('#fff0c8',
      `<rect x="60" y="26" width="34" height="72" rx="3" fill="#fff6a8" stroke="#8b5a2b" stroke-width="2.5"/>` +
      `<path d="M60 26 L78 34 V92 L60 98Z" fill="#b9743f" stroke="#7b4a22" stroke-width="2"/><circle cx="74" cy="64" r="2.6" fill="#ffd23f"/>` +
      `<path d="M80 40 L90 36 M82 56 H92 M80 72 L90 78" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>` +
      head() + hair('#2b2118') + eyes() + blush() + smile() +
      `<circle cx="20" cy="90" r="6" fill="#fff" stroke="#9aa5b1" stroke-width="1.5"/><path d="M20 96 V84" stroke="#e5484d" stroke-width="0"/><path d="M12 76 V96" stroke="#7b4a22" stroke-width="2"/><path d="M12 76 L26 81 L12 86Z" fill="#e5484d"/>`),
    // 5 - Hội Đập Dế (ECB, cricket): cricket bat + a cricket (dế) on the shoulder
    5: svg('#e8f5d4',
      head() + hair('#3a2a22') + eyes() + blush() + smile() +
      `<g transform="rotate(-22 84 70)"><rect x="79" y="34" width="12" height="40" rx="5" fill="#e0b36a" stroke="#8b5a2b" stroke-width="2"/><rect x="82.5" y="72" width="5" height="22" rx="2.5" fill="#7b4a22"/></g>` +
      `<g><ellipse cx="20" cy="88" rx="11" ry="6.5" fill="#8b6b2e" stroke="#4f3a14" stroke-width="1.5"/><circle cx="29" cy="84" r="5.5" fill="#a98838" stroke="#4f3a14" stroke-width="1.5"/>` +
      `<circle cx="31" cy="82.5" r="1.6" fill="#2b2118"/><path d="M28 79 Q24 70 14 68 M31 79 Q33 70 26 64" stroke="#4f3a14" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
      `<path d="M12 92 L6 100 M18 94 L16 101 M24 94 L28 101" stroke="#4f3a14" stroke-width="2" stroke-linecap="round"/><path d="M12 86 Q20 74 28 86" stroke="#c9a74a" stroke-width="2" fill="none"/></g>` +
      `<circle cx="52" cy="92" r="6" fill="#d62828" stroke="#7a1414" stroke-width="1.5"/><path d="M47 90 Q52 93 57 90" stroke="#fff" stroke-width="1.2" fill="none"/>`),
    // 6 - Nước Rửa Chén (AJAX): dish soap bottle, sponge and a foam hat of bubbles
    6: svg('#d8f1ff',
      head() + eyes() + blush() + smile() +
      `<path d="M22 50 Q20 28 50 28 Q80 28 78 50 Q64 38 50 40 Q36 38 22 50Z" fill="#fff" stroke="#9fd3f2" stroke-width="2"/>` +   // foam
      `<circle cx="34" cy="26" r="9" fill="#fff" stroke="#9fd3f2" stroke-width="2"/><circle cx="52" cy="20" r="11" fill="#fff" stroke="#9fd3f2" stroke-width="2"/><circle cx="68" cy="27" r="8" fill="#fff" stroke="#9fd3f2" stroke-width="2"/>` +
      `<rect x="76" y="60" width="18" height="34" rx="5" fill="#3fb7a3" stroke="#1e7a6b" stroke-width="2"/><rect x="81" y="50" width="8" height="12" rx="2" fill="#f5f5f5" stroke="#9aa5b1" stroke-width="1.5"/><path d="M85 50 H93" stroke="#9aa5b1" stroke-width="3" stroke-linecap="round"/>` +
      `<rect x="79" y="72" width="12" height="10" rx="2" fill="#fff" opacity=".9"/><circle cx="85" cy="77" r="2.6" fill="#3fb7a3"/>` +
      `<rect x="8" y="76" width="24" height="16" rx="4" fill="#f5d24a" stroke="#b8941c" stroke-width="2"/><rect x="8" y="86" width="24" height="6" rx="3" fill="#4caf50"/>` +
      bubble(40, 92, 5) + bubble(70, 96, 4) + bubble(94, 44, 5) + bubble(10, 58, 4)),
    // 7 - Lễ Hội Người Tiền Sử (PALEO Festival): caveman with a bone in his hair and a fur top
    7: svg('#f4e4c4',
      head('#f2cfa6') +
      `<path d="M17 58 Q12 24 50 24 Q88 24 83 58 Q70 38 58 44 Q50 36 42 44 Q30 38 17 58Z" fill="#3a2a22"/><path d="M26 34 L18 30 M74 34 L82 30 M50 26 V18" stroke="#3a2a22" stroke-width="4" stroke-linecap="round"/>` +
      eyes() + blush() + smile() +
      `<path d="M38 46 L62 46 M40 42 L60 42" stroke="#3a2a22" stroke-width="3" stroke-linecap="round"/>` +
      `<g transform="rotate(-24 76 30)"><rect x="62" y="26" width="30" height="7" rx="3.5" fill="#fff" stroke="#b9a98a" stroke-width="1.5"/><circle cx="62" cy="26" r="5" fill="#fff" stroke="#b9a98a" stroke-width="1.5"/><circle cx="62" cy="34" r="5" fill="#fff" stroke="#b9a98a" stroke-width="1.5"/><circle cx="92" cy="26" r="5" fill="#fff" stroke="#b9a98a" stroke-width="1.5"/><circle cx="92" cy="34" r="5" fill="#fff" stroke="#b9a98a" stroke-width="1.5"/></g>` +
      `<path d="M14 84 L24 96 L32 86 L42 98 L52 88 L62 98 L72 88 L82 96 L88 84 Q50 74 14 84Z" fill="#c98a4b" stroke="#7b4a22" stroke-width="2"/><circle cx="30" cy="88" r="2.4" fill="#5b3a22"/><circle cx="52" cy="92" r="2.4" fill="#5b3a22"/><circle cx="72" cy="88" r="2.4" fill="#5b3a22"/>` +
      `<g transform="rotate(30 88 80)"><rect x="84" y="62" width="9" height="32" rx="4" fill="#8b5a2b" stroke="#5b3a22" stroke-width="1.5"/><ellipse cx="88.5" cy="62" rx="8" ry="10" fill="#9a6a38" stroke="#5b3a22" stroke-width="1.5"/></g>`),
    // 8 - Gánh Hát Paris (ONP, Opéra de Paris): beret, theatre mask and the Eiffel Tower
    8: svg('#f8e3ec',
      `<path d="M14 98 L26 36 L32 36 L44 98 M20 74 H38 M23 56 H35" stroke="#b9a0a8" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M24 98 Q29 80 34 98" stroke="#b9a0a8" stroke-width="3" fill="none"/>` +
      head() + hair('#6b3b24') + eyes() + blush() + smile() +
      `<ellipse cx="46" cy="30" rx="26" ry="9" fill="#2b2b3a" stroke="#14141c" stroke-width="2"/><circle cx="46" cy="21" r="3.4" fill="#2b2b3a"/>` +
      `<path d="M70 62 Q70 84 84 92 Q98 84 98 62 Q84 56 70 62Z" fill="#fff" stroke="#8b5a5a" stroke-width="2"/><path d="M75 68 Q79 65 82 69 M86 69 Q90 65 94 68" stroke="#2b2118" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M76 76 Q84 86 92 76" stroke="#c0392b" stroke-width="2.4" fill="none" stroke-linecap="round"/>`),
    // 9 - Hòn Đá Bạc (Silverstone): a shiny silver stone and a chequered flag
    9: svg('#e6ebf1',
      `<defs><linearGradient id="silv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b5c0cc"/><stop offset="1" stop-color="#7f8b97"/></linearGradient></defs>` +
      head() + hair('#2b2118') + eyes() + blush() + smile() +
      `<path d="M14 98 V46" stroke="#7b4a22" stroke-width="2.5"/>` +
      Array.from({ length: 12 }, (_, i) => { const cx = i % 4, cy = Math.floor(i / 4); return `<rect x="${14 + cx * 7}" y="${46 + cy * 7}" width="7" height="7" fill="${(cx + cy) % 2 ? '#fff' : '#2b2118'}"/>`; }).join('') +
      `<rect x="14" y="46" width="28" height="21" fill="none" stroke="#2b2118" stroke-width="1"/>` +
      `<path d="M52 98 L56 80 L68 70 L86 74 L96 88 L90 98Z" fill="url(#silv)" stroke="#5f6b77" stroke-width="2.2" stroke-linejoin="round"/><path d="M60 82 L70 76 M72 90 L84 82" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>` +
      star(60, 66, 6, '#fff') + star(92, 70, 5, '#fff') + star(76, 60, 4, '#fff')),
    // 0 (Team 10) - Hội Đá Banh Xứ Băng (KSI, Iceland): beanie, snowflakes and a football on the ice
    0: svg('#dcf3ff',
      `<path d="M0 90 Q50 80 100 90 V100 H0Z" fill="#bfe6f7"/>` +
      snow(18, 30, 6) + snow(84, 24, 7) + snow(90, 52, 4) + snow(10, 62, 4) +
      head() + hair('#d8b27a') + eyes() + blush() + smile() +
      `<path d="M22 46 Q22 18 50 18 Q78 18 78 46Z" fill="#3d8bd8" stroke="#1f5fa6" stroke-width="2"/><rect x="20" y="40" width="60" height="12" rx="6" fill="#fff" stroke="#9fc7ec" stroke-width="1.5"/>` +
      `<path d="M30 32 H70 M34 25 H66" stroke="#9fc7ec" stroke-width="2" stroke-dasharray="3 3"/><circle cx="50" cy="14" r="7" fill="#fff" stroke="#9fc7ec" stroke-width="1.5"/>` +
      ball(50, 88, 15, '#f1faff')),
  };
})();
