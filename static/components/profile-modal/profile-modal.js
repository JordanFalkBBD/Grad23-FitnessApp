class ProfileModal extends HTMLElement {

  profileContainer;

  flipSwitch = function() {
    const root = document.querySelector(":root");
    root.style.setProperty("--slider-flex", getComputedStyle(root).getPropertyValue("--slider-flex") === "row-reverse" ? "row" : "row-reverse");
    root.style.setProperty("--image-transform", getComputedStyle(root).getPropertyValue("--image-transform") === "rotate(180deg)" ? "none" : "rotate(180deg)");
    this.textContent = this.textContent === "Metric" ? "Imperial" : "Metric";
  }

  hideModal = function() {
    this.profileContainer?.classList.add("hidden");
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

    const unitLabel = document.createElement("label");
    unitLabel.textContent = "Units:";
    const unitSlide = document.createElement("button");
    unitSlide.classList.add("slider");
    unitSlide.id = "unitSlider";
    unitSlide.type = "button";
    const unit = document.createElement('p');
    unit.textContent = "Metric";
    const slidingSection = document.createElement("img");
    slidingSection.setAttribute("src", "/assets/arrow-right.svg");
    slidingSection.setAttribute("alt","Slider indicator");
    unitSlide.appendChild(slidingSection);
    unitSlide.appendChild(unit);
    unitSlide.onclick = this.flipSwitch.bind(unit);

    const profileBar = document.createElement("figure");
    profileBar.classList.add("profile-info");
    const userPhoto = document.createElement("img");
    userPhoto.setAttribute("alt","Profile photo");
    const userName = document.createElement("figcaption");
    userName.textContent = '{username}';
    const minimize = document.createElement("button");
    minimize.type="button";
    minimize.textContent= "X";
    minimize.onclick = () => this.hideModal();
    profileBar.appendChild(userPhoto);
    profileBar.appendChild(userName);
    profileBar.appendChild(minimize);

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