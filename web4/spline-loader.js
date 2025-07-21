(function () {
  if (window.splineAppLoaded) return;
  window.splineAppLoaded = true;

  // Inject canvas dynamiquement
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  document.body.appendChild(canvas);

  // File d’attente
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
    console.log("✅ Runtime chargé");

    if (!window.spline || !window.spline.Runtime) {
      console.error("❌ Spline runtime non trouvé.");
      return;
    }

    const canvas = document.getElementById("canvas3d");
    const app = new window.spline.Runtime.Application(canvas);
    window.splineAppInstance = app;

    // Exécute les callbacks
    window.splineReadyCallbacks.forEach(cb => cb(app));
    window.splineReadyCallbacks.length = 0;
  };

  document.head.appendChild(script);
})();
