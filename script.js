/* ==========================================
   ROHIT'S WEB - STUDENT COMMAND CENTER
   FULL JAVASCRIPT SYSTEM ENGINE
   ========================================== */

// --- GLOBAL STORAGE KEY & STATE ---
const STORAGE_KEY = 'ROHITS_WEB_DATA';

const DEFAULT_DATA = {
  subjects: [
    { id: 'subj_1', code: 'CS301', name: 'Database Management Systems', teacher: 'Dr. A. Sharma', targetHours: 40, completedHours: 24 },
    { id: 'subj_2', code: 'CS302', name: 'Operating Systems', teacher: 'Prof. R. Verma', targetHours: 35, completedHours: 18 },
    { id: 'subj_3', code: 'CS303', name: 'Web Technologies', teacher: 'Dr. K. Patel', targetHours: 30, completedHours: 22 },
    { id: 'subj_4', code: 'CS304', name: 'Computer Networks', teacher: 'Prof. S. Gupta', targetHours: 25, completedHours: 10 }
  ],
  assignments: [
    { id: 'asgn_1', title: 'SQL Query Optimization Report', subject: 'CS301', description: 'Analyze execution plans for 10 complex join queries.', dueDate: '2026-09-25', priority: 'HIGH', completed: false },
    { id: 'asgn_2', title: 'Process Scheduling Simulation', subject: 'CS302', description: 'Implement Round Robin algorithm in C++', dueDate: '2026-09-28', priority: 'MEDIUM', completed: false },
    { id: 'asgn_3', title: 'Responsive Portfolio Project', subject: 'CS303', description: 'Build pure HTML/CSS/JS interactive dashboard.', dueDate: '2026-09-20', priority: 'HIGH', completed: true },
    { id: 'asgn_4', title: 'Subnetting Worksheet', subject: 'CS304', description: 'Solve IP allocation exercises 1 through 15.', dueDate: '2026-10-02', priority: 'LOW', completed: false }
  ],
  practicals: [
    { id: 'prac_1', number: 'PR-01', subject: 'CS301', title: 'ER Diagram to Relational Schema', date: '2026-09-18', status: 'Completed' },
    { id: 'prac_2', number: 'PR-02', subject: 'CS302', title: 'Linux System Calls Implementation', date: '2026-09-22', status: 'In Progress' },
    { id: 'prac_3', number: 'PR-03', subject: 'CS303', title: 'DOM Manipulation & Event Listeners', date: '2026-09-24', status: 'Pending' }
  ],
  timetable: [
    { id: 'tt_1', day: 'Monday', startTime: '09:00', endTime: '10:30', subject: 'CS301 - DBMS', room: 'Lab 3' },
    { id: 'tt_2', day: 'Monday', startTime: '11:00', endTime: '12:30', subject: 'CS302 - OS', room: 'Hall B' },
    { id: 'tt_3', day: 'Tuesday', startTime: '10:00', endTime: '11:30', subject: 'CS303 - Web Tech', room: 'Lab 1' },
    { id: 'tt_4', day: 'Wednesday', startTime: '09:00', endTime: '10:30', subject: 'CS304 - Networks', room: 'Room 204' },
    { id: 'tt_5', day: 'Thursday', startTime: '14:00', endTime: '16:00', subject: 'CS301 - DBMS Lab', room: 'Lab 3' },
    { id: 'tt_6', day: 'Friday', startTime: '11:00', endTime: '12:30', subject: 'CS303 - Web Tech', room: 'Hall A' }
  ],
  campus: [
    { id: 'camp_1', title: 'Annual Tech Hackathon 2026', description: '48-hour coding marathon with prizes worth $5,000. Registration open!', date: '2026-10-15', category: 'EVENTS' },
    { id: 'camp_2', title: 'Mid-Semester Exam Schedule Released', description: 'Exams begin from October 10th. Check student portal for detailed hall ticket.', date: '2026-09-15', category: 'NOTICES' },
    { id: 'camp_3', title: 'IEEE Research Journal Access', description: 'Free institutional credentials now available via campus library intranet.', date: '2026-09-10', category: 'RESOURCES' }
  ],
  goals: [
    { id: 'goal_1', title: 'Master JavaScript ES6+ Features', description: 'Deep dive into Promises, Async/Await, Web APIs, and OOP.', deadline: '2026-09-30', category: 'Academics', completed: true },
    { id: 'goal_2', title: 'Complete DBMS Project', description: 'Build full database schema and documentation for course project.', deadline: '2026-10-05', category: 'Projects', completed: false },
    { id: 'goal_3', title: 'Maintain 90%+ Attendance', description: 'Attend all scheduled lectures and laboratory sessions.', deadline: '2026-12-15', category: 'Personal', completed: false }
  ],
  notes: [
    { id: 'note_1', title: 'DBMS Indexing Types', content: 'B-Trees vs B+ Trees: B+ trees store data only in leaf nodes, making range queries faster.', pinned: true, timestamp: '2026-09-15 14:30' },
    { id: 'note_2', title: 'Project Presentation Checklist', content: '1. Prepare slides\n2. Test live demo locally\n3. Export backup database dump\n4. Rehearse timing (10 mins max)', pinned: false, timestamp: '2026-09-16 09:15' }
  ],
  studyMinutes: 240,
  settings: {
    sound: true,
    animations: true,
    compact: false
  }
};

