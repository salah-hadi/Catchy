let interactionLog = [];
let lastInteractionTime = 0;

// Track user interactions
function trackInteraction(type, details) {
  const now = Date.now();
  if (now - lastInteractionTime > 1000) { // Only log if 1 second has passed since last interaction
    interactionLog.push({
      type,
      details,
      timestamp: now
    });
    lastInteractionTime = now;
  }
}

// Track clicks on any clickable elements
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement) {
    // If clicked on a div, try to find a more specific child element
    if (target.tagName.toLowerCase() === 'div') {
      const priorityElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'span', 'input', 'button', 'textarea'];
      const childElements = target.querySelectorAll('*');
      
      if (childElements.length > 0) {
        // Find the most relevant child element based on priority
        for (const element of childElements) {
          const tagName = element.tagName.toLowerCase();
          if (priorityElements.includes(tagName)) {
            target = element;
            break;
          }
        }
      }
    }

    // Get the most relevant text content
    const text = getTextContent(target);
    
    // Get all attributes
    const attributes = {};
    const attrNames = ['id', 'class', 'name', 'type', 'value', 'placeholder', 'title', 'alt', 'src', 'href'];
    
    // Get specific attributes we want to track
    attrNames.forEach(attr => {
      attributes[attr] = target.getAttribute(attr) || '';
    });
    
    // Get all other attributes
    Array.from(target.attributes).forEach(attr => {
      if (!attrNames.includes(attr.name)) {
        attributes[attr.name] = attr.value;
      }
    });

    // Track the interaction
    trackInteraction('click', {
      element: target.tagName.toLowerCase(),
      text,
      id: attributes.id,
      className: attributes.class,
      xpath: getXPath(target),
      attributes
    });
  }
});

// Get the most relevant text content from an element
function getTextContent(element) {
  // Try to get text from common label elements
  const labelElements = ['label', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
  let text = '';
  
  // Check if there's an icon (i or svg) with a title or aria-label
  const icon = element.querySelector('i, svg');
  if (icon) {
    const iconText = icon.getAttribute('title') || icon.getAttribute('aria-label');
    if (iconText) {
      text += iconText + ' ';
    }
  }
  
  // Check for text in label elements
  const label = Array.from(element.querySelectorAll(labelElements.join(','))).reduce((best, child) => {
    const childText = child.textContent?.trim() || '';
    if (childText.length > (best.textContent?.trim()?.length || 0)) {
      return child;
    }
    return best;
  }, null);
  
  if (label) {
    text += label.textContent?.trim() || '';
  } else {
    // Fallback to direct text content
    text += element.textContent?.trim() || '';
  }
  
  // Remove any extra whitespace
  return text.replace(/\s+/g, ' ').trim() || 'unknown';
}

// Track form inputs
document.addEventListener('input', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    trackInteraction('input', {
      element: target.tagName.toLowerCase(),
      value: target.value,
      id: target.id || target.getAttribute('name') || '',
      className: target.className || ''
    });
  }
});

// Get XPath for an element
function getXPath(element) {
  if (!element) return '';
  if (element.id) return `//*[@id="${element.id}"]`;
  
  let xpath = '';
  let current = element;
  while (current && current.nodeType === 1) {
    const position = Array.from(current.parentNode?.children || []).indexOf(current) + 1;
    xpath = `/${current.tagName.toLowerCase()}[${position}]${xpath}`;
    current = current.parentNode;
  }
  return xpath;
}

// Generate detailed steps based on user interactions
function generateStepsToReproduce(pageInfo) {
  const steps = [
    `1. Navigate to: ${pageInfo.url}`,
    `2. Page title: "${pageInfo.title}"`,
    `3. Viewport size: ${pageInfo.viewport.width}x${pageInfo.viewport.height}`
  ];

  if (pageInfo.scrollPosition.y > 0) {
    steps.push(`4. Scroll down to position: ${pageInfo.scrollPosition.y}px`);
  }

  // Add user interactions
  if (interactionLog.length > 0) {
    steps.push(`5. User interactions:`);
    interactionLog.forEach((interaction, index) => {
      if (interaction.type === 'click') {
        steps.push(`  ${index + 6}. Clicked ${interaction.element}:
                    - Text: "${interaction.text}"
                    - ID: "${interaction.id}"
                    - XPath: ${interaction.xpath}`);
      } else if (interaction.type === 'input') {
        steps.push(`  ${index + 6}. Entered text in ${interaction.element}:
                    - ID: "${interaction.id}"
                    - Value: "${interaction.value}"`);
      }
    });
  }

  steps.push(`6. Bug observed at timestamp: ${new Date(pageInfo.timestamp).toLocaleString()}`);
  
  return steps.join('\n');
}

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
    
    // Reset interaction log before generating steps
    const steps = generateStepsToReproduce(pageInfo);
    interactionLog = [];
    
    sendResponse({
      ...pageInfo,
      generatedSteps: steps
    });
  }
});