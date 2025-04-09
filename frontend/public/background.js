console.log("Background script running...");

// Listen for installation or update events.
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed or updated.");
});

// Optionally, listen for messages from content scripts.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  // You can process messages here or even forward them to your backend if necessary.
  sendResponse({ status: "received" });
});
