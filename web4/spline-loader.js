(function () {
  if (window.splineAppLoaded) return;
  window.splineAppLoaded = true;

  const canvas = document.createElement('canvas');
  canvas.id = 'canvas3d';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1500;';
  document.body.appendChild(canvas);

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
  };

  function showAvatar(nameToShow) {
    if (typeof whenSplineReady !== 'function') {
      console.error("❌ Spline not ready");
      return;
    }

    whenSplineReady((app) => {
      const avatarNames = ["avatar_pig", "avatar_bunny"]; // ⚠️ adapte à ta scène
      avatarNames.forEach((name) => {
        const obj = app.findObjectByName(name);
        if (obj) obj.visible = (name === nameToShow);
      });
      console.log("✅ Avatar visible :", nameToShow);
    });
  }

  document.head.appendChild(script);
})();