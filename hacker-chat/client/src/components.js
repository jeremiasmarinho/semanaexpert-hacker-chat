import blessed from "blessed";

export default class ComponentsBuilder {
  #screen;
  #layout;
  constructor() {}

  #baseComponet() {
    return {
      border: "line",
      mouse: true,
      keys: true,
      top: 0,
      scrollboar: {
        ch: " ",
        inverse: true,
      },
      // habilita colocar cores e tags no texto
      tags: true,
    };
  }
  setScreen({ title }) {
    this.screen = blessed.screen({
      smartCSR: true,
      title,
    });
    return this;
  }
  setLayoutComponent() {}
}
