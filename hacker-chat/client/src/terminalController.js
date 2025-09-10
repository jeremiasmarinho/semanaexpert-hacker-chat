import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

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
  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      const [userName] = msg.split(/\s/);
      const collor = this.#getUserColor(userName);
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/bold}`);
      screen.render();
    };
  }
  #onStatusChanged({ screen, status }) {
    return (users) => {
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);

      users.forEach((userName) => {
        const collor = this.#getUserColor(userName);
        status.addItem(`{${collor}}{bold}${userName}{/bold}`);
      });
      screen.render();
    };
  }
  #registerEvents(eventEmitter, components) {
    eventEmitter.on(
      constants.events.app.MESSAGE_RECEIVED,
      this.#onMessageReceived(components)
    );
    eventEmitter.on(
      constants.events.app.ACTIVITYLOG_UPDATED,
      this.#onLogChanged(components)
    );
    eventEmitter.on(
      constants.events.app.STATUS_UPDATED,
      this.#onStatusChanged(components)
    );
  }

  initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "Hacker Chat - Samuel Marinho" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setStatusComponent()
      .setActivityLogComponent()
      .build();

    this.#registerEvents(eventEmitter, components);
    components.input.focus();
    components.screen.render();

    setInterval(() => {
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "Samuel join");
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "Maria join");
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "João join");
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "Samuel left");
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "Maria left");
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, "João left");
    }, 1000);
  }
}
