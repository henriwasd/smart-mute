// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

// Check if a URL matches any pattern in the whitelist
async function isWhitelisted(url) {
  const data = await chrome.storage.local.get({ whitelist: [] });
  const whitelist = data.whitelist;
  return whitelist.some(pattern => url.includes(pattern));
}

// Main logic to mute other tabs of the same domain
async function handleActiveAudioTab(activeTab) {
  const data = await chrome.storage.local.get({ extensionEnabled: true, allowDifferentSites: true });
  if (!data.extensionEnabled) return;

  if (!activeTab.url) return;
  const activeDomain = getDomain(activeTab.url);
  if (!activeDomain) return;

  const tabs = await chrome.tabs.query({});
  
  for (const t of tabs) {
    if (t.id === activeTab.id) continue;
    
    const tDomain = getDomain(t.url);
    
    let shouldMute = false;
    if (!data.allowDifferentSites) {
      // Se não permite sites diferentes tocando, muta todos os outros
      shouldMute = true;
    } else {
      // Se permite sites diferentes tocando, muta apenas do mesmo site
      if (tDomain === activeDomain) {
        shouldMute = true;
      }
    }

    if (shouldMute) {
      const whitelisted = await isWhitelisted(t.url);
      if (!whitelisted) {
        // Mute the other tab
        if (!t.mutedInfo || !t.mutedInfo.muted) {
          chrome.tabs.update(t.id, { muted: true });
        }
      }
    }
  }
}

// Listen for tab updates (e.g., when a tab starts playing audio)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.audible === true) {
    // A tab started playing sound. We should ensure it's unmuted, 
    // and then mute other tabs from the same domain.
    if (tab.mutedInfo && tab.mutedInfo.muted) {
      await chrome.tabs.update(tabId, { muted: false });
    }
    await handleActiveAudioTab(tab);
  }
});

// Listen for tab activation (when user switches to a different tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    // If the tab we switched to is playing sound (even if currently muted)
    if (tab.audible) {
      // Unmute it if it was muted
      if (tab.mutedInfo && tab.mutedInfo.muted) {
        await chrome.tabs.update(tab.id, { muted: false });
      }
      // Apply the mute rule for other tabs of the same domain
      await handleActiveAudioTab(tab);
    }
  } catch (e) {
    console.error("Error handling tab activation:", e);
  }
});
