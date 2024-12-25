window.renderResearchPage = function(mainContent) {
    mainContent.innerHTML = '';
  
    const header = document.createElement('h2');
    header.textContent = 'Research';
  
    const text = document.createElement('p');
    text.textContent = 'Invest in R&D for new products or improved equipment, etc.';
  
    mainContent.appendChild(header);
    mainContent.appendChild(text);
  };
  