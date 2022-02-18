const MAX_LETTERS = 5;

class WordleWord extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.word = " ".repeat(MAX_LETTERS);
  }

  static get styles() {
    return /* css */`
      :host {
        --size-letter: 50px;

        position: relative;
      }

      .container {
        display: flex;
      }

      .letter {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: var(--size-letter);
        height: var(--size-letter);
        border: 2px solid #404040;
        padding: 5px;
        margin: 2px;
        font-size: 2rem;
        text-transform: uppercase;
      }

      .letter.pop {
        animation: pop 0.25s ease-in-out 1 forwards;
      }

      @keyframes pop {
        0, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }

      .rae {
        position: absolute;
        font-size: 2rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        right: -42px;
        top: 10px;
        transition:
          transform 0.5s,
          opacity 0.5s;
        opacity: 0;
      }

      .rae.visible {
        opacity: 1;
      }

      .rae:hover {
        transform: translateY(-4px);
      }

      :host(.sended) .letter {
        background: var(--used-color);
        border-color: var(--used-color);
        transform: scaleY(0);
        transition: background-color 1s ease;
      }

      .container .letter.exist {
        background-color: var(--exist-color);
        border-color: var(--exist-color);
      }

      .container .letter.exact {
        background-color: var(--exact-color);
        border-color: var(--exact-color);
      }

      /* Spin Animations */

      :host(.sended) .letter {
        animation: spin 0.25s ease-out 1 forwards var(--delay);
      }

      :host(.sended) .letter:nth-child(1) { --delay: 0s; }
      :host(.sended) .letter:nth-child(2) { --delay: 0.2s; }
      :host(.sended) .letter:nth-child(3) { --delay: 0.4s; }
      :host(.sended) .letter:nth-child(4) { --delay: 0.6s; }
      :host(.sended) .letter:nth-child(5) { --delay: 0.8s; }

      @keyframes spin {
        0% { transform: scaleY(0); }
        100% { transform: scaleY(1); }
      }
    `;
  }

  toString() {
    return this.word.replace(/ /g, "");
  }

  isSolved() {
    const letters = Array.from(this.shadowRoot.querySelectorAll(".letter"));
    return letters.every(letter => letter.classList.contains("exact"));
  }

  connectedCallback() {
    this.render();
  }

  isEmpty() {
    return this.word.includes(" ");
  }

  addLetter(letter) {
    const index = this.toString().length;
    const word = this.toString() + letter;
    this.word = word.padEnd(MAX_LETTERS, " ");
    this.render();
    const box = this.shadowRoot.querySelectorAll(".letter")[index];
    box.classList.add("pop");
  }

  removeLetter() {
    const word = this.toString().slice(0, -1);
    this.word = word.padEnd(MAX_LETTERS, " ");
    this.render();
  }

  setExactLetter(index) {
    const letters = this.shadowRoot.querySelectorAll(".letter");
    letters[index].classList.add("exact");
  }

  setExistLetter(index) {
    const letters = this.shadowRoot.querySelectorAll(".letter");
    letters[index].classList.add("exist");
  }

  setRAELink(word) {
    const link = document.createElement("a");
    link.href = `https://dle.rae.es/${word}`;
    link.classList.add("rae");
    link.textContent = "📕";
    this.shadowRoot.appendChild(link);
    setTimeout(() => link.classList.add("visible"), 1000);
  }

  getTemplateLetters() {
    return this.word
      .split("")
      .map(letter => `<div class="letter">${letter}</div>`)
      .join("");
  }

  getStats() {
    const isSended = this.classList.contains("sended");
    const letters = Array.from(this.shadowRoot.querySelectorAll(".letter"));
    const translate = letter =>
      letter.classList.contains("exact")
        ? "🟩"
        : letter.classList.contains("exist")
          ? "🟨"
          : "⬛";

    return isSended ? letters.map(letter => translate(letter)).join("") : "";
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${WordleWord.styles}</style>
    <div class="container">
      ${this.getTemplateLetters()}
    </div>`;
  }
}

customElements.define("wordle-word", WordleWord);
