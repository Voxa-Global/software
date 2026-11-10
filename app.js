const storage = window.localStorage;
const root = document.documentElement;
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function applyTheme(theme) {
  root.dataset.theme = theme === "dark" ? "dark" : "light";
}

applyTheme(storage.getItem("voxa.theme") || "light");

document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const navContent = document.querySelector("#nav-content");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navContent?.classList.toggle("is-open", !isOpen);
});

navContent?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    navContent.classList.remove("is-open");
  });
});

const profileForm = document.querySelector("#profile-form");
if (profileForm) {
  const fields = ["fullName", "email", "phone", "location", "bio"];
  const nameInput = profileForm.elements.namedItem("fullName");
  const emailInput = profileForm.elements.namedItem("email");
  const bioInput = profileForm.elements.namedItem("bio");
  const bioCount = document.querySelector("#bio-count");
  const status = document.querySelector("#profile-status");
  const avatarUpload = document.querySelector("#avatar-upload");
  const avatarImages = document.querySelectorAll("[data-profile-avatar]");

  fields.forEach((field) => {
    const input = profileForm.elements.namedItem(field);
    const savedValue = storage.getItem(`voxa.profile.${field}`);
    if (input && savedValue !== null) input.value = savedValue;
  });

  const updateSummary = () => {
    document.querySelectorAll("[data-profile-name]").forEach((element) => {
      element.textContent = nameInput.value.trim() || "Voxa Learner";
    });
    document.querySelectorAll("[data-profile-email]").forEach((element) => {
      element.textContent = emailInput.value.trim() || "learner@example.com";
    });
  };

  const updateBioCount = () => {
    if (bioCount) bioCount.textContent = String(bioInput.value.length);
  };

  nameInput.addEventListener("input", updateSummary);
  emailInput.addEventListener("input", updateSummary);
  bioInput.addEventListener("input", updateBioCount);
  updateSummary();
  updateBioCount();

  avatarUpload.addEventListener("change", () => {
    const [file] = avatarUpload.files;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      avatarUpload.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Choose an image smaller than 5 MB.");
      avatarUpload.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      avatarImages.forEach((image) => {
        image.src = reader.result;
      });
    });
    reader.addEventListener("error", () => showToast("That image could not be opened."));
    reader.readAsDataURL(file);
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach((field) => {
      const input = profileForm.elements.namedItem(field);
      storage.setItem(`voxa.profile.${field}`, input.value.trim());
    });
    updateSummary();
    status.textContent = "Your profile is saved on this device.";
    showToast("Profile details saved.");
  });
}

const settingsForm = document.querySelector("#settings-form");
if (settingsForm) {
  const themeSelect = settingsForm.elements.namedItem("theme");
  const emailUpdates = settingsForm.elements.namedItem("emailUpdates");
  const learningTips = settingsForm.elements.namedItem("learningTips");
  const languageSelect = settingsForm.elements.namedItem("language");
  const status = document.querySelector("#settings-status");

  themeSelect.value = storage.getItem("voxa.theme") || "light";
  emailUpdates.checked = storage.getItem("voxa.emailUpdates") !== "false";
  learningTips.checked = storage.getItem("voxa.learningTips") === "true";
  languageSelect.value = storage.getItem("voxa.language") || "en";

  themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    storage.setItem("voxa.theme", themeSelect.value);
    storage.setItem("voxa.emailUpdates", String(emailUpdates.checked));
    storage.setItem("voxa.learningTips", String(learningTips.checked));
    storage.setItem("voxa.language", languageSelect.value);
    status.textContent = "Your preferences are saved on this device.";
    showToast("Settings saved.");
  });
}
