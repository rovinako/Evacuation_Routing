// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════

const G = {
  "Gaza City":     [{ node:"Jabalia",       danger:4, time:2, congestion:3, roadCondition:2 },
                   { node:"Nuseirat",       danger:6, time:4, congestion:4, roadCondition:3 }],
  "Jabalia":       [{ node:"Gaza City",     danger:4, time:2, congestion:3, roadCondition:2 },
                   { node:"Beit Lahia",     danger:3, time:2, congestion:2, roadCondition:2 },
                   { node:"Beit Hanoun",    danger:5, time:3, congestion:3, roadCondition:3 }],
  "Beit Lahia":    [{ node:"Jabalia",       danger:3, time:2, congestion:2, roadCondition:2 },
                   { node:"Shelter A",      danger:2, time:2, congestion:2, roadCondition:1 }],
  "Beit Hanoun":   [{ node:"Jabalia",       danger:5, time:3, congestion:3, roadCondition:3 },
                   { node:"Shelter A",      danger:4, time:2, congestion:2, roadCondition:2 }],
  "Nuseirat":      [{ node:"Gaza City",     danger:6, time:4, congestion:4, roadCondition:3 },
                   { node:"Bureij",         danger:3, time:2, congestion:2, roadCondition:2 },
                   { node:"Deir al-Balah",  danger:4, time:3, congestion:3, roadCondition:2 }],
  "Bureij":        [{ node:"Nuseirat",      danger:3, time:2, congestion:2, roadCondition:2 },
                   { node:"Medical Point",  danger:2, time:1, congestion:2, roadCondition:1 },
                   { node:"Deir al-Balah",  danger:3, time:2, congestion:2, roadCondition:2 }],
  "Deir al-Balah": [{ node:"Nuseirat",      danger:4, time:3, congestion:3, roadCondition:2 },
                   { node:"Bureij",         danger:3, time:2, congestion:2, roadCondition:2 },
                   { node:"Khan Younis",    danger:5, time:3, congestion:3, roadCondition:2 },
                   { node:"Shelter B",      danger:2, time:2, congestion:2, roadCondition:1 }],
  "Khan Younis":   [{ node:"Deir al-Balah", danger:5, time:3, congestion:3, roadCondition:2 },
                   { node:"Rafah",          danger:4, time:2, congestion:3, roadCondition:2 },
                   { node:"Medical Point",  danger:3, time:2, congestion:2, roadCondition:1 }],
  "Rafah":         [{ node:"Khan Younis",   danger:4, time:2, congestion:3, roadCondition:2 },
                   { node:"Border Exit",    danger:2, time:2, congestion:2, roadCondition:1 },
                   { node:"Shelter B",      danger:3, time:2, congestion:2, roadCondition:1 }],
  "Shelter A":     [{ node:"Beit Lahia",    danger:2, time:2, congestion:2, roadCondition:1 },
                   { node:"Beit Hanoun",    danger:4, time:2, congestion:2, roadCondition:2 }],
  "Shelter B":     [{ node:"Deir al-Balah", danger:2, time:2, congestion:2, roadCondition:1 },
                   { node:"Rafah",          danger:3, time:2, congestion:2, roadCondition:1 }],
  "Medical Point": [{ node:"Bureij",        danger:2, time:1, congestion:2, roadCondition:1 },
                   { node:"Khan Younis",    danger:3, time:2, congestion:2, roadCondition:1 }],
  "Border Exit":   [{ node:"Rafah",         danger:2, time:2, congestion:2, roadCondition:1 }]
};

// Normalised canvas positions (0–1)
const POS = {
  "Gaza City":     { x:.24, y:.05 },
  "Jabalia":       { x:.17, y:.16 },
  "Beit Lahia":    { x:.06, y:.24 },
  "Beit Hanoun":   { x:.31, y:.25 },
  "Nuseirat":      { x:.37, y:.40 },
  "Bureij":        { x:.51, y:.50 },
  "Deir al-Balah": { x:.61, y:.58 },
  "Khan Younis":   { x:.68, y:.70 },
  "Rafah":         { x:.74, y:.81 },
  "Shelter A":     { x:.04, y:.36 },
  "Shelter B":     { x:.63, y:.77 },
  "Medical Point": { x:.56, y:.63 },
  "Border Exit":   { x:.87, y:.92 }
};

