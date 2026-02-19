// 年份
document.getElementById("year").textContent = new Date().getFullYear();

// 点击打招呼
const helloBtn = document.getElementById("helloBtn");
const msg = document.getElementById("msg");
helloBtn?.addEventListener("click", () => {
  msg.textContent = "你好！很高兴认识你 🙂 你可以给我发邮件或在社交平台私信。";
});

// 滚动出现动画
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("show");
  }
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// 鼠标跟随高光（现代感）
const glow = document.querySelector(".glow");
let moved = false;

window.addEventListener("pointermove", (e) => {
  if (!glow) return;
  moved = true;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
  glow.style.opacity = "1";
}, { passive: true });

window.addEventListener("scroll", () => {
  if (!glow || !moved) return;
  glow.style.opacity = "0.65";
}, { passive: true });

// 深浅色切换（记住选择）
const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

function setTheme(mode){
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");

  if (icon) icon.textContent = (mode === "light") ? "☀️" : "🌙";
  localStorage.setItem("theme", mode);
}

const saved = localStorage.getItem("theme");
if (saved === "light" || saved === "dark") {
  setTheme(saved);
} else {
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  setTheme(prefersLight ? "light" : "dark");
}

toggleBtn?.addEventListener("click", () => {
  const isLight = root.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});
