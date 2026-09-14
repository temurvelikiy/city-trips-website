/* ================= STATE ================= */
let LANG = localStorage.getItem("ct_lang") || "uz";

/* ================= THEME (day / night) ================= */
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("ct_theme", theme);
  const btn = document.getElementById("themeBtn");
  if(btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}
(function initTheme(){
  const saved = localStorage.getItem("ct_theme");
  applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
})();

/* ================= I18N APPLY ================= */
function applyLang(lang){
  LANG = lang;
  localStorage.setItem("ct_lang", lang);
  document.documentElement.lang = lang;
  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll(".lang__btn").forEach(b=>
    b.classList.toggle("active", b.dataset.lang===lang));
  renderTours();
  renderReviews();
  populateBookDest();
}

/* ================= TOURS GRID ================= */
function renderTours(){
  const grid = document.getElementById("toursGrid");
  const d = I18N[LANG];
  grid.innerHTML = TOURS.map(t=>`
    <article class="tour">
      <div class="tour__img">
        <img src="${t.img}" alt="${t.name[LANG]}" loading="lazy"
             onerror="this.style.display='none'" />
        <span class="tour__flag">${t.flag} ${t.country[LANG]}</span>
      </div>
      <div class="tour__body">
        <h3 class="tour__title">${t.name[LANG]}</h3>
        <p class="tour__desc">${t.desc[LANG]}</p>
        <div class="tour__meta"><span>🗓 ${t.days} ${d.tour_days}</span><span>👥 ${t.capacity}</span></div>
        <div class="tour__price">${d.tour_from} $${t.price} <span>/ ${t.days} ${d.tour_days}</span></div>
        <div class="tour__btns">
          <button class="btn btn--outline" onclick="openDetails('${t.id}')">${d.tour_details}</button>
          <button class="btn btn--gold" onclick="openBooking('${t.id}')">${d.tour_book}</button>
        </div>
      </div>
    </article>`).join("");
}

/* ================= REVIEWS CAROUSEL (3 per view) ================= */
let revPage = 0;
function perView(){ return window.innerWidth<=760 ? 1 : (window.innerWidth<=980 ? 2 : 3); }
function pageCount(){ return Math.ceil(REVIEWS.length / perView()); }

function renderReviews(){
  const track = document.getElementById("reviewsTrack");
  track.style.setProperty("--per", perView());
  track.innerHTML = REVIEWS.map(r=>`
    <div class="review">
      <div class="review__card">
        <div class="review__stars">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</div>
        <p class="review__text">“${r.text[LANG]}”</p>
        <div class="review__author">
          <div class="review__avatar">${r.name.charAt(0)}</div>
          <div style="text-align:left">
            <div class="review__name">${r.name}</div>
            <div class="review__loc">${r.loc[LANG]}</div>
          </div>
        </div>
      </div>
    </div>`).join("");
  renderDots();
  updateReview();
}
function renderDots(){
  const dots = document.getElementById("reviewsDots");
  dots.innerHTML = Array.from({length:pageCount()},(_,i)=>
    `<button class="${i===revPage?'active':''}" onclick="goReview(${i})"></button>`).join("");
}
function updateReview(){
  if(revPage >= pageCount()) revPage = 0;
  document.getElementById("reviewsTrack").style.transform = `translateX(-${revPage*100}%)`;
  document.querySelectorAll("#reviewsDots button").forEach((b,i)=>b.classList.toggle("active",i===revPage));
}
function goReview(i){ const pc=pageCount(); revPage=(i+pc)%pc; updateReview(); }
document.getElementById("revNext").onclick=()=>goReview(revPage+1);
document.getElementById("revPrev").onclick=()=>goReview(revPage-1);
let revTimer = setInterval(()=>goReview(revPage+1), 6000);
const revEl = document.querySelector(".reviews");
revEl.addEventListener("mouseenter",()=>clearInterval(revTimer));
revEl.addEventListener("mouseleave",()=>revTimer=setInterval(()=>goReview(revPage+1),6000));
let revResizeTO;
window.addEventListener("resize",()=>{clearTimeout(revResizeTO);revResizeTO=setTimeout(renderReviews,150);});

