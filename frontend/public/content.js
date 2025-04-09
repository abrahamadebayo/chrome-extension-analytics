(function () {
    // Extract page metrics.
    const url = window.location.href;
    const linkCount = document.querySelectorAll('a').length;
    const imageCount = document.querySelectorAll('img').length;
  
    // Count words in visible text (using innerText to capture what users see).
    const text = document.body.innerText || "";
    const words = text.trim().split(/\s+/);
    const wordCount = words.filter(word => word.length > 0).length;
  
    // Prepare the metrics object. Note that datetime_visited here is provided by JS,
    // but your API may override/update it to use the current server time.
    const pageMetrics = {
      url,
      link_count: linkCount,
      word_count: wordCount,
      image_count: imageCount,
      datetime_visited: new Date().toISOString()
    };
  
    console.log("Extracted page metrics:", pageMetrics);
  
    // Option 1: Send the metrics directly to the backend endpoint.
    fetch('http://localhost:8000/api/analytics/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pageMetrics)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log("Page analytics recorded:", data))
      .catch(error => console.error("Error sending page metrics:", error));
  
    // Option 2: Alternatively, send the metrics to the background script (if you wish to handle it there).
    // chrome.runtime.sendMessage(pageMetrics, response => {
    //   console.log("Response from background:", response);
    // });
  })();
  