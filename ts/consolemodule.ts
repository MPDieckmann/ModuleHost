/// <reference path="module.ts" />
/// <reference path="propertyexpander.ts" />
/// <reference path="nodeexpander.ts" />

class ConsoleModule extends ExtendableModule implements ConsoleModule.ConsoleFunctions {
  public static readonly version = "2019-11-05";
  protected $functions: (keyof ConsoleModule.ConsoleFunctions)[] = [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "time",
    "timeEnd",
    "warn"
  ];
  public consoleProxy: Console | null = null;
  public readonly target: (Window & {
    eval(code: string): any;
    Node: { new(): Node };
  }) | null = null;
  constructor(target: Window | null = null) {
    super({
      name: "Console",
      type: "console"
    });

    this.element.appendChild(this.$lines);
    var $input = document.createElement("mpc-console-input-line");
    this.element.appendChild($input);
    var $this = this;
    // @ts-ignore
    this.$codeMirror = CodeMirror($input, {
      mode: "javascript",
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      extraKeys: {
        // @ts-ignore
        Enter(codeMirror: CodeMirror.Editor) {
          var value = codeMirror.getValue().trim();
          if (value != "") {
            try {
              var line = document.createElement("mpc-console-line");
              line.setAttribute("type", "input");
              $this.$output.appendChild(line);
              // @ts-ignore
              CodeMirror(line, {
                mode: "javascript",
                tabSize: 2,
                readOnly: true,
                value: value
              });

              $this.$createLine([$this.$eval(value)], "output");
              codeMirror.setValue("");
            } catch (e) {
              $this.$createLine(["Uncaught:", e], "error");
            }
          }
        },
        // @ts-ignore
        "Shift-Enter"(codeMirror: CodeMirror.Doc) {
          codeMirror.replaceSelection("\n");
        },
        "Ctrl-L"() {
          $this.$clear();
        }
      }
    });

    this.bind(target);
  }
  protected $codeMirror: CodeMirror.Editor;
  protected $lines: Element = document.createElement("mpc-console-lines");
  protected $output: Element = this.$lines;
  protected $eval(code: string) {
    if (this.target) {
      return this.target.eval.call(null, code);
    } else {
      this.$createLine(["Failed to evaluate '%s': console is not linked to a window", code], "error");
      return null;
    }
  }
  protected $toString(value: any): string {
    switch (typeof value) {
      case "boolean":
      case "function":
      case "number":
      case "string":
      case "symbol":
        return value.toString();
      case "object":
        if (value === null) {
          return "null";
        }
        if ("toString" in value && typeof value.toString == "function") {
          return value.toString();
        }
        return Object.prototype.toString.call(value);
      case "undefined":
        return "undefined";
    }
  }
  protected $createLine(args: IArguments | any[], type?: string) {
    var line = document.createElement("mpc-console-line");
    var index = 0;
    var length = args.length;
    if (typeof args[0] == "string") {
      var regexp = /%[sidfoOc]/;
      var tmp: HTMLElement = line;
      index++;
      args[0].split(/(%[sidfoOc])/).forEach(str => {
        if (regexp.test(str) && index < length) {
          switch (str) {
            case "%s":
              tmp.appendChild(new PropertyExpander({
                property: this.$toString(args[index++])
              }).details);
              break;
            case "%i":
            case "%d":
              tmp.appendChild(new PropertyExpander({
                property: parseInt(this.$toString(args[index++]))
              }).details);
              break;
            case "%f":
              tmp.appendChild(new PropertyExpander({
                property: parseFloat(this.$toString(args[index++]))
              }).details);
              break;
            case "%o":
              if (this.target && typeof args[index] == "object" && NodeExpander.isNode(args[index])) {
                tmp.appendChild(new NodeExpander({
                  node: args[index++]
                }).details);
                break;
              }
            case "%O":
              tmp.appendChild(new PropertyExpander({
                property: args[index++]
              }).details);
              break;
            case "%c":
              let tmp2 = document.createElement("font");
              tmp2.setAttribute("style", args[index++]);
              tmp.appendChild(tmp2);
              tmp = tmp2;
              break;
          }
        } else {
          tmp.appendChild(document.createTextNode(str));
        }
      });
    }
    for (index; index < length; index++) {
      if (typeof args[index] == "string") {
        line.appendChild(document.createTextNode(" " + args[index]));
      } else if (this.target && typeof args[index] == "object" && NodeExpander.isNode(args[index])) {
        line.appendChild(new NodeExpander({
          node: args[index]
        }).details);
      } else {
        line.appendChild(new PropertyExpander({
          property: args[index]
        }).details);
      }
    }
    if (type) {
      line.setAttribute("type", type);
    }
    this.$output.appendChild(line);
    return line;
  }
  protected $clear() {
    while (this.$lines.firstChild) {
      DOMHelper.remove(this.$lines.firstChild);
    }
    this.$output = this.$lines;
  }
  public assert(test: boolean, message?: any, ...optionalParams: any[]) {
    if (test) {
      optionalParams.unshift(message);
      if (typeof message == "string") {
        optionalParams[0] = "Assertion Failed: " + optionalParams[0];
      } else {
        optionalParams.unshift("Assertion Failed");
      }
      this.$createLine(optionalParams, "error");
    }
  }
  public clear() {
    this.$clear();
    this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
  }
  protected $counter: { [s: string]: number } = {};
  public count(countTitle?: string) {
    var $countTitle = "$" + countTitle;
    if ($countTitle in this.$counter === false) {
      this.$counter[$countTitle] = 0;
    }
    if (countTitle) {
      this.log(countTitle, ++this.$counter[$countTitle]);
    } else {
      this.log(++this.$counter[$countTitle]);
    }
  }
  // @ts-ignore
  public debug(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "debug");
  }
  public dir(value: any) {
    this.$createLine(["%O", value], "dir");
  }
  public dirxml(value: any) {
    this.$createLine(["%o", value], "dirxml");
  }
  // @ts-ignore
  public error(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "error");
  }
  protected $groups: Element[] = [];
  // @ts-ignore
  public group(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.details.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.group"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    expander.summary.click();
    this.$groups.push(this.$output);
    DOMHelper.replaceChild(expander.details, line);
    this.$output = expander.details;
  }
  // @ts-ignore
  public groupCollapsed(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.details.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.groupCollapsed"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    this.$groups.push(this.$output);
    DOMHelper.replaceChild(expander.details, line);
    this.$output = expander.details;
  }
  public groupEnd() {
    if (0 in this.$groups) {
      this.$output = <Element>this.$groups.pop();
    }
  }
  // @ts-ignore
  public info(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "info");
  }
  // @ts-ignore
  public log(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "log");
  }
  protected $timer: { [s: string]: number } = {};
  public time(timerName?: string) {
    var $timerName = "$" + timerName;
    if ($timerName in this.$timer === false) {
      this.$timer[$timerName] = Date.now();
    }
  }
  public timeEnd(timerName?: string) {
    var $timerName = "$" + timerName;
    var $time = 0;
    if ($timerName in this.$timer) {
      $time = Date.now() - this.$timer[$timerName];
      delete this.$timer[$timerName];
    }
    this.log("%s: %fms", timerName || "default", $time);
  }
  // @ts-ignore
  public warn(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "warn");
  }
  public preserveLog: boolean = false;
  public bind(target: Window | null) {
    if (this.target) {
      this.target.removeEventListener && this.target.removeEventListener("error", this._errorListener);
      this.$createLine(["%cNavigated to %s", "color:#00f;", this.target.location], "log");
      if (!this.preserveLog) {
        this.$clear();
      }
    }

    (<{ target: any }>this).target = target;

    if (this.target) {
      this.target.addEventListener("error", this._errorListener);

      const $this = this;
      try {
        (<{ console: Console }>this.target).console = this.consoleProxy = new Proxy(this.target.console, {
          get($target: Console, p: keyof ConsoleModule.ConsoleFunctions): any {
            if (p in $target === false) {
              return;
            }
            if ($this.target === target && $this.$functions.indexOf(p) >= 0 && p in $this) {
              return function () {
                $this[p].apply($this, arguments);
                return $target[p].apply($target, arguments);
              }
            }
            return $target[p];
          }
        });
      } catch (e) {
        this.error(e);
      }
    }
  }
  private _errorListener = ((event: ErrorEvent) => {
    try {
      var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
      if ("colno" in event) {
        args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
        args.push(event.colno);
      }
      this.$createLine(args, "error");
    } catch (e) {
      this.$createLine(["Uncaught:", e], "error");
    }
  }).bind(this);
  public onattach(host: ModuleHost) {
    super.onattach(host);
    this.header.click();
  }
}
declare namespace ConsoleModule {
  type ConsoleFunctions = {
    assert(test: boolean, message?: any, ...optionalParams: any[]): void;
    clear(): void;
    count(countTitle?: string): void;
    debug(message?: any, ...optionalParams: any[]): void;
    dir(value: any): void;
    dirxml(value: any): void;
    error(message?: any, ...optionalParams: any[]): void;
    group(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupEnd(): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    time(timerName?: string): void;
    timeEnd(timerName?: string): void;
    warn(message?: any, ...optionalParams: any[]): void;
  }
}