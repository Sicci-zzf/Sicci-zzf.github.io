function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function parseFrontMatter(md){
  if (!md.startsWith("---")) return { meta:{}, body: md };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { meta:{}, body: md };
  const raw = md.slice(3, end).trim();
  const body = md.slice(end + 4).trim();
  const meta = {};
  raw.split("\n").forEach(line => {
    const i = line.indexOf(":");
    if (i === -1) return;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();
    meta[k] = v;
  });
  return { meta, body };
}

function renderMarkdown(md){
  const parts = md.split("```");
  let html = "";
  for (let idx=0; idx<parts.length; idx++){
    if (idx % 2 === 1){
      html += `<pre><code>${escapeHtml(parts[idx].replace(/^\w*\n/, ""))}</code></pre>`;
      continue;
    }
    let block = parts[idx];

    block = block.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    block = block.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    block = block.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    block = block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    block = block.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`);

    block = block.replace(/^(?:- .*(?:\n|$))+?/gm, (m) => {
      const items = m.trim().split("\n").map(x => `<li>${x.replace(/^- /,"")}</li>`).join("");
      return `<ul>${items}</ul>\n`;
    });

    block = block
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => {
        if (/^<h[1-3]>/.test(p) || /^<ul>/.test(p) || /^<pre>/.test(p)) return p;
        return `<p>${p.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("\n");

    html += block;
  }
  return html;
}

// 从 raw.githubusercontent.com 拉 md（绕开 Pages 对 md 的 404）
function rawMdUrl(slug){
  const owner = "Sicci-zzf";
  const repo = "Sicci-zzf.github.io";
  const branch = "main";
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/blog/md/${encodeURIComponent(slug)}.md`;
}

async function loadPost(){
  const params = new URLSearchParams(location.search);
  const slug = params.get("p");
  const titleEl = document.getElementById("postTitle");
  const metaEl = document.getElementById("postMeta");
  const bodyEl = document.getElementById("postBody");

  if (!slug){
    if (titleEl) titleEl.textContent = "未指定文章";
    return;
  }

  const url = rawMdUrl(slug);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok){
    if (titleEl) titleEl.textContent = "文章不存在或加载失败";
    if (metaEl) metaEl.textContent = url;
    return;
  }

  const text = await res.text();
  const { meta, body } = parseFrontMatter(text);

  const title = meta.title || slug;
  const date = meta.date || "";

  document.title = `${title} · Sicci-zzf`;
  if (titleEl) titleEl.textContent = title;
  if (metaEl) metaEl.textContent = date ? `${date} · Sicci-zzf` : "Sicci-zzf";
  if (bodyEl) bodyEl.innerHTML = renderMarkdown(body);
}

document.addEventListener("DOMContentLoaded", loadPost);
