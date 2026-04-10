function drawBackground(ctx, width, height) {
  const g = ctx.createRadialGradient(width * 0.68, height * 0.32, 20, width * 0.55, height * 0.4, width * 0.8);
  g.addColorStop(0, "rgba(38, 54, 88, 0.65)");
  g.addColorStop(1, "rgba(5, 8, 15, 0.95)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

function drawAmbientStars(ctx, width, height, time, focusX, focusY) {
  const count = 68;
  for (let i = 0; i < count; i += 1) {
    const px = ((i * 137.5) % width) + Math.sin(time * 0.0001 + i) * 4;
    const py = ((i * 73.2) % height) + Math.cos(time * 0.00015 + i) * 5;
    const dx = px - width * focusX;
    const dy = py - height * focusY;
    const dist = Math.hypot(dx, dy);
    const alpha = Math.max(0.08, 0.45 - dist / (Math.max(width, height) * 1.2));
    ctx.fillStyle = `rgba(172, 189, 255, ${alpha.toFixed(3)})`;
    ctx.fillRect(px, py, 1.5, 1.5);
  }
}

export function renderFrame(ctx, canvas, frame, layoutContext, time) {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawAmbientStars(ctx, width, height, time, layoutContext.focusX, layoutContext.focusY);

  if (!frame.points.length) return;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(129, 165, 255, 0.26)";
  for (const [a, b] of frame.links) {
    const p1 = frame.points[a];
    const p2 = frame.points[b];
    if (!p1 || !p2) continue;
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height);
    ctx.lineTo(p2.x * width, p2.y * height);
    ctx.stroke();
  }

  for (const point of frame.points) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(134, 167, 255, 0.92)";
    ctx.arc(point.x * width, point.y * height, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (frame.stage === "response") {
    ctx.beginPath();
    frame.hull.forEach((h, i) => {
      const x = h.x * width;
      const y = h.y * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(129, 230, 217, 0.13)";
    ctx.strokeStyle = "rgba(129, 230, 217, 0.76)";
    ctx.lineWidth = 1.3;
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}
