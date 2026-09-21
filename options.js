const DEFAULTS = {
  textColor: "#ed8515",
  backgroundColor: "#3b3a3a"
};

const THEMES = [
  { name: "Sunset (default)", textColor: "#ed8515", backgroundColor: "#3b3a3a" },
  { name: "Ocean Blue", textColor: "#4fc3f7", backgroundColor: "#1c2b36" },
  { name: "Forest Green", textColor: "#7ed957", backgroundColor: "#1e2b1e" },
  { name: "Classic Purple", textColor: "#c792ea", backgroundColor: "#2b213b" },
  { name: "Crimson", textColor: "#ff6b6b", backgroundColor: "#2b1a1a" },
  { name: "High Contrast", textColor: "#ffffff", backgroundColor: "#000000" },
  { name: "Solarized", textColor: "#b58900", backgroundColor: "#002b36" },
  { name: "Light Mode", textColor: "#c7254e", backgroundColor: "#f9f2f4" }
];

const textColorInput = document.getElementById("text-color");
const textColorHex = document.getElementById("text-color-hex");
const bgColorInput = document.getElementById("bg-color");
const bgColorHex = document.getElementById("bg-color-hex");
const previewCode = document.getElementById("preview-code");
const themeGrid = document.getElementById("theme-grid");
const resetBtn = document.getElementById("reset-btn");
const saveStatus = document.getElementById("save-status");

let saveTimeout = null;
let statusTimeout = null;

function isValidHex(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

function updatePreview(textColor, backgroundColor) {
  previewCode.style.color = textColor;
  previewCode.style.backgroundColor = backgroundColor;
}

function setInputs(textColor, backgroundColor) {
  textColorInput.value = textColor;
  textColorHex.value = textColor;
  bgColorInput.value = backgroundColor;
  bgColorHex.value = backgroundColor;
  updatePreview(textColor, backgroundColor);
  highlightMatchingTheme(textColor, backgroundColor);
}

function highlightMatchingTheme(textColor, backgroundColor) {
  const swatches = themeGrid.querySelectorAll(".theme-swatch");
  swatches.forEach((el) => {
    const match =
      el.dataset.textColor.toLowerCase() === textColor.toLowerCase() &&
      el.dataset.backgroundColor.toLowerCase() === backgroundColor.toLowerCase();
    el.classList.toggle("selected", match);
  });
}

function showSavedStatus() {
  saveStatus.textContent = "Saved";
  saveStatus.classList.add("visible");
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    saveStatus.classList.remove("visible");
  }, 1200);
}

function persist(textColor, backgroundColor) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.sync.set({ textColor, backgroundColor }, showSavedStatus);
  }, 150);
}

function applyAndSave(textColor, backgroundColor) {
  setInputs(textColor, backgroundColor);
  persist(textColor, backgroundColor);
}

function renderThemes() {
  themeGrid.innerHTML = "";
  THEMES.forEach((theme) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-swatch";
    btn.dataset.textColor = theme.textColor;
    btn.dataset.backgroundColor = theme.backgroundColor;
    btn.innerHTML = `
      <span class="swatch-preview" style="background:${theme.backgroundColor}; color:${theme.textColor};">code</span>
      <span>${theme.name}</span>
    `;
    btn.addEventListener("click", () => {
      applyAndSave(theme.textColor, theme.backgroundColor);
    });
    themeGrid.appendChild(btn);
  });
}

textColorInput.addEventListener("input", () => {
  applyAndSave(textColorInput.value, bgColorInput.value);
});

bgColorInput.addEventListener("input", () => {
  applyAndSave(textColorInput.value, bgColorInput.value);
});

textColorHex.addEventListener("change", () => {
  const value = textColorHex.value.trim();
  if (isValidHex(value)) {
    applyAndSave(value, bgColorInput.value);
  } else {
    textColorHex.value = textColorInput.value;
  }
});

bgColorHex.addEventListener("change", () => {
  const value = bgColorHex.value.trim();
  if (isValidHex(value)) {
    applyAndSave(textColorInput.value, value);
  } else {
    bgColorHex.value = bgColorInput.value;
  }
});

resetBtn.addEventListener("click", () => {
  applyAndSave(DEFAULTS.textColor, DEFAULTS.backgroundColor);
});

renderThemes();

chrome.storage.sync.get(DEFAULTS, (settings) => {
  setInputs(settings.textColor, settings.backgroundColor);
});
