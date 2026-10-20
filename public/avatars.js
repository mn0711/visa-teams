// Chibi team avatars (inline SVG), keyed by team digit 0-9. Shared by the user and admin pages.
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

  window.TEAM_AVATARS = {
    // 1 - Phở Không Hành: chibi soaking in a pho bowl
    1: svg('#ffe9c7',
      head() + hair() + eyes() + blush() + smile() +
      `<path d="M16 80 H84 Q82 99 50 99 Q18 99 16 80Z" fill="#fff" stroke="${S}" stroke-width="2"/>` +
      `<path d="M19 88 H81" stroke="#2d6cdf" stroke-width="4"/>` +
      `<ellipse cx="50" cy="80" rx="34" ry="6" fill="#f7d98b" stroke="${S}" stroke-width="1.5"/>` +
      `<ellipse cx="38" cy="79" rx="7" ry="3" fill="#e57a7a"/><ellipse cx="60" cy="80" rx="7" ry="3" fill="#e57a7a"/>`),
    // 2 - Trà Đá Vỉa Hè: conical hat + giant iced tea
    2: svg('#e6f7e0',
      face() +
      `<path d="M62 62 L94 62 L89 97 L67 97Z" fill="#f3b24a" stroke="${S}" stroke-width="2"/>` +
      `<rect x="70" y="70" width="8" height="8" rx="2" fill="#fff" opacity=".8"/><rect x="79" y="78" width="8" height="8" rx="2" fill="#fff" opacity=".8"/>` +
      `<path d="M84 62 L90 40" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M16 42 L50 8 L84 42Z" fill="#ead58a" stroke="${S}" stroke-width="2"/>` +
      `<path d="M30 40 Q50 22 70 40" stroke="#c9a94f" stroke-width="2" fill="none"/>` +
      ''),
    // 3 - Cà Phê Muối: salty coffee cup
    3: svg('#f1e4d6',
      head() + hair('#5b3b25') + eyes() + blush() + smile() +
      `<path d="M20 80 H80 Q78 99 50 99 Q22 99 20 80Z" fill="#fff" stroke="${S}" stroke-width="2"/>` +
      `<path d="M80 83 Q94 82 90 92 Q86 98 78 95" stroke="${S}" stroke-width="3" fill="none"/>` +
      `<ellipse cx="50" cy="80" rx="30" ry="6" fill="#6b4226" stroke="${S}" stroke-width="1.5"/>` +
      `<ellipse cx="50" cy="79" rx="22" ry="3.5" fill="#fff8ec"/>` +
      `<path d="M14 40 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z M86 30 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#fff" stroke="#c9b9a6" stroke-width="1"/>`),
    // 4 - Chú Cuội Cung Trăng: on the moon with banyan leaves
    4: svg('#232c63',
      `<circle cx="50" cy="52" r="40" fill="#ffe27a"/><circle cx="26" cy="74" r="5" fill="#f2cd57"/><circle cx="78" cy="70" r="4" fill="#f2cd57"/>` +
      `<g fill="#fff"><circle cx="12" cy="18" r="2"/><circle cx="86" cy="14" r="2.5"/><circle cx="92" cy="40" r="1.6"/><circle cx="8" cy="46" r="1.6"/></g>` +
      head() + hair() + eyes() + blush() + smile() +
      `<path d="M50 28 Q38 12 28 22 Q36 30 50 28Z M50 28 Q62 10 74 20 Q64 30 50 28Z M50 28 Q50 8 50 4 Q58 14 50 28Z" fill="#4c9a3a" stroke="#2f6b25" stroke-width="1.5"/>`),
    // 5 - Thánh Gióng Phi Ngựa: golden helmet, red plume, sword
    5: svg('#ffd9d0',
      head() + eyes(64) + blush(72) + smile(73) +
      `<path d="M18 56 Q18 22 50 22 Q82 22 82 56Z" fill="#f2b632" stroke="${S}" stroke-width="2"/>` +
      `<rect x="44" y="22" width="12" height="30" fill="#f7cf5e" stroke="${S}" stroke-width="1.5"/>` +
      `<path d="M50 22 Q42 4 64 2 Q56 12 58 24Z" fill="#d62828" stroke="${S}" stroke-width="1.5"/>` +
      `<path d="M88 96 L88 60" stroke="#aeb7c2" stroke-width="5" stroke-linecap="round"/><path d="M80 80 H96" stroke="#f2b632" stroke-width="4" stroke-linecap="round"/>`),
    // 6 - Sơn Tinh Thủy Tinh: mountain vs. water, split hair
    6: svg('#dff3ff',
      `<path d="M0 100 L26 38 L54 100Z" fill="#6bbf6b"/><path d="M26 38 L19 54 L26 50 L33 54Z" fill="#fff"/>` +
      `<path d="M46 100 Q60 58 76 72 Q86 80 100 68 V100Z" fill="#4aa3df"/>` +
      head() + eyes() + blush() + smile() +
      `<path d="M20 56 Q20 28 50 28 L50 45 Q32 42 20 56Z" fill="#3c9a4a"/><path d="M50 28 Q80 28 80 56 Q68 42 50 45Z" fill="#2f7fd0"/>`),
    // 7 - Trạng Quỳnh: scholar hat with wings, sly mustache
    7: svg('#efe3ff',
      head() + eyes(60) + blush() + smile(73) +
      `<path d="M38 67 Q44 62 50 67 Q56 62 62 67" stroke="#2b2118" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="18" cy="28" rx="15" ry="5" fill="#2a2a2a"/><ellipse cx="82" cy="28" rx="15" ry="5" fill="#2a2a2a"/>` +
      `<path d="M32 40 V22 Q32 12 50 12 Q68 12 68 22 V40Q50 34 32 40Z" fill="#2a2a2a"/><rect x="32" y="34" width="36" height="4" fill="#d6a31f"/>` +
      `<rect x="36" y="87" width="28" height="12" rx="6" fill="#7b4bd1"/>`),
    // 8 - Ông Táo Lên Trời: kitchen god riding a carp
    8: svg('#ffe0b8',
      `<ellipse cx="46" cy="90" rx="32" ry="12" fill="#ff8a2a" stroke="${S}" stroke-width="2"/>` +
      `<path d="M74 90 L96 76 Q92 90 96 104Z" fill="#ff8a2a" stroke="${S}" stroke-width="2"/>` +
      `<circle cx="24" cy="87" r="3" fill="#2b2118"/><path d="M40 84 q4 4 0 8 M50 84 q4 4 0 8 M60 84 q4 4 0 8" stroke="#ffc27a" stroke-width="2" fill="none"/>` +
      face() +
      `<ellipse cx="20" cy="30" rx="14" ry="4.5" fill="#c2312b"/><ellipse cx="80" cy="30" rx="14" ry="4.5" fill="#c2312b"/>` +
      `<path d="M32 42 V24 Q32 14 50 14 Q68 14 68 24 V42Q50 36 32 42Z" fill="#c2312b"/><rect x="32" y="36" width="36" height="4" fill="#f2b632"/>`),
    // 9 - Cóc Kiện Trời: toad suing heaven
    9: svg('#d9f5d0',
      `<ellipse cx="50" cy="94" rx="32" ry="8" fill="#fff"/><ellipse cx="30" cy="92" rx="14" ry="7" fill="#fff"/><ellipse cx="72" cy="92" rx="14" ry="7" fill="#fff"/>` +
      `<ellipse cx="50" cy="62" rx="32" ry="25" fill="#7ec850" stroke="#2f6b25" stroke-width="2"/>` +
      `<circle cx="32" cy="36" r="13" fill="#7ec850" stroke="#2f6b25" stroke-width="2"/><circle cx="68" cy="36" r="13" fill="#7ec850" stroke="#2f6b25" stroke-width="2"/>` +
      `<circle cx="32" cy="36" r="8" fill="#fff"/><circle cx="68" cy="36" r="8" fill="#fff"/>` +
      `<circle cx="34" cy="37" r="4.5" fill="#2b2118"/><circle cx="66" cy="37" r="4.5" fill="#2b2118"/>` +
      `<circle cx="35.5" cy="35" r="1.5" fill="#fff"/><circle cx="67.5" cy="35" r="1.5" fill="#fff"/>` +
      `<path d="M30 68 Q50 86 70 68" stroke="#2f6b25" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="26" cy="68" rx="5" ry="3" fill="#ff8fa3" opacity=".75"/><ellipse cx="74" cy="68" rx="5" ry="3" fill="#ff8fa3" opacity=".75"/>` +
      `<g fill="#5aa23a"><circle cx="44" cy="56" r="2.5"/><circle cx="58" cy="54" r="2"/><circle cx="52" cy="62" r="2"/></g>`),
    // 0 - Bánh Chưng Bánh Giầy: square green cake with a round white cake hat
    0: svg('#e8f5e0',
      `<rect x="20" y="26" width="60" height="64" rx="8" fill="#5fae45" stroke="#2f6b25" stroke-width="2"/>` +
      `<path d="M20 42 H80 M20 58 H80 M20 74 H80 M38 26 V90 M62 26 V90" stroke="#4c9a3a" stroke-width="1.5" opacity=".6"/>` +
      `<path d="M20 50 H80 M20 68 H80" stroke="#f1e2a8" stroke-width="2.5"/><path d="M42 26 V90 M58 26 V90" stroke="#f1e2a8" stroke-width="2.5"/>` +
      `<ellipse cx="50" cy="24" rx="20" ry="11" fill="#fff" stroke="${S}" stroke-width="2"/>` +
      `<ellipse cx="39" cy="55" rx="4" ry="5.5" fill="#2b2118"/><ellipse cx="61" cy="55" rx="4" ry="5.5" fill="#2b2118"/>` +
      `<circle cx="40.5" cy="53" r="1.7" fill="#fff"/><circle cx="62.5" cy="53" r="1.7" fill="#fff"/>` +
      `<ellipse cx="30" cy="64" rx="5" ry="3" fill="#ff8fa3" opacity=".85"/><ellipse cx="70" cy="64" rx="5" ry="3" fill="#ff8fa3" opacity=".85"/>` +
      `<path d="M44 64 Q50 70 56 64" stroke="#2b2118" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  };
})();
