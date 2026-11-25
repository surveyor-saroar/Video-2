(function () {
  function initPage() {
    var touchHandImg = document.getElementById("touchHandImg");
    var touchHandFallback = document.getElementById("touchHandFallback");
    var highlightBtn = document.getElementById("highlightBtn");
    var statusBox = document.getElementById("statusBox");
    var letmegoaudio = document.getElementById("letmegoaudio");

    var neededDurationMs = 20000;
    var maxAudioSeconds = 150;
    var audioTimer = null;

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
        }
      };
    }

    function playLowBackgroundAudio() {
      if (!letmegoaudio) {
        return;
      }

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
        } else if (statusBox) {
          statusBox.textContent = "অ্যানিমেশন ও কম ভলিউমে ব্যাকগ্রাউন্ড অডিও চলছে";
        }

        if (audioTimer) {
          clearTimeout(audioTimer);
        }

        audioTimer = setTimeout(function () {
          letmegoaudio.pause();
          letmegoaudio.currentTime = 0;
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
