class ProfileModal extends HTMLElement {
  profileContainer;

  unit;

  userName;

  flipSwitch = function () {
    const root = document.querySelector(":root");
    root.style.setProperty(
      "--slider-flex",
      getComputedStyle(root).getPropertyValue("--slider-flex") === "row-reverse"
        ? "row"
        : "row-reverse"
    );
    root.style.setProperty(
      "--image-transform",
      getComputedStyle(root).getPropertyValue("--image-transform") ===
        "rotate(180deg)"
        ? "none"
        : "rotate(180deg)"
    );
    this.unit.textContent = this.unit.textContent === "Metric" ? "Imperial" : "Metric";
  };

  hideModal = function () {
    this.profileContainer?.classList.add("hidden");
  };

  showModal = function () {
    this.profileContainer?.classList.remove("hidden");
  };

  setState = function (username, metric) {
    this.userName.textContent = username;
    if (!metric) {
      const root = document.querySelector(":root");
      root.style.setProperty("--slider-flex", "row-reverse");
      root.style.setProperty("--image-transform", "rotate(180deg)")
      this.unit.textContent = "Imperial";
    }
    else {
      const root = document.querySelector(":root");
      root.style.setProperty("--slider-flex", "row");
      root.style.setProperty("--image-transform", "none")
      this.unit.textContent = "Metric";
    }
  }

  constructor() {
    super();

    const globalStyle = document.createElement("link");
    globalStyle.setAttribute("rel", "stylesheet");
    globalStyle.setAttribute("href", "global.css");

    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "profile-modal.css");

    const shadow = this.attachShadow({ mode: "open" });

    this.profileContainer = document.createElement("section");
    this.profileContainer.classList.add("modal-container");
    this.profileContainer.classList.add("hidden");

    const unitLabel = document.createElement("label");
    unitLabel.textContent = "Units:";
    const unitSlide = document.createElement("button");
    unitSlide.classList.add("slider");
    unitSlide.id = "unitSlider";
    unitSlide.type = "button";
    this.unit = document.createElement("p");
    this.unit.textContent = "Metric";
    const slidingSection = document.createElement("img");
    slidingSection.setAttribute("src", "arrow-right.svg");
    slidingSection.setAttribute("alt", "Slider indicator");
    unitSlide.appendChild(slidingSection);
    unitSlide.appendChild(this.unit);
    unitSlide.onclick = () => this.flipSwitch();

    const profileBar = document.createElement("article");
    profileBar.classList.add("profile-info");
    const minimize = document.createElement("img");
    minimize.setAttribute("src", "close.svg");
    minimize.setAttribute("alt", "Close");
    minimize.setAttribute("width", "1em");
    this.userName = document.createElement("p");
    this.userName.textContent = "";
    minimize.onclick = () => this.hideModal();
    profileBar.appendChild(minimize);
    profileBar.appendChild(this.userName);

    const signOut = document.createElement("button");
    signOut.classList.add("bottom-bar");
    signOut.type = "button";
    signOut.textContent = "Sign Out";
    signOut.onclick = () => {
      history.pushState({}, "", "http://localhost:3000/logout");
      history.go(0);
    };

    this.profileContainer.appendChild(profileBar);
    this.profileContainer.appendChild(unitLabel);
    this.profileContainer.appendChild(unitSlide);
    this.profileContainer.appendChild(signOut);
    shadow.append(globalStyle);
    shadow.append(style);
    shadow.appendChild(this.profileContainer);
  }
}

customElements.define("profile-modal", ProfileModal);
