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
  
    // Tokenize the text and calculate term frequency
    const words = text.split(/\s+/);
    const frequencyMap: { [word: string]: number } = {};
    words.forEach((word) => {
      word = word.toLowerCase();
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });
  
    // Rank sentences based on the sum of term frequencies
    const rankedSentences = sentences.map((sentence) => {
      const sentenceWords = sentence.split(/\s+/);
      let rank = 0;
      sentenceWords.forEach((word) => {
        rank += frequencyMap[word.toLowerCase()] || 0;
      });
      return { sentence, rank };
    });
  
    // Sort the sentences by rank and take the top N
    rankedSentences.sort((a, b) => b.rank - a.rank);
    const summary = rankedSentences.slice(0, 3).map((item) => item.sentence).join(' ');
  
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

    console.log(`Content Script Summarized: ${summary}`)
  
    chrome.runtime.sendMessage({ action: 'summarizedContent', content: summary });
  }
  
  extractAndProcessContent();
  