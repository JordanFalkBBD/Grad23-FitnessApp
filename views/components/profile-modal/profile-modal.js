class ProfileModal extends HTMLElement {
  profileModal;

  profileContainer;

  shroud;

  unit;

  userName;

  initialState;

  currentState;
  
  saveButton;

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
    this.currentState = !this.currentState;
    this.unit.textContent = this.currentState ? "Metric" : "Imperial";
    this.saveButton.disabled = this.currentState === this.initialState;
  };

  hideModal = function () {
    this.profileContainer?.classList.add("hidden");
    this.shroud.classList.add("hidden");
    this.profileModal.classList.add("hidden");
  };

  showModal = function () {
    this.profileContainer?.classList.remove("hidden");
    this.shroud.classList.remove("hidden");
    this.profileModal.classList.remove("hidden");
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
    this.initialState = !!metric;
    this.currentState = !!metric;
  }

  constructor() {
    super();

    this.profileModal = document.createElement("section");
    this.profileModal.classList.add("hidden");
    this.profileModal.classList.add("modal-parent");

    const globalStyle = document.createElement("link");
    globalStyle.setAttribute("rel", "stylesheet");
    globalStyle.setAttribute("href", "global.css");

    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "profile-modal.css");

    const shadow = this.attachShadow({ mode: "open" });

    this.profileContainer = document.createElement("article");
    this.profileContainer.classList.add("modal-container");
    this.profileContainer.classList.add("hidden");

    this.shroud = document.createElement("aside");
    this.shroud.classList.add("hidden");
    this.shroud.classList.add("shroud");
    this.shroud.onclick = () => this.hideModal();

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

    this.saveButton = document.createElement("button");
    this.saveButton.type = "button";
    this.saveButton.onclick = async () => await fetch(`/users/update/${this.currentState}/${this.userName.textContent}`, {method: "POST"});
    this.saveButton.classList.add("save-button")
    this.saveButton.textContent = "Save";
    this.saveButton.disabled = true;

    const profileBar = document.createElement("article");
    profileBar.classList.add("profile-info");
    const close = document.createElement("img");
    close.setAttribute("src", "close.svg");
    close.setAttribute("alt", "Close");
    const minimize = document.createElement("button");
    minimize.type = "button";
    this.userName = document.createElement("p");
    this.userName.textContent = "";
    minimize.onclick = () => this.hideModal();
    minimize.appendChild(close);
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
    this.profileContainer.appendChild(this.saveButton);
    this.profileContainer.appendChild(signOut);
    this.profileModal.appendChild(this.shroud);
    this.profileModal.appendChild(this.profileContainer);
    shadow.append(globalStyle);
    shadow.append(style);
    shadow.appendChild(this.profileModal);
  }
}

customElements.define("profile-modal", ProfileModal);
