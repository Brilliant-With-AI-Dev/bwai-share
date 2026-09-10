

'use strict';



const PARTICIPANT = 'Sam';
const STAGES = [
  { id: 'reality', label: 'Current reality', turns: [
    { q: 'Where does “One Stratford” happen today? Where does the current structure help or hinder?',
      a: 'It happens when two practices land a pursuit together and nobody argues about whose it is. That’s rarer than it should be. Most weeks I plan staffing inside my own unit, because that’s where my number lives. Cross-unit work is real, but it happens on goodwill, not on the system.' },
    { q: 'What would a client notice if they watched that from the outside?',
      a: 'They’d see two teams with different intake, different templates, and a handoff in the middle. Good people on both sides, but it looks like two firms.' } ] },
  { id: 'direction', label: 'Direction', turns: [
    { q: 'Which choices do you understand as decided, recommended, or open? Where does your own view differ?',
      a: 'I understand mid-market and Canada are marked confirmed in the assumptions. I support that focus, though I still want to test its implications. Integrated delivery I agree with in principle, but “how integrated” is wide open. And I honestly don’t know whether picking industry verticals is decided or just being floated.' } ] },
  { id: 'implications', label: 'Practical implications', turns: [
    { q: 'If the firm commits to integrated delivery, what changes in your next ninety days? Think pursuits, staffing, and credit.',
      a: 'I’d need to release people to pursuits I don’t own, and trust the credit comes back. Today that means a harder conversation with my own team about utilization. If decision rights and credit aren’t written down, I’ll default to protecting my unit. Not because I want to, because that’s what the model rewards.' },
    { q: 'What’s one thing that would have to be true for that to feel safe rather than risky?',
      a: 'A shared capacity view I can actually see. If I can see the firm’s pipeline and who’s free, I stop hoarding.' } ] },
  { id: 'doubts', label: 'Judgment and doubts', turns: [
    { q: 'What do you support, question, or oppose in the plan? What evidence might change your view?',
      a: 'The growth and AI ambition outruns the evidence I’ve seen. I believe the direction; I don’t yet believe the capacity. I’d back it fully if we named fewer commitments and resourced them properly, instead of adding initiatives on top of full workloads.' } ] },
  { id: 'resolve', label: 'What the offsite must resolve', turns: [
    { q: 'What must the room actually decide on the 17th, not just discuss? And what will you bring?',
      a: 'Decide the operating model: who decides what across units, and how credit works. If that leaves the room open, nothing else moves. I’ll bring two live pursuits where the current model already cost us, and I’ll argue for a work plan with owners before we leave.' },
    { q: 'If the room can’t agree, how should it be settled?',
      a: 'Try for consensus, but the CEO should call it. A clear call I disagree with beats another quarter of ambiguity.' } ] },
];
const TENSIONS = [
  { id: 't1', title: 'One firm versus unit-level incentives and capacity',
    body: 'Shaper input suggests unit targets and credit rules may discourage integrated delivery. The 2024–2026 strategy delegated market and service choices to units; the 2027 assumptions reframe structure as a barrier to integration.',
    sources: ['Shaper transcripts (Sept 10)', '2024–2026 strategy (BU delegation)', '2027 assumptions (structure reframed)'],
    decisions: ['d1', 'd4'] },
  { id: 't2', title: 'Agreed direction versus genuinely open choices',
    body: 'Some choices read as settled (mid-market, Canada-first). Others are unclear: one shaper names focus industries; another treats industry focus as open. Participants may not share the same map of what is decided, recommended, or open.',
    sources: ['2027 assumptions (confirmed items)', 'Shaper transcripts (Sept 10)'],
    decisions: ['d2', 'd3'] },
  { id: 't3', title: 'Growth and AI ambition versus evidence and execution capacity',
    body: 'Margin, growth, and AI-enabled service aspirations appear in shaper input and the 2027 assumptions. The 2026 plan emphasizes BD discipline, utilization visibility, and reusable delivery. The open question is what evidence and capacity the ambition requires, and how many commitments the firm can actually resource.',
    sources: ['Shaper transcripts (Sept 10)', '2026 plan (BD, utilization)', '2027 assumptions (AI shift)'],
    decisions: ['d5', 'd6'] },
];

