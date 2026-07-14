/** VMP App Init */
function applyRole(role) {
  VMP.currentRole = role;
  const nav = NAV_CONFIG[role];
  VMP.currentUser = VMP.getUser(nav?.userId) || { full_name: nav?.label, email: 'demo@company.com' };

  const switcher = document.getElementById('role-switcher');
  if (switcher) switcher.value = role;

  sessionStorage.setItem('vmp_role', role);

  // Rebuild sidebar for this actor's menu
  Router.renderSidebar();

  // Navigate to role dashboard (updates main content + topbar)
  const dashboard = nav?.dashboard || 'dashboard/main';
  if (location.hash.slice(1).split('?')[0] !== dashboard) {
    location.hash = dashboard;
  } else {
    Router.navigate();
  }
}

const AUTH_KEY = 'vmp_authed';
const EMAIL_KEY = 'vmp_user_email';
let routerInited = false;

const NotifUI = {
  open: false,

  refresh() {
    VMP.updateNotifBadge();
    if (this.open) this.renderList();
  },

  renderList() {
    const list = document.getElementById('notif-panel-list');
    if (!list) return;
    const items = VMP_DATA.notifications || [];
    if (!items.length) {
      list.innerHTML = '<div class="notif-empty">No notifications yet. Actions you take will appear here.</div>';
      return;
    }
    list.innerHTML = items.map(n => {
      const meta = [n.entity_type && n.entity_id ? `${n.entity_type} ${n.entity_id}` : null, n.sent_at]
        .filter(Boolean).join(' · ');
      return `<button type="button" class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
        <div class="notif-item-title">${n.event}</div>
        <div class="notif-item-meta"><span>${meta}</span>${n.nav ? '<span>Open →</span>' : ''}</div>
      </button>`;
    }).join('');

    list.querySelectorAll('[data-notif-id]').forEach(btn => {
      btn.addEventListener('click', () => this.openItem(btn.dataset.notifId));
    });
  },

  openItem(id) {
    const n = VMP_DATA.notifications.find(x => x.id === id);
    if (!n) return;
    n.read = true;
    this.close();
    VMP.updateNotifBadge();
    if (n.nav) {
      const target = n.nav.replace(/^#/, '');
      if (location.hash.slice(1) === target) Router.navigate();
      else location.hash = target;
    }
  },

  toggle() {
    if (this.open) this.close();
    else this.show();
  },

  show() {
    const panel = document.getElementById('notif-panel');
    const bell = document.getElementById('notif-bell');
    if (!panel) return;
    this.open = true;
    panel.hidden = false;
    if (bell) bell.setAttribute('aria-expanded', 'true');
    this.renderList();
  },

  close() {
    const panel = document.getElementById('notif-panel');
    const bell = document.getElementById('notif-bell');
    if (!panel) return;
    this.open = false;
    panel.hidden = true;
    if (bell) bell.setAttribute('aria-expanded', 'false');
  },

  markAllRead() {
    (VMP_DATA.notifications || []).forEach(n => { n.read = true; });
    this.refresh();
  },

  bind() {
    const bell = document.getElementById('notif-bell');
    const markAll = document.getElementById('notif-mark-all');
    const wrap = document.getElementById('notif-wrap');
    if (bell && !bell.dataset.bound) {
      bell.dataset.bound = '1';
      bell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
    if (markAll && !markAll.dataset.bound) {
      markAll.dataset.bound = '1';
      markAll.addEventListener('click', (e) => {
        e.stopPropagation();
        this.markAllRead();
      });
    }
    if (!document.body.dataset.notifOutsideBound) {
      document.body.dataset.notifOutsideBound = '1';
      document.addEventListener('click', (e) => {
        if (!this.open) return;
        if (wrap && wrap.contains(e.target)) return;
        this.close();
      });
    }
    VMP.updateNotifBadge();
  }
};

function showApp() {
  const login = document.getElementById('login-screen');
  const shell = document.getElementById('app-shell');
  if (login) login.style.display = 'none';
  if (shell) shell.style.display = 'flex';
}

function showLogin() {
  const login = document.getElementById('login-screen');
  const shell = document.getElementById('app-shell');
  if (shell) shell.style.display = 'none';
  if (login) login.style.display = 'flex';
}

function bootApp() {
  let role = sessionStorage.getItem('vmp_role') || 'taq';
  if (!NAV_CONFIG[role]) {
    role = 'taq';
    sessionStorage.setItem('vmp_role', role);
  }
  VMP.currentRole = role;

  if (!routerInited) {
    Router.init();
    routerInited = true;
  }

  NotifUI.bind();
  applyRole(role);

  const emailEl = document.getElementById('current-user-email');
  const email = sessionStorage.getItem(EMAIL_KEY);
  if (emailEl) emailEl.textContent = email || '';
}

document.addEventListener('DOMContentLoaded', () => {
  const authed = sessionStorage.getItem(AUTH_KEY) === '1';
  if (authed) {
    showApp();
    bootApp();
  } else {
    showLogin();
  }

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email')?.value || '').trim();
    const pw = document.getElementById('login-password')?.value || '';
    const err = document.getElementById('login-error');
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!emailValid) {
      if (err) err.textContent = 'Enter a valid company email address.';
      return;
    }
    if (!pw) {
      if (err) err.textContent = 'Enter your password.';
      return;
    }
    if (err) err.textContent = '';
    sessionStorage.setItem(AUTH_KEY, '1');
    sessionStorage.setItem(EMAIL_KEY, email);
    showApp();
    bootApp();
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    const pwField = document.getElementById('login-password');
    if (pwField) pwField.value = '';
    showLogin();
  });

  document.getElementById('role-switcher')?.addEventListener('change', (e) => {
    applyRole(e.target.value);
  });
});
