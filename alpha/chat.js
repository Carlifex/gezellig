// ============================================================================
// ALPHA / GEPARKT — Reden (KI-Chat)
// ----------------------------------------------------------------------------
// Aus app.js ausgelagert (nicht Teil des roten Fadens). NICHT in die App
// eingebunden. Zum Reaktivieren zurueck nach app.js kopieren und Verdrahtung
// wiederherstellen (Tab, render()-Dispatch, Imports). Siehe alpha/BACKLOG.md.
// Abhaengigkeiten (aus app.js/Modulen): esc, go, toast, state, CHAT_SCENARIOS, isMock, tutorReply (tutor.js), speak, speakSequence, ttsSupported
// ============================================================================

/* ============================ REDEN (Chat) ============================ */
let chatScenario = CHAT_SCENARIOS[0];
function renderChat() {
  const sc = chatScenario;
  app.innerHTML = `
    <div class="section-title">Reden</div>
    <div class="section-sub">${isMock() ? 'Übungs-Modus (offline)' : 'Mit KI verbunden'} · wähle eine Situation</div>
    <div class="seg wrap" id="scenpick">${CHAT_SCENARIOS.map(s =>
      `<button data-s="${s.id}" class="${s.id === sc.id ? 'on' : ''}">${s.icon} ${esc(s.label)}</button>`).join('')}</div>
    <div class="chat-wrap" style="margin-top:14px">
      <div class="scen">🎭 ${esc(sc.scenarioDe)}</div>
      <div class="msgs" id="msgs"></div>
      <form class="composer" id="composer"><input id="cin" placeholder="Auf Niederländisch tippen…" autocomplete="off"/><button class="btn small" type="submit">➤</button></form>
    </div>`;
  app.querySelectorAll('#scenpick button').forEach(b => b.onclick = () => {
    chatScenario = CHAT_SCENARIOS.find(s => s.id === b.dataset.s) || CHAT_SCENARIOS[0];
    renderChat();
  });
  mountChat(app.querySelector('#msgs'), app.querySelector('#composer'), app.querySelector('#cin'), sc);
}
function mountChat(msgsEl, formEl, inputEl, sc) {
  const history = [];
  const add = (role, text, hint) => {
    const d = document.createElement('div');
    d.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
    d.innerHTML = esc(text) + (hint ? `<span class="hint">${esc(hint)}</span>` : '');
    msgsEl.appendChild(d); window.scrollTo(0, document.body.scrollHeight);
  };
  add('assistant', sc.opener, sc.openerHint);
  history.push({ role: 'assistant', content: sc.opener });
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const txt = inputEl.value.trim(); if (!txt) return;
    inputEl.value = ''; add('user', txt); history.push({ role: 'user', content: txt });
    const think = document.createElement('div'); think.className = 'msg bot'; think.textContent = '…'; msgsEl.appendChild(think);
    const res = await tutorReply(history, sc); think.remove();
    add('assistant', res.text, res.hint); history.push({ role: 'assistant', content: res.text });
    if (state.settings.tts) speak(res.text);
    chatTurn(); flushUnlocks();
  });
}

