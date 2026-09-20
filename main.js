const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const bootMessages = [
  "CONNECTING TO ARCHIVE NODE KR-SEOUL...",
  "VERIFYING ENCRYPTED RECORDS...",
  "LOADING AWAKENED REGISTRY...",
  "SYNCING GATE MONITORING NETWORK...",
  "ACCESS LEVEL 04 CONFIRMED."
];

let bootIndex = 0;
const bootLog = $("#boot-log");
const bootBar = $("#boot-progress-bar");

function runBoot() {
  const timer = setInterval(() => {
    if (bootIndex < bootMessages.length) {
      const line = document.createElement("div");
      line.textContent = `> ${bootMessages[bootIndex]}`;
      bootLog.appendChild(line);
      bootIndex++;
      bootBar.style.width = `${bootIndex / bootMessages.length * 100}%`;
    } else {
      clearInterval(timer);
      setTimeout(() => $("#boot-screen").classList.add("hidden"), 450);
    }
  }, 330);
}
window.addEventListener("load", runBoot);

const cursorGlow = $(".cursor-glow");
window.addEventListener("pointermove", (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour12:false });
  $("#clock").textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalKicker = $("#modalKicker");
const modalContent = $("#modalContent");

const gateData = {
  "GATE-001": {
    kicker: "GATE RECORD / S-RANK",
    title: "GATE-001 // THE BLACK DOOR",
    content: `
      <p><strong>LOCATION:</strong> SEOUL, REPUBLIC OF KOREA</p>
      <p><strong>FIRST DETECTED:</strong> 2049.06.17</p>
      <p><strong>STATUS:</strong> <span class="red">SEALED</span></p>
      <hr>
      <p>최초 관측된 게이트. 외부에서 관측 가능한 내부 광원은 존재하지 않는다.</p>
      <p>27년 동안 단 한 차례도 완전히 닫힌 적이 없으며, 주기적으로 내부에서 미확인 신호가 발생한다.</p>
      <p>※ 일부 원본 기록은 협회 최고 기밀 등급에 의해 <span class="redacted">REDACTED</span> 처리됨.</p>
    `
  },
  "GATE-017": {
    kicker: "GATE RECORD / A-RANK",
    title: "GATE-017 // RED MAZE",
    content: `
      <p><strong>LOCATION:</strong> TOKYO METROPOLITAN SECTOR</p>
      <p><strong>STATUS:</strong> ACTIVE</p>
      <hr>
      <p>내부 구조가 지속적으로 변화하는 미궁형 게이트.</p>
      <p>탐사팀의 모든 기록에서 동일한 좌표가 반복적으로 발견되었다. 해당 좌표에는 출입구가 존재하지 않는다.</p>
    `
  },
  "GATE-042": {
    kicker: "GATE RECORD / S-RANK",
    title: "GATE-042 // THE SLEEPER",
    content: `
      <p><strong>LOCATION:</strong> BERLIN EXCLUSION ZONE</p>
      <p><strong>STATUS:</strong> OBSERVATION ONLY</p>
      <hr>
      <p>게이트 외벽에서 인간과 유사한 생체 신호가 관측된다.</p>
      <p>현재까지 내부 진입은 승인되지 않았다. 2068년 이후 신호의 주기가 점차 짧아지고 있다.</p>
    `
  }
};

$$(".gate-detail").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.closest(".gate-card").dataset.gate;
    const data = gateData[id];
    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalContent.innerHTML = data.content;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function openIncident() {
  modalKicker.textContent = "INCIDENT LOG / CLASSIFIED";
  modalTitle.textContent = "SECTOR-7 INCIDENT";
  modalContent.innerHTML = `
    <p><strong>DATE:</strong> 2061.11.03 / 02:17:44 UTC</p>
    <p><strong>LOCATION:</strong> ██████████</p>
    <hr>
    <p>02:17 — 통신망 전체에서 43분간의 기록 손실 발생.</p>
    <p>02:18 — 게이트 내부에서 비정상적인 인간 음성 신호 감지.</p>
    <p>02:31 — 구조팀 진입.</p>
    <p>02:34 — 모든 생체 신호 소실.</p>
    <p>03:00 — 기록 복구. 단, <span class="redacted">████████████</span>에 해당하는 데이터는 존재하지 않음.</p>
    <hr>
    <p class="red">NOTICE: 이 문서에 대한 무단 복제 및 열람은 즉시 기록됩니다.</p>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
$("#incidentBtn").addEventListener("click", openIncident);

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
$("#modalClose").addEventListener("click", closeModal);
$(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior:"smooth", block:"start" });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [{ opacity:0, transform:"translateY(24px)" }, { opacity:1, transform:"translateY(0)" }],
        { duration:650, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards" }
      );
      observer.unobserve(entry.target);
    }
  });
}, { threshold:.12 });

$$(".terminal-card,.stat,.gate-card,.hunter-card,.timeline-item").forEach(el => observer.observe(el));
