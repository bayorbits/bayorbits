function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function buildPromptGeometry(tokens, layoutContext) {
  const count = Math.max(tokens.length, 8);
  const centerX = layoutContext.focusX;
  const centerY = layoutContext.focusY;
  const radiusX = layoutContext.safeZone.w * 0.32;
  const radiusY = layoutContext.safeZone.h * 0.26;

  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const r = 0.2 + (i % 5) * 0.13;
    return {
      id: i,
      token: tokens[i % tokens.length],
      seedX: centerX,
      seedY: centerY,
      projectedX: centerX + Math.cos(angle) * radiusX * r,
      projectedY: centerY + Math.sin(angle) * radiusY * r,
      transformedX: centerX + Math.cos(angle * 1.8) * radiusX * 0.95,
      transformedY: centerY + Math.sin(angle * 1.4) * radiusY * 0.95,
      responseX: centerX + Math.cos(angle) * radiusX * 0.36,
      responseY: centerY + Math.sin(angle) * radiusY * 0.2,
      jitter: Math.random() * 0.02
    };
  });

  const links = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const next = (i + 1) % nodes.length;
    const skip = (i + 3) % nodes.length;
    links.push([i, next], [i, skip]);
  }

  return {
    createdAt: Date.now(),
    nodes,
    links,
    responseHull: nodes.map((node, index) => ({
      x: lerp(node.transformedX, node.responseX, 0.75 + ((index % 3) * 0.08)),
      y: lerp(node.transformedY, node.responseY, 0.75)
    }))
  };
}
