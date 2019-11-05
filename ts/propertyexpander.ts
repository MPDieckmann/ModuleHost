/// <reference path="domhelper.ts" />
/// <reference path="expander.ts" />

class PropertyExpander<T> extends ExtendableExpander {
  public static readonly version = "2019-11-05";
  constructor(options: PropertyExpander.Options<T>) {
    super();
    this.property = options.property;
    switch (this.toType()) {
      case "boolean":
        (<PropertyExpander<boolean>><unknown>this).$boolean();
        break;
      case "function":
        (<PropertyExpander<Function>><unknown>this).$function();
        break;
      case "iterable":
        (<PropertyExpander<{ length: number; }>><unknown>this).$iterable();
        break;
      case "null":
        (<PropertyExpander<null | undefined>><unknown>this).$null();
        break;
      case "number":
        (<PropertyExpander<number>><unknown>this).$number();
        break;
      case "object":
        (<PropertyExpander<object>><unknown>this).$object();
        break;
      case "regexp":
        (<PropertyExpander<RegExp>><unknown>this).$regexp();
        break;
      case "string":
        (<PropertyExpander<string>><unknown>this).$string();
        break;
      case "symbol":
        (<PropertyExpander<symbol>><unknown>this).$symbol();
        break;
      default:
        throw "Cannot handle typeof property: " + typeof this.property;
    }
    this.summary.innerHTML = '<mpc-property-expander-value type="' + (this.details.getAttribute("type") || "").replace("-property", "") + '">' + this.summary.innerHTML + '</mpc-property-expander-value>';
    // this.summary.addEventListener("dblclick", event => {
    //   var input = document.createElement("input");
    //   switch (this.toType()) {
    //     case "boolean":
    //     case "function":
    //     case "number":
    //     case "regexp":
    //     case "symbol":
    //       input.value = this.property.toString();
    //       break;
    //     case "string":
    //       input.value = '"' + this.property + '"';
    //       break;
    //     case "iterable":
    //       input.value = JSON.stringify(this.property);
    //       break;
    //     case "null":
    //       input.value = String(this.property);
    //       break;
    //   }
    //   input.addEventListener("keydown", event=>{
    //     if (event.keyCode == 13) {
    //       DOMHelper.replaceChild(this.summary, input);
    //     }
    //   });
    //   DOMHelper.replaceChild(input, this.summary);
    // });
  }
  public property: T;
  protected $createValue(prop: PropertyExpander.Descriptor) {
    var expander = new PropertyExpander({
      property: prop.value
    });
    expander.summary.innerHTML = '<mpc-property-expander-key type="' + prop.type + '">' + prop.key.toString() + '</mpc-property-expander-key>: ' + expander.summary.innerHTML;
    if (prop.enumerable == false) {
      expander.details.setAttribute("enumerable", "false");
    }
    if (prop.writable) {
      expander.details.setAttribute("editable", "");
    }
    this.details.appendChild(expander.details);
  }
  protected $createGet(prop: PropertyExpander.Descriptor) {
    var placeholder = document.createElement(this.details.tagName);
    placeholder.setAttribute("type", "property-placeholder");
    placeholder.innerHTML = '<mpc-expander-label><mpc-property-expander-key type="' + prop.type + '">' + prop.key.toString() + '</mpc-property-expander-key>: <mpc-property-expander-value type="placeholder">(...)</mpc-property-expander-value></mpc-expander-label>';
    placeholder.addEventListener("click", () => {
      var expander: PropertyExpander<T>;
      try {
        expander = new PropertyExpander<T>({
          property: prop.get.call(this.property)
        });
      } catch (e) {
        expander = new PropertyExpander({
          property: e
        });
        expander.details.setAttribute("type", expander.details.getAttribute("type") + " error");
      }
      expander.summary.innerHTML = '<mpc-property-expander-key type="' + prop.type + '">' + prop.key.toString() + '</mpc-property-expander-key>: ' + expander.summary.innerHTML;
      if (prop.enumerable == false) {
        expander.details.setAttribute("enumerable", "false");
      }
      if ("set" in prop) {
        expander.details.setAttribute("editable", "");
      }
      DOMHelper.replaceChild(expander.details, placeholder);
    });
    if (prop.enumerable == false) {
      placeholder.setAttribute("enumerable", "false");
    }
    this.details.appendChild(placeholder);
  }
  protected $createGetter(prop: PropertyExpander.Descriptor) {
    var expander = new PropertyExpander({
      property: prop.get
    });
    expander.summary.innerHTML = '<mpc-property-expander-key type="get-' + prop.type + '">get ' + prop.key.toString() + '</mpc-property-expander-key>: ' + expander.summary.innerHTML;
    if (prop.enumerable == false) {
      expander.details.setAttribute("enumerable", "false");
    }
    if (prop.configurable) {
      expander.details.setAttribute("editable", "");
    }
    this.details.appendChild(expander.details);
  }
  protected $createSetter(prop: PropertyExpander.Descriptor) {
    var expander = new PropertyExpander({
      property: prop.set
    });
    expander.summary.innerHTML = '<mpc-property-expander-key type="set-' + prop.type + '">set ' + prop.key.toString() + '</mpc-property-expander-key>: ' + expander.summary.innerHTML;
    if (prop.enumerable == false) {
      expander.details.setAttribute("enumerable", "false");
    }
    if (prop.configurable) {
      expander.details.setAttribute("editable", "");
    }
    this.details.appendChild(expander.details);
  }
  protected $propertySorter(a: string | symbol, b: string | symbol) {
    if (a == b) {
      return 0;
    }
    if (typeof a == "symbol") {
      if (typeof b != "symbol") {
        return 1;
      }
      a = a.toString();
    }
    if (typeof b == "symbol") {
      if (typeof a != "symbol") {
        return -1;
      }
      b = b.toString();
    }
    var index = 0;
    var length = Math.min(a.length, b.length);
    for (index; index < length; index++) {
      if (a[index] == "_" && a[index] != b[index]) {
        return 1;
      }
      if (b[index] == "_" && a[index] != b[index]) {
        return -1;
      }
      if (a[index] == "$" && a[index] != b[index]) {
        return 1;
      }
      if (b[index] == "$" && a[index] != b[index]) {
        return -1;
      }
      if (a.charCodeAt(index) > b.charCodeAt(index)) {
        return 1;
      } else if (a.charCodeAt(index) < b.charCodeAt(index)) {
        return -1;
      }
    }
    if (a.length > b.length) {
      return 1;
    } else if (a.length < b.length) {
      return -1;
    }
    return 0;
  }
  protected $properties(this: PropertyExpander<object>) {
    this.$expandable = true;
    this.$onexpand = () => {
      if (!this.$wasExpanded) {
        var values: {
          [s: string]: PropertyExpander.Descriptor
        } = Object.create(null);
        var prototypes = [];
        var tmp = this.property;
        do {
          prototypes.unshift(tmp);
        } while (tmp = Object.getPrototypeOf(tmp));
        prototypes.forEach(tmp => {
          Object.getOwnPropertyNames(tmp).forEach(name => {
            var desc = Object.getOwnPropertyDescriptor(tmp, name);
            if (desc && ("get" in desc || tmp === this.property)) {
              values[name] = Object.assign<PropertyDescriptor, {
                key: string,
                type: "string" | "number",
                owner: object
              }>(desc, {
                key: name,
                type: isNaN(parseInt(name)) ? "string" : "number",
                owner: tmp
              });
            }
          });
          Object.getOwnPropertySymbols(tmp).forEach(name => {
            var desc = Object.getOwnPropertyDescriptor(tmp, name);
            if (desc && ("get" in desc || tmp === this.property)) {
              // @ts-ignore
              values[name] = Object.assign<PropertyDescriptor, {
                key: symbol,
                type: "symbol",
                owner: object
              }>(desc, {
                key: name,
                type: "symbol",
                owner: tmp
              });
            }
          });
        });
        (<(string | symbol)[]>[]).concat(
          Object.getOwnPropertyNames(values),
          Object.getOwnPropertySymbols(values)
        ).sort(this.$propertySorter).forEach(key => {
          var prop = values[<string>key];
          if ("value" in prop) {
            this.$createValue(prop);
          }
          if ("get" in prop) {
            this.$createGet(prop);
          }
          if (prop.owner === this.property) {
            if ("get" in prop) {
              this.$createGetter(prop);
            }
            if ("set" in prop) {
              this.$createSetter(prop);
            }
          }
        });
      }
    }
  }
  protected $boolean(this: PropertyExpander<boolean>) {
    this.details.setAttribute("type", "boolean-property");
    this.summary.textContent = this.property.toString();
  }
  protected $function(this: PropertyExpander<Function>) {
    this.details.setAttribute("type", "function-property");
    var string = this.property.toString();
    var tmp = /^(?:function|class)?[^\{]*{/.exec(string);
    if (tmp) {
      var result = tmp[0].replace(/\s+/g, " ");
      this.summary.textContent = result + " [javascript] }";
    } else {
      this.summary.textContent = string;
    }
    (<PropertyExpander<object>>this).$properties();
  }
  protected $iterable(this: PropertyExpander<{ length: number; }>) {
    this.details.setAttribute("type", "iterable-property");
    this.summary.textContent = this.property.constructor.name + "[" + this.property.length + "]";
    (<PropertyExpander<object>>this).$properties();
  }
  protected $null(this: PropertyExpander<null | undefined>) {
    this.details.setAttribute("type", "null-property");
    this.summary.textContent = String(this.property);
  }
  protected $number(this: PropertyExpander<number>) {
    this.details.setAttribute("type", "number-property");
    this.summary.textContent = this.property.toString();
  }
  protected $object(this: PropertyExpander<object>) {
    this.details.setAttribute("type", "object-property");
    var summaryText: string;
    try {
      summaryText = this.property.toString();
      summaryText = summaryText.replace(/^\[object (.*)\]$/, "$1");
    } catch (e) {
      summaryText = Object.prototype.toString.call(this.property).replace(/^\[object (.*)\]$/, "$1");
    }
    this.summary.textContent = summaryText;
    this.$properties();
  }
  protected $regexp(this: PropertyExpander<RegExp>) {
    this.details.setAttribute("type", "regexp-property");
    this.summary.textContent = this.property.toString();
    (<PropertyExpander<object>>this).$properties();
  }
  protected $string(this: PropertyExpander<string>) {
    this.details.setAttribute("type", "string-property");
    this.summary.textContent = '"' + this.property + '"';
  }
  protected $symbol(this: PropertyExpander<symbol>) {
    this.details.setAttribute("type", "symbol-property");
    this.summary.textContent = this.property.toString();
  }
  public toType() {
    switch (typeof this.property) {
      case "boolean":
        return "boolean";
      case "function":
        return "function";
      case "bigint":
      case "number":
        return "number";
      case "object":
        try {
          if (this.property === null) {
            return "null";
          } else if (this.property instanceof RegExp) {
            return "regexp"
          } else if ("length" in this.property && typeof (<PropertyExpander<{ length: number; }>><unknown>this).property.length == "number") {
            return "iterable";
          }
        } catch (e) { }
        return "object";
      case "string":
        return "string";
      case "symbol":
        return "symbol";
      case "undefined":
        return "null";
      default:
        return "object";
    }
  }
}
declare namespace PropertyExpander {
  interface Options<T> {
    property: T;
  }
  type Descriptor = PropertyDescriptor & (
    {
      key: string,
      type: "string" | "number",
      owner: object
    } | {
      key: symbol,
      type: "symbol",
      owner: object
    }
  );
}
