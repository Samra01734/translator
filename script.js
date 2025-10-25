// Select elements
const fromText = document.querySelector(".form-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector(".translate-btn");
const icons = document.querySelectorAll(".icons i");

// Populate language options from countries.js
selectTag.forEach((tag, id) => {
  for (const code in countries) {
    // Default: from = Hindi, to = English
    let selected =
      id === 0
        ? code === "hi-IN"
          ? "selected"
          : ""
        : code === "en-US"
        ? "selected"
        : "";
    let option = `<option value='${code}' ${selected}>${countries[code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Exchange text and selected languages
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// Translate text using MyMemory API
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    })
    .catch(() => {
      toText.value = "Error: Translation failed!";
    });
});

// Copy and voice functionality
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value && !toText.value) return;

    // Voice button
    if (target.classList.contains("fa-volume-up")) {
      let utterance;
      if (target.closest(".row").classList.contains("from")) {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }

    // Copy button
    else if (target.classList.contains("fa-copy")) {
      if (target.closest(".row").classList.contains("from")) {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
      alert("Copied to clipboard!");
    }
  });
});
