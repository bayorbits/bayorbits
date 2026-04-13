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
  const tokens = promptText
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => ({
      raw,
      cleaned: cleanWord(raw)
    }))
    .filter((token) => Boolean(token.cleaned))
    .slice(0, 64);

  if (!tokens.length) {
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
  for (const token of tokens) {
    const key = token.cleaned.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return tokens.map((token, index) => {
    const normalized = token.cleaned.toLowerCase();
    const repeated = (counts.get(normalized) ?? 0) > 1;
    const punctuationBoost = /[!?]/.test(token.raw) ? 0.2 : 0; // Intentionally preserve raw punctuation for emphasis.
    const lengthBoost = Math.min(token.cleaned.length / 18, 0.5);
    const hash = hashToken(`${normalized}_${index}`);
    const energy = Math.min(1, 0.2 + lengthBoost + punctuationBoost + (hash % 19) / 100);

    return {
      id: `${normalized}_${index}`,
      text: token.raw,
      normalized,
      index,
      length: token.cleaned.length,
      emphasis: punctuationBoost,
      repeated,
      energy
    };
  });
}
