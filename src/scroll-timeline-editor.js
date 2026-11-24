// EDITOR TEMPORAR — o singura axa pentru scrollul intregii pagini.
// Fișierul nu folosește dat.GUI si nu necesita librarii noi.
export function installUnifiedScrollTimelineEditor({
  gsap, mainTimeline, cameraScrollPoints, cameraAnimationStart, textScrollPoints, onTextChange,
  onTimelineShift = () => {}, referenceScroll = null
}) {
  if (document.getElementById('unified-scroll-editor')) return;

  // Există o singură referință temporală: scrollY real în pixeli.
  const scroller = document.scrollingElement || document.documentElement;
  const maxScroll = () => Math.max(1, scroller.scrollHeight - window.innerHeight);
  // GUI positions are real page pixels; camera/text source coordinates may be
  // stored in a reference scroll domain (8413px for this project).
  const refMax = () => referenceScroll ?? maxScroll();
  const toPlot = px => px / refMax() * maxScroll();
  const fromPlot = px => px / maxScroll() * refMax();
  const scrollTrigger = mainTimeline.scrollTrigger;
  if (!scrollTrigger) {
    console.warn('[Scroll Editor] mainTimeline nu are ScrollTrigger.');
    return;
  }

  // Memorăm legătura originală: secunde GSAP -> pixeli de scroll.
  const baseTriggerStart = scrollTrigger.start;
  const baseTriggerEnd = scrollTrigger.end;
  const baseDuration = mainTimeline.duration();
  const pixelsPerSecond = Math.max(1, (baseTriggerEnd - baseTriggerStart) / Math.max(0.001, baseDuration));

  const allDirectChildren = mainTimeline.getChildren(false, true, true);
  const containsTarget = (child, selector) => {
    const tweens = child.getChildren ? child.getChildren(true, true, false) : [child];
    return tweens.some(tween => typeof tween.targets === 'function' &&
      tween.targets().some(target => target?.nodeType === 1 && target.matches(selector)));
  };
  const findChildren = selector => allDirectChildren.filter(child => containsTarget(child, selector));
  const foundInfo = findChildren('.infoBar');
  const foundOrtho = mainTimeline.getChildren(false, false, true).find(child =>
    !containsTarget(child, '.viewport2') && !containsTarget(child, '.text2D') &&
    !containsTarget(child, '.infoBar') && !containsTarget(child, '.nextBtn') &&
    !containsTarget(child, '.prevBtn') && !containsTarget(child, '.downBtn') &&
    !containsTarget(child, '.controls'));

  const gsapDefinitions = [
    ['ortho', 'Camera logo (ortho)', foundOrtho],
    ['logo', 'Logo 2D', findChildren('.viewport2')[0]],
    ['architizer', 'Text Architizer', findChildren('.text2D')[0]],
    ['infoIn', 'InfoBar intră', foundInfo[0]],
    ['next', 'Buton Next', findChildren('.nextBtn')[0]],
    ['prev', 'Buton Prev', findChildren('.prevBtn')[0]],
    ['down', 'Buton Down', findChildren('.downBtn')[0]],
    ['infoOut', 'InfoBar iese', foundInfo[1]],
    ['controlsFade', 'Controale dispar', findChildren('.controls')[0]],
    ['infoOut2', 'InfoBar iese 2', foundInfo[2]]
  ];

  const baseline = { camera: cameraScrollPoints.map(toPlot), cameraStart: toPlot(cameraAnimationStart.px),
    text: Object.fromEntries(Object.entries(textScrollPoints).map(([k,v]) => [k, toPlot(v)])), gsap: {} };
  const cameraLabels = ['A — Salut (poziție inițială)',
    'B — Început tranziție',
    'C — About Me',
    'D — Abilități',
    'E — Experiență',
    'F — Contact',
    'G — Final'
    ];
  const markers = [];
  // Marker INDEPENDENT de CAM A: îl tragi pentru a decide când începe efectiv A -> B.
  // Camera rămâne în poziția A între 0px și acest reper.
  markers.push({ id: 'cameraStart', label: 'CAM 0 — Start animație', kind: 'cameraStart',
    lane: 'left', px: toPlot(cameraAnimationStart.px) });
  cameraScrollPoints.forEach((p, i) => markers.push({
    id: 'camera' + i, label: 'CAM ' + cameraLabels[i], kind: 'camera',
    lane: 'left', index: i, px: toPlot(p), locked: i === 0
  }));
  const gsapMarkers = [];
  for (const [id, label, node] of gsapDefinitions) {
    if (!node) continue;
    const originalTime = node.startTime();
    const originalPx = Math.max(0, baseTriggerStart + originalTime * pixelsPerSecond);
    baseline.gsap[id] = { time: originalTime, px: originalPx };
    const marker = { id, label, kind: 'gsap', lane: 'right', node, px: originalPx };
    markers.push(marker);
    gsapMarkers.push(marker);
  }
  for (const [id, label] of [
    ['salut', 'Text: Salut!'], ['proiect', 'Text: Proiect'], ['gol', 'Text: golire']
  ]) {
    markers.push({ id: 'text_' + id, textKey: id, label, kind: 'text',
      lane: 'right', px: toPlot(textScrollPoints[id]) });
  }

  // Deconectăm numai controlul temporar al acestui editor.
  // Scenele originale, tween-urile și easing-urile rămân neschimbate.
  scrollTrigger.disable(false, true);
  mainTimeline.pause();
  const shift = baseTriggerStart / pixelsPerSecond;
  onTimelineShift(shift);
  const existingChildren = [...allDirectChildren];
  existingChildren.forEach(child => child.startTime(child.startTime() + shift));
  // Ancoră invizibilă pentru a permite plasarea markerelor pe întreaga pagină.
  mainTimeline.to({ __timelineAnchor: 0 }, { __timelineAnchor: 0, duration: 0.001,
    ease: 'none' }, maxScroll() / pixelsPerSecond + 5);

  const setTimelineAtActualScroll = () => {
    mainTimeline.time(Math.max(0, window.scrollY / pixelsPerSecond), false);
  };
  setTimelineAtActualScroll();

  const css = `
  #unified-scroll-editor, #unified-scroll-editor * { box-sizing:border-box; }
  #unified-scroll-editor { position:fixed; z-index:2147483646; top:12px; right:12px;
    width:min(420px,calc(100vw - 24px)); height:calc(100dvh - 24px); min-height:340px;
    font:12px/1.3 system-ui,-apple-system,Segoe UI,sans-serif; color:#edf2ff;
    background:rgba(18,23,46,.95); border:1px solid rgba(174,191,255,.36);
    border-radius:16px; box-shadow:0 12px 45px rgba(0,0,0,.4); user-select:none;
    display:flex; flex-direction:column; overflow:hidden; backdrop-filter:blur(16px); }
  #unified-scroll-editor .ue-header {display:flex;align-items:center;justify-content:space-between;
    padding:11px 12px 8px; flex:0 0 auto; gap:8px;}
  #unified-scroll-editor .ue-title {font-weight:750;font-size:13px;letter-spacing:.02em;}
  #unified-scroll-editor .ue-tiny {color:#a6b4d8;font-size:10px;}
  #unified-scroll-editor .ue-actions {display:flex;gap:5px;}
  #unified-scroll-editor button {border:1px solid rgba(200,210,255,.23);
    border-radius:8px;padding:5px 8px; background:rgba(255,255,255,.07); color:#fff;
    cursor:pointer;font:inherit;}
  #unified-scroll-editor button:hover {background:rgba(190,200,255,.18);}
  #unified-scroll-editor .ue-legend {display:flex;gap:12px;margin:0 13px 8px;color:#bdc9e9;font-size:10px;}
  #unified-scroll-editor .ue-legend span:before {content:'●';margin-right:4px;}
  #unified-scroll-editor .ue-legend .cam:before {color:#68ccff;}
  #unified-scroll-editor .ue-legend .anim:before {color:#b59aff;}
  #unified-scroll-editor .ue-legend .txt:before {color:#ffd081;}
  #unified-scroll-editor .ue-scroll-label {margin:0 12px 4px;display:flex;
    justify-content:space-between;color:#cbd4ed;font-size:10px;}
  #unified-scroll-editor .ue-plot {position:relative;flex:1;min-height:150px;
    margin:6px 12px 8px; border:1px solid rgba(220,225,255,.11);border-radius:10px;
    background:linear-gradient(90deg,rgba(104,204,255,.035) 0 49.8%,
      rgba(255,255,255,.1) 49.8% 50.2%,rgba(181,154,255,.04) 50.2% 100%);
    cursor:crosshair; touch-action:none; overflow:hidden;}
  #unified-scroll-editor .ue-axis {position:absolute;top:6px;bottom:6px;left:50%;width:2px;
    background:rgba(220,228,255,.38);transform:translateX(-50%);pointer-events:none;}
  #unified-scroll-editor .ue-progress {position:absolute;top:0;left:0;width:100%;
    background:linear-gradient(to bottom,rgba(124,187,255,.13),rgba(124,187,255,0));}
  #unified-scroll-editor .ue-ruler {position:absolute;left:calc(50% - 24px);width:19px;
    text-align:right;font-size:9px;color:#677797;transform:translateY(-50%);pointer-events:none;}
  #unified-scroll-editor .ue-cursor {position:absolute;left:0;width:100%;height:2px;
    background:#61f4a4;box-shadow:0 0 5px #61f4a4;z-index:2;pointer-events:none;}
  #unified-scroll-editor .ue-cursor::before {content:'SCROLL';position:absolute;right:0;
    bottom:3px;color:#61f4a4;font-weight:800;font-size:9px;}
  #unified-scroll-editor .ue-marker {position:absolute;left:50%;width:0;height:0;
    z-index:3;cursor:ns-resize;touch-action:none;}
  #unified-scroll-editor .ue-marker.ue-selected {z-index:5;}
  #unified-scroll-editor .ue-dot {position:absolute;left:-5px;top:-5px;border:2px solid #101d32;
    border-radius:100%;width:10px;height:10px;pointer-events:none;}
  #unified-scroll-editor .ue-marker.camera .ue-dot {background:#68ccff;}
  #unified-scroll-editor .ue-marker.cameraStart .ue-dot {background:#35f3bd;}
  #unified-scroll-editor .ue-marker.gsap .ue-dot {background:#b59aff;}
  #unified-scroll-editor .ue-marker.text .ue-dot {background:#ffd081;}
  #unified-scroll-editor .ue-marker.locked .ue-dot {background:#737d95;}
  #unified-scroll-editor .ue-marker .ue-link {position:absolute;left:-1px;width:1px;
    background:rgba(255,255,255,.32);pointer-events:none;display:none;}
  #unified-scroll-editor .ue-marker .ue-label {position:absolute;top:-10px;width:calc(50cqw - 26px);
    min-width:0;max-width:180px;padding:3px 7px;border:1px solid rgba(255,255,255,.13);
    border-radius:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    background:rgba(41,48,76,.92);font-size:10px;line-height:14px;height:22px;
    cursor:ns-resize;}
  #unified-scroll-editor .ue-marker.camera .ue-label {right:13px;text-align:right;
    border-right:2px solid #68ccff;}
  #unified-scroll-editor .ue-marker.cameraStart .ue-label {right:13px;text-align:right;
    border-right:2px solid #35f3bd;}
  #unified-scroll-editor .ue-marker.gsap .ue-label {left:13px;border-left:2px solid #b59aff;}
  #unified-scroll-editor .ue-marker.text .ue-label {left:13px;border-left:2px solid #ffd081;}
  #unified-scroll-editor .ue-marker.ue-selected .ue-label {background:#384877;border-color:#e9f1ff;}
  #unified-scroll-editor .ue-marker.locked .ue-label {opacity:.5;cursor:default;}
  #unified-scroll-editor .ue-footer {padding:8px 12px 12px;flex:0 0 auto;
    border-top:1px solid rgba(255,255,255,.12);display:flex;gap:7px;flex-wrap:wrap;}
  #unified-scroll-editor .ue-footer button {flex:1 1 auto;}
  #unified-scroll-editor .ue-primary {background:#647ce3!important;font-weight:750!important;}
  #unified-scroll-editor .ue-note {width:100%;font-size:10px;color:#b2bee0;}
  #unified-scroll-editor.ue-left {right:auto;left:12px;}
  #unified-scroll-editor.ue-mini {height:auto;min-height:0;width:290px;}
  #unified-scroll-editor.ue-mini .ue-plot, #unified-scroll-editor.ue-mini .ue-legend,
  #unified-scroll-editor.ue-mini .ue-scroll-label, #unified-scroll-editor.ue-mini .ue-footer {display:none;}
  #unified-scroll-editor .ue-output {position:absolute;z-index:20;inset:0;background:#141c36;
    padding:14px;display:none;flex-direction:column;gap:8px;}
  #unified-scroll-editor .ue-output.ue-visible {display:flex;}
  #unified-scroll-editor .ue-output textarea {resize:none;flex:1;border-radius:8px;
    border:1px solid #4d679e;background:#09132b;color:#e9f3ff;padding:10px;
    font:10px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;}
  #unified-scroll-editor .ue-output .ue-outputbuttons {display:flex;gap:7px;}
  #unified-scroll-editor .ue-output .ue-outputbuttons button {flex:1;}
  `;
  const style = document.createElement('style');
  style.id = 'unified-scroll-editor-style';
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('aside');
  panel.id = 'unified-scroll-editor';
  panel.style.containerType = 'inline-size';
  panel.innerHTML = `
    <div class="ue-header">
      <div><div class="ue-title">SCROLL • TIMELINE</div><div class="ue-tiny">Toată pagina = 0–100%</div></div>
      <div class="ue-actions"><button type="button" id="ue-switch" title="Mută panoul stânga / dreapta">⇄</button>
        <button type="button" id="ue-min" title="Micșorează panoul">−</button></div>
    </div>
    <div class="ue-legend"><span class="cam">Camera 3D</span><span class="anim">GSAP 2D</span><span class="txt">Texte</span></div>
    <div class="ue-scroll-label"><span>0% • începutul paginii</span><span id="ue-scroll-stat">scroll 0 px</span></div>
    <div class="ue-plot" id="ue-plot" role="group" aria-label="Toată înălțimea scrollabilă a paginii">
      <div class="ue-progress" id="ue-progress"></div><div class="ue-axis"></div>
      <div class="ue-cursor" id="ue-cursor"></div>
    </div>
    <div class="ue-footer">
      <button type="button" id="ue-current">↳ Vino la reper</button>
      <button type="button" class="ue-primary" id="ue-print">PRINT / COPY</button>
      <div class="ue-note">Trage etichetele ↑↓. Click pe axă = scroll real. Verde = poziția din pagină.</div>
    </div>
    <div class="ue-output" id="ue-output"><strong>Pozițiile finale — trimite-mi acest text</strong>
      <textarea id="ue-report" readonly spellcheck="false"></textarea>
      <div class="ue-outputbuttons"><button type="button" id="ue-copy">Copiază</button>
        <button type="button" id="ue-back">Înapoi</button></div>
    </div>
  `;
  document.body.appendChild(panel);
  const plot = panel.querySelector('#ue-plot');
  const progressFill = panel.querySelector('#ue-progress');
  const cursor = panel.querySelector('#ue-cursor');
  const stat = panel.querySelector('#ue-scroll-stat');
  const output = panel.querySelector('#ue-output');
  const report = panel.querySelector('#ue-report');

  for (const n of [0,25,50,75,100]) {
    const el = document.createElement('div');
    el.className = 'ue-ruler'; el.textContent = n + '%'; el.style.top = n + '%';
    plot.appendChild(el);
  }
  const selected = { marker: null };
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pct = px => clamp(px / maxScroll() * 100, 0, 100);
  const yPosition = px => 6 + clamp(px / maxScroll(), 0, 1) * Math.max(1, plot.clientHeight - 12);
  const nodeElements = new Map();
  for (const marker of markers) {
    const el = document.createElement('div');
    el.className = 'ue-marker ' + marker.kind + (marker.locked ? ' locked' : '');
    el.title = marker.label;
    el.innerHTML = '<div class="ue-dot"></div><div class="ue-link"></div><div class="ue-label"></div>';
    el.querySelector('.ue-label').textContent = marker.label;
    plot.appendChild(el);
    nodeElements.set(marker.id, el);
    el.addEventListener('pointerdown', event => {
      event.preventDefault(); event.stopPropagation();
      selected.marker = marker;
      if (marker.locked) { render(); return; }
      el.setPointerCapture(event.pointerId);
      updateFromPointer(event, marker);
    });
    el.addEventListener('pointermove', event => {
      if (el.hasPointerCapture(event.pointerId) && !marker.locked) updateFromPointer(event, marker);
    });
    el.addEventListener('pointerup', event => {
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    });
    el.addEventListener('pointercancel', event => {
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    });
  }

  function setMarkerPixel(marker, px) {
    px = clamp(px, 0, maxScroll());
    if (marker.kind === 'cameraStart') {
      // CAM 0 poate fi oriunde intre inceputul paginii si CAM B.
      px = clamp(px, 0, toPlot(cameraScrollPoints[1]) - 20);
      cameraAnimationStart.px = fromPlot(px);
    } else if (marker.kind === 'camera') {
      const i = marker.index;
      // CAM B nu poate trece deasupra noului CAM 0.
      const before = i === 1
        ? Math.max(toPlot(cameraScrollPoints[0]), toPlot(cameraAnimationStart.px))
        : (cameraScrollPoints[i - 1] === undefined ? -50 : toPlot(cameraScrollPoints[i - 1]));
      const after = cameraScrollPoints[i + 1] === undefined
        ? maxScroll() + 50 : toPlot(cameraScrollPoints[i + 1]);
      px = clamp(px, before + 20, Math.max(before + 20, after - 20));
      cameraScrollPoints[i] = fromPlot(px);
    } else if (marker.kind === 'text') {
      // Păstrăm cele trei condiții din changeDescription în ordine.
      if (marker.textKey === 'salut') px = Math.min(px, toPlot(textScrollPoints.proiect) - 20);
      if (marker.textKey === 'proiect') px = clamp(px, toPlot(textScrollPoints.salut) + 20, toPlot(textScrollPoints.gol) - 20);
      if (marker.textKey === 'gol') px = Math.max(px, toPlot(textScrollPoints.proiect) + 20);
      textScrollPoints[marker.textKey] = fromPlot(px);
      onTextChange();
    } else {
      // Mută chiar tween-ul/subtimeline-ul original în timeline-ul GSAP.
      marker.node.startTime(px / pixelsPerSecond);
      setTimelineAtActualScroll();
    }
    marker.px = px;
  }
  function updateFromPointer(event, marker) {
    const bounds = plot.getBoundingClientRect();
    const relativeY = clamp((event.clientY - bounds.top - 6) / Math.max(1, bounds.height - 12), 0, 1);
    setMarkerPixel(marker, relativeY * maxScroll());
    // Te duce la noul reper, ca să vezi imediat scena în browser.
    window.scrollTo({ top: marker.px, behavior: 'instant' });    render();
  }
  plot.addEventListener('pointerdown', event => {
    if (event.target.closest('.ue-marker')) return;
    const bounds = plot.getBoundingClientRect();
    const y = clamp((event.clientY - bounds.top - 6) / Math.max(1, bounds.height - 12), 0, 1);
    window.scrollTo({ top: y * maxScroll(), behavior: 'instant' });
    render();
  });

  function layoutLabels(list) {
    const height = plot.clientHeight;
    const ordered = [...list].sort((a,b) => a.px - b.px);
    const distance = 23;
    const topMargin = 12;
    const positions = [];
    ordered.forEach(m => {
      const ideal = yPosition(m.px);
      positions.push(positions.length === 0
        ? Math.max(topMargin, ideal)
        : Math.max(ideal, positions[positions.length - 1] + distance));
    });
    for (let j = positions.length - 1; j >= 0; j--) {
      positions[j] = Math.min(positions[j], j === positions.length - 1 ? height - topMargin : positions[j+1] - distance);
    }
    ordered.forEach((m, i) => {
      const element = nodeElements.get(m.id);
      const desired = yPosition(m.px);
      const shift = positions[i] - desired;
      const label = element.querySelector('.ue-label');
      label.style.transform = `translateY(${shift}px)`;
      const link = element.querySelector('.ue-link');
      link.style.display = Math.abs(shift) > 6 ? 'block' : 'none';
      link.style.top = Math.min(0, shift) + 'px';
      link.style.height = Math.abs(shift) + 'px';
    });
  }
  function render() {
    const current = clamp(window.scrollY / maxScroll(), 0, 1);
    const currentY = yPosition(window.scrollY);
    cursor.style.top = currentY + 'px';
    progressFill.style.height = currentY + 'px';
    stat.textContent = Math.round(window.scrollY) + ' / ' + Math.round(maxScroll()) + ' px';
    for (const marker of markers) {
      const el = nodeElements.get(marker.id);
      el.style.top = yPosition(marker.px) + 'px';
      el.classList.toggle('ue-selected', selected.marker === marker);
      const p = pct(marker.px).toFixed(1);
      const text = `${marker.label} · ${p}%`;
      el.querySelector('.ue-label').textContent = text;
      el.title = `${marker.label} | ${Math.round(marker.px)} px / ${p}%`;
    }
    layoutLabels(markers.filter(m => m.lane === 'left'));
    layoutLabels(markers.filter(m => m.lane === 'right'));
  }

  function getReport() {
    const m = maxScroll();
    const fmt = p => `${Math.round(p)} px  |  ${(p / m * 100).toFixed(2)}% din scroll total`;
    const sorted = kind => markers.filter(x => x.kind === kind);
    const line = (marker, original) => {
      const diff = marker.px - original;
      return `${marker.label.padEnd(23)} ${fmt(marker.px)}  |  delta ${diff >= 0 ? '+' : ''}${Math.round(diff)} px`;
    };
    const camera = sorted('camera');
    const cam0 = markers.find(x => x.id === 'cameraStart');
    const timeline = sorted('gsap');
    const texts = sorted('text');
    const lines = [
      '=== UNIFIED SCROLL TIMELINE — POZIȚII DE APLICAT ÎN COD ===',
      'Script sursă: scripts.js (poziții aplicate + magnetic scroll + GUI v3)',
      `Viewport: ${window.innerWidth} × ${window.innerHeight}px`,
      `Scroll real: max ${Math.round(m)}px | scrollY curent: ${Math.round(window.scrollY)}px`,
      `GSAP: ScrollTrigger original ${Math.round(baseTriggerStart)} → ${Math.round(baseTriggerEnd)} px`,
      `GSAP: 1s timeline = ${pixelsPerSecond.toFixed(3)}px scroll (conversie preview)`,
      `Scroll de referință în cod: ${Math.round(refMax())} px (valorile de mai jos sunt scalate corect)`,
      '', '--- CAMERA 3D: updateCam() ---',
      line(cam0, baseline.cameraStart),
      ...camera.map(x => line(x, baseline.camera[x.index])),
      '', '--- GSAP 2D: mainTimeline ---',
      ...timeline.map(x => line(x, baseline.gsap[x.id].px)),
      '', '--- CONȚINUT: changeDescription() ---',
      ...texts.map(x => line(x, baseline.text[x.textKey])),
      '', '--- VALORI PENTRU REINTRODUCERE ÎN COD ---',
      `cameraAnimationStart = ${Math.round(fromPlot(cam0.px))}; // CAM 0 — coordonată de referință (px)`,
      `cameraScrollPoints = [${camera.map(x => Math.round(fromPlot(x.px))).join(', ')}]; // pixeli pe scroll-ul de referință`,
      `textScrollPoints = ${JSON.stringify(Object.fromEntries(texts.map(x=>[x.textKey,Math.round(fromPlot(x.px))])))}; // scroll de referință`,
      'GSAP startTime (secunde ale timeline-ului de preview):',
      ...timeline.map(x => `  ${x.id.padEnd(15)} ${(x.px / pixelsPerSecond).toFixed(4)}s`),
      '', 'NOTĂ: timpii GSAP de mai sus sunt pentru driver-ul de preview',
      'bazat pe întregul scroll. Trimite-mi raportul complet pentru a adapta',
      'definitiv mainTimeline și updateCam, fără editor.',
    ];
    return lines.join('\n');
  }
  const openReport = () => {
    const text = getReport();
    report.value = text;
    console.log('%c=== SCROLL TIMELINE / PRINT ===', 'color:#78caff;font-weight:800', '\n'+text);
    output.classList.add('ue-visible');
    window.__scrollTimelineReport = text;
  };
  panel.querySelector('#ue-print').addEventListener('click',openReport);
  panel.querySelector('#ue-copy').addEventListener('click',async () => {
    report.select();
    try { await navigator.clipboard.writeText(report.value); }
    catch (_) { document.execCommand('copy'); }
    panel.querySelector('#ue-copy').textContent='Copiat ✓';
  });
  panel.querySelector('#ue-back').addEventListener('click',() => {
    output.classList.remove('ue-visible');
    panel.querySelector('#ue-copy').textContent='Copiază';
  });
  panel.querySelector('#ue-switch').addEventListener('click',() => panel.classList.toggle('ue-left'));
  panel.querySelector('#ue-min').addEventListener('click',() => {
    panel.classList.toggle('ue-mini');
    panel.querySelector('#ue-min').textContent = panel.classList.contains('ue-mini') ? '+' : '−';
  });
  panel.querySelector('#ue-current').addEventListener('click',() => {
    if (selected.marker) window.scrollTo({ top: selected.marker.px, behavior: 'instant' });
  });
  window.addEventListener('scroll', () => { setTimelineAtActualScroll(); render(); }, {passive: true});
  window.addEventListener('resize',render);
  // Atât actualizarea camerei cât și timeline-ul GSAP ascultă același scrollY.
  setTimelineAtActualScroll();
  render();
  console.info('[Scroll Editor] Un singur timeline relativ la scrollY. PRINT / COPY = configurația pentru modificările definitive.');
  window.unifiedScrollEditor = { markers, cameraAnimationStart, cameraScrollPoints, textScrollPoints, getReport };
}
