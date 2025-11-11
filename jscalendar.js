// calendar.js — FX Habit Tracker Calendar
// Uses localStorage to persist habit data

const calendarWrapper = document.getElementById("calendarWrapper");
const habitSelector = document.getElementById("habitSelector");
const dayModal = document.getElementById("dayModal");
const dayTitle = document.getElementById("dayTitle");
const dayCompleted = document.getElementById("dayCompleted");
const dayNote = document.getElementById("dayNote");
const saveDay = document.getElementById("saveDay");
const cancelDay = document.getElementById("cancelDay");

let selectedHabit = "";
let habits = ["Morning Run", "Meditation", "No Sugar", "Study 1 Hour"];
let habitData = {}; // { habitName: { "YYYY-MM-DD": { done: bool, note: "" } } }
let selectedDate = "";

// Initialize the app
init();

function init() {
  loadData();
  populateHabitSelector();
  renderCalendar();
  setupModal();
}

// Load from localStorage
function loadData() {
  const stored = localStorage.getItem("habitData");
  if (stored) habitData = JSON.parse(stored);
  else habitData = {};
}

// Save to localStorage
function saveData() {
  localStorage.setItem("habitData", JSON.stringify(habitData));
}

// Populate dropdown
function populateHabitSelector() {
  habitSelector.innerHTML = habits.map(h => `<option value="${h}">${h}</option>`).join("");
  selectedHabit = habitSelector.value;
  habitSelector.addEventListener("change", () => {
    selectedHabit = habitSelector.value;
    renderCalendar();
  });
}

// Render current month
function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();

  // Clear previous
  calendarWrapper.innerHTML = "";

  // Month title
  const monthName = today.toLocaleString("default", { month: "long" });
  const title = document.createElement("h3");
  title.textContent = `${monthName} ${year}`;
  title.style.textAlign = "center";
  title.style.marginBottom = "10px";
  calendarWrapper.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // Blank slots before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    const blank = document.createElement("div");
    blank.className = "day-cell blank";
    grid.appendChild(blank);
  }

  // Days of month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const dateKey = formatDateKey(date);

    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    dayCell.textContent = d;

    const record = getDayRecord(selectedHabit, dateKey);
    if (record.done) dayCell.classList.add("done");
    if (record.note) dayCell.setAttribute("data-note", "📝");

    dayCell.addEventListener("click", () => openDayModal(dateKey, d));
    grid.appendChild(dayCell);
  }

  calendarWrapper.appendChild(grid);
}

// Format date as YYYY-MM-DD
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Get record safely
function getDayRecord(habit, dateKey) {
  if (!habitData[habit]) habitData[habit] = {};
  if (!habitData[habit][dateKey]) habitData[habit][dateKey] = { done: false, note: "" };
  return habitData[habit][dateKey];
}

// Modal handling
function setupModal() {
  cancelDay.addEventListener("click", () => {
    dayModal.close();
  });

  saveDay.addEventListener("click", e => {
    e.preventDefault();
    if (!selectedDate || !selectedHabit) return;

    const record = getDayRecord(selectedHabit, selectedDate);
    record.done = dayCompleted.checked;
    record.note = dayNote.value.trim();
    saveData();
    renderCalendar();
    dayModal.close();
  });
}

function openDayModal(dateKey, dayNum) {
  selectedDate = dateKey;
  const record = getDayRecord(selectedHabit, dateKey);

  dayTitle.textContent = `Day ${dayNum}`;
  dayCompleted.checked = record.done;
  dayNote.value = record.note;
  dayModal.showModal();
}