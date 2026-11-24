const btn = document.getElementById("actionBtn");
const msg = document.getElementById("message");

let count = 0;

btn.addEventListener("click", () => {
  count += 1;
  msg.textContent = `আপনি বাটনটিতে ${count} বার ক্লিক করেছেন!`;
});