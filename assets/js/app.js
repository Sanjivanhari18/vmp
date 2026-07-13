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

document.addEventListener('DOMContentLoaded', () => {
  let role = sessionStorage.getItem('vmp_role') || 'taq';
  if (!NAV_CONFIG[role]) {
    role = 'taq';
    sessionStorage.setItem('vmp_role', role);
  }
  VMP.currentRole = role;

  Router.init();

  applyRole(role);

  document.getElementById('role-switcher')?.addEventListener('change', (e) => {
    applyRole(e.target.value);
  });
});
