class WordleSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
      }

      .container {
        border: 2px solid #555;
        width: 400px;
        background: #000000f3;
        margin: auto;
        padding: 5em 3em;
        color: #fff;
        text-align: center;
        box-shadow: 5px 5px 15px #000;
        position: relative;
      }

      strong {
        color: #ebe716;
      }

      h2 {
        font-size: 2rem;
        margin: 0 1em 1.5em 1em;
        color: var(--exact-color);
      }

      h3 {
        margin-bottom: 0;
      }

      p {
        font-size: 1.25rem;
      }

      .link {
        margin: 0;
      }

      .link a {
        font-size: 1rem;
        color: #855aca;
      }

      hr {
        border: 0;
        border-bottom: 1px solid #222;
        margin: 2em 1em;
      }

      .text-to-select span {
        font-family: monospace;
      }

      button.select {
        background: #117f0f;
        color: #fff;
        border: 0;
        padding: 15px 35px;
        margin-top: 3em;
        font-family: Montserrat, sans-serif;
        box-shadow: 0 0 4px 1px #37d034;
        cursor: pointer;
      }

      button.close {
        background: transparent;
        border: 0;
        color: #777;
        font-family: Montserrat, sans-serif;
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
      }
    `;
  }

  get status() {
    return this.winner ? "GANASTE" : "PERDISTE";
  }

  get message() {
    return this.winner ? "¡Enhorabuena! Has ganado la partida." : "Lo sentimos, has perdido la partida.";
  }

  setWinner(winner) {
    this.winner = winner;

    if (!winner) {
      this.style.setProperty("--exact-color", "#a81c1c");
    }
  }

  setSecretWord(secretWord) {
    this.secretWord = secretWord;
  }

  setStats(words) {
    this.words = Array.from(words);
  }

  getStats() {
    return this.words.map((word, index) => `\n<span>(${index})</span> ` + word.getStats() + "<br>").join("");
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector(".select").addEventListener("click", () => this.onCopy());
    this.shadowRoot.querySelector(".close").addEventListener("click", () => this.onClose());
  }

  onClose() {
    this.remove();
  }

  onCopy() {
    const textToSelect = this.shadowRoot.querySelector(".text-to-select");

    if (getSelection) {
      const range = document.createRange();
      range.selectNode(textToSelect);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    }

    navigator.clipboard.writeText(textToSelect.textContent)
      .then(clipText => {
        const button = this.shadowRoot.querySelector("button.select");
        button.textContent = "¡Copiado!";
        button.disabled = true;
      });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${WordleSummary.styles}</style>
    <div class="container">
      <h2>¡${this.status}!</h2>
      <p>${this.message}</p>
      <p>La palabra era <strong>${this.secretWord}</strong>.</p>
      <hr>
      <div class="text-to-select">
        <h3>WORDLE MANZDEV ${this.winner ? ":)" : ":("}</h3>
        <p class="link"><a href="https://wordle.manz.dev/">wordle.manz.dev</a></p>
        <p>Tu partida:</p>

        ${this.getStats()}
      </div>
      <button class="select">Select & Copy</button>
      <button class="close">X</button>
    </div>`;
  }
}

customElements.define("wordle-summary", WordleSummary);