let appState = null;

// Load App Data safely
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appState = JSON.parse(raw);
    } else {
      appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
    }
  } catch (e) {
    console.warn('LocalStorage error, restoring default state:', e);
    appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state to LocalStorage:', e);
  }
  renderAllViews();
}

// --- UTILITY: HTML ESCAPING ---
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type, duration, vol = 0.1) {
  if (!appState || !appState.settings.sound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio safe fallback
  }
}

function playClickSound() { playTone(800, 'sine', 0.05, 0.08); }
function playErrorSound() { playTone(180, 'sawtooth', 0.2, 0.1); }

function playSuccessSound() {
  if (!appState || !appState.settings.sound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.15);
    });
  } catch (e) {}
}

function playStartupSound() {
  if (!appState || !appState.settings.sound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [300, 450, 600, 900, 1200].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.2);
    });
  } catch (e) {}
}

// --- INITIALIZATION & INTRO SEQUENCE ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initIntroSequence();
  initNavigation();
  initClock();
  initQuickActions();
  initTimer();
  initSettingsAndDataCenter();
  applySettingsUI();
  renderAllViews();
});

function initIntroSequence() {
  const bootLog = document.getElementById('boot-log');
  const bootProgress = document.getElementById('boot-progress');
  const enterBtn = document.getElementById('btn-enter-system');

  const logs = [
    "SYSTEM INITIALIZING...",
    "LOADING STUDENT MODULES...",
    "CONNECTING PRODUCTIVITY SYSTEM...",
    "LOCAL STORAGE ONLINE...",
    "SYSTEM READY"
  ];

  let step = 0;
  const interval = setInterval(() => {
    if (step < logs.length) {
      const p = document.createElement('div');
      p.textContent = `> ${logs[step]}`;
      bootLog.appendChild(p);
      bootLog.scrollTop = bootLog.scrollHeight;
      step++;
      bootProgress.style.width = `${(step / logs.length) * 100}%`;
    } else {
      clearInterval(interval);
      enterBtn.classList.remove('hidden');
    }
  }, 400);

  enterBtn.addEventListener('click', () => {
    getAudioContext();
    playStartupSound();
    const introScreen = document.getElementById('intro-screen');
    const appContainer = document.getElementById('app-container');

    introScreen.style.opacity = '0';
    introScreen.style.transform = 'scale(1.1)';
    setTimeout(() => {
      introScreen.style.display = 'none';
      appContainer.classList.remove('hidden');
    }, 700);
  });
}

// --- CLOCK ENGINE ---
function initClock() {
  const clockEl = document.getElementById('live-clock');
  const timeDisplayEl = document.getElementById('system-time-display');

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (clockEl) clockEl.textContent = timeStr;
    if (timeDisplayEl) timeDisplayEl.textContent = `${timeStr} | ${dateStr} | SECURE LOCAL SYSTEM`;
  }
  update();
  setInterval(update, 1000);
}

