// /components/sidebar.js

window.renderSidebar = function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  // Navigation
  const navLinks = document.createElement('nav');
  navLinks.className = 'nav-links';

  function createNavItem(label, pageName) {
      const existingItem = document.getElementById(`${pageName}-nav-item`);
      if (existingItem) {
          console.warn(`Duplicate nav item id: ${pageName}-nav-item`);
          return;
      }

      const item = document.createElement('div');
      item.className = 'nav-item';
      item.textContent = label;
      item.onclick = () => {
          if (typeof window.showPage === 'function') {
              window.showPage(pageName);
          } else {
              console.warn(`showPage function is not defined. Attempted to show: ${pageName}`);
          }
      };
      item.id = `${pageName}-nav-item`; // Add an id to each item for easy access later
      return item;
  }

  // Updated order and grouping
  navLinks.appendChild(createNavItem('Operations', 'operations'));
  navLinks.appendChild(createNavItem('Inventory', 'inventory'));
  navLinks.appendChild(createNavItem('Marketplace', 'marketplace'));
  navLinks.appendChild(createNavItem('Employees', 'employees'));
  navLinks.appendChild(createNavItem('Finances', 'finances'));
  navLinks.appendChild(createNavItem('Customers', 'customers'));
  navLinks.appendChild(createNavItem('Orders', 'orders'));
  navLinks.appendChild(createNavItem('Equipment', 'equipment'));
  navLinks.appendChild(createNavItem('Research', 'research'));
  navLinks.appendChild(createNavItem('Marketing', 'marketing'));
  navLinks.appendChild(createNavItem('Statistics', 'statistics'));
  navLinks.appendChild(createNavItem('Dashboard', 'dashboard'));

  sidebar.appendChild(navLinks);

  return sidebar;
};

// New function to update the active nav item
window.updateActiveNavItem = function(pageName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
      item.classList.remove('active');
  });

  const activeNavItem = document.getElementById(`${pageName}-nav-item`);
  if (activeNavItem) {
      activeNavItem.classList.add('active');
  } else {
      console.warn(`No navigation item found for page: ${pageName}`);
  }
};
