const characters = [
    {
      name: 'Robot',
      draw(ctx, cx, cy, r) {
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = Math.max(1, r * 0.1);
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.85);
        ctx.lineTo(cx, cy - r * 1.25);
        ctx.stroke();
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(cx, cy - r * 1.3, r * 0.14, 0, Math.PI * 2);
        ctx.fill();
        const hw = r * 0.85, hh = r * 0.85, rc = r * 0.2;
        ctx.fillStyle = '#78909c';
        ctx.beginPath();
        ctx.moveTo(cx - hw + rc, cy - hh);
        ctx.arcTo(cx + hw, cy - hh, cx + hw, cy + hh, rc);
        ctx.arcTo(cx + hw, cy + hh, cx - hw, cy + hh, rc);
        ctx.arcTo(cx - hw, cy + hh, cx - hw, cy - hh, rc);
        ctx.arcTo(cx - hw, cy - hh, cx + hw, cy - hh, rc);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(cx - r * 0.55, cy - r * 0.4, r * 0.35, r * 0.3);
        ctx.fillRect(cx + r * 0.2, cy - r * 0.4, r * 0.35, r * 0.3);
        ctx.fillStyle = '#37474f';
        ctx.fillRect(cx - r * 0.4, cy + r * 0.2, r * 0.8, r * 0.25);
        ctx.strokeStyle = '#78909c';
        ctx.lineWidth = Math.max(1, r * 0.05);
        for (let i = 1; i < 4; i++) {
          const lx = cx - r * 0.4 + i * r * 0.8 / 4;
          ctx.beginPath(); ctx.moveTo(lx, cy + r * 0.2); ctx.lineTo(lx, cy + r * 0.45); ctx.stroke();
        }
      }
    },
    {
      name: 'Ninja',
      draw(ctx, cx, cy, r) {
        ctx.fillStyle = '#2d2d2d';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e94560';
        ctx.fillRect(cx - r, cy - r * 0.3, r * 2, r * 0.3);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.3, cy - r * 0.15, r * 0.22, r * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.3, cy - r * 0.15, r * 0.22, r * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      name: 'Wizard',
      draw(ctx, cx, cy, r) {
        ctx.fillStyle = '#7c4dff';
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.15, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.75, cy - r * 0.15);
        ctx.lineTo(cx, cy - r * 1.5);
        ctx.lineTo(cx + r * 0.75, cy - r * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#651fff';
        ctx.beginPath();
        ctx.ellipse(cx, cy - r * 0.15, r * 0.85, r * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd740';
        const sx = cx, sy = cy - r * 0.8;
        const sr = r * 0.22;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI / 5);
          ctx.lineTo(sx + Math.cos(ang) * sr, sy + Math.sin(ang) * sr);
          const inner = ang + Math.PI / 5;
          ctx.lineTo(sx + Math.cos(inner) * sr * 0.4, sy + Math.sin(inner) * sr * 0.4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy + r * 0.2, r * 0.14, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.3, cy + r * 0.2, r * 0.14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy + r * 0.2, r * 0.07, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.35, cy + r * 0.2, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      name: 'Knight',
      draw(ctx, cx, cy, r) {
        ctx.fillStyle = '#90a4ae';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.ellipse(cx, cy - r * 1.05, r * 0.12, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#37474f';
        ctx.fillRect(cx - r * 0.6, cy - r * 0.1, r * 1.2, r * 0.18);
        ctx.fillRect(cx - r * 0.09, cy - r * 0.1, r * 0.18, r * 0.55);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.35, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      name: 'Cat',
      draw(ctx, cx, cy, r) {
        ctx.fillStyle = '#ff8a65';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.7, cy - r * 0.4);
        ctx.lineTo(cx - r * 0.45, cy - r * 1.15);
        ctx.lineTo(cx - r * 0.05, cy - r * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.7, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.45, cy - r * 1.15);
        ctx.lineTo(cx + r * 0.05, cy - r * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffab91';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.55, cy - r * 0.42);
        ctx.lineTo(cx - r * 0.43, cy - r * 0.85);
        ctx.lineTo(cx - r * 0.18, cy - r * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.55, cy - r * 0.42);
        ctx.lineTo(cx + r * 0.43, cy - r * 0.85);
        ctx.lineTo(cx + r * 0.18, cy - r * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ff8a65';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.3, cy - r * 0.1, r * 0.18, r * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.3, cy - r * 0.1, r * 0.18, r * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.28, cy - r * 0.1, r * 0.06, r * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.32, cy - r * 0.1, r * 0.06, r * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d84315';
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.15);
        ctx.lineTo(cx - r * 0.1, cy + r * 0.25);
        ctx.lineTo(cx + r * 0.1, cy + r * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = Math.max(1, r * 0.05);
        ctx.beginPath(); ctx.moveTo(cx - r * 0.25, cy + r * 0.2); ctx.lineTo(cx - r * 1.0, cy + r * 0.05); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.25, cy + r * 0.28); ctx.lineTo(cx - r * 1.0, cy + r * 0.35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.25, cy + r * 0.2); ctx.lineTo(cx + r * 1.0, cy + r * 0.05); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.25, cy + r * 0.28); ctx.lineTo(cx + r * 1.0, cy + r * 0.35); ctx.stroke();
      }
    },
    {
      name: 'Ghost',
      secret: true,
      draw(ctx, cx, cy, r) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.6);
        glow.addColorStop(0, 'rgba(200, 230, 255, 0.25)');
        glow.addColorStop(1, 'rgba(200, 230, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
        ctx.fillStyle = 'rgba(210, 230, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.15, r * 0.85, Math.PI, 0);
        ctx.lineTo(cx + r * 0.85, cy + r * 0.7);
        for (let i = 0; i < 4; i++) {
          const bx1 = cx + r * 0.85 - (i + 0.5) * (r * 1.7 / 4);
          const bx2 = cx + r * 0.85 - (i + 1) * (r * 1.7 / 4);
          ctx.lineTo(bx1, cy + r * 0.4);
          ctx.lineTo(bx2, cy + r * 0.7);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.3, cy - r * 0.15, r * 0.16, r * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.3, cy - r * 0.15, r * 0.16, r * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * 0.25, r * 0.12, r * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  ];