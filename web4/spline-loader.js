(function () {
  if (window.splineAppLoaded) return;
  window.splineAppLoaded = true;

  // 🖼️ Crée le canvas plein écran
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1500;';
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

        // Événement clic dans Spline
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
  showAvatar: function (nameToShow) {
    const avatarNames = ["avatar_pig", "avatar_bunny"]; // adapte à ta scène

    window.whenSplineReady((app) => {
      const all = app.getAllObjects();

      avatarNames.forEach((name) => {
        const obj = app.findObjectByName(name);
        if (!obj) {
          console.warn("❌ Objet non trouvé :", name);
          return;
        }

        obj.visible = (name === nameToShow);
      });

      console.log("✅ Avatar affiché :", nameToShow);
    });
  }
};
})();