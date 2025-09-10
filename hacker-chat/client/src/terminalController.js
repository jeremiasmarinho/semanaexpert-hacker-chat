import ComponentsBuilder from "./components.js";
export default class TerminalController {
  #userCollors = new Map();
  constructor() {}

  #pickCollor() {
    return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
  }

  #getUserColor(userName) {
    if (this.#userCollors.has(userName)) return this.#userCollors.get(userName);
    const collor = this.#pickCollor();
    this.#userCollors.set(userName, collor);
    return collor;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message);
      this.clearValue();
    };
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const collor = this.#getUserColor(userName);
      chat.addItem(`{${collor}}{bold}${userName}{/bold} ${message}`);
      screen.render();
    };
  }
  #registerEvents(eventEmitter, components) {
    eventEmitter.on("message:received", this.#onMessageReceived(components));
  }

  initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "Hacker Chat - Samuel Marinho" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .build();

    this.#registerEvents(eventEmitter, components);
    components.input.focus();
    components.screen.render();

    setInterval(() => {
      eventEmitter.emit("message:received", {
        userName: "Samuel",
        message: "Hello World",
      });
      eventEmitter.emit("message:received", {
        userName: "Maria",
        message: "Hello World",
      });
    }, 1000);
  }
}