const QUESTIONS = [
  'Which choices does the room treat as settled, which as recommendations open to challenge, and which as genuinely open? Who breaks a tie?',
  'What would “One Stratford” change in the next two live pursuits: decision rights, staffing release, and credit?',
  'Is industry focus a decision for the 17th, or a question to hold open with explicit criteria and a date?',
  'What evidence would justify the growth and AI ambition, and what capacity does executing it require?',
  'For each decision, what action follows, who owns it, and what evidence will show completion?',
];
const DECISIONS = [
  { id: 'd1', decisionPrompt: 'What rule will govern cross-unit staffing and credit, and who can authorize it?', title: 'Operating model: decision rights and credit across units', status: 'open', note: 'Placement: demo hypothesis. Named by shapers as the thing that must be decided, not discussed.' },
  { id: 'd2', decisionPrompt: 'What implications should be tested within the documented mid-market and Canada focus?', title: 'Mid-market and Canada-first focus', status: 'settled', note: 'Marked confirmed in the 2027 structure-and-assumptions document. Not a participant vote.' },
  { id: 'd3', decisionPrompt: 'Choose industry focus now, or define the evidence needed before deciding?', title: 'Industry vertical focus', status: 'open', note: 'Placement: demo hypothesis. Shapers differ; keep as a shaping question, not consensus.' },
  { id: 'd4', decisionPrompt: 'Which delivery activities should be shared across the firm, and which should stay with each practice?', title: 'Integrated delivery and practitioner model', status: 'recommend', note: 'Placement: demo hypothesis. Reframed in 2027 assumptions; degree of integration is contested.' },
  { id: 'd5', decisionPrompt: 'Which commitments should be resourced first, and what should stop to make room?', title: 'Fewer, properly resourced commitments', status: 'recommend', note: 'Placement: demo hypothesis. Raised by shapers as a condition for backing the plan.' },
  { id: 'd6', decisionPrompt: 'What evidence and capacity would justify adopting the proposed targets?', title: 'Growth, margin, and AI-enabled service targets', status: 'open', note: 'Placement: demo hypothesis. Aspirations belong to individual shapers, not approved targets.' },
];
const STATUS_LABEL = { settled: 'Source document marks confirmed', recommend: 'Candidate recommendations', open: 'Candidate open decisions' };

const VIEWS = [
  { id: 'start', label: 'Welcome', group: 'Participant' },
  { id: 'voice', label: 'Speaking guide', group: 'Participant' },
  { id: 'context', label: 'Context', group: 'Participant' },
  { id: 'interview', label: 'Conversation', group: 'Participant' },
  { id: 'review', label: 'Review', group: 'Participant' },
  { id: 'outcome', label: 'Your outcome', group: 'Participant' },
  { id: 'facilitator', label: 'Facilitator preview', group: 'Facilitator' },
];



const KEY = 'stratford-mirror-candidate-v1';
const initial = () => ({
  progress: 0,
  answers: {},
  ready: {},
  reviewed: false,
  facilitatorMode: 'tension',
});
let state = load();
let view = 'start';
let editing = null;

