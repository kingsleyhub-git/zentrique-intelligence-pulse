import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };
type Pulse = { a: number; b: number; t: number; speed: number };

/** Animated AI neural-network background: drifting nodes, live links and data pulses. */
export function NetworkCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(canvas);
    const blue = styles.getPropertyValue("--brand-blue").trim() || "#2678E8";
    const teal = styles.getPropertyValue("--brand-teal").trim() || "#18B6A4";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 150;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(40, (w * h) / 14000)));
      nodes = Array.from({ length: count }, () => {
        const hub = Math.random() < 0.12;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: hub ? 2.4 : 1.2 + Math.random() * 0.8,
          hub,
        };
      });
      pulses = [];
    };

    const spawnPulse = () => {
      const a = Math.floor(Math.random() * nodes.length);
      let best = -1;
      let bestD = LINK;
      for (let i = 0; i < nodes.length; i++) {
        if (i === a) continue;
        const d = Math.hypot(nodes[i].x - nodes[a].x, nodes[i].y - nodes[a].y);
        if (d < bestD && Math.random() > 0.3) {
          bestD = d;
          best = i;
        }
      }
      if (best >= 0) pulses.push({ a, b: best, t: 0, speed: 0.008 + Math.random() * 0.012 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 160;
            ctx.globalAlpha = (1 - d / LINK) * (near ? 0.55 : 0.18);
            ctx.strokeStyle = near ? teal : blue;
            ctx.lineWidth = near ? 1 : 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.globalAlpha = n.hub ? 0.95 : 0.6;
        ctx.fillStyle = n.hub ? teal : blue;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.hub) {
          ctx.globalAlpha = 0.15;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced) {
        if (pulses.length < 14 && Math.random() < 0.12) spawnPulse();
        pulses = pulses.filter((p) => p.t <= 1);
        for (const p of pulses) {
          p.t += p.speed;
          const a = nodes[p.a];
          const b = nodes[p.b];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          ctx.globalAlpha = 1;
          ctx.fillStyle = teal;
          ctx.shadowColor = teal;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        raf = requestAnimationFrame(draw);
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    setup();
    draw();
    const ro = new ResizeObserver(() => {
      setup();
      if (reduced) draw();
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