// --- NAVIGATION ENGINE ---
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const viewPanels = document.querySelectorAll('.view-panel');
  const titleEl = document.getElementById('current-view-title');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();

      const targetView = link.getAttribute('data-view');
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      viewPanels.forEach(panel => {
        if (panel.id === `view-${targetView}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      if (titleEl) {
        titleEl.textContent = targetView.toUpperCase();
      }

      // Close mobile sidebar if open
      closeMobileSidebar();
    });
  });

  // Mobile menu events
  const toggleBtn = document.getElementById('btn-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// --- QUICK ACTIONS ---
function initQuickActions() {
  document.getElementById('quick-btn-assignment')?.addEventListener('click', () => openAssignmentModal());
  document.getElementById('quick-btn-practical')?.addEventListener('click', () => openPracticalModal());
  document.getElementById('quick-btn-goal')?.addEventListener('click', () => openGoalModal());
  document.getElementById('quick-btn-note')?.addEventListener('click', () => openNoteModal());
  document.getElementById('quick-btn-focus')?.addEventListener('click', () => {
    document.querySelector('.nav-link[data-view="focus"]')?.click();
  });

  // Section buttons
  document.getElementById('btn-add-subject')?.addEventListener('click', () => openSubjectModal());
  document.getElementById('btn-add-assignment')?.addEventListener('click', () => openAssignmentModal());
  document.getElementById('btn-add-practical')?.addEventListener('click', () => openPracticalModal());
  document.getElementById('btn-add-timetable')?.addEventListener('click', () => openTimetableModal());
  document.getElementById('btn-add-campus')?.addEventListener('click', () => openCampusModal());
  document.getElementById('btn-add-goal')?.addEventListener('click', () => openGoalModal());
  document.getElementById('btn-add-note')?.addEventListener('click', () => openNoteModal());

  // Search & Filters
  document.getElementById('asgn-search')?.addEventListener('input', renderAssignments);
  document.getElementById('asgn-filter-priority')?.addEventListener('change', renderAssignments);
  document.getElementById('asgn-filter-status')?.addEventListener('change', renderAssignments);

  document.getElementById('campus-search')?.addEventListener('input', renderCampusHub);
  document.querySelectorAll('.category-pills .pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.category-pills .pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      renderCampusHub();
    });
  });

  document.getElementById('notes-search')?.addEventListener('input', renderNotes);

  // Timetable Day Tabs
  document.querySelectorAll('#timetable-day-tabs .day-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#timetable-day-tabs .day-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderTimetable();
    });
  });
}

// --- RENDER ALL VIEWS ---
function renderAllViews() {
  renderDashboard();
  renderStudyPulse();
  renderAssignments();
  renderPracticals();
  renderTimetable();
  renderCampusHub();
  renderGoals();
  renderNotes();
  renderDataCenter();
}

// --- 2. DASHBOARD ENGINE ---
function renderDashboard() {
  const totalAsgn = appState.assignments.length;
  const pendingAsgn = appState.assignments.filter(a => !a.completed).length;
  
  const totalPrac = appState.practicals.length;
  const completedPrac = appState.practicals.filter(p => p.status === 'Completed').length;
  const pracPct = totalPrac > 0 ? Math.round((completedPrac / totalPrac) * 100) : 0;

  const totalGoals = appState.goals.length;
  const completedGoals = appState.goals.filter(g => g.completed).length;
  const goalPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const hours = Math.floor(appState.studyMinutes / 60);
  const mins = appState.studyMinutes % 60;

  document.getElementById('dash-total-assignments').textContent = totalAsgn;
  document.getElementById('dash-pending-assignments').textContent = pendingAsgn;
  document.getElementById('dash-practical-progress').textContent = `${pracPct}%`;
  document.getElementById('dash-goals-progress').textContent = `${goalPct}%`;
  document.getElementById('dash-study-time').textContent = `${hours}h ${mins}m`;
  document.getElementById('dash-notes-count').textContent = appState.notes.length;
  document.getElementById('dash-campus-count').textContent = appState.campus.length;

  // Urgent Assignments Widget
  const urgentList = document.getElementById('dash-urgent-list');
  const pendingItems = appState.assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  if (pendingItems.length === 0) {
    urgentList.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No pending assignments!</p>';
  } else {
    urgentList.innerHTML = pendingItems.map(a => `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-cyan);">
        <div>
          <strong>${escapeHTML(a.title)}</strong>
          <br><small class="text-muted">${escapeHTML(a.subject)} - Due: ${escapeHTML(a.dueDate)}</small>
        </div>
        <span class="priority-badge priority-${a.priority}">${a.priority}</span>
      </div>
    `).join('');
  }

  // Today Schedule Widget
  const scheduleList = document.getElementById('dash-schedule-list');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayClasses = appState.timetable.filter(t => t.day === todayName);

  if (todayClasses.length === 0) {
    scheduleList.innerHTML = `<p class="text-muted" style="font-size:0.85rem;">No lectures scheduled for ${todayName}.</p>`;
  } else {
    scheduleList.innerHTML = todayClasses.map(c => `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-cyan);">
        <div>
          <strong>${escapeHTML(c.subject)}</strong>
          <br><small class="text-muted">Room: ${escapeHTML(c.room)}</small>
        </div>
        <span class="neon-cyan" style="font-family:var(--font-code); font-size:0.85rem;">${escapeHTML(c.startTime)} - ${escapeHTML(c.endTime)}</span>
      </div>
    `).join('');
  }
}

// --- 4. STUDYPULSE ENGINE ---
function renderStudyPulse() {
  const container = document.getElementById('studypulse-grid');
  if (!container) return;

  if (appState.subjects.length === 0) {
    container.innerHTML = '<p class="text-muted">No subjects added yet.</p>';
    return;
  }

  container.innerHTML = appState.subjects.map(s => {
    const pct = s.targetHours > 0 ? Math.min(100, Math.round((s.completedHours / s.targetHours) * 100)) : 0;
    return `
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div>
            <span class="neon-cyan" style="font-family:var(--font-code); font-size:0.8rem;">${escapeHTML(s.code)}</span>
            <h3 style="font-size:1.1rem; font-family:var(--font-tech);">${escapeHTML(s.name)}</h3>
          </div>
          <div class="card-actions">
            <button class="icon-action" onclick="openSubjectModal('${s.id}')">✏️</button>
            <button class="icon-action" onclick="deleteSubject('${s.id}')">🗑️</button>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">Teacher: ${escapeHTML(s.teacher)}</p>
        
        <div class="progress-label-wrap">
          <span>Target: ${s.targetHours}h</span>
          <span>${s.completedHours}h (${pct}%)</span>
        </div>
        <div class="cyber-progress">
          <div class="progress-fill" style="width:${pct}%;"></div>
        </div>

        <div style="margin-top:12px; display:flex; gap:6px;">
          <button class="btn-cyan" style="font-size:0.75rem; padding:4px 8px;" onclick="logSubjectHours('${s.id}', 1)">+1 Hr</button>
          <button class="btn-cyan" style="font-size:0.75rem; padding:4px 8px;" onclick="logSubjectHours('${s.id}', 2)">+2 Hrs</button>
        </div>
      </div>
    `;
  }).join('');
}

function logSubjectHours(id, hrs) {
  const subj = appState.subjects.find(s => s.id === id);
  if (subj) {
    subj.completedHours += hrs;
    appState.studyMinutes += hrs * 60;
    playSuccessSound();
    saveData();
    showToast(`Logged +${hrs}h for ${subj.name}`);
  }
}

function deleteSubject(id) {
  if (confirm('Delete subject and all related data?')) {
    appState.subjects = appState.subjects.filter(s => s.id !== id);
    saveData();
    showToast('Subject deleted.');
  }
}

// --- 5. ASSIGNMENTS ENGINE ---
function renderAssignments() {
  const container = document.getElementById('assignments-list');
  if (!container) return;

  const query = (document.getElementById('asgn-search')?.value || '').toLowerCase();
  const priorityFilter = document.getElementById('asgn-filter-priority')?.value || 'ALL';
  const statusFilter = document.getElementById('asgn-filter-status')?.value || 'ALL';

  let list = appState.assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(query) || a.subject.toLowerCase().includes(query);
    const matchesPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'PENDING' ? !a.completed : a.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (list.length === 0) {
    container.innerHTML = '<div class="glass-panel text-muted">No assignments found matching criteria.</div>';
    return;
  }

  container.innerHTML = list.map(a => `
    <div class="cyber-card" style="${a.completed ? 'opacity:0.6;' : ''}">
      <div class="cyber-card-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <input type="checkbox" ${a.completed ? 'checked' : ''} onchange="toggleAssignment('${a.id}')" style="transform:scale(1.3); cursor:pointer;">
          <div>
            <h3 style="font-size:1.1rem; ${a.completed ? 'text-decoration:line-through;' : ''}">${escapeHTML(a.title)}</h3>
            <span class="neon-cyan" style="font-family:var(--font-code); font-size:0.8rem;">${escapeHTML(a.subject)}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="priority-badge priority-${a.priority}">${a.priority}</span>
          <div class="card-actions">
            <button class="icon-action" onclick="openAssignmentModal('${a.id}')">✏️</button>
            <button class="icon-action" onclick="deleteAssignment('${a.id}')">🗑️</button>
          </div>
        </div>
      </div>
      <p style="font-size:0.9rem; color:var(--text-muted); margin:8px 0;">${escapeHTML(a.description)}</p>
      <div style="font-family:var(--font-code); font-size:0.8rem; color:var(--neon-yellow);">
        📅 Due Date: ${escapeHTML(a.dueDate)}
      </div>
    </div>
  `).join('');
}

function toggleAssignment(id) {
  const asgn = appState.assignments.find(a => a.id === id);
  if (asgn) {
    asgn.completed = !asgn.completed;
    if (asgn.completed) playSuccessSound();
    saveData();
    showToast(asgn.completed ? 'Assignment marked complete!' : 'Assignment marked pending.');
  }
}

function deleteAssignment(id) {
  if (confirm('Delete assignment?')) {
    appState.assignments = appState.assignments.filter(a => a.id !== id);
    saveData();
    showToast('Assignment deleted.');
  }
}

// --- 6. PRACTICALS ENGINE ---
function renderPracticals() {
  const container = document.getElementById('practicals-list');
  if (!container) return;

  const total = appState.practicals.length;
  const completed = appState.practicals.filter(p => p.status === 'Completed').length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('practical-stats-text').textContent = `${completed}/${total} Completed (${pct}%)`;
  document.getElementById('practical-overall-progress').style.width = `${pct}%`;

  if (total === 0) {
    container.innerHTML = '<div class="glass-panel text-muted">No practical records created.</div>';
    return;
  }

  container.innerHTML = appState.practicals.map(p => `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div>
          <span style="font-family:var(--font-code); font-size:0.8rem; color:var(--neon-blue);">${escapeHTML(p.number)} | ${escapeHTML(p.subject)}</span>
          <h3 style="font-size:1.05rem;">${escapeHTML(p.title)}</h3>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="status-badge status-${p.status.replace(' ', '-')}">${p.status}</span>
          <div class="card-actions">
            <button class="icon-action" onclick="openPracticalModal('${p.id}')">✏️</button>
            <button class="icon-action" onclick="deletePractical('${p.id}')">🗑️</button>
          </div>
        </div>
      </div>
      <p style="font-size:0.8rem; font-family:var(--font-code); color:var(--text-muted);">Scheduled: ${escapeHTML(p.date)}</p>
    </div>
  `).join('');
}

function deletePractical(id) {
  if (confirm('Delete practical record?')) {
    appState.practicals = appState.practicals.filter(p => p.id !== id);
    saveData();
    showToast('Practical record deleted.');
  }
}

// --- 7. TIMETABLE ENGINE ---
function renderTimetable() {
  const container = document.getElementById('timetable-list');
  if (!container) return;

  const activeTab = document.querySelector('#timetable-day-tabs .day-tab.active');
  const day = activeTab ? activeTab.getAttribute('data-day') : 'Monday';

  const classes = appState.timetable
    .filter(t => t.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (classes.length === 0) {
    container.innerHTML = `<div class="glass-panel text-muted">No classes scheduled for ${day}.</div>`;
    return;
  }

  container.innerHTML = classes.map(c => `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <div>
          <h3 style="font-size:1.1rem; color:var(--neon-blue);">${escapeHTML(c.subject)}</h3>
          <span style="font-family:var(--font-code); font-size:0.85rem; color:var(--text-muted);">Room / Venue: ${escapeHTML(c.room)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="neon-yellow" style="font-family:var(--font-code); font-size:0.9rem;">${escapeHTML(c.startTime)} - ${escapeHTML(c.endTime)}</span>
          <div class="card-actions">
            <button class="icon-action" onclick="openTimetableModal('${c.id}')">✏️</button>
            <button class="icon-action" onclick="deleteTimetable('${c.id}')">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function deleteTimetable(id) {
  if (confirm('Delete timetable class entry?')) {
    appState.timetable = appState.timetable.filter(t => t.id !== id);
    saveData();
    showToast('Class entry removed.');
  }
}

// --- 8. CAMPUSHUB ENGINE ---
function renderCampusHub() {
  const container = document.getElementById('campus-grid');
  if (!container) return;

  const query = (document.getElementById('campus-search')?.value || '').toLowerCase();
  const activePill = document.querySelector('.category-pills .pill.active');
  const category = activePill ? activePill.getAttribute('data-cat') : 'ALL';

  const posts = appState.campus.filter(p => {
    const matchesQuery = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    const matchesCat = category === 'ALL' || p.category === category;
    return matchesQuery && matchesCat;
  });

  if (posts.length === 0) {
    container.innerHTML = '<div class="glass-panel text-muted">No campus posts found.</div>';
    return;
  }

  container.innerHTML = posts.map(p => `
    <div class="cyber-card">
      <div class="cyber-card-header">
        <span class="priority-badge priority-LOW">${escapeHTML(p.category)}</span>
        <button class="icon-action" onclick="deleteCampusPost('${p.id}')">🗑️</button>
      </div>
      <h3 style="font-size:1.1rem; margin-bottom:8px;">${escapeHTML(p.title)}</h3>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:12px;">${escapeHTML(p.description)}</p>
      <small style="font-family:var(--font-code); color:var(--neon-cyan);">📅 Date: ${escapeHTML(p.date)}</small>
    </div>
  `).join('');
}

function deleteCampusPost(id) {
  if (confirm('Delete campus post?')) {
    appState.campus = appState.campus.filter(p => p.id !== id);
    saveData();
    showToast('Campus post deleted.');
  }
}

// --- 9. GOALS ENGINE ---
function renderGoals() {
  const container = document.getElementById('goals-list');
  if (!container) return;

  const total = appState.goals.length;
  const completed = appState.goals.filter(g => g.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('goals-stats-text').textContent = `${completed}/${total} Completed (${pct}%)`;
  document.getElementById('goals-overall-progress').style.width = `${pct}%`;

  if (total === 0) {
    container.innerHTML = '<div class="glass-panel text-muted">No personal goals recorded.</div>';
    return;
  }

  container.innerHTML = appState.goals.map(g => `
    <div class="cyber-card" style="${g.completed ? 'opacity:0.6;' : ''}">
      <div class="cyber-card-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <input type="checkbox" ${g.completed ? 'checked' : ''} onchange="toggleGoal('${g.id}')" style="transform:scale(1.3); cursor:pointer;">
          <div>
            <h3 style="font-size:1.1rem; ${g.completed ? 'text-decoration:line-through;' : ''}">${escapeHTML(g.title)}</h3>
            <span class="neon-green" style="font-family:var(--font-code); font-size:0.8rem;">Tag: ${escapeHTML(g.category)}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="icon-action" onclick="openGoalModal('${g.id}')">✏️</button>
          <button class="icon-action" onclick="deleteGoal('${g.id}')">🗑️</button>
        </div>
      </div>
      <p style="font-size:0.9rem; color:var(--text-muted); margin:8px 0;">${escapeHTML(g.description)}</p>
      <small style="font-family:var(--font-code); color:var(--neon-yellow);">Deadline: ${escapeHTML(g.deadline)}</small>
    </div>
  `).join('');
}

function toggleGoal(id) {
  const goal = appState.goals.find(g => g.id === id);
  if (goal) {
    goal.completed = !goal.completed;
    if (goal.completed) playSuccessSound();
    saveData();
    showToast(goal.completed ? 'Goal achieved!' : 'Goal status updated.');
  }
}

function deleteGoal(id) {
  if (confirm('Delete goal?')) {
    appState.goals = appState.goals.filter(g => g.id !== id);
    saveData();
    showToast('Goal removed.');
  }
}

// --- 10. QUICK NOTES ENGINE ---
function renderNotes() {
  const container = document.getElementById('notes-grid');
  if (!container) return;

  const query = (document.getElementById('notes-search')?.value || '').toLowerCase();
  const notes = appState.notes.filter(n => 
    n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
  );

  notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (notes.length === 0) {
    container.innerHTML = '<div class="glass-panel text-muted">No notes recorded.</div>';
    return;
  }

  container.innerHTML = notes.map(n => `
    <div class="cyber-card" style="${n.pinned ? 'border-color:var(--neon-yellow);' : ''}">
      <div class="cyber-card-header">
        <h3 style="font-size:1.1rem; color:var(--neon-blue);">${escapeHTML(n.title)}</h3>
        <div class="card-actions">
          <button class="icon-action" onclick="togglePinNote('${n.id}')">${n.pinned ? '📌' : '📍'}</button>
          <button class="icon-action" onclick="openNoteModal('${n.id}')">✏️</button>
          <button class="icon-action" onclick="deleteNote('${n.id}')">🗑️</button>
        </div>
      </div>
      <p style="font-size:0.9rem; white-space:pre-wrap; color:var(--text-main); margin-bottom:12px;">${escapeHTML(n.content)}</p>
      <small style="font-family:var(--font-code); color:var(--text-muted); font-size:0.75rem;">${escapeHTML(n.timestamp)}</small>
    </div>
  `).join('');
}

function togglePinNote(id) {
  const note = appState.notes.find(n => n.id === id);
  if (note) {
    note.pinned = !note.pinned;
    saveData();
  }
}

function deleteNote(id) {
  if (confirm('Delete quick note?')) {
    appState.notes = appState.notes.filter(n => n.id !== id);
    saveData();
    showToast('Note deleted.');
  }
}

// --- 11. FOCUS MODE ENGINE ---
let timerInterval = null;
let selectedTimerMinutes = 25;
let timerSeconds = 25 * 60;
let isTimerRunning = false;
let completedSessionsCount = 0;

function initTimer() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  const display = document.getElementById('timer-display');
  const btnStart = document.getElementById('btn-timer-start');
  const btnPause = document.getElementById('btn-timer-pause');
  const btnReset = document.getElementById('btn-timer-reset');

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTimerRunning) return;
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimerMinutes = parseInt(btn.getAttribute('data-time'), 10);
      timerSeconds = selectedTimerMinutes * 60;
      updateTimerDisplay();
    });
  });

  btnStart?.addEventListener('click', () => {
    getAudioContext();
    if (!isTimerRunning) {
      isTimerRunning = true;
      btnStart.classList.add('hidden');
      btnPause.classList.remove('hidden');
      playClickSound();

      timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
          timerSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          btnStart.classList.remove('hidden');
          btnPause.classList.add('hidden');

          // Add exact session time (25, 45, or 60)
          appState.studyMinutes += selectedTimerMinutes;
          completedSessionsCount++;

          document.getElementById('focus-session-count').textContent = completedSessionsCount;
          document.getElementById('focus-total-time').textContent = `${Math.floor(appState.studyMinutes / 60)}h ${appState.studyMinutes % 60}m`;

          playSuccessSound();
          saveData();
          triggerNotification("FOCUS SESSION FINISHED", `Added +${selectedTimerMinutes} mins to study statistics!`);
        }
      }, 1000);
    }
  });

  btnPause?.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      btnStart.classList.remove('hidden');
      btnPause.classList.add('hidden');
      playClickSound();
    }
  });

  btnReset?.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    btnStart.classList.remove('hidden');
    btnPause.classList.add('hidden');
    timerSeconds = selectedTimerMinutes * 60;
    updateTimerDisplay();
    playClickSound();
  });

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  const circle = document.getElementById('timer-progress');
  if (!display || !circle) return;

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalSecs = selectedTimerMinutes * 60;
  const pct = timerSeconds / totalSecs;
  const dashoffset = 283 * (1 - pct);
  circle.style.strokeDashoffset = dashoffset;
}

