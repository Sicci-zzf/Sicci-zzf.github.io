// ====== 自动加载导航组件 ======
async function loadNav() {
  const container = document.getElementById("nav-placeholder");
  if (!container) return;

  const res = await fetch("/components/nav.html");
  const html = await res.text();
  container.innerHTML = html;

  // 导航插入后：初始化高亮
  setupNavActive();
}

document.addEventListener("DOMContentLoaded", loadNav);

// ====== 导航自动高亮 ======
function clearActive() {
  document.querySelectorAll(".nav-links a.active").forEach(a => a.classList.remove("active"));
}

function setActive(key) {
  clearActive();
  const a = document.querySelector(`.nav-links a[data-nav="${key}"]`);
  if (a) a.classList.add("active");
}

function setupNavActive() {
  // 1) 先根据“页面路径”高亮：首页/博客/文章页
  const path = location.pathname; // 例如 "/"  "/blog/"  "/blog/posts/xxx.html"

  if (path.startsWith("/blog")) {
    setActive("blog");
  } else {
    setActive("home");
  }

  // 2) 如果在首页：再根据滚动位置高亮（projects/about/contact）
  // 只有首页才做滚动侦测
  if (path !== "/" && path !== "/index.html") return;

  const ids = ["projects", "about", "contact"];
  const sections = ids
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    // 找到最“可见”的 section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    if (id === "projects") setActive("projects");
    if (id === "about") setActive("about");
    if (id === "contact") setActive("contact");
  }, {
    root: null,
    threshold: [0.2, 0.35, 0.5, 0.65]
  });

  sections.forEach(sec => io.observe(sec));

  // 点击首页（home）时也恢复 home 高亮
  const homeLink = document.querySelector(`.nav-links a[data-nav="home"]`);
  homeLink?.addEventListener("click", () => setActive("home"));
}

// document.addEventListener("DOMContentLoaded", loadNav);

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

// 深浅色切换（支持动态注入的 nav，记住选择）
const root = document.documentElement;

const THEME_KEY = "theme"; // "light" | "dark"

function applyTheme(mode) {
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");

  localStorage.setItem(THEME_KEY, mode);

  // nav 是动态插入的，所以每次都重新找 icon
  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = (mode === "light") ? "🌙" : "☀️"; // light 显示月亮（提示可切到夜间）
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

// 初始化一次
applyTheme(getInitialTheme());

// 事件委托：不管 nav 什么时候插入，点击都能生效
document.addEventListener("click", (e) => {
  const btn = e.target.closest?.("#themeToggle");
  if (!btn) return;

  const isLight = root.classList.contains("light");
  applyTheme(isLight ? "dark" : "light");
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
