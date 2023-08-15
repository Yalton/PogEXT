function extractTextFromHTML(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || '';
  }
  
  function preprocessContent(content: string): string {
    return content.replace(/\s+/g, ' ').trim();
  }
  
  function summarizeText(text: string): string {
    // Split the text into sentences
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  
    // Simple summarization by taking the first few sentences
    // You can replace this with more sophisticated logic
    const summary = sentences.slice(0, 3).join(' ');
  
    return summary;
  }
  
  function extractAndProcessContent() {
    // Extract the main content or specific elements based on your requirement
    const bodyHTML = document.body.innerHTML;
  
    // Extract and preprocess the text content
    const bodyText = extractTextFromHTML(bodyHTML);
    const processedContent = preprocessContent(bodyText);
  
    // Summarize the processed content
    const summary = summarizeText(processedContent);
  
    // Example: Sending summary to the background script
    chrome.runtime.sendMessage({ content: summary });
  }
  
  extractAndProcessContent();
  