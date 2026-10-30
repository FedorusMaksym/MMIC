const KEY = "newsletterSignup";
const TTL_MS = 60 * 60 * 1000; // how long to keep the data (1 hour)

const form = document.querySelector(".newletter__form");
const nameInput = form.querySelector('input[type="text"]');
const emailInput = form.querySelector('input[type="email"]');

// Get saved data, delete it if too old
function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(KEY);
      console.log("Data expired and was deleted.");
      return null;
    }
    return data;
  } catch (err) {
    console.error("Storage error:", err);
    return null;
  }
}

// When the page opens, show saved data and fill the inputs
const saved = loadData();
if (saved) {
  console.log("Loaded:", saved);
  nameInput.value = saved.name;
  emailInput.value = saved.email;
}

// When the form is sent, save the data
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    expiresAt: Date.now() + TTL_MS, // when to forget it
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    console.log("Saved:", data);
  } catch (err) {
    console.error("Could not save:", err);
  }

  // Delete it after the time is up
  setTimeout(loadData, TTL_MS + 100);
});
