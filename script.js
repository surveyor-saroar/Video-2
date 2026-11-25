(function () {
  function init() {
    var gammaBox = document.querySelector(".gamma-ai-box");
    var handBox = document.querySelector(".hand-network-box");
    var touchHandImg = document.getElementById("touchHandImg");
    var pulseAura = document.querySelector(".pulse-aura");
    var statusBox = document.getElementById("statusBox");
    var audio = document.getElementById("letmegoaudio");

    var neededDurationMs = 30000;
    var maxAudioSeconds = 150;
    var audioTimer = null;
    var audioPlaying = false;

    function startAudio() {
      if (!audio) return;
      try {
        audio.volume = 0.12;
        if (!audioPlaying) {
          audio.currentTime = 0;
        }
        var p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(function () {
            audioPlaying = true;
            if (statusBox) {
              statusBox.textContent = "অ্যানিমেশন ও ব্যাকগ্রাউন্ড সং চলছে";
            }
          }).catch(function () {
            if (statusBox) {
              statusBox.textContent = "অ্যানিমেশন চলছে • সং শুনতে স্ক্রিনে টাচ করুন";
            }
          });
        }

        clearTimeout(audioTimer);
        audioTimer = setTimeout(function () {
          audio.pause();
          audio.currentTime = 0;
          audioPlaying = false;
        }, Math.min(neededDurationMs, maxAudioSeconds * 1000));
      } catch (e) {}
    }

    if (audio) {
      audio.addEventListener("timeupdate", function () {
        if (audio.currentTime >= maxAudioSeconds) {
          audio.pause();
          audio.currentTime = 0;
          audioPlaying = false;
        }
      });
    }

    var startTs = null;
    function loop(ts) {
      if (!startTs) startTs = ts;
      var t = (ts - startTs) / 1000;

      // হাতের স্পষ্ট ওঠানামা ও হালকা জুম
      var dy = Math.sin(t * 3.5) * 12;
      var rot = Math.sin(t * 2.5) * 4;
      var sc = 1 + Math.sin(t * 3.5) * 0.06;
      if (touchHandImg) {
        touchHandImg.style.transform =
          "translate3d(0px, " + dy.toFixed(2) + "px, 0px) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
      }

      // রিং পালস
      if (pulseAura) {
        var phase = (t * 0.9) % 1;
        pulseAura.style.transform = "scale(" + (0.5 + phase * 2.3).toFixed(2) + ")";
        pulseAura.style.opacity = (1 - phase).toFixed(2);
      }

      // গামা বক্স ও হ্যান্ড বক্স গ্লো
      if (gammaBox) {
        var gScale = 1 + Math.sin(t * 2.4) * 0.02;
        gammaBox.style.transform = "scale(" + gScale.toFixed(4) + ")";
        gammaBox.style.boxShadow = "0 0 22px rgba(255, 212, 0, 0.25)";
      }

      if (handBox) {
        var glow = 0.25 + (Math.sin(t * 3.2) + 1) * 0.25;
        handBox.style.boxShadow = "0 0 24px rgba(56, 189, 248, " + glow.toFixed(2) + ")";
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    startAudio();

    document.addEventListener("pointerdown", function onFirstTouch() {
      if (!audioPlaying) {
        startAudio();
      }
      document.removeEventListener("pointerdown", onFirstTouch);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
