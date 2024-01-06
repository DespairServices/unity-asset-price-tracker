import { colorGray, colorGreen, colorRed, colorWhite, colorYellow } from "./colors";

// Event Listeners
$("#enable").on("click", function() {
  const newValue = !JSON.parse($(this).val() + "");
  setChromeStorageValue("enable", newValue, updateValue, updateColor);
});
$("#mode").on("click", function() {
  const newValue = $(this).val() === "dark" ? "light" : "dark";
  setChromeStorageValue("mode", newValue, updateValue, updateMode);
});
$("#priceColor").on("change", function () {
  setChromeStorageValue("priceColor", $(this).val(), updateValue);
});
$("#gapColor").on("change", function() {
  setChromeStorageValue("gapColor", $(this).val(), updateValue);
});
$("#minimumColor").on("change", function() {
  setChromeStorageValue("minimumColor", $(this).val(), updateValue);
});
$("#intermediateColor").on("change", function() {
  setChromeStorageValue("intermediateColor", $(this).val(), updateValue);
});
$("#maximumColor").on("change", function() {
  setChromeStorageValue("maximumColor", $(this).val(), updateValue);
});
$("#reset").on("click", function() {
  setChromeStorageValue("enable", true, updateValue, updateColor);
  setChromeStorageValue("mode", "dark", updateValue, updateMode);
  setChromeStorageValue("priceColor", colorWhite, updateValue);
  setChromeStorageValue("gapColor", colorGray, updateValue);
  setChromeStorageValue("minimumColor", colorGreen, updateValue);
  setChromeStorageValue("intermediateColor", colorYellow, updateValue);
  setChromeStorageValue("maximumColor", colorRed, updateValue);
});
$("#website").on("click", function() {
  console.log("YES")
  chrome.tabs.create({
    url: "https://www.despair.services"
  });
});

// Functions
function updateValue(key: any, value: any) { 
  $("#" + key).val(value);
};

function updateColor(key: any, value: any) { 
  let color = value ? colorGreen : colorRed;
  $("#" + key + " svg").attr("fill", color);
};

function updateMode(_key: any, value: any) {
  $("html").attr("data-bs-theme", value);
  const isDark = value === "dark";
  $("#light").toggle(!isDark);
  $("#dark").toggle(isDark);
};

function validateValue(key: any, value: any, result: any): boolean {
  return typeof result[key] === typeof value;
};

function validateColor(key: any, value: any, result: any): boolean {
  return validateValue(key, value, result) && CSS.supports("color", value);
};

function validateMode(key: any, value: any, result: any): boolean {
  return validateValue(key, value, result) && (value === "dark" || value === "light");
};

function getChromeStorageValue(key: any, callback: (result: any) => void) {
  chrome.storage.sync.get([key]).then(result => callback(result));
};

function setChromeStorageValue(key: any, value: any, ...callbacks: ((key: any, value : any) => void)[]) {
  chrome.storage.sync.set({ [key]: value });
  callbacks.forEach(function (callback) { 
    callback(key, value);
  });
};

function initChromeStorageValue(key: any, value: any, validate: (key: any, value : any, result: any) => boolean, ...callbacks: ((key: any, value : any) => void)[]) {
  getChromeStorageValue(key, (result) => {
    const storedValue = validate(key, value, result) ? result[key] : value;
    setChromeStorageValue(key, storedValue, ...callbacks);
  });
};

function init() {
  initChromeStorageValue("enable", true, validateValue, updateValue, updateColor);
  initChromeStorageValue("mode", "dark", validateMode, updateValue, updateMode);
  initChromeStorageValue("priceColor", colorWhite, validateColor, updateValue);
  initChromeStorageValue("gapColor", colorGray, validateColor, updateValue);
  initChromeStorageValue("minimumColor", colorGreen, validateColor, updateValue);
  initChromeStorageValue("intermediateColor", colorYellow, validateColor, updateValue);
  initChromeStorageValue("maximumColor", colorRed, validateColor, updateValue);
};

// Entry Point
const entryPoint = () => {
  init();
};
entryPoint();
