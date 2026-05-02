const header = document.querySelector("[data-header]");
const quoteForm = document.querySelector(".quote-form");
const booth = document.querySelector("[data-booth]");
const boothButton = document.querySelector("[data-start-booth]");
const screenTitle = document.querySelector("[data-screen-title]");
const screenCopy = document.querySelector("[data-screen-copy]");
const frames = document.querySelectorAll("[data-frames] span");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration);
});

const flash = async () => {
  booth.classList.remove("is-flashing");
  void booth.offsetWidth;
  booth.classList.add("is-flashing");
  await wait(240);
  booth.classList.remove("is-flashing");
};

const setScreen = (title, copy) => {
  if (screenTitle) screenTitle.textContent = title;
  if (screenCopy) screenCopy.textContent = copy;
};

const runBooth = async () => {
  if (!booth || !boothButton) return;

  boothButton.disabled = true;
  boothButton.textContent = "Capturing...";
  booth.classList.remove("has-print");
  frames.forEach((frame) => frame.classList.remove("is-filled"));

  setScreen("Get ready", "Three quick frames, one branded print.");
  await wait(500);

  for (let index = 0; index < frames.length; index += 1) {
    setScreen(`Frame ${index + 1}`, "Flash, capture and build the print strip.");
    await flash();
    frames[index].classList.add("is-filled");
    await wait(300);
  }

  setScreen("Printing", "The custom strip drops from the booth.");
  boothButton.textContent = "Printing...";
  booth.classList.add("has-print");
  await wait(1500);

  setScreen("Ready again", "Tap to run the booth demo.");
  boothButton.disabled = false;
  boothButton.textContent = "Run again";
};

if (boothButton) {
  boothButton.addEventListener("click", runBooth);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const eventType = formData.get("eventType");
    const brief = formData.get("brief");
    const subject = encodeURIComponent(`Shed Photobooth enquiry - ${eventType || "Event"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent type: ${eventType}\n\nBrief:\n${brief}`
    );

    window.location.href = `mailto:hello@shedphotobooth.com?subject=${subject}&body=${body}`;
  });
}
