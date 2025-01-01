// /components/sidebar.js

window.renderSidebar = function renderSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    // Navigation
    const navLinks = document.createElement('nav');
    navLinks.className = 'nav-links';

    function createNavItem(label, pageName) {
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.textContent = label;
        item.onclick = () => window.showPage(pageName);
        item.id = `${pageName}-nav-item`; // Add an id to each item for easy access later
        return item;
    }

    // Sidebar Pages (Updated Order)
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

    sidebar.appendChild(navLinks);

    // Add "Logout" Button
    const logoutButton = document.createElement('div');
    logoutButton.className = 'nav-item logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.onclick = () => {
        window.location.href = '/logout'; // Redirect to the logout route
    };

    // Push logout button to the bottom
    logoutButton.style.marginTop = 'auto'; // Ensures the button sticks to the bottom
    sidebar.appendChild(logoutButton);

    return sidebar;
};

// Update active nav item function (unchanged)
window.updateActiveNavItem = function(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeNavItem = document.getElementById(`${pageName}-nav-item`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
};
