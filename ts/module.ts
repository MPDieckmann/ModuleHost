/// <reference path="modulehost.ts" />

class ExtendableModule extends EventTarget {
  public static readonly version = "2019-11-05";
  public element = document.createElement("mpc-module");
  public header = document.createElement("mpc-module-header");
  protected constructor(options: ExtendableModule.Options) {
    super();
    this.element.setAttribute("type", options.type);
    this.header.textContent = options.name;
  }
  public onfocus() { }
  public onblur() { }
  public onattach(host: ModuleHost) { }
}
declare namespace ExtendableModule {
  interface Options {
    name: string;
    type: string;
  }
}
