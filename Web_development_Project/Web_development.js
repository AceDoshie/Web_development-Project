// === Smooth Scroll to a Specific Section ===
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// === Gear Carousel Setup ===
const gearItems = [
  { name: "Running Shoes", image: "Nike.png", link: "https://www.example.com/running-shoes" },
  { name: "Wetsuits", image: "athlete.png", link: "https://www.example.com/wetsuits" },
  { name: "Hydration Packs", image: "addias.png", link: "https://www.example.com/hydration-packs" },
  { name: "Cycling Helmets", image: "Under_Armour.png", link: "https://www.example.com/cycling-helmets" },
  { name: "Smartwatches", image: "Puma.png", link: "https://www.example.com/smartwatches" }
];

let currentGearIndex = 0;

function updateGearDisplay() {
  const gear = gearItems[currentGearIndex];
  const gearDisplay = document.getElementById("gearDisplay");
  const gearLink = document.getElementById("gearLink");
  const gearImage = document.getElementById("gearImage");

  gearDisplay.textContent = gear.name;
  gearLink.href = gear.link;
  gearImage.style.opacity = 0;
  gearImage.style.transition = "transform 0.6s ease, opacity 0.3s ease";

  setTimeout(() => {
    gearImage.src = gear.image;
    gearImage.style.transform = "rotateY(0deg)";
    gearImage.style.opacity = 1;
  }, 300);
}

function nextGear() {
  currentGearIndex = (currentGearIndex + 1) % gearItems.length;
  updateGearDisplay();
}

function prevGear() {
  currentGearIndex = (currentGearIndex - 1 + gearItems.length) % gearItems.length;
  updateGearDisplay();
}

function showSubscribeConfirmation(message) {
  const confirmation = document.getElementById("subscribe-confirmation");
  if (!confirmation) return;
  confirmation.textContent = message;
  confirmation.style.display = "block";
  confirmation.style.opacity = 1;
  setTimeout(() => {
    confirmation.style.opacity = 0;
    setTimeout(() => confirmation.style.display = "none", 400);
  }, 3000);
}

// === DOMContentLoaded Logic ===
document.addEventListener("DOMContentLoaded", () => {
  updateGearDisplay();

  // Forum Post with Login Check
  const postButton = document.querySelector(".forum button");
  const textarea = document.querySelector(".forum textarea");
  const commentList = document.querySelector(".forum .comment-list");

  if (postButton && textarea && commentList) {
    postButton.addEventListener("click", () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const account = JSON.parse(localStorage.getItem("account"));

      if (!isLoggedIn || !account) {
        alert("Please log in before posting.");
        window.location.href = "login.html";
        return;
      }

      const content = textarea.value.trim();
      if (!content) {
        alert("Please write something before posting.");
        return;
      }

      const username = account.username || "Anonymous";
      const commentEntry = document.createElement("p");
      commentEntry.textContent = `${username}: ${content}`;
      commentEntry.style.transition = "opacity 0.3s ease-in";
      commentEntry.style.opacity = 0;

      commentList.prepend(commentEntry);
      setTimeout(() => {
        commentEntry.style.opacity = 1;
      }, 50);

      while (commentList.children.length > 5) {
        commentList.removeChild(commentList.lastChild);
      }

      textarea.value = "";
    });
  }

  // Subscribe Toggle Button Logic
  const subscribeLink = document.getElementById("subscribe-link");
  if (subscribeLink) {
    function updateSubscribeText() {
      const account = JSON.parse(localStorage.getItem("account"));
      const subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
      if (account && subscribers.includes(account.email)) {
        subscribeLink.textContent = "Unsubscribe";
      } else {
        subscribeLink.textContent = "Subscribe to Weekly Challenges";
      }
    }

    subscribeLink.addEventListener("click", (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const account = JSON.parse(localStorage.getItem("account"));
      let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];

      if (!isLoggedIn || !account || !account.email) {
        alert("You must be logged in to manage your subscription.");
        return;
      }

      const email = account.email;
      if (subscribers.includes(email)) {
        // Unsubscribe
        subscribers = subscribers.filter(e => e !== email);
        localStorage.setItem("subscribers", JSON.stringify(subscribers));
        showSubscribeConfirmation("❌ You have unsubscribed from weekly challenges.");
      } 
      else {
  subscribers.push(email);
  localStorage.setItem("subscribers", JSON.stringify(subscribers));

  const timestamps = JSON.parse(localStorage.getItem("subscriptionTimestamps")) || {};
  timestamps[email] = new Date().toLocaleString();
  localStorage.setItem("subscriptionTimestamps", JSON.stringify(timestamps));

  showSubscribeConfirmation("✅ You're subscribed to weekly challenges!");
}

      updateSubscribeText();
    });

    updateSubscribeText();
  }

  // Login / Logout Toggle
  const loginLogoutLink = document.getElementById("logoutLink");
  if (loginLogoutLink) {
    function updateLoginLogoutText() {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      loginLogoutLink.textContent = isLoggedIn ? "Logout" : "Login";
    }

    updateLoginLogoutText();

    loginLogoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        localStorage.removeItem("isLoggedIn");
        alert("Logged out successfully.");
        updateLoginLogoutText();
      } else {
        window.location.href = "login.html";
      }
    });
  }
});
