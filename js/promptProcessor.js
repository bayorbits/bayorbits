function cleanWord(word) {
  return word.replace(/[^\w'-]/g, "").trim();
}

export function buildTokenUnits(promptText) {
  const words = promptText
    .split(/\s+/)
    .map(cleanWord)
    .filter(Boolean)
    .slice(0, 48);

  if (!words.length) {
    return ["empty", "prompt"];
  }

  return words.map((word, index) => `${word.toLowerCase()}_${index}`);
}
