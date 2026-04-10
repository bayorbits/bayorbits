function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function polarToXY(cx, cy, rx, ry, angle, radiusScale) {
  return {
    x: cx + Math.cos(angle) * rx * radiusScale,
    y: cy + Math.sin(angle) * ry * radiusScale
  };
}

export function buildPromptGeometry(tokenUnits, layoutContext) {
  const units = tokenUnits.length ? tokenUnits : [{ id: "empty_0", normalized: "empty", length: 5, energy: 0.2, repeated: false }];
  const count = Math.max(units.length, 10);

  const centerX = layoutContext.focusX;
  const centerY = layoutContext.focusY;
  const radiusX = layoutContext.safeZone.w * 0.46;
  const radiusY = layoutContext.safeZone.h * 0.38;

  const seed = hashString(units.map((unit) => unit.id).join("|"));
  const rand = createSeededRandom(seed);

  const nodes = Array.from({ length: count }, (_, i) => {
    const unit = units[i % units.length];
    const baseAngle = (Math.PI * 2 * i) / count;
    const angle = baseAngle + (rand() - 0.5) * 0.24;
    const semanticBand = 0.25 + Math.min((unit.length ?? 5) / 16, 0.45);
    const repeatOffset = unit.repeated ? -0.06 : 0.06;
    const seedRadius = clamp(semanticBand + repeatOffset + (rand() - 0.5) * 0.15, 0.12, 0.78);

    const projected = polarToXY(centerX, centerY, radiusX, radiusY, angle, seedRadius);
    const transformed = polarToXY(
      centerX,
      centerY,
      radiusX,
      radiusY,
      angle * (1.25 + (unit.energy ?? 0.25) * 0.8),
      clamp(seedRadius + (unit.energy ?? 0.2) * 0.28, 0.18, 0.94)
    );
    const response = polarToXY(
      centerX,
      centerY,
      radiusX,
      radiusY,
      angle * (1.05 + (unit.energy ?? 0.2) * 0.25),
      clamp(0.22 + (unit.energy ?? 0.2) * 0.33 + (rand() - 0.5) * 0.08, 0.18, 0.55)
    );

    return {
      id: i,
      token: unit.normalized ?? unit.id,
      seedX: centerX + (rand() - 0.5) * 0.015,
      seedY: centerY + (rand() - 0.5) * 0.015,
      projectedX: projected.x,
      projectedY: projected.y,
      transformedX: transformed.x,
      transformedY: transformed.y,
      responseX: response.x,
      responseY: response.y,
      jitter: 0.008 + rand() * 0.022
    };
  });

  const links = [];
  const maxLocal = 3;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = 1; j <= maxLocal; j += 1) {
      links.push([i, (i + j) % nodes.length]);
    }
    if (units[i % units.length]?.repeated) {
      links.push([i, (i + Math.floor(nodes.length / 2)) % nodes.length]);
    }
  }

  const responseHull = nodes
    .map((node, index) => ({
      x: lerp(node.transformedX, node.responseX, 0.7 + ((index % 5) * 0.05)),
      y: lerp(node.transformedY, node.responseY, 0.72)
    }))
    .sort((a, b) => Math.atan2(a.y - centerY, a.x - centerX) - Math.atan2(b.y - centerY, b.x - centerX));

  return {
    createdAt: Date.now(),
    nodes,
    links,
    responseHull
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
