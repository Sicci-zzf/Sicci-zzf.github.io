// ====== 自动加载导航组件 ======
async function loadNav() {
  const container = document.getElementById("nav-placeholder");
  if (!container) return;

  const res = await fetch("/components/nav.html");
  const html = await res.text();
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", loadNav);

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
// Hero 打字机
const target = document.getElementById("typeTarget");
const sub = document.getElementById("typeSub");

// 你想展示的词组（随便改）
const words = ["Sicci🦄", "累累慢慢菇🍄", "网络小白一个"];
let w = 0, i = 0, deleting = false;

function tick(){
  if (!target) return;

  const word = words[w];
  if (!deleting) {
    i++;
    target.textContent = word.slice(0, i);
    if (i === word.length) {
      deleting = true;
      setTimeout(tick, 900);
      return;
    }
  } else {
    i--;
    target.textContent = word.slice(0, i);
    if (i === 0) {
      deleting = false;
      w = (w + 1) % words.length;
    }
  }

  // 速度：打字快、删字更快
  const speed = deleting ? 50 : 85;
  setTimeout(tick, speed);
}

// 让副标题也更“Apple”一点：轻微淡入
if (sub) sub.style.opacity = "0";
setTimeout(() => {
  tick();
  if (sub) {
    sub.style.transition = "opacity .8s ease";
    sub.style.opacity = "1";
  }
}, 300);
