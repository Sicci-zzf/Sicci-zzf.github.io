const posts = [
  {
    title: "第一篇：你好，博客！",
    date: "2026-02-19",
    url: "./posts/2026-02-19-hello.html",
    desc: "我为什么做这个网站，以及接下来准备写什么。"
  }
];

const el = document.getElementById("postList");
if (!el) {
  console.error("找不到 #postList：请检查 blog/index.html 是否有 <div id='postList'>");
} else {
  el.innerHTML = posts.map(p => `
    <a class="postitem" href="${p.url}">
      <div class="postmeta">
        <div class="posttitle">${p.title}</div>
        <div class="postdesc">${p.desc}</div>
      </div>
      <div class="postdate">${p.date}</div>
    </a>
  `).join("");
}
