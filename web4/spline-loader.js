(function () {
  if (window.splineAppLoaded) return;
  window.splineAppLoaded = true;

  // 🖼️ Crée le canvas plein écran
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1504;';
  document.body.appendChild(canvas);

  // 🧠 Système d'attente runtime
  window.splineReadyCallbacks = [];

  window.whenSplineReady = function (callback) {
    if (window.splineAppInstance) {
      callback(window.splineAppInstance);
    } else {
      window.splineReadyCallbacks.push(callback);
    }
  };

  // 🚀 Charge une scène Spline
  window.loadSplineScene = function (url) {
    window.whenSplineReady((app) => {
      app.load(url).then(() => {
        console.log("✅ Scène chargée :", url);
        window.splineSceneReady = true;

        app.addEventListener('mouseDown', (e) => {
          const name = e.target.name;
          if (typeof bubble_fn_onSplineClick === 'function') {
            bubble_fn_onSplineClick(name);
          }
          console.log("🖱️ Click sur :", name);
        });

        if (typeof window.onSplineSceneReady === 'function') {
          window.onSplineSceneReady(app);
        }
      });
    });
  };

  // 🧰 Chargement du runtime officiel
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
  };
  document.head.appendChild(script);

  // 📦 Namespace public : SplineBridge
  window.SplineBridge = {
    skinSwitch: function (skinNameToShow) {
      whenSplineReady((app) => {
        const all = app.getAllObjects();
        const skins = all.filter(obj => obj.name.startsWith("skin_"));

        if (skins.length === 0) {
          console.warn("⚠️ Aucun skin trouvé (skin_...)");
          return;
        }

        skins.forEach(obj => {
          obj.visible = obj.name === skinNameToShow;
        });

        console.log("✅ Skin affiché :", skinNameToShow);
      });
    }
  };
})();