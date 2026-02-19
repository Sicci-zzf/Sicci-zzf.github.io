document.getElementById("year").textContent = new Date().getFullYear();

const btn = document.getElementById("helloBtn");
const msg = document.getElementById("msg");

btn.addEventListener("click", () => {
  msg.textContent = "你好！很高兴认识你 🙂 你可以给我发邮件或在社交平台私信。";
});
