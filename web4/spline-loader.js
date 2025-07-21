(function () {
  if (window.splineAppLoaded) return;
  window.splineAppLoaded = true;

  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.border = 'none';
  canvas.style.display = 'block';
  canvas.style.zIndex = '0';

  // 🧠 Injecter dans le bon conteneur Bubble
  const tryInjectCanvas = () => {
    const container = document.getElementById('spline-canvas-holder');
    if (container) {
      container.appendChild(canvas);
      console.log("✅ Canvas injecté dans #spline-canvas-holder");
    } else {
      console.warn("⌛ En attente de #spline-canvas-holder...");
      setTimeout(tryInjectCanvas, 100);
    }
  };
  tryInjectCanvas();

  window.splineReadyCallbacks = [];

  window.whenSplineReady = function (callback) {
    if (window.splineAppInstance) {
      callback(window.splineAppInstance);
    } else {
      window.splineReadyCallbacks.push(callback);
    }
  };

  window.loadSplineScene = function (url) {
    window.whenSplineReady((app) => {
      app.load(url).then(() => {
        console.log("✅ Scène chargée :", url);
        app.addEventListener('mouseDown', (e) => {
          const name = e.target.name;
          if (typeof bubble_fn_onSplineClick === 'function') {
            bubble_fn_onSplineClick(name);
          }
          console.log("🖱️ Click sur :", name);
        });
      });
    });
  };

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/walt-infinite/letsplaylife@main/vendor/spline-runtime/spline-runtime-umd.js';
  script.onload = () => {
    if (!window.spline || !window.spline.Runtime) {
      console.error("❌ Spline runtime non trouvé.");
      return;
    }
    const app = new window.spline.Runtime.Application(canvas);
    window.splineAppInstance = app;
    window.splineReadyCallbacks.forEach(cb => cb(app));
    window.splineReadyCallbacks.length = 0;
    console.log("✅ Spline app initialisée");
  };

  document.head.appendChild(script);
})();
