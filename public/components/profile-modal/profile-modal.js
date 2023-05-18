class ProfileModal extends HTMLElement {

  profileContainer;

  userName;

  unit;

  flipSwitch = function() {
    const root = document.querySelector(":root");
    root.style.setProperty("--slider-flex", getComputedStyle(root).getPropertyValue("--slider-flex") === "row-reverse" ? "row" : "row-reverse");
    root.style.setProperty("--image-transform", getComputedStyle(root).getPropertyValue("--image-transform") === "rotate(180deg)" ? "none" : "rotate(180deg)");
    this.unit.textContent = this.unit.textContent === "Metric" ? "Imperial" : "Metric";
  }

  hideModal = function() {
    this.profileContainer?.classList.add("hidden");
  }

  setState = function(username,metric) {
    this.userName.textContent=username;
    if (!metric) {
      this.unit.textContent = "Imperial"
      const root = document.querySelector(":root");
      root.style.setProperty("--slider-flex","row-reverse");
      root.style.setProperty("--image-transform","rotate(180deg)");
    }
  }

  showModal = function() {
    this.profileContainer?.classList.remove("hidden");
  }

  constructor () {
    super();

    const style = document.createElement("link");
    style.setAttribute("rel","stylesheet");
    style.setAttribute("href","/components/profile-modal/profile-modal.css");
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
    this.unit = document.createElement('p');
    this.unit.textContent = "Metric";
    const slidingSection = document.createElement("img");
    slidingSection.setAttribute("src", "/assets/arrow-right.svg");
    slidingSection.setAttribute("alt","Toggle");
    unitSlide.appendChild(slidingSection);
    unitSlide.appendChild(this.unit);
    unitSlide.onclick = () => this.flipSwitch();

    const profileBar = document.createElement("section");
    profileBar.classList.add("profile-info");
    const closeIcon = document.createElement("img");
    closeIcon.setAttribute("src", "/assets/close.svg")
    closeIcon.setAttribute("alt","Close");
    this.userName = document.createElement("p");
    const minimize = document.createElement("button");
    minimize.type="button";
    minimize.onclick = () => this.hideModal();
    minimize.appendChild(closeIcon);
    profileBar.appendChild(minimize);
    profileBar.appendChild(this.userName);

    const signOut = document.createElement("button")
    signOut.classList.add('bottom-bar');
    signOut.type = "button";
    signOut.textContent = "Sign Out";
    signOut.onclick = () => {history.pushState({},"","http://localhost:3000/logout"); history.go(0)};

    this.profileContainer.appendChild(profileBar);
    this.profileContainer.appendChild(unitLabel);
    this.profileContainer.appendChild(unitSlide);
    this.profileContainer.appendChild(signOut);
    shadow.append(style);
    shadow.appendChild(this.profileContainer);
  }
}

customElements.define('profile-modal', ProfileModal)