const NTYPE = {
  "Gaza City":"city",     "Jabalia":"city",    "Beit Lahia":"camp",
  "Beit Hanoun":"camp",   "Nuseirat":"camp",   "Bureij":"camp",
  "Deir al-Balah":"camp", "Khan Younis":"city", "Rafah":"city",
  "Shelter A":"safe",     "Shelter B":"safe",  "Medical Point":"medical",
  "Border Exit":"exit"
};

const NCLR = { city:"#f97316", camp:"#fbbf24", safe:"#4ade80", medical:"#22d3ee", exit:"#a78bfa" };
const NICO = { city:"🏙", camp:"⛺", safe:"🏥", medical:"➕", exit:"🚪" };

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function dc(d) {
  if (d <= 2) return "#4ade80";
  if (d <= 3) return "#86efac";
  if (d <= 4) return "#fbbf24";
  if (d <= 5) return "#f87171";
  return "#dc2626";
}

function dl(d) {
  if (d <= 2) return "Low";
  if (d <= 3) return "Moderate";
  if (d <= 4) return "High";
  if (d <= 5) return "Severe";
  return "Critical";
}

function blockedGraph() {
  const g = JSON.parse(JSON.stringify(G));
  g["Deir al-Balah"] = g["Deir al-Balah"].filter(e => e.node !== "Khan Younis");
  g["Khan Younis"]   = g["Khan Younis"].filter(e => e.node !== "Deir al-Balah");
  return g;
}

// ═══════════════════════════════════════════
// ALGORITHMS
// ═══════════════════════════════════════════

function edgeCost(e, m) {
  if (m === "safest")   return e.danger*.5  + e.time*.2  + e.congestion*.2 + e.roadCondition*.1;
  if (m === "fastest")  return e.time*.5    + e.danger*.2 + e.congestion*.2 + e.roadCondition*.1;
  /* balanced */        return e.danger*.35 + e.time*.35  + e.congestion*.2 + e.roadCondition*.1;
}

function dijkstra(graph, start, end, mode) {
  const dist = {}, prev = {}, visited = new Set();
  for (const n in graph) { dist[n] = Infinity; prev[n] = null; }
  dist[start] = 0;

  while (true) {
    let cur = null;
    for (const n in dist)
      if (!visited.has(n) && (cur === null || dist[n] < dist[cur])) cur = n;
    if (!cur || cur === end) break;
    visited.add(cur);
    for (const nb of graph[cur]) {
      const cost = dist[cur] + edgeCost(nb, mode);
      if (cost < dist[nb.node]) { dist[nb.node] = cost; prev[nb.node] = cur; }
    }
  }

  const path = []; let c = end;
  while (c) { path.unshift(c); c = prev[c]; }
  return { path, cost: dist[end], visited: visited.size, algo: "Dijkstra" };
}

function heuristic(a, b) {
  const dx = POS[a].x - POS[b].x, dy = POS[a].y - POS[b].y;
  return Math.sqrt(dx*dx + dy*dy) * 3;
}

function astar(graph, start, end, mode) {
  const open = [start], came = {}, visited = new Set();
  const gs = {}, fs = {};
  for (const n in graph) { gs[n] = Infinity; fs[n] = Infinity; }
  gs[start] = 0; fs[start] = heuristic(start, end);

  while (open.length) {
    const cur = open.reduce((a, b) => fs[a] < fs[b] ? a : b);
    visited.add(cur);

    if (cur === end) {
      const path = []; let t = end;
      while (t !== undefined) { path.unshift(t); t = came[t]; }
      return { path, cost: gs[end], visited: visited.size, algo: "A*" };
    }

    open.splice(open.indexOf(cur), 1);
    for (const nb of graph[cur]) {
      const tg = gs[cur] + edgeCost(nb, mode);
      if (tg < gs[nb.node]) {
        came[nb.node] = cur;
        gs[nb.node]   = tg;
        fs[nb.node]   = tg + heuristic(nb.node, end);
        if (!open.includes(nb.node)) open.push(nb.node);
      }
    }
  }
  return { path: [], cost: Infinity, visited: visited.size, algo: "A*" };
}

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

