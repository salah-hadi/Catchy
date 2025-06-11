chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureScreenshot') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.captureVisibleTab(
          tabs[0].windowId,
          { format: 'png', quality: 100 },
          (dataUrl) => {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError.message });
              return;
            }
            
            // Get page info for auto-generating steps
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageInfo' }, (pageInfo) => {
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              const filename = `bug-screenshot-${timestamp}.png`;
              
              // Convert data URL to blob for download
              const response = {
                dataUrl: dataUrl,
                filename: filename,
                pageInfo: pageInfo || {}
              };
              
              // Trigger download
              chrome.downloads.download({
                url: dataUrl,
                filename: filename,
                saveAs: false
              });
              
              sendResponse(response);
            });
          }
        );
      }
    });
    return true; // Keep the message channel open for async response
  }
});