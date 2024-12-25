window.renderSidebar = function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const logoSection = document.createElement('div');
  logoSection.className = 'logo-section';

  const logoText = document.createElement('span');
  logoText.className = 'logo-text';
  logoText.textContent = 'PharmaSim';
  logoSection.appendChild(logoText);

  sidebar.appendChild(logoSection);

  // Navigation
  const navLinks = document.createElement('nav');
  navLinks.className = 'nav-links';

  function createNavItem(label, pageName, isActive=false) {
    const item = document.createElement('div');
    item.className = 'nav-item' + (isActive ? ' active' : '');
    item.textContent = label;
    item.onclick = () => window.showPage(pageName);
    return item;
  }

  navLinks.appendChild(createNavItem('Dashboard', 'dashboard'));
  navLinks.appendChild(createNavItem('Orders', 'orders'));
  navLinks.appendChild(createNavItem('Inventory', 'inventory'));
  navLinks.appendChild(createNavItem('Finances', 'finances'));
  navLinks.appendChild(createNavItem('Employees', 'employees'));
  navLinks.appendChild(createNavItem('Marketplace', 'marketplace'));
  navLinks.appendChild(createNavItem('Customers', 'customers'));
  navLinks.appendChild(createNavItem('Marketing', 'marketing'));
  navLinks.appendChild(createNavItem('Research', 'research'));
  navLinks.appendChild(createNavItem('Statistics', 'statistics'));
  navLinks.appendChild(createNavItem('Operations', 'operations', true));
  navLinks.appendChild(createNavItem('Equipment', 'equipment', true));

  sidebar.appendChild(navLinks);

  return sidebar;
};
