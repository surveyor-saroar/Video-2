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

    // ১. touchnetwork ইমেজ লোডিং
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

    // ২. letmegoaudio লোডিং
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
        }
      };
    }

    // ৩. JavaScript রিয়েল-টাইম অ্যানিমেশন লুপ (সব ব্রাউজারে নিশ্চিতভাবে চলবে)
    var startTime = null;
    var boostMode = false;

    function animateFrame(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = (timestamp - startTime) / 1000;

      // হাতের ছবি ও ফলব্যাক ভেক্টরের ওঠানামা ও হালকা জুম অ্যানিমেশন
      var speed = boostMode ? 4.2 : 2.6;
      var floatY = Math.sin(elapsed * speed) * (boostMode ? 9 : 6);
      var handScale = 1 + Math.sin(elapsed * speed) * 0.04;

      if (touchHandImg && touchHandImg.style.display !== "none") {
        touchHandImg.style.transform =
          "translateY(" + floatY.toFixed(2) + "px) scale(" + handScale.toFixed(3) + ")";
      }
      if (touchHandFallback && touchHandFallback.style.display === "block") {
        touchHandFallback.style.transform =
          "translateY(" + floatY.toFixed(2) + "px) scale(" + handScale.toFixed(3) + ")";
      }

      // টাচ পালস রিং ছড়িয়ে যাওয়ার অ্যানিমেশন
      if (pulseAura) {
        var ringProgress = (elapsed * 0.7) % 1;
        var ringScale = 0.6 + ringProgress * 1.7;
        var ringOpacity = 1 - ringProgress;
        pulseAura.style.transform = "scale(" + ringScale.toFixed(2) + ")";
        pulseAura.style.opacity = ringOpacity.toFixed(2);
      }

      // গামা এআই বক্সের হালকা শ্বাস-প্রশ্বাস ও বর্ডার গ্লো অ্যানিমেশন
      if (gammaBox) {
        var boxScale = 1 + Math.sin(elapsed * 2.0) * 0.015;
        var glowAlpha = 0.25 + (Math.sin(elapsed * 2.0) + 1) * 0.2;
        gammaBox.style.transform = "scale(" + boxScale.toFixed(4) + ")";
        gammaBox.style.borderColor = "rgba(255, 212, 0, " + glowAlpha.toFixed(2) + ")";
      }

      // হ্যান্ড নেটওয়ার্ক বক্সের বর্ডার গ্লো
      if (handBox) {
        var handGlow = 0.25 + (Math.cos(elapsed * 2.2) + 1) * 0.2;
        handBox.style.borderColor = "rgba(56, 189, 248, " + handGlow.toFixed(2) + ")";
      }

      // হাইলাইট বাটনের পালস অ্যানিমেশন
      if (highlightBtn) {
        var btnScale = 1 + Math.sin(elapsed * 3.0) * 0.035;
        highlightBtn.style.transform = "scale(" + btnScale.toFixed(3) + ")";
      }

      requestAnimationFrame(animateFrame);
    }

    requestAnimationFrame(animateFrame);

    // ৪. ক্লিক করলে সাউন্ড + অ্যানিমেশন বুস্ট
    function playLowBackgroundAudio() {
      boostMode = true;

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
          boostMode = false;
          if (statusBox) {
            statusBox.textContent = "অ্যানিমেশন চলছে • আবার শুনতে বাটনে ক্লিক করুন";
          }
        }, playLimit);
      } catch (e) {
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
