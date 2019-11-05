/// <reference path="module.ts" />

class ModuleHost {
  public static readonly version = "2019-11-05";
  public element = document.createElement("mpc-module-host");
  public constructor(options: ModuleHost.Options) {
    var viewModeToggle = document.createElement("button");
    viewModeToggle.textContent = "splitscreen";
    viewModeToggle.id = "view-mode-toggle";
    var viewModes: ModuleHost.ViewMode[] = ["fullscreen", "splitscreen"];
    viewModeToggle.addEventListener("click", event => {
      let i = viewModes.indexOf(this.viewMode);
      if (i + 1 >= viewModes.length) {
        i = 0;
      } else {
        i++;
      }
      this.viewMode = viewModes[i];
      viewModeToggle.textContent = this.viewMode;
    });
    this.viewMode = "splitscreen";

    this.$header.appendChild(viewModeToggle);
    this.$header.addEventListener("click", event => {
      let target = <HTMLElement>event.target;
      while (target && target.tagName.toLowerCase() != "mpc-module-header") {
        target = target.parentElement
      }
      let module = this.$moduleHeaderMap.get(target);
      if (module && this.$activeModule !== module) {
        if (this.$activeModule) {
          this.$activeModule.onblur();
          this.$activeModule.header.removeAttribute("active");
          this.$activeModule.element.removeAttribute("active");
        }
        this.$activeModule = module;
        this.$activeModule.onfocus();
        this.$activeModule.header.setAttribute("active", "");
        this.$activeModule.element.setAttribute("active", "");
      }
    });

    this.$header.appendChild(this.$moduleHeaders);
    this.element.appendChild(this.$header);

    this.attachModule(options.main);
    options.main.element.setAttribute("main", "");
    options.main.header.setAttribute("main", "");
    
    options.modules.forEach(this.attachModule, this);
  }

  private _viewMode: ModuleHost.ViewMode;
  public get viewMode(): ModuleHost.ViewMode {
    return this._viewMode;
  }
  public set viewMode(value: ModuleHost.ViewMode) {
    if (
      value == "fullscreen" ||
      value == "splitscreen"
    ) {
      this._viewMode = value;
      this.element.setAttribute("view-mode", value);
    }
  }

  protected $header = document.createElement("mpc-module-host-header");
  protected $moduleHeaders = document.createElement("mpc-module-host-module-headers");
  protected $activeModule: ExtendableModule = null;
  public attachModule(module: ExtendableModule) {
    this.$moduleHeaders.appendChild(module.header);
    this.element.appendChild(module.element);
    this.$moduleHeaderMap.set(module.header, module);
    (<ExtendableModule[]>this.modules).push(module);
    if (!this.$activeModule) {
      this.$activeModule = module;
      this.$activeModule.onfocus();
      this.$activeModule.header.setAttribute("active", "");
      this.$activeModule.element.setAttribute("active", "");
    }
    module.onattach(this);
  }
  public removeModule(module: ExtendableModule) {
    let index = this.modules.indexOf(module);
    this.$moduleHeaderMap.delete(module.header);
    if (this.$activeModule === module) {
      this.$activeModule.onblur();
      this.$activeModule.header.removeAttribute("active");
      this.$activeModule.element.removeAttribute("active");
      this.$activeModule = null;
      if (this.modules.length > 1) {
        this.$activeModule = this.modules[index - 1 < 0 ? 1 : index - 1];
        this.$activeModule.onfocus();
        this.$activeModule.header.setAttribute("active", "");
        this.$activeModule.element.setAttribute("active", "");
      }
    }
    this.$moduleHeaders.removeChild(module.element);
    this.element.removeChild(module.element);
    (<ExtendableModule[]>this.modules).splice(index, 1);
  }
  public modules: ReadonlyArray<ExtendableModule> = [];
  protected $moduleHeaderMap: Map<HTMLElement, ExtendableModule> = new Map();
}
declare namespace ModuleHost {
  interface Options {
    main: ExtendableModule;
    modules: ExtendableModule[];
  }
  type ViewMode = "fullscreen" | "splitscreen"
}
