(function () {
  function initPage() {
    var gammaBox = document.querySelector(".gamma-ai-box");
    var handBox = document.querySelector(".hand-network-box");
    var touchHandImg = document.getElementById("touchHandImg");
    var touchHandFallback = document.getElementById("touchHandFallback");
    var pulseAura = document.querySelector(".pulse-aura");
    var highlightBtn = document.getElementById("highlightBtn");
    var statusBox = document.getElementById("statusBox");
    var letmegoaudio = document.getElementById("letmegoaudio");

    var neededDurationMs = 20000;
    var maxAudioSeconds = 150;
    var audioTimer = null;
    var isAudioActive = false;

    var imgList = [
      "touchnetwork",
      "touchnetwork.png",
      "touchnetwork.jpg",
      "touchnetwork.jpeg",
      "touchnetwork.webp"
    ];
    var imgIdx = 0;

    if (touchHandImg) {
      touchHandImg.src = imgList[0];
      touchHandImg.onerror = function () {
        imgIdx += 1;
        if (imgIdx < imgList.length) {
          touchHandImg.src = imgList[imgIdx];
        } else {
          touchHandImg.style.display = "none";
          if (touchHandFallback) {
            touchHandFallback.style.display = "block";
          }
        }
      };
    }

    var audioList = [
      "letmegoaudio",
      "letmegoaudio.mp3",
      "letmegoaudio.wav",
      "letmegoaudio.ogg",
      "letmegoaudio.m4a"
    ];
    var audioIdx = 0;

    if (letmegoaudio) {
      letmegoaudio.src = audioList[0];
      letmegoaudio.onerror = function () {
        audioIdx += 1;
        if (audioIdx < audioList.length) {
          letmegoaudio.src = audioList[audioIdx];
        }
      };

      letmegoaudio.ontimeupdate = function () {
        if (letmegoaudio.currentTime >= maxAudioSeconds) {
          letmegoaudio.pause();
          letmegoaudio.currentTime = 0;
          isAudioActive = false;
        }
      };
    }

    var startTime = null;

    function animateFrame(timestamp) {
      if (!startTime) startTime = timestamp;
      var t = (timestamp - startTime) / 1000;

      var speed = isAudioActive ? 5.2 : 3.2;
      var moveY = Math.sin(t * speed) * (isAudioActive ? 10 : 7);
      var tiltDeg = Math.sin(t * (speed * 0.7)) * (isAudioActive ? 4 : 2.5);
      var scaleVal = 1 + Math.sin(t * speed) * (isAudioActive ? 0.06 : 0.035);

      var handTransform =
        "translate3d(0px, " +
        moveY.toFixed(2) +
        "px, 0px) rotate(" +
        tiltDeg.toFixed(2) +
        "deg) scale(" +
        scaleVal.toFixed(3) +
        ")";

      if (touchHandImg && touchHandImg.style.display !== "none") {
        touchHandImg.style.transform = handTransform;
      }
      if (touchHandFallback && touchHandFallback.style.display !== "none") {
        touchHandFallback.style.transform = handTransform;
      }

      if (pulseAura) {
        var ringRate = isAudioActive ? 1.15 : 0.75;
        var phase = (t * ringRate) % 1;
        var ringScale = 0.5 + phase * 2.2;
        var ringOpacity = (1 - phase) * 0.9;
        pulseAura.style.transform = "scale(" + ringScale.toFixed(2) + ")";
        pulseAura.style.opacity = ringOpacity.toFixed(2);
      }

      if (gammaBox) {
        var gScale = 1 + Math.sin(t * 2.4) * (isAudioActive ? 0.022 : 0.012);
        var gGlow = isAudioActive ? 0.85 : 0.45;
        gammaBox.style.transform = "scale(" + gScale.toFixed(4) + ")";
        gammaBox.style.boxShadow =
          "0 0 " + (isAudioActive ? 26 : 16) + "px rgba(255, 212, 0, " + (gGlow * 0.35).toFixed(2) + ")";
      }

      if (handBox) {
        var hGlow = 0.25 + (Math.sin(t * 3.0) + 1) * 0.25;
        handBox.style.boxShadow =
          "0 0 " + (isAudioActive ? 28 : 16) + "px rgba(56, 189, 248, " + hGlow.toFixed(2) + ")";
      }

      if (highlightBtn) {
        var bScale = 1 + Math.sin(t * (isAudioActive ? 4.5 : 2.8)) * 0.04;
        highlightBtn.style.transform = "scale(" + bScale.toFixed(3) + ")";
      }

      requestAnimationFrame(animateFrame);
    }

    requestAnimationFrame(animateFrame);

    function playLowBackgroundAudio() {
      isAudioActive = true;
      if (!letmegoaudio) return;

      try {
        letmegoaudio.volume = 0.12;
        letmegoaudio.currentTime = 0;

        var playLimit = Math.min(neededDurationMs, maxAudioSeconds * 1000);
        var res = letmegoaudio.play();

        if (res && typeof res.then === "function") {
          res.then(function () {
            if (statusBox) {
              statusBox.textContent = "অ্যানিমেশন ও কম ভলিউমে ব্যাকগ্রাউন্ড অডিও চলছে";
            }
          }).catch(function () {
            if (statusBox) {
              statusBox.textContent = "স্ক্রিনে ক্লিক করলে ব্যাকগ্রাউন্ড অডিও চালু হবে";
            }
          });
        }

        if (audioTimer) {
          clearTimeout(audioTimer);
        }

        audioTimer = setTimeout(function () {
          letmegoaudio.pause();
          letmegoaudio.currentTime = 0;
          isAudioActive = false;
          if (statusBox) {
            statusBox.textContent = "অ্যানিমেশন চলছে • আবার শুনতে বাটনে ক্লিক করুন";
          }
        }, playLimit);
      } catch (e) {
        isAudioActive = false;
        if (statusBox) {
          statusBox.textContent = "অডিও চালু করা যায়নি";
        }
      }
    }

    if (highlightBtn) {
      highlightBtn.onclick = playLowBackgroundAudio;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
})();