function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? { ...initial(), ...s } : initial(); } catch { return initial(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {  } }

const turns = STAGES.flatMap(s => s.turns.map((t, i) => ({ ...t, key: `${s.id}-${i}`, stage: s })));
const totalTurns = turns.length;
const answerFor = t => state.answers[t.key] ?? t.a;
const stageDone = s => s.turns.every((t, i) => turns.findIndex(x => x.key === `${s.id}-${i}`) < state.progress);
const allDone = () => state.progress >= totalTurns;
const readyCount = () => STAGES.filter(s => state.ready[s.id]).length;



const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const btn = (text, action, extra = '', cls = '') => `<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
const main = document.querySelector('#main');
const drawer = document.querySelector('#answer-drawer');

function navigate(id, { focus = true } = {}) {
  if (!VIEWS.some(v => v.id === id)) id = 'start';
  view = id;
  if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  render();
  if (focus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
}
const next = (id, label = 'Continue') => btn(label + ' →', 'go', `data-view="${id}"`, 'primary');
const back = (id) => btn('← Back', 'go', `data-view="${id}"`, 'ghost');



function start() {
  return `<div class="welcome-editorial"><div class="experience-label">Participant experience · fictional participant · scripted</div>
<div class="welcome-hero"><div class="welcome-copy"><p class="eyebrow">Your Stratford Offsite Strategy Mirror</p>
<h1>Before the room<br>decides, say what<br><em>you actually think.</em></h1>
<p class="lead">The straw-dog strategy is a draft. This is your chance to test it against the reality of your practice: what’s working, what’s settled, what’s open, and what the offsite has to resolve.</p>
<p class="small muted">Eight sample exchanges across five stages. Explore the proposed experience; nothing is recorded or sent.</p>
${next('voice', 'Begin')}</div></div>
<div class="welcome-bottom"><p><strong>Something for you, too.</strong> The proposed experience would help you clarify your position and a question to bring into the room.</p><span class="tiny muted">Scripted demo · no recording or delivery</span></div></div>`;
}

function voice() {
  return `<div class="voice-guide-page"><div class="experience-label">Participant experience · speaking guide</div>
<div class="welcome-note mic-note"><span class="voice-symbol" aria-hidden="true">❙ ❚ ❙ ❚ ❙</span><p class="eyebrow">Built for speaking, not form-filling</p>
<h2>Talk it through.<br>Go past the<br>first answer.</h2>
<p>Tell the story behind your view. Name the pursuit, the handoff, the decision that stalled. Say what you’re unsure about. This candidate shows one or two sample exchanges per topic.</p>
<p>This walkthrough uses fictional answers to illustrate a spoken conversation. Click to reveal them; the microphone is not active.</p></div>
<div class="row spacer">${back('start')} ${next('context', 'I’m ready')}</div></div>`;
}

function context() {
  return `<div class="outcome-page"><div class="experience-label">Participant experience · context</div>
<p class="eyebrow">What this conversation is for</p>
<h1>Five stages. One position.</h1>
<p class="lead">You’ll move through five short topics. Each one asks for your honest read, not a polished answer.</p>
<ol class="stage-list">${STAGES.map((s, i) => `<li><span class="stage-number">${i + 1}</span><div><strong>${esc(s.label)}</strong><p class="small muted">${esc(STAGE_BLURB[s.id])}</p></div></li>`).join('')}</ol>
<div class="section-next"><p><strong>Proposed sharing flow.</strong> Select stages you would share. Nothing is sent. Edits are saved in this browser. The engagement’s sharing policy still requires approval. Please use fictional examples here.</p></div>
<div class="row spacer">${back('voice')} ${next('interview', 'Start the conversation')}</div></div>`;
}
const STAGE_BLURB = {
  reality: 'How the firm actually works today, and where the structure helps or hinders.',
  direction: 'Which choices you understand as decided, recommended, or open, and where your view differs.',
  implications: 'What would change in your next ninety days if the firm committed.',
  doubts: 'What you support, question, or oppose, and what evidence might change your view.',
  resolve: 'What the room must decide on the 17th, and what you will bring.',
};

function interview() {
  const shown = turns.slice(0, state.progress);
  const current = turns[state.progress];
  let html = '', lastStage = null;
  for (const t of shown) {
    if (t.stage !== lastStage) { html += `<p class="chapter-divider">Stage ${STAGES.indexOf(t.stage) + 1} · ${esc(t.stage.label)}</p>`; lastStage = t.stage; }
    html += `<div class="bubble"><p class="speaker">MIRROR</p><p class="words">${esc(t.q)}</p></div>
<div class="bubble cary"><p class="speaker">${esc(PARTICIPANT.toUpperCase())} · SCRIPTED</p><p class="words">${esc(answerFor(t))}</p></div>`;
  }
  if (current) {
    if (current.stage !== lastStage) html += `<p class="chapter-divider">Stage ${STAGES.indexOf(current.stage) + 1} · ${esc(current.stage.label)}</p>`;
    html += `<div class="bubble current-question" aria-label="Current Mirror question"><p class="speaker">MIRROR · ${esc(current.stage.label.toUpperCase())}</p><p class="words">${esc(current.q)}</p></div>`;
  }
  const composer = current
    ? `<div class="composer"><div class="row between"><div class="row"><span class="microphone" aria-hidden="true"></span><span class="small muted">Microphone simulated · click to reveal ${esc(PARTICIPANT)}’s scripted answer</span></div><span class="tiny muted">${state.progress + 1} of ${totalTurns}</span></div>
<div class="row spacer">${btn('Reveal sample answer', 'answer', '', 'primary')} ${state.progress ? btn('Undo last', 'undo', '', 'ghost') : ''}</div></div>`
    : `<div class="composer"><h2>That’s the conversation.</h2><p class="muted">Review the sample answers next. Nothing is sent from this candidate.</p><div class="row">${btn('Undo last', 'undo', '', 'ghost')} ${next('review', 'Review my answers')}</div></div>`;
  return `<div class="conversation"><div class="experience-label">Participant experience · conversation · ${esc(PARTICIPANT)} is fictional</div>
<div class="chat-scroll" id="chat" aria-live="polite">${html}</div>${composer}</div>`;
}

function review() {
  if (!allDone()) return `<div class="review-document"><div class="experience-label">Participant experience · review</div><h1>Nothing to review yet</h1><p class="lead">Finish the conversation first. In this draft, each turn is revealed by clicking “Reveal sample answer”.</p><div class="row">${next('interview', 'Go to the conversation')}</div></div>`;
  const groups = STAGES.map((s, i) => `<section class="review-group" id="stage-${s.id}"><h2 tabindex="-1">${i + 1}. ${esc(s.label)}</h2>
${s.turns.map((t, j) => { const key = `${s.id}-${j}`; const turn = turns.find(x => x.key === key); const edited = key in state.answers; return `<article class="answer-card" id="answer-${key}" tabindex="-1"><div class="answer-heading"><p class="question">${esc(t.q)}</p><div class="row">${edited ? '<span class="pill">Edited</span>' : ''}${btn('Edit', 'edit', `data-key="${key}"`, 'small')}</div></div><p class="answer">${answerFor(turn) === "" ? '<em>Answer removed</em>' : esc(answerFor(turn))}</p></article>`; }).join('')}
<div class="row between share-row"><label class="row"><input type="checkbox" data-action="ready" data-stage="${s.id}" ${state.ready[s.id] ? 'checked' : ''}> Would share with the facilitator</label><span class="pill ${state.ready[s.id] ? 'green' : ''}">${state.ready[s.id] ? 'Selected' : 'Not selected'}</span></div></section>`).join('');
  return `<div class="review-document"><div class="experience-label">Participant experience · review · ${esc(PARTICIPANT)} is fictional</div>
<p class="eyebrow">Review before sharing</p><h1>Here is what you said.</h1>
<p class="lead">Edit or remove any sample answer. Select stages you would share. Nothing is sent. Edits are saved in this browser; the engagement’s sharing policy still requires approval. Please use fictional examples.</p>
<div class="review-jumps">${STAGES.map((s, i) => btn(`${i + 1} · ${esc(s.label)}`, 'jump', `data-target="stage-${s.id}"`)).join('')}</div>
${groups}
<div class="review-finish"><h2>${readyCount()} of ${STAGES.length} stages selected</h2><p class="muted">Finishing here does not send anything. This draft has no delivery.</p><div class="row">${back('interview')} ${btn('Finish review →', 'finish-review', '', 'primary')}</div></div></div>`;
}

function outcome() {
  if (!allDone() || !state.reviewed) return `<div class="outcome-page"><p class="eyebrow">Your review</p><h1>${allDone() ? 'Review the sample answers first.' : 'Explore the conversation first.'}</h1><p class="lead">Finish the review to see your selections. Selecting no stages is also an option.</p>${next(allDone() ? 'review' : 'interview', allDone() ? 'Continue to review' : 'Continue the conversation')}</div>`;
  const ready = STAGES.filter(s => state.ready[s.id]);
  return `<div class="outcome-page"><div class="experience-label">Participant experience · example outcome · ${esc(PARTICIPANT)} is fictional</div>
<p class="eyebrow">Thank you</p><h1>Your review selections are saved in this browser.</h1>
<p class="lead">${allDone() ? `You selected ${ready.length} of ${STAGES.length} stages. Nothing has been sent.` : 'You haven’t finished the conversation yet, so nothing is marked ready.'}</p>
<div class="stack spacer">
<div class="card document"><p class="eyebrow">Something for you</p><h3>A question to bring into the room</h3><p class="muted">An example of a question the experience could help you formulate. This fixed example does not change when you edit answers.</p><p class="stub">“Who decides staffing release across units, and how is credit shared, before we commit to integrated delivery?”</p></div>
<div class="card"><p class="eyebrow">Illustrative facilitator preview</p><p class="muted">This separate example uses shaper discovery and strategy documents. Your scripted answers and sharing selections do not change it. Participant synthesis is not demonstrated here.</p>${btn('Preview the facilitator view', 'go', 'data-view="facilitator"')}</div>
</div><div class="row spacer">${back('review')} ${btn('Start over', 'reset', '', 'ghost')}</div></div>`;
}

function facilitator() {
  const mode = state.facilitatorMode;
  const toggle = `<div class="row mode-toggle" role="group" aria-label="Arrangement">${btn('Tension-first', 'mode', `data-mode="tension" aria-pressed="${mode === 'tension'}"`, mode === 'tension' ? 'primary' : '')}${btn('Decision-first', 'mode', `data-mode="decision" aria-pressed="${mode === 'decision'}"`, mode === 'decision' ? 'primary' : '')}</div>`;
  const body = mode === 'tension'
    ? `<ol class="tension-list">${TENSIONS.map(t => `<li class="card"><p class="eyebrow">Alignment tension</p><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p><p class="tiny muted">Sources: ${t.sources.map(esc).join(' · ')}</p><p class="tiny muted">Related decisions: ${t.decisions.map(d => esc(DECISIONS.find(x => x.id === d).title)).join('; ')}</p></li>`).join('')}</ol>`
    : `<div class="stack">${['settled', 'recommend', 'open'].map(st => `<section class="card"><p class="eyebrow">${esc(STATUS_LABEL[st])}</p><ul class="plain">${DECISIONS.filter(d => d.status === st).map(d => `<li><strong>${esc(d.title)}</strong><p>${esc(d.decisionPrompt)}</p><p class="small muted">${esc(d.note)} Related tension: ${TENSIONS.filter(t => t.decisions.includes(d.id)).map(t => esc(t.title)).join('; ')}</p></li>`).join('')}</ul></section>`).join('')}</div>`;
  return `<div class="outcome-page facilitator"><div class="experience-label">Facilitator preview · illustrative example</div>
<div class="hypothesis-banner"><strong>Preliminary hypotheses from shaper discovery.</strong> Drawn from three shaper transcripts and three strategy documents. Not findings from completed participant Mirrors. No counts, votes, or endorsements exist yet.</div>
<p class="eyebrow">Stratford · offsite preparation</p><h1>Possible tensions to explore before the offsite.</h1>
${toggle}
${body}
<section class="spacer"><p class="eyebrow">Questions the offsite could use</p><ol class="question-list">${QUESTIONS.map(q => `<li>${esc(q)}</li>`).join('')}</ol></section>

<div class="row spacer">${back('outcome')} ${next('start', 'Return to welcome')}</div></div>`;
}

const RENDER = { start, voice, context, interview, review, outcome, facilitator };



function openDrawer(key) {
  const t = turns.find(x => x.key === key); if (!t) return;
  editing = key;
  drawer.innerHTML = `<header class="drawer-head"><div><p class="eyebrow">Stage ${STAGES.indexOf(t.stage) + 1} · ${esc(t.stage.label)}</p><h2 id="drawer-title" tabindex="-1">Edit this answer</h2></div>${btn('×', 'drawer-close', 'aria-label="Close editor"', 'ghost')}</header>
<div class="drawer-body"><p class="question">${esc(t.q)}</p><label class="small" for="drawer-text">Your words. Edit freely, including removing an answer. Saving a change clears this stage’s selection; review it again before selecting. The original sample can be restored.</label><textarea id="drawer-text" class="edit-area">${esc(answerFor(t))}</textarea>
<div class="row spacer">${btn('Save', 'drawer-save', '', 'primary')} ${btn('Restore original', 'drawer-restore', '', 'ghost')} ${btn('Cancel', 'drawer-close', '', 'ghost')}</div></div>`;
  drawer.showModal();
  drawer.querySelector('#drawer-text').focus();
}
function closeDrawer() { const key = editing; editing = null; if (drawer.open) drawer.close(); render(); const card = key && document.getElementById('answer-' + key); if (card) card.focus(); }



function render() {
  const nav = document.querySelector('#nav');
  let group = null, html = '';
  VIEWS.forEach(v => {
    if (v.group !== group) { group = v.group; html += `<p class="eyebrow nav-group">${esc(group)}</p>`; }
    html += `<button data-action="go" data-view="${v.id}" ${v.id === view ? 'aria-current="step"' : ''}><span class="step-num" aria-hidden="true">·</span>${esc(v.label)}</button>`;
  });
  nav.innerHTML = html;
  const side = document.querySelector('#side-state');
  side.textContent = allDone() ? `Conversation complete · ${readyCount()} of ${STAGES.length} stages selected` : `Conversation ${state.progress} of ${totalTurns} turns · saved in this browser only`;
  main.innerHTML = RENDER[view]();
  document.title = `Stratford Mirror · Candidate · ${VIEWS.find(v => v.id === view).label}`;
  const chat = document.querySelector('#chat'); if (chat) chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el || el.type === 'checkbox') return;
  const a = el.dataset.action;
  if (a === 'go') navigate(el.dataset.view);
  else if (a === 'answer') { if (state.progress < totalTurns) { state.progress++; save(); render(); main.querySelector('.composer [data-action="answer"],.composer [data-view="review"]')?.focus(); } }
  else if (a === 'undo') { if (state.progress > 0) { state.progress--; state.reviewed = false; save(); render(); main.querySelector('[data-action="answer"]')?.focus(); } }
  else if (a === 'jump') { document.getElementById(el.dataset.target)?.scrollIntoView({ block: 'start' }); document.getElementById(el.dataset.target)?.querySelector('h2')?.focus(); }
  else if (a === 'edit') openDrawer(el.dataset.key);
  else if (a === 'drawer-save') {
    const v = drawer.querySelector('#drawer-text').value.trim();
    const t = turns.find(x => x.key === editing);
    if (v !== answerFor(t)) { delete state.ready[t.stage.id]; state.reviewed = false; }
    if (v !== t.a) state.answers[editing] = v; else delete state.answers[editing];
    save(); closeDrawer();
  }
  else if (a === 'finish-review') { if (allDone()) { state.reviewed = true; save(); navigate('outcome'); } }
  else if (a === 'drawer-restore') { drawer.querySelector('#drawer-text').value = turns.find(x => x.key === editing).a; }
  else if (a === 'drawer-close') closeDrawer();
  else if (a === 'mode') { state.facilitatorMode = el.dataset.mode; save(); render(); document.querySelector(`[data-mode="${el.dataset.mode}"]`)?.focus(); }
  else if (a === 'reset') { state = initial(); save(); navigate('start'); }
});
document.addEventListener('change', e => {
  const el = e.target; if (el.dataset.action !== 'ready') return;
  state.reviewed = false; state.ready[el.dataset.stage] = el.checked; if (!el.checked) delete state.ready[el.dataset.stage]; save(); render();
  document.querySelector(`[data-stage="${el.dataset.stage}"]`)?.focus();
});
drawer.addEventListener('close', () => { if (editing) { editing = null; render(); } });
window.addEventListener('popstate', () => { view = location.hash.slice(1) || 'start'; if (!RENDER[view]) view = 'start'; render(); });

view = location.hash.slice(1) || 'start'; if (!RENDER[view]) view = 'start';
render();