const S = {
  mode: "safest", algo: "dijkstra",
  path: [], result: null,
  scale: 1, ox: 0, oy: 0,
  drag: false, ds: null,
  looping: false, raf: null
};

// ═══════════════════════════════════════════
// CANVAS SETUP
// ═══════════════════════════════════════════

const canvas = document.getElementById("mapCanvas");
const ctx    = canvas.getContext("2d");
const area   = document.getElementById("mapArea");

function resize() {
  canvas.width  = area.clientWidth;
  canvas.height = area.clientHeight;
}

window.addEventListener("resize", () => { resize(); if (!S.looping) redraw(); });

function toC(nx, ny) {
  const px = Math.min(canvas.width, canvas.height) * .09;
  return {
    x: px + nx * (canvas.width  - px*2) * S.scale + S.ox,
    y: px + ny * (canvas.height - px*2) * S.scale + S.oy
  };
}

function pathEdgeSet(path) {
  const s = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    s.add(path[i] + "~" + path[i+1]);
    s.add(path[i+1] + "~" + path[i]);
  }
  return s;
}

// ═══════════════════════════════════════════
// DRAW
// ═══════════════════════════════════════════

function redraw() {
  if (S.looping) return;
  if (S.raf) return;
  S.raf = requestAnimationFrame(() => { S.raf = null; draw(); });
}

function startLoop() {
  if (S.looping) return;
  S.looping = true;
  (function loop() { if (!S.looping) return; draw(); requestAnimationFrame(loop); })();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // bg radial tint
  const gr = ctx.createRadialGradient(canvas.width*.5, canvas.height*.5, 0, canvas.width*.5, canvas.height*.5, canvas.width*.7);
  gr.addColorStop(0, "rgba(0,40,55,.2)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

  // topo lines
  ctx.save(); ctx.globalAlpha = .035; ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  ctx.restore();

  const useBlocked = document.getElementById("chkB").checked;
  const showCosts  = document.getElementById("chkE").checked;
  const graph      = useBlocked ? blockedGraph() : G;
  const pe         = pathEdgeSet(S.path);

  drawEdges(graph, pe, showCosts, useBlocked);
  if (S.path.length > 1) drawFlow();
  drawNodes(pe);
}

function drawEdges(graph, pe, showCosts, useBlocked) {
  const drawn = new Set();

  for (const from in graph) {
    for (const e of graph[from]) {
      const key = [from, e.node].sort().join("~");
      if (drawn.has(key)) continue;
      drawn.add(key);

      const p1 = toC(POS[from].x,   POS[from].y);
      const p2 = toC(POS[e.node].x, POS[e.node].y);
      const on = pe.has(from + "~" + e.node);

      ctx.save();
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      if (on) {
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3.5;
        ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 16;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = dc(e.danger); ctx.lineWidth = 1.8;
        ctx.globalAlpha = .28; ctx.setLineDash([6,5]);
      }
      ctx.stroke(); ctx.restore();

      // edge cost label
      if (showCosts && !on) {
        const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
        ctx.save();
        ctx.font = "9px 'Roboto Mono', monospace";
        ctx.fillStyle = "rgba(75,86,117,.85)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(edgeCost(e, S.mode).toFixed(1), mx, my - 5);
        ctx.restore();
      }
    }
  }

  // blocked road overlay
  if (useBlocked) {
    const p1 = toC(POS["Deir al-Balah"].x, POS["Deir al-Balah"].y);
    const p2 = toC(POS["Khan Younis"].x,   POS["Khan Younis"].y);
    ctx.save(); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2.5; ctx.globalAlpha = .6; ctx.setLineDash([8,4]);
    ctx.stroke(); ctx.restore();
    const mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2;
    ctx.save(); ctx.font = "bold 14px sans-serif"; ctx.fillStyle = "#f87171";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("✕", mx, my); ctx.restore();
  }
}

function drawFlow() {
  const t = (Date.now() % 1600) / 1600;
  for (let i = 0; i < S.path.length - 1; i++) {
    const a = S.path[i], b = S.path[i+1];
    if (!POS[a] || !POS[b]) continue;
    const p1 = toC(POS[a].x, POS[a].y), p2 = toC(POS[b].x, POS[b].y);
    const tt = (t + i * .2) % 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p1.x + (p2.x-p1.x)*tt, p1.y + (p2.y-p1.y)*tt, 4.5, 0, Math.PI*2);
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 12;
    ctx.fill(); ctx.restore();
  }
}

