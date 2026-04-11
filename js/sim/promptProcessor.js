function cleanWord(word) {
  return word.replace(/[^\w'-]/g, "").trim();
}

function hashToken(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function buildTokenUnits(promptText) {
  const words = promptText
    .split(/\s+/)
    .map(cleanWord)
    .filter(Boolean)
    .slice(0, 64);

  if (!words.length) {
    return [
      {
        id: "empty_0",
        text: "empty",
        normalized: "empty",
        index: 0,
        length: 5,
        emphasis: 0,
        repeated: false,
        energy: 0.2
      }
    ];
  }

  const counts = new Map();
  for (const word of words) {
    const key = word.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return words.map((word, index) => {
    const normalized = word.toLowerCase();
    const repeated = (counts.get(normalized) ?? 0) > 1;
    const punctuationBoost = /[!?]/.test(word) ? 0.2 : 0;
    const lengthBoost = Math.min(word.length / 18, 0.5);
    const hash = hashToken(`${normalized}_${index}`);
    const energy = Math.min(1, 0.2 + lengthBoost + punctuationBoost + (hash % 19) / 100);

    return {
      id: `${normalized}_${index}`,
      text: word,
      normalized,
      index,
      length: word.length,
      emphasis: punctuationBoost,
      repeated,
      energy
    };
  });
}
