type TRGB = [number, number, number];

const readCssColor = (varName: string): TRGB | null => {
  const el = document.createElement("div");

  document.body.appendChild(el);

  el.style.color = `var(${ varName })`;

  const raw = getComputedStyle(el).color;

  document.body.removeChild(el);

  const match = raw.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    return null;
  }

  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
};

const lerpColor = ([r1, g1, b1]: TRGB, [r2, g2, b2]: TRGB, t: number): string => {
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);

  return `rgb(${lerp(r1, r2)}, ${lerp(g1, g2)}, ${lerp(b1, b2)})`;
};

export const getSegmentColors = (n: number): string[] => {
  const start = readCssColor("--color-primary-800");
  const end = readCssColor("--color-accent-500");

  if (!start || !end) {
    return Array(n).fill("#cccccc");
  }

  if (n === 1) {
    return [lerpColor(start, end, 0)];
  }

  return Array.from({ length: n }, (_, i) => lerpColor(start, end, i / (n - 1)));
};

export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 4);

export const getWinner = (elements: string[], rotation: number): string => {
  const n = elements.length;

  if (n === 0) {
    return "";
  }

  const segAngle = 360 / n;
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const angleAtTop = (360 - normalizedRotation) % 360;
  const index = Math.floor(angleAtTop / segAngle) % n;

  return elements[index]
};

export const drawWheel = (
  ctx: CanvasRenderingContext2D,
  elements: string[],
  colors: string[],
  rotation: number,
) => {
  const canvas = ctx.canvas;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) - 30;
  const n = elements.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (n === 0) {
    return;
  }
  const segAngle = (2 * Math.PI) / n;
  const rotRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < n; i++) {
    const startAngle = -Math.PI / 2 + rotRad + i * segAngle;
    const endAngle = startAngle + segAngle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    const midAngle = startAngle + segAngle / 2;
    const label =
      elements[i].length > 10 ? elements[i].slice(0, 9) + "\u2026" : elements[i];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "#f2f2f2";
    ctx.font = `16px arial`;
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(label, radius - 12, 5);
    ctx.restore();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pointer triangle at top, pointing down into the wheel
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius + 6);
  ctx.lineTo(cx - 11, cy - radius - 16);
  ctx.lineTo(cx + 11, cy - radius - 16);
  ctx.closePath();
  ctx.fillStyle = "#000";
  ctx.fill();
};