/* ================= DETAILS MODAL ================= */
const detailsModal = document.getElementById("detailsModal");
function fmtDate(s){ const [y,m,d]=s.split("-"); return `${d}.${m}.${y}`; }
function openDetails(id){
  const t = TOURS.find(x=>x.id===id);
  const d = I18N[LANG];
  document.getElementById("dImg").src = t.img;
  document.getElementById("dTitle").textContent = `${t.flag} ${t.name[LANG]}`;
  document.getElementById("dDesc").textContent = t.desc[LANG];
  document.getElementById("dMeta").innerHTML =
    `<span>💵 ${d.tour_from} $${t.price}</span><span>🗓 ${t.days} ${d.tour_days}</span><span>👥 ${t.capacity}</span>`;
  document.getElementById("dDates").innerHTML =
    `<strong>${d.details_dates}:</strong> ` +
    t.available.map(([f,to])=>`<span class="date-chip">${fmtDate(f)} – ${fmtDate(to)}</span>`).join(" ");
  const bookBtn = document.getElementById("dBook");
  bookBtn.textContent = d.tour_book;
  bookBtn.onclick = ()=>{ closeDetails(); openBooking(id); };
  detailsModal.hidden = false;
  document.body.style.overflow="hidden";
}
function closeDetails(){ detailsModal.hidden=true; document.body.style.overflow=""; }
detailsModal.querySelectorAll("[data-dclose]").forEach(el=>el.onclick=closeDetails);

/* ================= BOOKING MODAL → TELEGRAM ================= */
const TG_USER = "akbarov0909";            // operator Telegram (@akbarov0909)
const modal = document.getElementById("bookModal");

function populateBookDest(){
  const sel = document.getElementById("bDest");
  if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = `<option value="">${I18N[LANG].search_dest_ph}</option>` +
    TOURS.map(t=>`<option value="${t.id}">${t.flag} ${t.name[LANG]} — $${t.price}</option>`).join("");
  sel.value = cur;
}
function openBooking(id){
  populateBookDest();
  document.getElementById("bookForm").reset();
  document.getElementById("bDest").value = id || "";
  document.getElementById("bPeople").value = 2;
  document.getElementById("bookOk").hidden = true;
  document.getElementById("bookForm").hidden = false;
  modal.hidden = false;
  document.body.style.overflow="hidden";
}
function closeModal(){ modal.hidden=true; document.body.style.overflow=""; }
modal.querySelectorAll("[data-close]").forEach(el=>el.onclick=closeModal);

document.getElementById("bookForm").addEventListener("submit",e=>{
  e.preventDefault();
  const t = TOURS.find(x=>x.id===document.getElementById("bDest").value);
  if(!t) return;
  const name   = document.getElementById("bName").value.trim();
  const phone  = document.getElementById("bPhone").value.trim();
  const people = document.getElementById("bPeople").value;
  const L = {
    uz:{h:"Yangi bron so‘rovi",tour:"Yo‘nalish",name:"Ism",phone:"Telefon",ppl:"Sayohatchilar"},
    ru:{h:"Новая заявка на бронирование",tour:"Направление",name:"Имя",phone:"Телефон",ppl:"Путешественники"},
    en:{h:"New booking request",tour:"Destination",name:"Name",phone:"Phone",ppl:"Travelers"}
  }[LANG];
  const msg =
`🌍 City Trips — ${L.h}
✈️ ${L.tour}: ${t.flag} ${t.name[LANG]} — $${t.price} (${t.days} ${I18N[LANG].tour_days})
👤 ${L.name}: ${name}
📞 ${L.phone}: ${phone}
👥 ${L.ppl}: ${people}`;
  try{ navigator.clipboard && navigator.clipboard.writeText(msg); }catch(_){}
  window.open(`https://t.me/${TG_USER}?text=${encodeURIComponent(msg)}`, "_blank");
  document.getElementById("bookForm").hidden = true;
  document.getElementById("bookOk").hidden = false;
});

/* ================= NAV / BURGER / LANG / THEME ================= */
document.getElementById("lang").addEventListener("click",e=>{
  if(e.target.dataset.lang) applyLang(e.target.dataset.lang);
});
document.getElementById("themeBtn").onclick = ()=>{
  const now = document.documentElement.getAttribute("data-theme")==="dark" ? "light" : "dark";
  applyTheme(now);
};
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.onclick=()=>{ nav.classList.toggle("open"); burger.classList.toggle("active"); };
nav.querySelectorAll("a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));

/* ================= INIT ================= */
document.getElementById("year").textContent = new Date().getFullYear();
applyLang(LANG);
