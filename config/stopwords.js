const STOPWORDS = new Set([
  'a', 'an', 'the', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
  'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'in', 'on', 'at', 'by', 'for', 'with', 'from', 'to', 'of', 'about', 'into',
  'and', 'but', 'or', 'so', 'if', 'when', 'than', 'because', 'while',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'should', 'could', 'can', 'not', 'no', 'yes', 'hi', 'hey', 'ok', 'bye'
]);

module.exports = {
  shouldTrack: (word) => !STOPWORDS.has(word) && /[a-z]/.test(word)
};
