import ComponentsBuilder from "./components.js";
export default class TerminalController {
  constructor() {}

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
      chat.addItem(`{bold}${userName}{/bold} ${message}`);
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
        message: "ola",
        userName: "Jeremias",
      });
      eventEmitter.emit("message:received", {
        message: "oi",
        userName: "Samuel",
      });
    }, 2000);
  }
}
