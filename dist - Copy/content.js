chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageInfo') {
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      }
    };
    
    // Generate basic steps based on page context
    const steps = generateStepsToReproduce(pageInfo);
    
    sendResponse({
      ...pageInfo,
      generatedSteps: steps
    });
  }
});

function generateStepsToReproduce(pageInfo) {
  const steps = [
    `1. Navigate to: ${pageInfo.url}`,
    `2. Page title: "${pageInfo.title}"`,
    `3. Viewport size: ${pageInfo.viewport.width}x${pageInfo.viewport.height}`,
  ];
  
  if (pageInfo.scrollPosition.y > 0) {
    steps.push(`4. Scroll down to position: ${pageInfo.scrollPosition.y}px`);
  }
  
  steps.push(`5. Bug observed at timestamp: ${new Date(pageInfo.timestamp).toLocaleString()}`);
  
  return steps.join('\n');
}