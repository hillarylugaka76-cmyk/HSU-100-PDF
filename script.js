const FOLDER = "pdfs/";

// "file" must match the exact PDF file name inside the pdfs folder
const FILES = [
  { category: "Lecture Notes", title: "1. Introduction to Basic Life Support", file: "1__Introduction_to_Basic_Life_Support_SLIDE.pdf", desc: "Introductory lecture slides on basic life support." },
  { category: "Lecture Notes", title: "2. Airway and Breathing Emergencies", file: "2__Airway_and_Breathing_Emercency_-_Copy.pdf", desc: "Choking, airway obstruction and breathing emergencies." },
  { category: "Lecture Notes", title: "3. Cardiovascular Emergencies and CPR", file: "3__Cardiovascular_emergencies_and_CPR.pdf", desc: "Angina, heart attack, stroke, cardiac arrest, CPR and AED." },
  { category: "Lecture Notes", title: "4. Wounds and Bleeding", file: "4__Wounds_and_Bleeding.pdf", desc: "Managing wounds and controlling external bleeding." },
  { category: "Lecture Notes", title: "5. Bone and Joint Injuries", file: "5_Bone_and_Joint_Injuries.pdf", desc: "Fractures, sprains, dislocations and their first aid." },
  { category: "Lecture Notes", title: "6. Other Emergencies", file: "6_Other__Emergencies.pdf", desc: "Diabetes, seizures, heat and cold injuries, poisoning and more." },
  { category: "Study Notes", title: "Basic Life Support", file: "BASIC_LIFE_SUPPORT.pdf", desc: "Study notes on basic life support." },
  { category: "Study Notes", title: "Basic Life Support and Emergency Care Notes", file: "Basic_Life_support_and_emergency_care_notes__2_.pdf", desc: "Combined notes for the whole unit." },
  { category: "Past Papers", title: "HSU 100 Past Paper (2021/2022, with answers)", file: "HSU_100_Past_paper.pdf", desc: "1st semester 2021/2022 paper with handwritten answers." },
  { category: "Past Papers", title: "HSU 100 Past Papers (2016 to 2022)", file: "HSU_100_past_papers__.pdf", desc: "Papers from 2016/2017, 2017/2018, 2019/2020 and 2021/2022." },
  { category: "Past Papers", title: "HSU 100 Past Paper (2022/2023)", file: "HSU_100_past_papers_.pdf", desc: "2nd semester 2022/2023 paper." }
];

const ICONS = { "Lecture Notes": "fa-chalkboard-user", "Study Notes": "fa-book-open", "Past Papers": "fa-file-pen" };
const CATEGORIES = ["All", ...new Set(FILES.map((f) => f.category))];

const $ = (id) => document.getElementById(id);
let activeTab = "All";

const urlOf = (f) => FOLDER + encodeURIComponent(f.file);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderTabs() {
  $("tabs").innerHTML = CATEGORIES.map(
    (c) => `<button class="tab ${c === activeTab ? "active" : ""}" data-c="${c}">${c}</button>`
  ).join("");
  $("tabs").querySelectorAll(".tab").forEach((b) => {
    b.onclick = () => { activeTab = b.dataset.c; renderTabs(); render(); };
  });
}

function cardHTML(f) {
  const i = FILES.indexOf(f);
  return `<div class="card">
    <div class="card-top">
      <div class="icon"><i class="fa-solid ${ICONS[f.category]}"></i></div>
      <div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p><span class="badge">${f.category}</span></div>
    </div>
    <div class="actions">
      <button class="btn read" data-i="${i}"><i class="fa-solid fa-book-open-reader"></i> Read</button>
      <a class="btn dl" href="${urlOf(f)}" download="${esc(f.file)}"><i class="fa-solid fa-download"></i> Download</a>
    </div>
  </div>`;
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const list = FILES.filter(
    (f) =>
      (activeTab === "All" || f.category === activeTab) &&
      (f.title + " " + f.desc + " " + f.file + " " + f.category).toLowerCase().includes(q)
  );
  const lib = $("library");
  lib.innerHTML = "";
  [...new Set(list.map((f) => f.category))].forEach((cat) => {
    lib.insertAdjacentHTML(
      "beforeend",
      `<div class="section-title"><i class="fa-solid ${ICONS[cat]}"></i>${cat}</div>
       <div class="grid">${list.filter((f) => f.category === cat).map(cardHTML).join("")}</div>`
    );
  });
  $("empty").style.display = list.length ? "none" : "block";
  lib.querySelectorAll(".btn.read").forEach((b) => (b.onclick = () => openReader(FILES[b.dataset.i])));
}

function openReader(f) {
  const url = urlOf(f);
  $("rTitle").textContent = f.title;
  $("rFrame").src = url;
  $("rOpen").href = url;
  $("rDl").href = url;
  $("rDl").setAttribute("download", f.file);
  $("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeReader() {
  $("modal").classList.remove("open");
  $("rFrame").src = "about:blank";
  document.body.style.overflow = "";
}

$("rClose").onclick = closeReader;
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeReader(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeReader(); });
$("search").addEventListener("input", render);

renderTabs();
render();
