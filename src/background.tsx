// Constants
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;

// Listeners
chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'fetch') {
    handleFetchMessage(request.content).then(sendResponse);
  }
  return true;
});

// Functions
const handleFetchMessage = async (content: any) => {
  const sanitizedContent = sanitizeUrl(content);
  const response = await fetch(sanitizedContent);
  if (response.status !== 200) {
    return { ok: false, content: await response.text() };
  } else {
    try {
      return { ok: true, content: await response.json() };
    } catch (error) {
      return { ok: false, content: 'Error 2000' };
    }
  }
};
