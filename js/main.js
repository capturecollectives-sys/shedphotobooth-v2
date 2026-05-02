const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const quoteForm = document.querySelector("#quote-form");
const booth = document.querySelector("[data-booth]");
const boothButton = document.querySelector("[data-start-booth]");
const boothScreen = document.querySelector(".booth-screen");
const boothUnit = document.querySelector(".booth-unit");
const demoTrigger = document.querySelector("[data-demo-trigger]");
const modeCards = document.querySelectorAll("[data-mode]");
const boothStatus = document.querySelector("[data-status]");
const boothCountdown = document.querySelector("[data-countdown]");
const boothTitle = document.querySelector("[data-screen-title]");
const boothCopy = document.querySelector("[data-screen-copy]");
const boothReadout = document.querySelector("[data-readout]");
const boothFrames = document.querySelectorAll("[data-frames] i");

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
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

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration);
});

const setBoothText = ({ status, count, title, copy, readout }) => {
  if (boothStatus && status) boothStatus.textContent = status;
  if (boothCountdown && count) boothCountdown.textContent = count;
  if (boothTitle && title) boothTitle.textContent = title;
  if (boothCopy && copy) boothCopy.textContent = copy;
  if (boothReadout && readout) boothReadout.textContent = readout;
};

const flashBooth = async () => {
  if (!booth) return;

  booth.classList.remove("is-flashing");
  void booth.offsetWidth;
  booth.classList.add("is-flashing");
  await wait(260);
  booth.classList.remove("is-flashing");
};

const runBooth = async () => {
  if (!booth || !boothButton) {
    return;
  }

  boothButton.disabled = true;
  boothButton.textContent = "Capturing...";
  booth.classList.remove("has-print");
  booth.classList.add("is-capturing");
  boothFrames.forEach((frame) => frame.classList.remove("is-filled"));

  setBoothText({
    status: "LIVE",
    count: "3",
    title: "Get ready",
    copy: "The booth is counting down. The guest screen, camera and print flow now work together.",
    readout: "Session started"
  });

  for (const count of ["3", "2", "1"]) {
    setBoothText({ count, readout: `Flash in ${count}` });
    await wait(650);
  }

  for (let index = 0; index < boothFrames.length; index += 1) {
    setBoothText({
      status: "CAPTURE",
      count: String(index + 1),
      title: `Frame ${index + 1}`,
      copy: "Flash fires, the frame lands, and the strip starts building.",
      readout: `Captured frame ${index + 1}`
    });
    await flashBooth();
    boothFrames[index].classList.add("is-filled");
    await wait(360);
  }

  setBoothText({
    status: "PRINTING",
    count: "\u2713",
    title: "Printing",
    copy: "The branded strip drops from the booth as the guest takeaway.",
    readout: "Printing strip"
  });
  boothButton.textContent = "Printing...";
  booth.classList.add("has-print");
  await wait(1700);

  setBoothText({
    status: "READY",
    count: "3",
    title: "Ready again",
    copy: "Tap start to run the booth again.",
    readout: "Ready for next guest"
  });
  booth.classList.remove("is-capturing");
  boothButton.disabled = false;
  boothButton.textContent = "Run again";
};

if (boothButton) {
  boothButton.addEventListener("click", runBooth);
}

if (demoTrigger) {
  demoTrigger.addEventListener("click", runBooth);
}

if (boothScreen) {
  boothScreen.addEventListener("click", (event) => {
    if (event.target === boothButton || boothButton?.disabled) {
      return;
    }

    runBooth();
  });
}

if (boothUnit) {
  boothUnit.addEventListener("dblclick", () => {
    if (!boothButton?.disabled) {
      runBooth();
    }
  });
}

const modeContent = {
  festival: {
    status: "FESTIVAL",
    title: "Festival mode",
    copy: "Fast guest flow, clear interaction, visible branding and a print guests can carry through the site.",
    readout: "Festival build selected"
  },
  brand: {
    status: "BRAND",
    title: "Brand mode",
    copy: "Campaign-ready exterior, branded touch screen and custom output for sponsor or activation work.",
    readout: "Brand activation selected"
  },
  wedding: {
    status: "WEDDING",
    title: "Wedding mode",
    copy: "A polished guest magnet that feels part of the room, not a hired box in the corner.",
    readout: "Wedding build selected"
  },
  party: {
    status: "PARTY",
    title: "Party mode",
    copy: "Simple to use, fast to repeat and built to become the social centre of the night.",
    readout: "Party build selected"
  }
};

modeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode;
    const content = modeContent[mode];

    modeCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");

    if (content) {
      setBoothText({
        status: content.status,
        count: "3",
        title: content.title,
        copy: content.copy,
        readout: content.readout
      });
    }
  });
});
