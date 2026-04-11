function drawBackground(ctx, width, height) {
  const g = ctx.createRadialGradient(width * 0.62, height * 0.22, 10, width * 0.5, height * 0.5, width * 0.9);
  g.addColorStop(0, "rgba(38, 54, 88, 0.58)");
  g.addColorStop(1, "rgba(5, 8, 15, 0.94)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

function drawAmbientStars(ctx, width, height, time, focusX, focusY) {
  const count = 44;
  for (let i = 0; i < count; i += 1) {
    const px = ((i * 137.5) % width) + Math.sin(time * 0.0001 + i) * 2.5;
    const py = ((i * 73.2) % height) + Math.cos(time * 0.00015 + i) * 3;
    const dx = px - width * focusX;
    const dy = py - height * focusY;
    const dist = Math.hypot(dx, dy);
    const alpha = Math.max(0.06, 0.32 - dist / (Math.max(width, height) * 1.3));
    ctx.fillStyle = `rgba(172, 189, 255, ${alpha.toFixed(3)})`;
    ctx.fillRect(px, py, 1.4, 1.4);
  }
}

export function renderFrame(ctx, canvas, frame, layoutContext, time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawAmbientStars(ctx, width, height, time, layoutContext.focusX, layoutContext.focusY);

  if (!frame.points.length) return;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(129, 165, 255, 0.24)";
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
    ctx.fillStyle = "rgba(134, 167, 255, 0.9)";
    ctx.arc(point.x * width, point.y * height, 3, 0, Math.PI * 2);
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
    ctx.fillStyle = "rgba(129, 230, 217, 0.12)";
    ctx.strokeStyle = "rgba(129, 230, 217, 0.72)";
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}
