export function initPlausible(domain = "yourdomain.com") {
  const s = document.createElement("script");
  s.defer = true;
  s.setAttribute("data-domain", domain);
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}