function drawNodes(pe) {
  const st = document.getElementById("ss").value;
  const en = document.getElementById("es").value;

  for (const name in POS) {
    const pos  = toC(POS[name].x, POS[name].y);
    const type = NTYPE[name];
    const base = NCLR[type] || "#6b7280";
    const isSt = name === st, isEn = name === en, onP = S.path.includes(name);
    const fill = isSt ? "#4ade80" : isEn ? "#f97316" : onP ? "#ffffff" : base;
    const r    = isSt || isEn ? 15 : onP ? 12 : 9;

    // halo
    if (isSt || isEn || onP) {
      ctx.save();
      const halo = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r+13);
      const ac   = isSt ? "34,222,128" : isEn ? "249,115,22" : "255,255,255";
      halo.addColorStop(0, `rgba(${ac},.22)`); halo.addColorStop(1, `rgba(${ac},0)`);
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r+13, 0, Math.PI*2);
      ctx.fillStyle = halo; ctx.fill(); ctx.restore();
    }

    // dashed ring for start/end
    if (isSt || isEn) {
      ctx.save(); ctx.beginPath(); ctx.arc(pos.x, pos.y, r+5, 0, Math.PI*2);
      ctx.strokeStyle = fill; ctx.lineWidth = 1.5; ctx.globalAlpha = .35;
      ctx.setLineDash([3,3]); ctx.stroke(); ctx.restore();
    }

    // circle
    ctx.save(); ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI*2);
    ctx.fillStyle = fill;
    if (onP || isSt || isEn) { ctx.shadowColor = fill; ctx.shadowBlur = 10; }
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // emoji icon
    ctx.save();
    ctx.font = `${Math.round(r * .9)}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(NICO[type] || "•", pos.x, pos.y);
    ctx.restore();

    // label
    ctx.save();
    ctx.font = `${(onP||isSt||isEn) ? "600 " : "400 "}11px 'Roboto Mono', monospace`;
    ctx.fillStyle = (onP||isSt||isEn) ? "rgba(255,255,255,.95)" : "rgba(200,210,230,.5)";
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(name, pos.x, pos.y + r + 5);
    ctx.restore();
  }
}

// ═══════════════════════════════════════════
// ROUTING
// ═══════════════════════════════════════════

function findRoute() {
  const s = document.getElementById("ss").value;
  const e = document.getElementById("es").value;
  document.getElementById("noRoute").style.display = "none";

  if (s === e) { showErr("Start and destination must be different."); return; }

  const graph = document.getElementById("chkB").checked ? blockedGraph() : G;
  const res   = S.algo === "astar" ? astar(graph, s, e, S.mode) : dijkstra(graph, s, e, S.mode);
  S.result = res;

  if (!res.path.length || res.cost === Infinity) {
    S.path = []; S.looping = false;
    document.getElementById("noRoute").style.display = "flex";
    showErr("No route found. Try disabling the blocked road option.");
    redraw(); return;
  }

  S.path = res.path;
  renderResult(res);
  startLoop();
}

function renderResult(r) {
  const ml = { safest:"Safest", fastest:"Fastest", balanced:"Balanced" }[S.mode];
  const stops = r.path.map((n, i) => {
    const cls = i === 0 ? "ds" : i === r.path.length - 1 ? "de" : "dm";
    return `<div class="stop">
      <div class="stop-dot ${cls}"></div>
      ${i < r.path.length - 1 ? '<div class="stop-line"></div>' : ""}
      <span class="stop-nm">${n}</span>
    </div>`;
  }).join("");

  document.getElementById("results").innerHTML = `
    <div class="rcard">
      <div class="rcard-top">
        <div class="r-cost">${r.cost.toFixed(2)}<span> risk pts</span></div>
        <div class="r-tag">${r.algo} · ${ml}</div>
      </div>
      <div class="rstat-row">
        <div class="rstat"><div class="rstat-l">Stops</div><div class="rstat-v">${r.path.length}</div></div>
        <div class="rstat"><div class="rstat-l">Visited</div><div class="rstat-v">${r.visited}</div></div>
        <div class="rstat"><div class="rstat-l">Mode</div><div class="rstat-v" style="font-size:12px">${ml}</div></div>
      </div>
      <div class="rpath"><div class="rpath-lbl">Route Path</div>${stops}</div>
    </div>`;

  if (document.getElementById("chkC").checked) renderCompare();
}

function renderCompare() {
  const s = document.getElementById("ss").value;
  const e = document.getElementById("es").value;
  if (s === e) return;

  const graph = document.getElementById("chkB").checked ? blockedGraph() : G;
  const dr    = dijkstra(graph, s, e, S.mode);
  const ar    = astar(graph,    s, e, S.mode);
  const mx    = Math.max(dr.visited, ar.visited);
  if (!mx) return;

  const pd     = (dr.visited / mx * 100).toFixed(0);
  const pa     = (ar.visited / mx * 100).toFixed(0);
  const saving = dr.visited - ar.visited;
  const winner = ar.visited < dr.visited
    ? "A* visited fewer nodes — more efficient"
    : "Both visited the same number of nodes";

  const old = document.getElementById("cmpS"); if (old) old.remove();
  const d = document.createElement("div"); d.id = "cmpS";
  d.innerHTML = `<div class="cmp-card">
    <div class="cmp-lbl">Efficiency Comparison · Nodes Visited</div>
    <div class="cmp-row">
      <span class="cmp-n">Dijkstra</span>
      <div class="cmp-track"><div class="cmp-bar cb-d" style="width:${pd}%"></div></div>
      <span class="cmp-val">${dr.visited}</span>
    </div>
    <div class="cmp-row">
      <span class="cmp-n">A* Search</span>
      <div class="cmp-track"><div class="cmp-bar cb-a" style="width:${pa}%"></div></div>
      <span class="cmp-val">${ar.visited}</span>
    </div>
    <div class="cmp-meta">${winner}${saving > 0 ? ` (<b style="color:var(--cyan)">−${saving} nodes</b>)` : ""}</div>
    <div class="cmp-meta" style="margin-top:5px">
      Route cost: identical at <b>${dr.cost < Infinity ? dr.cost.toFixed(2) : "∞"}</b> — both algorithms always find the optimal path
    </div>
  </div>`;
  document.getElementById("results").appendChild(d);
}

function maybeCompare() {
  if (!S.result) return;
  if (document.getElementById("chkC").checked) renderCompare();
  else { const s = document.getElementById("cmpS"); if (s) s.remove(); }
}

function showErr(m) {
  document.getElementById("results").innerHTML = `<div class="r-err">${m}</div>`;
}

function clearRoute() {
  S.path = []; S.result = null; S.looping = false;
  if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
  document.getElementById("noRoute").style.display = "none";
  document.getElementById("results").innerHTML =
    `<div class="empty-state">Select start + destination<br>then press Find Route</div>`;
  redraw();
}

// ═══════════════════════════════════════════
// UI CONTROLS
// ═══════════════════════════════════════════

function setMode(m, el) {
  S.mode = m;
  document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  redraw();
}

function setAlgo(a, el) {
  S.algo = a;
  document.querySelectorAll(".algo-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

function zoom(f)    { S.scale = Math.min(Math.max(S.scale * f, .35), 6); if (!S.looping) redraw(); }
function resetView(){ S.scale = 1; S.ox = 0; S.oy = 0; if (!S.looping) redraw(); }

// ═══════════════════════════════════════════
// POPULATE SELECTS
// ═══════════════════════════════════════════

(function () {
  const nodes = Object.keys(POS);
  const ss = document.getElementById("ss");
  const es = document.getElementById("es");
  nodes.forEach(n => { ss.appendChild(new Option(n, n)); es.appendChild(new Option(n, n)); });
  ss.value = "Gaza City";
  es.value = "Border Exit";
})();

// ═══════════════════════════════════════════
// MAP INTERACTION
// ═══════════════════════════════════════════

const tt = document.getElementById("tt");

canvas.addEventListener("mousedown", e => {
  S.drag = true;
  S.ds   = { x: e.clientX - S.ox, y: e.clientY - S.oy };
  canvas.style.cursor = "grabbing";
});

canvas.addEventListener("mousemove", e => {
  const r  = canvas.getBoundingClientRect();
  const cx = e.clientX - r.left;
  const cy = e.clientY - r.top;

  if (S.drag && S.ds) {
    S.ox = e.clientX - S.ds.x;
    S.oy = e.clientY - S.ds.y;
    if (!S.looping) redraw();
    return;
  }

  // tooltip hit-test
  let hit = null;
  for (const n in POS) {
    const p = toC(POS[n].x, POS[n].y);
    if (Math.hypot(cx - p.x, cy - p.y) < 18) { hit = n; break; }
  }

  if (hit) {
    const edges = G[hit] || [];
    const avg   = edges.length ? (edges.reduce((s, e) => s + e.danger, 0) / edges.length).toFixed(1) : "N/A";
    const ml    = { safest:"Safest", fastest:"Fastest", balanced:"Balanced" }[S.mode];
    const mc    = edges.length ? (edges.reduce((s, e) => s + edgeCost(e, S.mode), 0) / edges.length).toFixed(2) : "N/A";

    tt.innerHTML = `
      <div class="tt-nm">${hit}</div>
      <div class="tt-row"><span>Type</span><b>${NTYPE[hit]}</b></div>
      <div class="tt-row"><span>Connections</span><b>${edges.length}</b></div>
      <div class="tt-row"><span>Avg Danger</span><b style="color:${dc(parseFloat(avg))}">${avg} — ${dl(parseFloat(avg))}</b></div>
      <div class="tt-row"><span>Avg Cost (${ml})</span><b>${mc}</b></div>`;

    tt.style.left    = (e.clientX + 16) + "px";
    tt.style.top     = (e.clientY - 12) + "px";
    tt.style.opacity = "1";
    canvas.style.cursor = "pointer";
  } else {
    tt.style.opacity    = "0";
    canvas.style.cursor = S.drag ? "grabbing" : "grab";
  }
});

canvas.addEventListener("mouseup",    () => { S.drag = false; S.ds = null; canvas.style.cursor = "grab"; });
canvas.addEventListener("mouseleave", () => { S.drag = false; tt.style.opacity = "0"; });
canvas.addEventListener("wheel", e   => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : .9); }, { passive: false });

canvas.addEventListener("click", e => {
  if (S.drag) return;
  const r  = canvas.getBoundingClientRect();
  const cx = e.clientX - r.left;
  const cy = e.clientY - r.top;
  for (const n in POS) {
    const p = toC(POS[n].x, POS[n].y);
    if (Math.hypot(cx - p.x, cy - p.y) < 18) {
      if (e.shiftKey) document.getElementById("es").value = n;
      else            document.getElementById("ss").value = n;
      if (!S.looping) redraw();
      break;
    }
  }
});

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════

resize();
redraw();
