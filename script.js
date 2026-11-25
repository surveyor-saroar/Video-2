const touchHandImg = document.getElementById("touchHandImg");
const touchHandFallback = document.getElementById("touchHandFallback");
const highlightBtn = document.getElementById("highlightBtn");
const statusBox = document.getElementById("statusBox");
const letmegoaudio = document.getElementById("letmegoaudio");

// ১৫০ সেকেন্ডের ক্লিপের শুরু থেকে যতটুকু অংশ দরকার (যেমন ২০ সেকেন্ড = 20000 ms)
const neededDurationMs = 20000;
const maxAudioSeconds = 150;
let audioStopTimer = null;

// আপলোড করা touchnetwork ছবির সম্ভাব্য এক্সটেনশন স্বয়ংক্রিয়ভাবে চেক করা
const imgCandidates = [
  "touchnetwork",
  "touchnetwork.png",
  "touchnetwork.jpg",
  "touchnetwork.jpeg",
  "touchnetwork.webp"
];
let imgIndex = 0;

touchHandImg.addEventListener("error", () => {
  imgIndex++;
  if (imgIndex < imgCandidates.length) {
    touchHandImg.src = imgCandidates[imgIndex];
  } else {
    touchHandImg.style.display = "none";
    touchHandFallback.style.display = "block";
  }
});

// আপলোড করা letmegoaudio অডিওর সম্ভাব্য এক্সটেনশন সেট করা
const audioCandidates = [
  "letmegoaudio",
  "letmegoaudio.mp3",
  "letmegoaudio.wav",
  "letmegoaudio.ogg",
  "letmegoaudio.m4a"
];
let audioIndex = 0;
letmegoaudio.src = audioCandidates[0];

letmegoaudio.addEventListener("error", () => {
  audioIndex++;
  if (audioIndex < audioCandidates.length) {
    letmegoaudio.src = audioCandidates[audioIndex];
    letmegoaudio.load();
  }
});

function startLowBackgroundAudio() {
  // ছোট সাউন্ড স্পষ্ট রাখতে ব্যাকগ্রাউন্ড অডিও কম ভলিউমে (১২%)
  letmegoaudio.volume = 0.12;
  letmegoaudio.currentTime = 0;

  const playForMs = Math.min(neededDurationMs, maxAudioSeconds * 1000);

  letmegoaudio.play().then(() => {
    statusBox.textContent = "অ্যানিমেশন ও কম ভলিউমে ব্যাকগ্রাউন্ড অডিও চলছে";
  }).catch(() => {
    statusBox.textContent = "স্ক্রিনে ক্লিক করলে ব্যাকগ্রাউন্ড অডিও চালু হবে";
  });

  clearTimeout(audioStopTimer);
  audioStopTimer = setTimeout(() => {
    letmegoaudio.pause();
    letmegoaudio.currentTime = 0;
    statusBox.textContent = "অ্যানিমেশন চলছে • আবার শুনতে বাটনে ক্লিক করুন";
  }, playForMs);
}

letmegoaudio.addEventListener("timeupdate", () => {
  if (letmegoaudio.currentTime >= maxAudioSeconds) {
    letmegoaudio.pause();
    letmegoaudio.currentTime = 0;
  }
});

highlightBtn.addEventListener("click", startLowBackgroundAudio);
