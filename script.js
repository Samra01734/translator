const fromText = document.querySelector(".form-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTags = document.querySelectorAll("select");
const translateBtn = document.querySelector(".translate-btn");
const icons = document.querySelectorAll(".icons i");

// Language list with code
const languages = {
  "en-GB": "English",
  "ur-PK": "Urdu (Pakistan)",
  "ro": "Roman Urdu",
  "hi-IN": "Hindi",
  "ar-SA": "Arabic",
  "fa-IR": "Persian"
};

// Fill dropdowns
selectTags.forEach((tag, id) => {
  for (let code in languages) {
    let selected =
      id === 0 && code === "en-GB"
        ? "selected"
        : id === 1 && code === "ur-PK"
        ? "selected"
        : "";
    let option = `<option value="${code}" ${selected}>${languages[code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Swap languages
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Translate function
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTags[0].value;
  let translateTo = selectTags[1].value;
  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

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

// Icon functionality (copy + voice)
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value && !toText.value) return;

    if (target.classList.contains("fa-copy")) {
      // Copy text
      if (target.closest(".row").classList.contains("from")) {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
      target.style.color = "#4c5df0";
      setTimeout(() => (target.style.color = "#8080ff"), 800);
    } else if (target.classList.contains("fa-volume-up")) {
      // Voice feature
      let utterance;
      if (target.closest(".row").classList.contains("from")) {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
