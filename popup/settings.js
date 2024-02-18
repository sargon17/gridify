// load getUrl function into settings.js
import { urlConcat } from "./../utils.js";

const measureSelector = document.getElementById("gridify-measure");

const selectorPX = document.getElementById("measure-selector-px");
const selectorREM = document.getElementById("measure-selector-rem");
const selectorVW = document.getElementById("measure-selector-vw");

const selectableMeasure = document.querySelectorAll(".selectable-measure");

const selectorButtons = [selectorPX, selectorREM, selectorVW];

let localStorageDirectory = "default-measures";

const setCurrentSelected = (measure) => {
  selectorButtons.forEach((selector) => {
    selector.classList.remove("active");
    if (selector.dataset.measure === measure) {
      selector.classList.add("active");
    }
  });
};

const setUIMeasure = (measure) => {
  selectableMeasure.forEach((selectable) => {
    selectable.textContent = measure;
  });
};

const sendMeasure = (measure) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "updateMeasure", measure: measure }, function (response) {
      console.log(response.message);

      if (response.message === "message received") {
        console.log("Measure updated");
      } else {
        console.log("Measure not updated");
      }
    });
  });
};

measureSelector.onchange = async () => {
  setCurrentSelected(measureSelector.value);
  setUIMeasure(measureSelector.value);
  sendMeasure(measureSelector.value);

  const directory = await urlConcat(localStorageDirectory);

  localStorage.setItem(directory, JSON.stringify({ measure: measureSelector.value }));
};

const loadLocalSettings = async () => {
  const directory = await urlConcat(localStorageDirectory);

  // get the settings for the current website
  let measureSettings = localStorage.getItem(directory);

  measureSettings = measureSettings ? JSON.parse(measureSettings) : {};

  if (!measureSettings.measure) {
    // if no measure is set, default to px
    measureSettings.measure = "px";
    localStorage.setItem(directory, JSON.stringify(measureSettings));
  }

  setCurrentSelected(measureSettings.measure);
  setUIMeasure(measureSettings.measure);
  sendMeasure(measureSettings.measure);
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadLocalSettings();
});

// handle click event for each selector
selectorButtons.forEach((selector) => {
  selector.addEventListener("click", () => {
    measureSelector.value = selector.dataset.measure;
    measureSelector.dispatchEvent(new Event("change"));
  });
});
