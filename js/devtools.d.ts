/// <reference types="codemirror" />
declare class ModuleHost {
    static readonly version = "2019-11-05";
    element: HTMLElement;
    constructor(options: ModuleHost.Options);
    private _viewMode;
    viewMode: ModuleHost.ViewMode;
    protected $header: HTMLElement;
    protected $moduleHeaders: HTMLElement;
    protected $activeModule: ExtendableModule;
    attachModule(module: ExtendableModule): void;
    removeModule(module: ExtendableModule): void;
    modules: ReadonlyArray<ExtendableModule>;
    protected $moduleHeaderMap: Map<HTMLElement, ExtendableModule>;
}
declare namespace ModuleHost {
    interface Options {
        main: ExtendableModule;
        modules: ExtendableModule[];
    }
    type ViewMode = "fullscreen" | "splitscreen";
}
declare class ExtendableModule extends EventTarget {
    static readonly version = "2019-11-05";
    element: HTMLElement;
    header: HTMLElement;
    protected constructor(options: ExtendableModule.Options);
    onfocus(): void;
    onblur(): void;
    onattach(host: ModuleHost): void;
}
declare namespace ExtendableModule {
    interface Options {
        name: string;
        type: string;
    }
}
declare namespace DOMHelper {
    const version = "2019-11-05";
    function prependChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
    function insertBefore<T extends Node = Node>(newChild: T, refChild: Node): T;
    function replaceChild<T extends Node = Node>(newChild: T, oldChild: Node): T;
    function remove<T extends Node = Node>(oldChild: T): T;
    function removeChild<T extends Node = Node>(oldChild: T, parentNode: Node): T;
    function insertAfter<T extends Node = Node>(newChild: T, refChild: Node): T;
    function appendChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
}
declare class ExtendableExpander {
    static readonly version = "2019-11-05";
    details: HTMLElement;
    summary: HTMLElement;
    protected constructor(options?: ExtendableExpander.Options<ExtendableExpander>);
    protected $expandable: boolean;
    protected $wasExpanded: boolean;
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
declare class Expander extends ExtendableExpander {
    static readonly version = "2019-11-05";
    constructor(options: Expander.Options<Expander>);
    label: string;
    expandable: boolean;
    wasExpanded: boolean;
    onexpand: ExtendableExpander.EventListener<this> | null;
    oncollapse: ExtendableExpander.EventListener<this> | null;
}
declare namespace Expander {
    interface Options<T extends ExtendableExpander> extends ExtendableExpander.Options<T> {
        label: string;
    }
}
declare class PropertyExpander<T> extends ExtendableExpander {
    static readonly version = "2019-11-05";
    constructor(options: PropertyExpander.Options<T>);
    property: T;
    protected $createValue(prop: PropertyExpander.Descriptor): void;
    protected $createGet(prop: PropertyExpander.Descriptor): void;
    protected $createGetter(prop: PropertyExpander.Descriptor): void;
    protected $createSetter(prop: PropertyExpander.Descriptor): void;
    protected $propertySorter(a: string | symbol, b: string | symbol): 1 | 0 | -1;
    protected $properties(this: PropertyExpander<object>): void;
    protected $boolean(this: PropertyExpander<boolean>): void;
    protected $function(this: PropertyExpander<Function>): void;
    protected $iterable(this: PropertyExpander<{
        length: number;
    }>): void;
    protected $null(this: PropertyExpander<null | undefined>): void;
    protected $number(this: PropertyExpander<number>): void;
    protected $object(this: PropertyExpander<object>): void;
    protected $regexp(this: PropertyExpander<RegExp>): void;
    protected $string(this: PropertyExpander<string>): void;
    protected $symbol(this: PropertyExpander<symbol>): void;
    toType(): "object" | "symbol" | "function" | "string" | "number" | "boolean" | "null" | "regexp" | "iterable";
}
declare namespace PropertyExpander {
    interface Options<T> {
        property: T;
    }
    type Descriptor = PropertyDescriptor & ({
        key: string;
        type: "string" | "number";
        owner: object;
    } | {
        key: symbol;
        type: "symbol";
        owner: object;
    });
}
declare class NodeExpander<N extends Node> extends ExtendableExpander {
    static readonly version = "2019-11-05";
    static isNode(object: Node | any): boolean;
    constructor(options: NodeExpander.Options<N>);
    readonly node: N;
    protected $elementNode(this: NodeExpander<Element>): void;
    protected $attributeNode(this: NodeExpander<Attr>): void;
    protected $textNode(this: NodeExpander<Text>): void;
    protected $cdataSectionNode(this: NodeExpander<CDATASection>): void;
    protected $processingInstructionNode(this: NodeExpander<ProcessingInstruction>): void;
    protected $commentNode(this: NodeExpander<Comment>): void;
    protected $documentNode(this: NodeExpander<Document>): void;
    protected $documentTypeNode(this: NodeExpander<DocumentType>): void;
    protected $documentFragmentNode(this: NodeExpander<DocumentFragment>): void;
}
declare namespace NodeExpander {
    interface Options<N extends Node> {
        node: N;
    }
}
declare class ConsoleModule extends ExtendableModule implements ConsoleModule.ConsoleFunctions {
    static readonly version = "2019-11-05";
    protected $functions: (keyof ConsoleModule.ConsoleFunctions)[];
    consoleProxy: Console | null;
    readonly target: (Window & {
        eval(code: string): any;
        Node: {
            new (): Node;
        };
    }) | null;
    constructor(target?: Window | null);
    protected $codeMirror: CodeMirror.Editor;
    protected $lines: Element;
    protected $output: Element;
    protected $eval(code: string): any;
    protected $toString(value: any): string;
    protected $createLine(args: IArguments | any[], type?: string): HTMLElement;
    protected $clear(): void;
    assert(test: boolean, message?: any, ...optionalParams: any[]): void;
    clear(): void;
    protected $counter: {
        [s: string]: number;
    };
    count(countTitle?: string): void;
    debug(message?: any, ...optionalParams: any[]): void;
    dir(value: any): void;
    dirxml(value: any): void;
    error(message?: any, ...optionalParams: any[]): void;
    protected $groups: Element[];
    group(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupEnd(): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    protected $timer: {
        [s: string]: number;
    };
    time(timerName?: string): void;
    timeEnd(timerName?: string): void;
    warn(message?: any, ...optionalParams: any[]): void;
    preserveLog: boolean;
    bind(target: Window | null): void;
    private _errorListener;
    onattach(host: ModuleHost): void;
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
    };
}
declare class PageViewModule extends ExtendableModule {
    static readonly version = "2019-11-05";
    iframe: HTMLIFrameElement;
    console: ConsoleModule;
    constructor(url?: string);
    onattach(host: ModuleHost): void;
}
