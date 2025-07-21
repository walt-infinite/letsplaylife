<div style="position: relative; width: 100%; height: 100vh; overflow: hidden;">
  <!-- Spline Canvas -->
  <canvas id="canvas3d" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;"></canvas>
</div>

<script>
  function bubble_fn_onSplineClick(name) {
    return name;
  }

  // 🧠 File d'attente d'actions à lancer une fois Spline prêt
  const splineReadyCallbacks = [];

  function whenSplineReady(callback) {
    if (window.splineAppInstance) {
      callback(window.splineAppInstance);
    } else {
      splineReadyCallbacks.push(callback);
    }
  }

  // 🔁 Fonction pour charger une scène dynamiquement
  function loadSplineScene(url) {
    whenSplineReady((app) => {
      app.load(url).then(() => {
        console.log("✅ Nouvelle scène chargée :", url);

        app.addEventListener('mouseDown', (e) => {
          const name = e.target.name;
          const uid = e.target.id;
          bubble_fn_onSplineClick(name);
          console.log("🖱️ Click sur :", name, " - ID: ", uid );
        });
      });
    });
  }

  (function () {
    if (window.splineAppLoaded) return;
    window.splineAppLoaded = true;

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

      // ✅ Exécute les callbacks mis en attente
      splineReadyCallbacks.forEach(cb => cb(app));
      splineReadyCallbacks.length = 0; // on vide la file
    };

    document.head.appendChild(script);
  })();
</script>
 