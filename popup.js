import { getUrl } from "./utils.js";

const updateGrid = document.getElementById("updateGrid");
const columnsInput = document.getElementById("gridify-columns");
const gutterInput = document.getElementById("gridify-gutter");
const maxWidthInput = document.getElementById("gridify-max-width");
const marginInput = document.getElementById("gridify-margin");
const hideGridButton = document.getElementById("hideGrid");

let columns = columnsInput.value;
let gutter = gutterInput.value;
let maxWidth = maxWidthInput.value;
let margin = marginInput.value;

window.onload = async () => {
  await loadSettings();

  showGrid();
};

updateGrid.addEventListener("click", () => {
  columns = columnsInput.value;
  gutter = gutterInput.value;
  maxWidth = maxWidthInput.value;
  showGrid();

  //   window.close();
});

columnsInput.addEventListener("input", () => {
  columns = columnsInput.value;
  showGrid();
});

gutterInput.addEventListener("input", () => {
  gutter = gutterInput.value;
  showGrid();
});

maxWidthInput.addEventListener("input", () => {
  maxWidth = maxWidthInput.value;
  showGrid();
});

marginInput.addEventListener("input", () => {
  margin = marginInput.value;
  showGrid();
});

hideGridButton.addEventListener("click", () => {
  hideGrid();
});

const showGrid = () => {
  updateSettings();

  const props = {
    columns,
    gutter,
    maxWidth,
    margin,
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "showGrid", ...props }, function (response) {
      console.log(response);
    });
  });
};

const hideGrid = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "hideGrid" }, function (response) {
      console.log(response);
    });
  });
};

const updateSettings = async () => {
  // website specific settings
  const url = await getUrl();
  const hostname = url.hostname;

  // get the settings for the current website
  let settings = localStorage.getItem(hostname);
  settings = settings ? JSON.parse(settings) : {};

  // update the settings
  settings = {
    ...settings,
    columns,
    gutter,
    maxWidth,
    margin,
  };

  // save the settings back to local storage
  localStorage.setItem(hostname, JSON.stringify(settings));
};

const loadSettings = async () => {
  const url = await getUrl();
  const hostname = url.hostname;

  // get the settings for the current website
  let settings = localStorage.getItem(hostname);
  settings = settings ? JSON.parse(settings) : {};

  // update the inputs
  columnsInput.value = settings.columns || 12;
  gutterInput.value = settings.gutter || 20;
  maxWidthInput.value = settings.maxWidth || 1200;
  marginInput.value = settings.margin || 20;

  // update the global variables
  columns = settings.columns || 12;
  gutter = settings.gutter || 20;
  maxWidth = settings.maxWidth || 1200;
  margin = settings.margin || 20;
};

// const getUrl = async () => {
//   let url;

//   url = await new Promise((resolve, reject) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       resolve(new URL(tabs[0].url));
//     });
//   });
//   return url;
// };