// --- 12 & 13. DATA CENTER & SETTINGS ---
function initSettingsAndDataCenter() {
  const soundToggle = document.getElementById('setting-sound');
  const animToggle = document.getElementById('setting-animations');
  const compactToggle = document.getElementById('setting-compact');
  const quickSoundBtn = document.getElementById('btn-quick-sound');

  soundToggle?.addEventListener('change', (e) => {
    appState.settings.sound = e.target.checked;
    if (quickSoundBtn) quickSoundBtn.textContent = appState.settings.sound ? 'ON' : 'OFF';
    saveData();
  });

  quickSoundBtn?.addEventListener('click', () => {
    appState.settings.sound = !appState.settings.sound;
    if (soundToggle) soundToggle.checked = appState.settings.sound;
    quickSoundBtn.textContent = appState.settings.sound ? 'ON' : 'OFF';
    saveData();
  });

  animToggle?.addEventListener('change', (e) => {
    appState.settings.animations = e.target.checked;
    saveData();
  });

  compactToggle?.addEventListener('change', (e) => {
    appState.settings.compact = e.target.checked;
    document.body.classList.toggle('compact-mode', appState.settings.compact);
    saveData();
  });

  document.getElementById('btn-request-notif')?.addEventListener('click', () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        showToast(`Notification permission: ${permission}`);
      });
    } else {
      showToast('Notifications API not supported in browser.');
    }
  });

  // Export Data JSON
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `rohits_web_backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    playSuccessSound();
    showToast("System state JSON exported!");
  });

  // Import Data JSON
  document.getElementById('import-json-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.subjects && imported.assignments) {
          appState = imported;
          saveData();
          applySettingsUI();
          playSuccessSound();
          showToast("Data imported successfully!");
        } else {
          throw new Error("Invalid structure");
        }
      } catch (err) {
        playErrorSound();
        showToast("Error reading JSON file.");
      }
    };
    reader.readAsText(file);
  });

  // Clear All Data
  document.getElementById('btn-clear-data')?.addEventListener('click', () => {
    if (confirm("WARNING: Clear all LocalStorage data? This action cannot be undone.")) {
      if (confirm("Are you 100% sure? All notes, assignments, and subjects will be wiped.")) {
        localStorage.removeItem(STORAGE_KEY);
        appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData();
        applySettingsUI();
        playSuccessSound();
        showToast("Database restored to default baseline state.");
      }
    }
  });
}

function applySettingsUI() {
  if (!appState) return;
  const soundToggle = document.getElementById('setting-sound');
  const animToggle = document.getElementById('setting-animations');
  const compactToggle = document.getElementById('setting-compact');
  const quickSoundBtn = document.getElementById('btn-quick-sound');

  if (soundToggle) soundToggle.checked = appState.settings.sound;
  if (animToggle) animToggle.checked = appState.settings.animations;
  if (compactToggle) compactToggle.checked = appState.settings.compact;
  if (quickSoundBtn) quickSoundBtn.textContent = appState.settings.sound ? 'ON' : 'OFF';

  document.body.classList.toggle('compact-mode', !!appState.settings.compact);
}

function renderDataCenter() {
  const jsonStr = JSON.stringify(appState);
  const bytes = new Blob([jsonStr]).size;
  const kb = (bytes / 1024).toFixed(2);

  const usedText = document.getElementById('storage-used-text');
  const progressBar = document.getElementById('storage-progress');

  if (usedText) usedText.textContent = `${kb} KB / 5000 KB`;
  if (progressBar) {
    const pct = Math.min(100, (kb / 5000) * 100);
    progressBar.style.width = `${pct}%`;
  }
}

// --- DYNAMIC MODAL GENERATOR ENGINE ---
function openModalEngine({ title, fields, onSubmit }) {
  const modal = document.getElementById('global-modal');
  const titleEl = document.getElementById('modal-title');
  const fieldsEl = document.getElementById('modal-fields');
  const form = document.getElementById('modal-form');

  titleEl.textContent = title;
  fieldsEl.innerHTML = fields.map(f => {
    if (f.type === 'select') {
      return `
        <div class="modal-field">
          <label>${f.label}</label>
          <select name="${f.name}" class="cyber-select" ${f.required ? 'required' : ''}>
            ${f.options.map(opt => `<option value="${opt}" ${f.value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (f.type === 'textarea') {
      return `
        <div class="modal-field">
          <label>${f.label}</label>
          <textarea name="${f.name}" class="cyber-textarea" ${f.required ? 'required' : ''}>${escapeHTML(f.value || '')}</textarea>
        </div>
      `;
    } else {
      return `
        <div class="modal-field">
          <label>${f.label}</label>
          <input type="${f.type || 'text'}" name="${f.name}" class="cyber-input" value="${escapeHTML(f.value || '')}" ${f.required ? 'required' : ''}>
        </div>
      `;
    }
  }).join('');

  modal.classList.remove('hidden');

  const close = () => {
    modal.classList.add('hidden');
    form.onsubmit = null;
  };

  document.getElementById('btn-modal-close').onclick = close;
  document.getElementById('btn-modal-cancel').onclick = close;

  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((val, key) => data[key] = val);
    onSubmit(data);
    close();
  };
}

// Subject Modal
function openSubjectModal(id = null) {
  const existing = id ? appState.subjects.find(s => s.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT SUBJECT' : 'ADD SUBJECT',
    fields: [
      { name: 'code', label: 'Subject Code', value: existing?.code, required: true },
      { name: 'name', label: 'Subject Name', value: existing?.name, required: true },
      { name: 'teacher', label: 'Teacher Name', value: existing?.teacher, required: true },
      { name: 'targetHours', label: 'Target Hours', type: 'number', value: existing?.targetHours || 30, required: true }
    ],
    onSubmit: (res) => {
      if (existing) {
        existing.code = res.code;
        existing.name = res.name;
        existing.teacher = res.teacher;
        existing.targetHours = parseInt(res.targetHours, 10);
      } else {
        appState.subjects.push({
          id: 'subj_' + Date.now(),
          code: res.code,
          name: res.name,
          teacher: res.teacher,
          targetHours: parseInt(res.targetHours, 10),
          completedHours: 0
        });
      }
      playSuccessSound();
      saveData();
      showToast('Subject saved.');
    }
  });
}

// Assignment Modal
function openAssignmentModal(id = null) {
  const existing = id ? appState.assignments.find(a => a.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT ASSIGNMENT' : 'NEW ASSIGNMENT',
    fields: [
      { name: 'title', label: 'Assignment Title', value: existing?.title, required: true },
      { name: 'subject', label: 'Subject Code / Name', value: existing?.subject, required: true },
      { name: 'dueDate', label: 'Due Date', type: 'date', value: existing?.dueDate || new Date().toISOString().split('T')[0], required: true },
      { name: 'priority', label: 'Priority', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'], value: existing?.priority || 'MEDIUM' },
      { name: 'description', label: 'Description', type: 'textarea', value: existing?.description }
    ],
    onSubmit: (res) => {
      if (existing) {
        existing.title = res.title;
        existing.subject = res.subject;
        existing.dueDate = res.dueDate;
        existing.priority = res.priority;
        existing.description = res.description;
      } else {
        appState.assignments.push({
          id: 'asgn_' + Date.now(),
          title: res.title,
          subject: res.subject,
          dueDate: res.dueDate,
          priority: res.priority,
          description: res.description,
          completed: false
        });
      }
      playSuccessSound();
      saveData();
      showToast('Assignment record updated.');
    }
  });
}

// Practical Modal
function openPracticalModal(id = null) {
  const existing = id ? appState.practicals.find(p => p.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT PRACTICAL' : 'NEW PRACTICAL',
    fields: [
      { name: 'number', label: 'Practical Number (e.g. PR-01)', value: existing?.number, required: true },
      { name: 'subject', label: 'Subject', value: existing?.subject, required: true },
      { name: 'title', label: 'Practical Title', value: existing?.title, required: true },
      { name: 'date', label: 'Scheduled Date', type: 'date', value: existing?.date || new Date().toISOString().split('T')[0] },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'], value: existing?.status || 'Pending' }
    ],
    onSubmit: (res) => {
      if (existing) {
        existing.number = res.number;
        existing.subject = res.subject;
        existing.title = res.title;
        existing.date = res.date;
        existing.status = res.status;
      } else {
        appState.practicals.push({
          id: 'prac_' + Date.now(),
          number: res.number,
          subject: res.subject,
          title: res.title,
          date: res.date,
          status: res.status
        });
      }
      playSuccessSound();
      saveData();
      showToast('Practical record saved.');
    }
  });
}

// Timetable Modal
function openTimetableModal(id = null) {
  const existing = id ? appState.timetable.find(t => t.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT SCHEDULE ENTRY' : 'ADD CLASS SCHEDULE',
    fields: [
      { name: 'day', label: 'Day of Week', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], value: existing?.day || 'Monday' },
      { name: 'subject', label: 'Subject Name / Code', value: existing?.subject, required: true },
      { name: 'room', label: 'Room / Venue', value: existing?.room, required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', value: existing?.startTime || '09:00', required: true },
      { name: 'endTime', label: 'End Time', type: 'time', value: existing?.endTime || '10:00', required: true }
    ],
    onSubmit: (res) => {
      if (existing) {
        existing.day = res.day;
        existing.subject = res.subject;
        existing.room = res.room;
        existing.startTime = res.startTime;
        existing.endTime = res.endTime;
      } else {
        appState.timetable.push({
          id: 'tt_' + Date.now(),
          day: res.day,
          subject: res.subject,
          room: res.room,
          startTime: res.startTime,
          endTime: res.endTime
        });
      }
      playSuccessSound();
      saveData();
      showToast('Timetable entry saved.');
    }
  });
}

// Campus Hub Modal
function openCampusModal() {
  openModalEngine({
    title: 'NEW CAMPUS POST',
    fields: [
      { name: 'title', label: 'Post Title', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['NOTICES', 'EVENTS', 'RESOURCES'] },
      { name: 'date', label: 'Date', type: 'date', value: new Date().toISOString().split('T')[0] },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ],
    onSubmit: (res) => {
      appState.campus.unshift({
        id: 'camp_' + Date.now(),
        title: res.title,
        category: res.category,
        date: res.date,
        description: res.description
      });
      playSuccessSound();
      saveData();
      showToast('Campus post published.');
    }
  });
}

// Goal Modal
function openGoalModal(id = null) {
  const existing = id ? appState.goals.find(g => g.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT GOAL' : 'ADD NEW GOAL',
    fields: [
      { name: 'title', label: 'Goal Title', value: existing?.title, required: true },
      { name: 'category', label: 'Category', value: existing?.category || 'Academics', required: true },
      { name: 'deadline', label: 'Target Deadline', type: 'date', value: existing?.deadline || new Date().toISOString().split('T')[0] },
      { name: 'description', label: 'Description', type: 'textarea', value: existing?.description }
    ],
    onSubmit: (res) => {
      if (existing) {
        existing.title = res.title;
        existing.category = res.category;
        existing.deadline = res.deadline;
        existing.description = res.description;
      } else {
        appState.goals.push({
          id: 'goal_' + Date.now(),
          title: res.title,
          category: res.category,
          deadline: res.deadline,
          description: res.description,
          completed: false
        });
      }
      playSuccessSound();
      saveData();
      showToast('Goal saved.');
    }
  });
}

// Quick Note Modal
function openNoteModal(id = null) {
  const existing = id ? appState.notes.find(n => n.id === id) : null;
  openModalEngine({
    title: existing ? 'EDIT QUICK NOTE' : 'NEW QUICK NOTE',
    fields: [
      { name: 'title', label: 'Note Title', value: existing?.title, required: true },
      { name: 'content', label: 'Note Content', type: 'textarea', value: existing?.content, required: true }
    ],
    onSubmit: (res) => {
      const nowStr = new Date().toLocaleString();
      if (existing) {
        existing.title = res.title;
        existing.content = res.content;
        existing.timestamp = nowStr;
      } else {
        appState.notes.unshift({
          id: 'note_' + Date.now(),
          title: res.title,
          content: res.content,
          pinned: false,
          timestamp: nowStr
        });
      }
      playSuccessSound();
      saveData();
      showToast('Quick note stored.');
    }
  });
}

// --- NOTIFICATIONS & TOASTS ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function triggerNotification(title, body) {
  showToast(`${title}: ${body}`);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
