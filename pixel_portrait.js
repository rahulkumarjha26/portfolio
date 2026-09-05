/**
 * Seamless Living Pixel Portrait with Color-Pop Foreground, Muted Background,
 * Subtle 3D Parallax, and Calm, Slow Micro-Shimmer
 */
(function () {
  'use strict';

  // Subtle 4x4 Bayer matrix for fine micro-texture
  const BAYER_4X4 = [
    [ 0/16,  8/16,  2/16, 10/16 ],
    [ 12/16, 4/16, 14/16,  6/16 ],
    [  3/16, 11/16,  1/16,  9/16 ],
    [ 15/16,  7/16, 13/16,  5/16 ]
  ];

  function initPixelPortrait() {
    const card = document.getElementById('avatarCard');
    if (!card) return;

    card.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.className = 'avatar-canvas';
    card.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Offscreen sampling canvas
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = window.PORTRAIT_BG_DATA_URI || window.PORTRAIT_DATA_URI || 'rahul_pure_crop.jpg';

    let isLoaded = false;
    let gridCols = 160;
    let gridRows = 106;

    // Processed pixel buffers
    let pixelR = null;
    let pixelG = null;
    let pixelB = null;
    let focusWeight = null; // Smooth 0..1 weight (1 = foreground, 0 = background)

    // Mouse tracking with smooth spring damping
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      isHovered: false,
      // Smoothed tilt angles for 3D parallax
      rotX: 0,
      rotY: 0,
      targetRotX: 0,
      targetRotY: 0
    };

    img.onload = () => {
      isLoaded = true;
      resizeCanvas();
    };

    function resizeCanvas() {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (w === 0 || h === 0) return;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      // Fine resolution (~2.4px per cell for crisp pixels)
      gridCols = Math.round(w / 2.35);
      gridRows = Math.round(h / 2.35);

      if (isLoaded) {
        processPortraitColors();
      }
    }

    function processPortraitColors() {
      if (!isLoaded || gridCols <= 0 || gridRows <= 0) return;

      offscreen.width = gridCols;
      offscreen.height = gridRows;
      offCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, gridCols, gridRows);

      try {
        const imgData = offCtx.getImageData(0, 0, gridCols, gridRows);
        const data = imgData.data;
        const total = gridCols * gridRows;

        pixelR = new Uint8Array(total);
        pixelG = new Uint8Array(total);
        pixelB = new Uint8Array(total);
        focusWeight = new Float32Array(total);

        // 1. Compute a smooth, natural subject focus field
        // In the cropped photo, Rahul is centered horizontally (x ~ 0.50) and extends from hair top to chest (y 0.15 to 1.0)
        const centerX = gridCols * 0.51;
        const centerY = gridRows * 0.52;
        const radiusX = gridCols * 0.36;
        const radiusY = gridRows * 0.44;

        // Raw weights based on subject geometry + skin/hair tone detection
        const rawWeights = new Float32Array(total);

        for (let r = 0; r < gridRows; r++) {
          const dy = (r - centerY) / radiusY;
          for (let c = 0; c < gridCols; c++) {
            const idx = r * gridCols + c;
            const dx = (c - centerX) / radiusX;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Elliptical falloff from center of Rahul outwards
            let w = Math.max(0.0, Math.min(1.0, 1.0 - (dist - 0.55) / 0.50));

            // Weight boost towards the bottom where shoulders/shirt are
            if (r > gridRows * 0.65) {
              const bodyDistX = Math.abs(c - centerX) / (gridCols * 0.42);
              const bodyWeight = Math.max(0.0, Math.min(1.0, 1.0 - bodyDistX));
              w = Math.max(w, bodyWeight * 0.95);
            }

            rawWeights[idx] = w;
          }
        }

        // 2. Multi-pass Gaussian blur on the focus map for 100% SEAMLESS blending
        // A blurred mask completely eliminates any sharp pasted-on boundaries
        const blurredWeights = new Float32Array(total);
        const blurRadius = 7;

        // Horizontal blur pass
        for (let r = 0; r < gridRows; r++) {
          for (let c = 0; c < gridCols; c++) {
            let sum = 0;
            let count = 0;
            for (let k = -blurRadius; k <= blurRadius; k++) {
              const nc = c + k;
              if (nc >= 0 && nc < gridCols) {
                sum += rawWeights[r * gridCols + nc];
                count++;
              }
            }
            blurredWeights[r * gridCols + c] = sum / count;
          }
        }

        // Vertical blur pass
        for (let c = 0; c < gridCols; c++) {
          for (let r = 0; r < gridRows; r++) {
            let sum = 0;
            let count = 0;
            for (let k = -blurRadius; k <= blurRadius; k++) {
              const nr = r + k;
              if (nr >= 0 && nr < gridRows) {
                sum += blurredWeights[nr * gridCols + c];
                count++;
              }
            }
            focusWeight[r * gridCols + c] = sum / count;
          }
        }

        // 3. Apply color processing:
        // Foreground: vibrant, popping colors (warm skin, crisp contrast, rich blacks)
        // Background: muted, duller, desaturated cool tone so subject stands out naturally
        for (let i = 0; i < total; i++) {
          const pIdx = i * 4;
          const origR = data[pIdx];
          const origG = data[pIdx + 1];
          const origB = data[pIdx + 2];
          const weight = focusWeight[i]; // 0 (bg) to 1 (fg)

          // --- POPPING FOREGROUND ---
          // Natural vibrance boost
          const maxC = Math.max(origR, origG, origB);
          const minC = Math.min(origR, origG, origB);
          const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
          const vib = (1.0 - sat) * 0.35 + 0.12; // boosts under-saturated tones
          const lum = 0.299 * origR + 0.587 * origG + 0.114 * origB;

          let fgR = lum + (origR - lum) * (1.0 + vib);
          let fgG = lum + (origG - lum) * (1.0 + vib);
          let fgB = lum + (origB - lum) * (1.0 + vib);

          // Deep contrast on Rahul (makes eyes, beard, hair pop without clipping)
          fgR = (fgR - 128) * 1.15 + 130;
          fgG = (fgG - 128) * 1.15 + 129;
          fgB = (fgB - 128) * 1.15 + 128;

          // --- DULLER BACKGROUND ---
          // Desaturate to 35% and dim by ~32%, with soft cool charcoal tint
          let bgR = (lum * 0.65 + origR * 0.35) * 0.68;
          let bgG = (lum * 0.65 + origG * 0.35) * 0.69;
          let bgB = (lum * 0.65 + origB * 0.35) * 0.74 + 4;

          // --- CONTINUOUS SEAMLESS BLEND ---
          // Because weight is continuous and blurred, the transition is completely seamless
          const finalR = Math.round(fgR * weight + bgR * (1.0 - weight));
          const finalG = Math.round(fgG * weight + bgG * (1.0 - weight));
          const finalB = Math.round(fgB * weight + bgB * (1.0 - weight));

          pixelR[i] = Math.min(255, Math.max(0, finalR));
          pixelG[i] = Math.min(255, Math.max(0, finalG));
          pixelB[i] = Math.min(255, Math.max(0, finalB));
        }
      } catch (err) {
        console.warn('Image processing error:', err);
      }
    }

    window.addEventListener('resize', resizeCanvas);

    // Interactive mouse listeners with 3D Parallax tracking
    card.addEventListener('mouseenter', (e) => {
      mouse.isHovered = true;
      const rect = card.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.x = clientX;
      mouse.y = clientY;
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.isHovered = true;

      // Calculate subtle 3D card tilt (max ±4.5 degrees)
      const normX = (clientX / rect.width) - 0.5;
      const normY = (clientY / rect.height) - 0.5;
      mouse.targetRotY = normX * 7.0;  // tilt left/right
      mouse.targetRotX = -normY * 6.0; // tilt up/down
    });

    card.addEventListener('mouseleave', () => {
      mouse.isHovered = false;
      mouse.targetRotX = 0;
      mouse.targetRotY = 0;
    });

    card.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = card.getBoundingClientRect();
        const clientX = e.touches[0].clientX - rect.left;
        const clientY = e.touches[0].clientY - rect.top;
        mouse.targetX = clientX;
        mouse.targetY = clientY;
        mouse.isHovered = true;

        const normX = (clientX / rect.width) - 0.5;
        const normY = (clientY / rect.height) - 0.5;
        mouse.targetRotY = normX * 5.0;
        mouse.targetRotX = -normY * 4.5;
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      mouse.isHovered = false;
      mouse.targetRotX = 0;
      mouse.targetRotY = 0;
    });

    // Slow, smooth interactive animation loop
    let animId = null;

    function render() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.width / dpr;
      const displayH = canvas.height / dpr;

      // 1. Smoothly interpolate 3D card tilt
      mouse.rotX += (mouse.targetRotX - mouse.rotX) * 0.12;
      mouse.rotY += (mouse.targetRotY - mouse.rotY) * 0.12;

      if (mouse.isHovered && (Math.abs(mouse.rotX) > 0.01 || Math.abs(mouse.rotY) > 0.01)) {
        card.style.transform = `perspective(900px) rotateX(${mouse.rotX.toFixed(2)}deg) rotateY(${mouse.rotY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
        card.style.boxShadow = `0 ${14 + Math.abs(mouse.rotX) * 2}px ${36 + Math.abs(mouse.rotY) * 2}px -6px rgba(0, 0, 0, 0.75), inset 0 0 0 1px rgba(255, 255, 255, 0.06)`;
      } else {
        card.style.transform = 'none';
        card.style.boxShadow = '0 12px 32px -8px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.04)';
      }

      // Smooth mouse cursor coordinate interpolation when hovered
      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep dark card base
      ctx.fillStyle = '#0a0e14';
      ctx.fillRect(0, 0, displayW, displayH);

      if (pixelR && gridCols > 0 && gridRows > 0) {
        const cellW = displayW / gridCols;
        const cellH = displayH / gridRows;
        const pixelW = cellW * 0.96;
        const pixelH = Math.max(1, cellH * 0.90); // crisp micro-scanline spacing

        const lightRadius = 140;
        const lightRadiusSq = lightRadius * lightRadius;

        for (let r = 0; r < gridRows; r++) {
          const cy = r * cellH + cellH * 0.5;
          const bayerRow = r % 4;

          for (let c = 0; c < gridCols; c++) {
            const cx = c * cellW + cellW * 0.5;
            const idx = r * gridCols + c;

            const pr = pixelR[idx];
            const pg = pixelG[idx];
            const pb = pixelB[idx];

            // Interactive cursor spotlight only when hovered
            let lightBoost = 0;
            if (mouse.isHovered) {
              const dx = cx - mouse.x;
              const dy = cy - mouse.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < lightRadiusSq) {
                const d = Math.sqrt(distSq);
                const falloff = Math.pow(1.0 - d / lightRadius, 2);
                lightBoost = falloff * 26;
              }
            }

            // Crisp Bayer matrix micro-texture for authentic digital canvas feel
            const bayerVal = (BAYER_4X4[bayerRow][c % 4] - 0.5) * 3;
            const mod = lightBoost + bayerVal;

            const finalR = Math.min(255, Math.max(0, Math.round(pr + mod)));
            const finalG = Math.min(255, Math.max(0, Math.round(pg + mod)));
            const finalB = Math.min(255, Math.max(0, Math.round(pb + mod * 0.85)));

            ctx.fillStyle = `rgb(${finalR},${finalG},${finalB})`;
            // Render directly in grid cell with zero geometric displacement/warping
            ctx.fillRect(c * cellW, r * cellH, pixelW, pixelH);
          }
        }

        // Soft peripheral vignette
        const vignette = ctx.createRadialGradient(
          displayW * 0.5, displayH * 0.5, displayW * 0.40,
          displayW * 0.5, displayH * 0.5, displayW * 0.72
        );
        vignette.addColorStop(0, 'transparent');
        vignette.addColorStop(1, 'rgba(10, 14, 20, 0.45)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, displayW, displayH);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    }

    resizeCanvas();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixelPortrait);
  } else {
    initPixelPortrait();
  }
})();
