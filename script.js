// ===============================
// 🟢 Select Elements
// ===============================
const fromText = document.querySelector(".form-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector(".translate-btn");
const icons = document.querySelectorAll(".icons i");

// ===============================
// 🟢 Populate Languages from countries.js
// ===============================
selectTag.forEach((tag, id) => {
  for (const code in countries) {
    // 🟢 Default: From = Urdu, To = English
    let selected =
      id === 0
        ? code === "ur-PK"
          ? "selected"
          : ""
        : code === "en-US"
        ? "selected"
        : "";
    let option = `<option value='${code}' ${selected}>${countries[code].name} ${countries[code].flag}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// ===============================
// 🟢 Exchange Text & Language
// ===============================
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// ===============================
// 🟢 Translate Text using API
// ===============================
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  // ✅ Free MyMemory API
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

// ===============================
// 🟢 Handle Copy & Voice Buttons
// ===============================
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value && !toText.value) return;

    // 🎙️ Voice Button
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

    // 📋 Copy Button
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
