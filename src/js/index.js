let settings = initializeSettings();

//Initial setup
showPasswordOptions();
showPasswordStrength();

document
  .getElementById("svg-cop-pwd")
  .addEventListener("click", copyPasswordToClipboard);

document
  .getElementById("range")
  .addEventListener("change", changePasswordLength);

document
  .getElementById("btn-generate")
  .addEventListener("click", generatePassword);

document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateSettings(checkbox.name, checkbox.checked);
    showPasswordStrength();
  });
});

function initializeSettings() {
  const storedSettings = localStorage.getItem("settings");
  if (!storedSettings) {
    const settings = {
      passwordLength: 0,
      passwordStrength: 0,
      password: "",
      options: {
        upperCaseLetters: false,
        lowerCaseLetters: false,
        numbers: false,
        symbols: false,
      },
    };
    saveSettings(settings);
    return settings;
  } else {
    return JSON.parse(storedSettings);
  }
}

function showPasswordStrength() {
  let displayStrengthElem = document.querySelector(".display-strength");
  const maxLevelStrength = 4;
  let passwordStrength = settings.passwordStrength;

  displayStrengthElem.innerText = "";

  for (let i = 0; i < maxLevelStrength; i++, passwordStrength--) {
    const listItem = document.createElement("li");
    const divElem = document.createElement("div");
    divElem.setAttribute("id", "level");

    if (passwordStrength > 0) {
      divElem.setAttribute("class", "level-up");
    }

    listItem.appendChild(divElem);
    displayStrengthElem.appendChild(listItem);
  }
}

function showPasswordOptions() {
  document.getElementById("range").value = settings.passwordLength;
  document.getElementById("password-length").innerHTML =
    settings.passwordLength;
  document.getElementById("title-password").innerHTML = settings.password;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = settings.options[checkbox.name];
  });
}
function updateSettings(optionName, isChecked) {
  settings.options[optionName] = isChecked;
  settings.passwordStrength += isChecked ? 1 : -1;
  saveSettings(settings);
}
function copyPasswordToClipboard() {
  let passwordElem = document.getElementById("title-password");
  navigator.clipboard.writeText(passwordElem.innerText);
}

function changePasswordLength() {
  let passwordLength = document.getElementById("range").value;
  let displayPasswordLength = document.getElementById("password-length");

  displayPasswordLength.innerHTML = passwordLength;
  settings.passwordLength = +passwordLength;
  saveSettings(settings);
}

function showPassword(password) {
  document.getElementById("title-password").innerHTML = password;
}
function isOptionsSet() {
  const options = Object.entries(settings.options);
  return options.some((option) => option[1] === true);
}

function generatePassword() {
  if (!isOptionsSet()) {
    alert("At least one option should be set");
    return;
  }

  let basePassword = "";
  let password = "";
  let randomIndex = 0;
  let fullTemplateString = "";
  const minPasswordLength = 5;
  const upperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*_?";
  const passwordLength =
    settings.passwordLength === 0
      ? minPasswordLength
      : settings.passwordLength + minPasswordLength;

  if (settings.options.upperCaseLetters) {
    randomIndex = Math.floor(Math.random() * upperCaseAlphabet.length);
    basePassword += upperCaseAlphabet.charAt(randomIndex);
    fullTemplateString += upperCaseAlphabet;
  }
  if (settings.options.lowerCaseLetters) {
    randomIndex = Math.floor(Math.random() * lowerCaseAlphabet.length);
    basePassword += lowerCaseAlphabet.charAt(randomIndex);
    fullTemplateString += lowerCaseAlphabet;
  }
  if (settings.options.numbers) {
    randomIndex = Math.floor(Math.random() * numbers.length);
    basePassword += numbers.charAt(randomIndex);
    fullTemplateString += numbers;
  }
  if (settings.options.symbols) {
    randomIndex = Math.floor(Math.random() * symbols.length);
    basePassword += symbols.charAt(randomIndex);
    fullTemplateString += symbols;
  }

  for (let i = 0; i < passwordLength - basePassword.length; i++) {
    let randomIndex = Math.floor(Math.random() * fullTemplateString.length);
    password += fullTemplateString.charAt(randomIndex);
  }

  password += basePassword;
  settings.password = password;
  saveSettings(settings);
  showPassword(password);
}

function shufflePassword(password) {
  let charArray = password.split("");

  for (let i = charArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
  }

  return charArray.join("");
}

function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}
