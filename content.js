let gridOverlay;

const gridStyleLink = document.createElement("link");
gridStyleLink.rel = "stylesheet";
gridStyleLink.type = "text/css";
gridStyleLink.href = chrome.runtime.getURL("gridOverlay.css");
document.head.appendChild(gridStyleLink);

let columns = 12;
let gutter = 20;
let maxWidth = 1200;
let margin = 20;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  columns = request.columns;
  gutter = request.gutter;
  maxWidth = request.maxWidth;
  margin = request.margin;

  if (request.message === "showGrid") {
    showGrid();
  } else if (request.message === "hideGrid") {
    hideGrid();
  }

  sendResponse({ message: "message received" });
});

function showGrid() {
  setGutter();
  setMaxWidth();
  setMargin();

  if (gridOverlay) {
    gridOverlay.style.display = "block";
    return;
  }
  createGrid();
}

function hideGrid() {
  if (gridOverlay) {
    gridOverlay.style.display = "none";
  }
}

const createGrid = () => {
  gridOverlay = document.createElement("div");
  gridOverlay.className = "gridify__grid-overlay";

  const columnContainer = document.createElement("div");
  columnContainer.className = "gridify__column-container";

  for (let i = 0; i < columns; i++) {
    const column = document.createElement("div");
    column.className = "gridify__column";
    columnContainer.appendChild(column);
  }

  gridOverlay.appendChild(columnContainer);
  document.body.appendChild(gridOverlay);
};

const setGutter = () => {
  document.querySelector(":root").style.setProperty("--gridify-gutter", `${gutter}px`);
};

const setMaxWidth = () => {
  document.querySelector(":root").style.setProperty("--gridify-max-width", `${maxWidth}px`);
};

const setMargin = () => {
  document.querySelector(":root").style.setProperty("--gridify-padding-x", `${margin}px`);
};


