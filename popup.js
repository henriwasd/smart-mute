document.addEventListener('DOMContentLoaded', async () => {
  // --- i18n Internationalization ---
  document.getElementById('allowDifferentSitesLabel').textContent = chrome.i18n.getMessage("allowDifferentSitesLabel");
  document.getElementById('exceptionsTitle').textContent = chrome.i18n.getMessage("exceptionsTitle");
  document.getElementById('exceptionsDesc').innerHTML = chrome.i18n.getMessage("exceptionsDesc");
  document.getElementById('whitelistInput').placeholder = chrome.i18n.getMessage("placeholderInput");
  document.getElementById('addButton').textContent = chrome.i18n.getMessage("addButton");
  document.getElementById('supportButton').textContent = chrome.i18n.getMessage("supportButton");
  // ---------------------------------

  const input = document.getElementById('whitelistInput');
  const addButton = document.getElementById('addButton');
  const ul = document.getElementById('whitelistUl');
  const toggleExtension = document.getElementById('toggleExtension');
  const statusText = document.getElementById('statusText');
  const allowDifferentSitesToggle = document.getElementById('allowDifferentSitesToggle');

  // Load the settings from storage
  let data = await chrome.storage.local.get({ whitelist: [], extensionEnabled: true, allowDifferentSites: true });
  let whitelist = data.whitelist;
  let extensionEnabled = data.extensionEnabled;
  let allowDifferentSites = data.allowDifferentSites;
  
  function updateStatusText(enabled) {
    statusText.textContent = enabled ? chrome.i18n.getMessage("statusActive") : chrome.i18n.getMessage("statusInactive");
    statusText.style.color = enabled ? "#00f3ff" : "#ff003c";
    statusText.style.textShadow = enabled ? "0 0 5px rgba(0, 243, 255, 0.5)" : "0 0 5px rgba(255, 0, 60, 0.5)";
  }

  toggleExtension.checked = extensionEnabled;
  updateStatusText(extensionEnabled);
  
  allowDifferentSitesToggle.checked = allowDifferentSites;

  toggleExtension.addEventListener('change', async () => {
    extensionEnabled = toggleExtension.checked;
    updateStatusText(extensionEnabled);
    await chrome.storage.local.set({ extensionEnabled });
  });

  allowDifferentSitesToggle.addEventListener('change', async () => {
    allowDifferentSites = allowDifferentSitesToggle.checked;
    await chrome.storage.local.set({ allowDifferentSites });
  });

  renderList(whitelist);

  // Add new item
  addButton.addEventListener('click', async () => {
    const val = input.value.trim();
    if (val && !whitelist.includes(val)) {
      whitelist.push(val);
      await chrome.storage.local.set({ whitelist });
      renderList(whitelist);
      input.value = '';
    }
  });

  // Render the list of exceptions
  function renderList(list) {
    ul.innerHTML = '';
    if (list.length === 0) {
      ul.innerHTML = `<li style="justify-content:center; color:#999; border: none; background: transparent;">${chrome.i18n.getMessage("noExceptions")}</li>`;
      return;
    }
    
    list.forEach(item => {
      const li = document.createElement('li');
      
      const span = document.createElement('span');
      span.textContent = item;
      
      const btn = document.createElement('button');
      btn.textContent = chrome.i18n.getMessage("removeButton");
      btn.addEventListener('click', async () => {
        whitelist = whitelist.filter(i => i !== item);
        await chrome.storage.local.set({ whitelist });
        renderList(whitelist);
      });
      
      li.appendChild(span);
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }
});
