(function() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const hours = ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'];

  // intensity 0-4 per hour per day (0=none,1=quiet,2=mod,3=busy,4=peak)
  const data = [
    // Mon
    [1,3,3,2,1,1,1,0,0,1,1,2,3,2,1,0],
    // Tue
    [1,3,3,2,1,1,1,0,0,1,1,2,3,3,2,0],
    // Wed
    [2,4,3,2,1,1,1,0,0,1,1,2,3,2,2,1],
    // Thu
    [1,3,3,2,1,1,1,0,0,1,1,2,3,3,2,0],
    // Fri
    [1,3,4,3,2,1,1,0,0,1,1,3,4,4,3,1],
    // Sat
    [2,4,4,4,3,2,1,1,0,0,1,2,3,3,3,2],
    // Sun
    [1,2,2,1,1,0,0,0,0,0,0,1,2,2,1,0],
  ];

  const colors = [
    'transparent',
    'rgba(45,187,106,0.18)',
    'rgba(45,187,106,0.42)',
    '#2dbb6a',
    '#d94f2b',
  ];
  const labels = ['','Quiet','Moderate','Busy','🔥 Peak'];
  const heightPx = [0,8,13,20,28];

  const container = document.getElementById('hm-bars');
  const tooltip   = document.getElementById('hm-tooltip');
  if (!container) return;

  days.forEach((day, di) => {
    const dayData = data[di];
    const totalScore = dayData.reduce((a,b)=>a+b,0);
    const peakCount = dayData.filter(v=>v===4).length;

    const col = document.createElement('div');
    col.className = 'hm-col';

    // day label
    const label = document.createElement('div');
    label.className = 'hm-day-label';
    label.textContent = day;
    col.appendChild(label);

    // bar wrap — stacked segments
    const wrap = document.createElement('div');
    wrap.className = 'hm-bar-wrap';

    // build from bottom up (highest hours at top of visual)
    dayData.forEach((val, hi) => {
      if (val === 0) return;
      const seg = document.createElement('div');
      seg.className = 'hm-segment';
      seg.style.height = heightPx[val] + 'px';
      seg.style.background = colors[val];
      seg.style.width = '100%';
      if (val === 4) {
        seg.style.boxShadow = '0 0 8px rgba(217,79,43,0.5)';
      }
      if (val === 3) {
        seg.style.boxShadow = '0 0 6px rgba(45,187,106,0.3)';
      }
      wrap.appendChild(seg);
    });
    col.appendChild(wrap);

    // total score badge
    const badge = document.createElement('div');
    badge.className = 'hm-total-badge';
    const intensity = totalScore > 35 ? '🔥' : totalScore > 25 ? '●' : '○';
    badge.textContent = intensity;
    col.appendChild(badge);

    const sub = document.createElement('div');
    sub.className = 'hm-sub-badge';
    sub.textContent = peakCount > 0 ? peakCount + ' peak hrs' : 'low traffic';
    col.appendChild(sub);

    // tooltip
    col.addEventListener('mouseenter', (e) => {
      const peaks = dayData.map((v,i)=>v===4?hours[i]:null).filter(Boolean);
      const busy  = dayData.map((v,i)=>v>=3?hours[i]:null).filter(Boolean);
      tooltip.style.display = 'block';
      tooltip.innerHTML = `
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;margin-bottom:8px;color:#fff;">${day}</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${peaks.length ? `<div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:2px;background:#d94f2b;flex-shrink:0;display:inline-block;box-shadow:0 0 6px rgba(217,79,43,0.7);"></span><span style="font-size:12px;color:#f5f3ef;">Peak: <strong>${peaks.join(', ')}</strong></span></div>` : ''}
          ${busy.length ? `<div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:2px;background:#2dbb6a;flex-shrink:0;display:inline-block;"></span><span style="font-size:12px;color:#f5f3ef;">Busy: <strong>${busy.join(', ')}</strong></span></div>` : ''}
          <div style="margin-top:4px;font-size:11px;color:rgba(245,243,239,0.45);font-family:'DM Mono',monospace;">Score: ${totalScore} / 64</div>
        </div>
      `;
    });

    col.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      let left = e.clientX - rect.left + 12;
      let top  = e.clientY - rect.top  - 20;
      if (left + 200 > rect.width) left = left - 210;
      tooltip.style.left = left + 'px';
      tooltip.style.top  = top  + 'px';
    });

    col.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    container.appendChild(col);
  });
})();



  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ── Streak chart bars ──
  const bars = [30, 55, 40, 70, 85, 50, 90, 65, 80, 95, 60, 75];
  const chart = document.getElementById('streakChart');
  if (chart) {
    chart.innerHTML = bars.map((h, i) => {
      const opacity = 0.2 + (h / 100) * 0.7;
      return `<div class="chart-bar" style="height:${h}%; background:rgba(255,255,255,${opacity}); border-radius:2px 2px 0 0;"></div>`;
    }).join('');
  }

  // ── Timing heatmap ──
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const hours = ['6am','7am','8am','9am','5pm','6pm','7pm','8pm'];
  const patterns = [
    [1,3,3,2,1,1,1,1],  // Mon
    [1,3,3,2,1,2,2,1],  // Tue
    [2,4,3,2,1,3,2,1],  // Wed
    [1,3,3,2,1,2,3,1],  // Thu
    [1,3,4,2,1,3,4,2],  // Fri
    [3,4,4,3,2,3,3,2],  // Sat
    [1,2,2,1,0,1,1,0],  // Sun
  ];
  const cls = ['h-low','h-mid','h-high','h-peak',''];
  const heatmap = document.getElementById('timingHeatmap');
  if (heatmap) {
    heatmap.innerHTML = days.map((d, i) => `
      <div class="timing-col">
        <div class="timing-day">${d}</div>
        ${patterns[i].map((v, h) => v > 0 ? `<div class="timing-cell ${cls[v-1]}">${hours[h]}</div>` : `<div class="timing-cell" style="background:var(--surface2);"></div>`).join('')}
      </div>
    `).join('');
  }

  // ── Animate inside count ──
  let count = 0;
  const target = 7;
  const el = document.getElementById('insideCount');
  const inc = setInterval(() => {
    if (count < target) { count++; if (el) el.textContent = count; }
    else clearInterval(inc);
  }, 180);