window.renderSidebar = function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const logoSection = document.createElement('div');
  logoSection.className = 'logo-section';

  const logoText = document.createElement('span');
  logoText.className = 'logo-text';
  logoText.textContent = 'PharmaSim';
  logoSection.appendChild(logoText);

  const navLinks = document.createElement('nav');
  navLinks.className = 'nav-links';

  function createNavItem(text, pageName, isActive = false) {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item' + (isActive ? ' active' : '');
    navItem.textContent = text;
    navItem.onclick = () => window.showPage(pageName);
    return navItem;
  }

  // Existing pages:
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
  navLinks.appendChild(createNavItem('Operations', 'operations'));

  // NEW LINK for Equipment Page:
  navLinks.appendChild(createNavItem('Equipment', 'equipment'));

  sidebar.appendChild(logoSection);
  sidebar.appendChild(navLinks);

  return sidebar;
};
