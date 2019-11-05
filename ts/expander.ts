class ExtendableExpander {
  public static readonly version = "2019-11-05";
  public details = document.createElement("mpc-expander");
  public summary = document.createElement("mpc-expander-label");
  protected constructor(options: ExtendableExpander.Options<ExtendableExpander> = {}) {
    this.details.appendChild(this.summary);
    this.summary.addEventListener("click", event => {
      if (this.$expandable && !this.details.hasAttribute("open")) {
        this.details.setAttribute("open", "");
        typeof this.$onexpand == "function" && this.$onexpand.call(this, event);
        if (this.$wasExpanded == false) {
          this.$wasExpanded = true;
        }
      } else {
        this.details.removeAttribute("open");
        typeof this.$oncollapse == "function" && this.$oncollapse.call(this, event);
      }
      event.preventDefault();
    });

    this.$onexpand = options.onexpand || null;
    this.$oncollapse = options.oncollapse || null;
  }
  protected get $expandable(): boolean {
    return this.details.hasAttribute("expandable");
  }
  protected set $expandable(value: boolean) {
    if (value) {
      this.details.setAttribute("expandable", "");
    } else {
      this.details.removeAttribute("expandable");
    }
  }
  protected $wasExpanded: boolean = false;
  protected $onexpand: ExtendableExpander.EventListener<this> | null;
  protected $oncollapse: ExtendableExpander.EventListener<this> | null;
}
declare namespace ExtendableExpander {
  interface Options<T extends ExtendableExpander> {
    onexpand?: EventListener<T>;
    oncollapse?: EventListener<T>;
  }
  interface EventListener<T extends ExtendableExpander> {
    (this: T, event: Event): void;
  }
}

class Expander extends ExtendableExpander {
  public static readonly version = "2019-11-05";
  constructor(options: Expander.Options<Expander>) {
    super(options);
    this.label = options.label;
  }
  public get label(): string {
    return this.summary.innerHTML;
  }
  public set label(value: string) {
    this.summary.innerHTML = value;
  }
  public get expandable(): boolean {
    return this.$expandable;
  }
  public set expandable(value: boolean) {
    this.$expandable = value;
  }
  public get wasExpanded(): boolean {
    return this.$wasExpanded;
  }
  public set wasExpanded(value: boolean) {
    this.$wasExpanded = value;
  }
  public get onexpand(): ExtendableExpander.EventListener<this> | null {
    return this.$onexpand;
  }
  public set onexpand(value: ExtendableExpander.EventListener<this> | null) {
    this.$onexpand = value;
  }
  public get oncollapse(): ExtendableExpander.EventListener<this> | null {
    return this.$oncollapse;
  }
  public set oncollapse(v: ExtendableExpander.EventListener<this> | null) {
    this.$oncollapse = v;
  }
}
declare namespace Expander {
  interface Options<T extends ExtendableExpander> extends ExtendableExpander.Options<T> {
    label: string;
  }
}
