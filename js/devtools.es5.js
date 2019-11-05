var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ExtendableModule = /** @class */ (function () {
    function ExtendableModule(options) {
        this.element = document.createElement("mpc-module");
        this.header = document.createElement("mpc-module-header");
        this.element.setAttribute("type", options.type);
    }
    ExtendableModule.prototype.onfocus = function () { };
    ExtendableModule.prototype.onblur = function () { };
    ExtendableModule.version = "2019-11-05";
    return ExtendableModule;
}());
var DOMHelper;
(function (DOMHelper) {
    DOMHelper.version = "2019-11-05";
    function prependChild(newChild, parentNode) {
        if (parentNode.firstChild) {
            parentNode.insertBefore(newChild, parentNode.firstChild);
        }
        else {
            parentNode.appendChild(newChild);
        }
        return newChild;
    }
    DOMHelper.prependChild = prependChild;
    function insertBefore(newChild, refChild) {
        if (refChild.parentNode) {
            refChild.parentNode.insertBefore(newChild, refChild);
        }
        else {
            throw new DOMException("The second argument <refChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.insertBefore = insertBefore;
    function replaceChild(newChild, oldChild) {
        if (oldChild.parentNode) {
            oldChild.parentNode.replaceChild(newChild, oldChild);
        }
        else {
            throw new DOMException("The second argument <oldChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.replaceChild = replaceChild;
    function remove(oldChild) {
        if (oldChild.parentNode) {
            oldChild.parentNode.removeChild(oldChild);
        }
        return oldChild;
    }
    DOMHelper.remove = remove;
    function removeChild(oldChild, parentNode) {
        parentNode.removeChild(oldChild);
        return oldChild;
    }
    DOMHelper.removeChild = removeChild;
    function insertAfter(newChild, refChild) {
        if (refChild.parentNode) {
            if (refChild.nextSibling) {
                refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
            }
            else {
                refChild.parentNode.appendChild(newChild);
            }
        }
        else {
            throw new DOMException("The second argument <refChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.insertAfter = insertAfter;
    function appendChild(newChild, parentNode) {
        parentNode.appendChild(newChild);
        return newChild;
    }
    DOMHelper.appendChild = appendChild;
})(DOMHelper || (DOMHelper = {}));
var ExtendableExpander = /** @class */ (function () {
    function ExtendableExpander(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.details = document.createElement("mpc-expander");
        this.summary = document.createElement("mpc-expander-label");
        this.$wasExpanded = false;
        this.details.appendChild(this.summary);
        this.summary.addEventListener("click", function (event) {
            if (_this.$expandable && !_this.details.hasAttribute("open")) {
                _this.details.setAttribute("open", "");
                typeof _this.$onexpand == "function" && _this.$onexpand.call(_this, event);
                if (_this.$wasExpanded == false) {
                    _this.$wasExpanded = true;
                }
            }
            else {
                _this.details.removeAttribute("open");
                typeof _this.$oncollapse == "function" && _this.$oncollapse.call(_this, event);
            }
            event.preventDefault();
        });
        this.$onexpand = options.onexpand || null;
        this.$oncollapse = options.oncollapse || null;
    }
    Object.defineProperty(ExtendableExpander.prototype, "$expandable", {
        get: function () {
            return this.details.hasAttribute("expandable");
        },
        set: function (value) {
            if (value) {
                this.details.setAttribute("expandable", "");
            }
            else {
                this.details.removeAttribute("expandable");
            }
        },
        enumerable: true,
        configurable: true
    });
    ExtendableExpander.version = "2019-11-05";
    return ExtendableExpander;
}());
var Expander = /** @class */ (function (_super) {
    __extends(Expander, _super);
    function Expander(options) {
        var _this = _super.call(this, options) || this;
        _this.label = options.label;
        return _this;
    }
    Object.defineProperty(Expander.prototype, "label", {
        get: function () {
            return this.summary.innerHTML;
        },
        set: function (value) {
            this.summary.innerHTML = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Expander.prototype, "expandable", {
        get: function () {
            return this.$expandable;
        },
        set: function (value) {
            this.$expandable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Expander.prototype, "wasExpanded", {
        get: function () {
            return this.$wasExpanded;
        },
        set: function (value) {
            this.$wasExpanded = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Expander.prototype, "onexpand", {
        get: function () {
            return this.$onexpand;
        },
        set: function (value) {
            this.$onexpand = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Expander.prototype, "oncollapse", {
        get: function () {
            return this.$oncollapse;
        },
        set: function (v) {
            this.$oncollapse = v;
        },
        enumerable: true,
        configurable: true
    });
    Expander.version = "2019-11-05";
    return Expander;
}(ExtendableExpander));
/// <reference path="domhelper.ts" />
/// <reference path="expander.ts" />
var PropertyExpander = /** @class */ (function (_super) {
    __extends(PropertyExpander, _super);
    function PropertyExpander(options) {
        var _this = _super.call(this) || this;
        _this.property = options.property;
        switch (_this.toType()) {
            case "boolean":
                _this.$boolean();
                break;
            case "function":
                _this.$function();
                break;
            case "iterable":
                _this.$iterable();
                break;
            case "null":
                _this.$null();
                break;
            case "number":
                _this.$number();
                break;
            case "object":
                _this.$object();
                break;
            case "regexp":
                _this.$regexp();
                break;
            case "string":
                _this.$string();
                break;
            case "symbol":
                _this.$symbol();
                break;
            default:
                throw "Cannot handle typeof property: " + typeof _this.property;
        }
        _this.summary.innerHTML = '<mpc-property-expander-value type="' + (_this.details.getAttribute("type") || "").replace("-property", "") + '">' + _this.summary.innerHTML + '</mpc-property-expander-value>';
        return _this;
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
    PropertyExpander.prototype.$createValue = function (prop) {
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
    };
    PropertyExpander.prototype.$createGet = function (prop) {
        var _this = this;
        var placeholder = document.createElement(this.details.tagName);
        placeholder.setAttribute("type", "property-placeholder");
        placeholder.innerHTML = '<mpc-expander-label><mpc-property-expander-key type="' + prop.type + '">' + prop.key.toString() + '</mpc-property-expander-key>: <mpc-property-expander-value type="placeholder">(...)</mpc-property-expander-value></mpc-expander-label>';
        placeholder.addEventListener("click", function () {
            var expander;
            try {
                expander = new PropertyExpander({
                    property: prop.get.call(_this.property)
                });
            }
            catch (e) {
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
    };
    PropertyExpander.prototype.$createGetter = function (prop) {
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
    };
    PropertyExpander.prototype.$createSetter = function (prop) {
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
    };
    PropertyExpander.prototype.$propertySorter = function (a, b) {
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
            }
            else if (a.charCodeAt(index) < b.charCodeAt(index)) {
                return -1;
            }
        }
        if (a.length > b.length) {
            return 1;
        }
        else if (a.length < b.length) {
            return -1;
        }
        return 0;
    };
    PropertyExpander.prototype.$properties = function () {
        var _this = this;
        this.$expandable = true;
        this.$onexpand = function () {
            if (!_this.$wasExpanded) {
                var values = Object.create(null);
                var prototypes = [];
                var tmp = _this.property;
                do {
                    prototypes.unshift(tmp);
                } while (tmp = Object.getPrototypeOf(tmp));
                prototypes.forEach(function (tmp) {
                    Object.getOwnPropertyNames(tmp).forEach(function (name) {
                        var desc = Object.getOwnPropertyDescriptor(tmp, name);
                        if (desc && ("get" in desc || tmp === _this.property)) {
                            values[name] = Object.assign(desc, {
                                key: name,
                                type: isNaN(parseInt(name)) ? "string" : "number",
                                owner: tmp
                            });
                        }
                    });
                    Object.getOwnPropertySymbols(tmp).forEach(function (name) {
                        var desc = Object.getOwnPropertyDescriptor(tmp, name);
                        if (desc && ("get" in desc || tmp === _this.property)) {
                            // @ts-ignore
                            values[name] = Object.assign(desc, {
                                key: name,
                                type: "symbol",
                                owner: tmp
                            });
                        }
                    });
                });
                [].concat(Object.getOwnPropertyNames(values), Object.getOwnPropertySymbols(values)).sort(_this.$propertySorter).forEach(function (key) {
                    var prop = values[key];
                    if ("value" in prop) {
                        _this.$createValue(prop);
                    }
                    if ("get" in prop) {
                        _this.$createGet(prop);
                    }
                    if (prop.owner === _this.property) {
                        if ("get" in prop) {
                            _this.$createGetter(prop);
                        }
                        if ("set" in prop) {
                            _this.$createSetter(prop);
                        }
                    }
                });
            }
        };
    };
    PropertyExpander.prototype.$boolean = function () {
        this.details.setAttribute("type", "boolean-property");
        this.summary.textContent = this.property.toString();
    };
    PropertyExpander.prototype.$function = function () {
        this.details.setAttribute("type", "function-property");
        var string = this.property.toString();
        var tmp = /^(?:function|class)?[^\{]*{/.exec(string);
        if (tmp) {
            var result = tmp[0].replace(/\s+/g, " ");
            this.summary.textContent = result + " [javascript] }";
        }
        else {
            this.summary.textContent = string;
        }
        this.$properties();
    };
    PropertyExpander.prototype.$iterable = function () {
        this.details.setAttribute("type", "iterable-property");
        this.summary.textContent = this.property.constructor.name + "[" + this.property.length + "]";
        this.$properties();
    };
    PropertyExpander.prototype.$null = function () {
        this.details.setAttribute("type", "null-property");
        this.summary.textContent = String(this.property);
    };
    PropertyExpander.prototype.$number = function () {
        this.details.setAttribute("type", "number-property");
        this.summary.textContent = this.property.toString();
    };
    PropertyExpander.prototype.$object = function () {
        this.details.setAttribute("type", "object-property");
        var summaryText;
        try {
            summaryText = this.property.toString();
            summaryText = summaryText.replace(/^\[object (.*)\]$/, "$1");
        }
        catch (e) {
            summaryText = Object.prototype.toString.call(this.property).replace(/^\[object (.*)\]$/, "$1");
        }
        this.summary.textContent = summaryText;
        this.$properties();
    };
    PropertyExpander.prototype.$regexp = function () {
        this.details.setAttribute("type", "regexp-property");
        this.summary.textContent = this.property.toString();
        this.$properties();
    };
    PropertyExpander.prototype.$string = function () {
        this.details.setAttribute("type", "string-property");
        this.summary.textContent = '"' + this.property + '"';
    };
    PropertyExpander.prototype.$symbol = function () {
        this.details.setAttribute("type", "symbol-property");
        this.summary.textContent = this.property.toString();
    };
    PropertyExpander.prototype.toType = function () {
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
                    }
                    else if (this.property instanceof RegExp) {
                        return "regexp";
                    }
                    else if ("length" in this.property && typeof this.property.length == "number") {
                        return "iterable";
                    }
                }
                catch (e) { }
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
    };
    PropertyExpander.version = "2019-11-05";
    return PropertyExpander;
}(ExtendableExpander));
/// <reference path="expander.ts" />
var NodeExpander = /** @class */ (function (_super) {
    __extends(NodeExpander, _super);
    function NodeExpander(options) {
        var _this = _super.call(this) || this;
        _this.node = options.node;
        switch (_this.node.nodeType) {
            case _this.node.ELEMENT_NODE:
                _this.$elementNode();
                break;
            case _this.node.ATTRIBUTE_NODE:
                _this.$attributeNode();
                break;
            case _this.node.TEXT_NODE:
                _this.$textNode();
                break;
            case _this.node.CDATA_SECTION_NODE:
                _this.$cdataSectionNode();
                break;
            case _this.node.PROCESSING_INSTRUCTION_NODE:
                _this.$processingInstructionNode();
                break;
            case _this.node.COMMENT_NODE:
                _this.$commentNode();
                break;
            case _this.node.DOCUMENT_NODE:
                _this.$documentNode();
                break;
            case _this.node.DOCUMENT_TYPE_NODE:
                _this.$documentTypeNode();
                break;
            case _this.node.DOCUMENT_FRAGMENT_NODE:
                _this.$documentFragmentNode();
                break;
            default:
                throw "Cannot handle nodeType: " + _this.node.nodeType;
        }
        return _this;
    }
    NodeExpander.isNode = function (object) {
        if (typeof object !== "object" ||
            !("nodeName" in object && "nodeType" in object && "nodeValue" in object) ||
            !("ownerDocument" in object && typeof object.ownerDocument == "object") ||
            !("defaultView" in object.ownerDocument && typeof object.ownerDocument.defaultView == "object") ||
            !("Node" in object.ownerDocument.defaultView && typeof object.ownerDocument.defaultView.Node == "object") ||
            !(object instanceof object.ownerDocument.defaultView.Node)) {
            return false;
        }
        return true;
    };
    NodeExpander.prototype.$elementNode = function () {
        var _this = this;
        this.details.setAttribute("type", "element-node");
        var summaryStart = "&lt;" + this.node.localName;
        var attrIndex = 0;
        var attrLength = this.node.attributes.length;
        var attribute;
        for (attrIndex; attrIndex < attrLength; attrIndex++) {
            attribute = this.node.attributes[attrIndex];
            summaryStart += " <mpc-node-expander-attr-name>" + attribute.localName + "</mpc-node-expander-attr-name>";
            if (attribute.nodeValue) {
                summaryStart += '="<mpc-node-expander-attr-value>' + attribute.nodeValue + '</mpc-node-expander-attr-value>"';
            }
        }
        var summaryText = summaryStart + " />";
        if (this.$expandable = this.node.hasChildNodes()) {
            summaryStart += "&gt;";
            var summaryEnd = "&lt;/" + this.node.localName + "&gt;";
            summaryText = summaryStart + "\u2026" + summaryEnd;
            var lastChild = document.createElement("mpc-expander-label");
            lastChild.innerHTML = summaryEnd;
            this.details.appendChild(lastChild);
            this.$oncollapse = function () {
                _this.summary.innerHTML = summaryText;
            };
            this.$onexpand = function () {
                _this.summary.innerHTML = summaryStart;
                if (!_this.$wasExpanded) {
                    var chldIndex = 0;
                    var chldLength = _this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (_this.node.childNodes[chldIndex].nodeType == _this.node.TEXT_NODE && /^\s*$/.test(_this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        _this.details.insertBefore(new NodeExpander({
                            node: _this.node.childNodes[chldIndex]
                        }).details, lastChild);
                    }
                }
            };
        }
        this.summary.innerHTML = summaryText;
    };
    NodeExpander.prototype.$attributeNode = function () {
        this.details.setAttribute("type", "attribute-node");
        var attrText = " <mpc-node-expander-attr-name>" + this.node.localName + "</mpc-node-expander-attr-name>";
        if (this.node.nodeValue) {
            attrText += '="<mpc-node-expander-attr-value>' + this.node.nodeValue + '</mpc-node-expander-attr-value>"';
        }
        this.summary.innerHTML = attrText;
    };
    NodeExpander.prototype.$textNode = function () {
        this.details.setAttribute("type", "text-node");
        if (this.node.nodeValue) {
            var detailsText = document.createElement("mpc-node-expander-text");
            detailsText.textContent = this.node.nodeValue;
            if (/\n/.test(this.node.nodeValue)) {
                this.summary.textContent = this.node.nodeName;
                this.details.appendChild(detailsText);
                this.$expandable = true;
            }
            else {
                this.summary.appendChild(detailsText);
            }
        }
        else {
            this.summary.textContent = this.node.nodeName;
        }
    };
    NodeExpander.prototype.$cdataSectionNode = function () {
        this.details.setAttribute("type", "cdata-node");
        var detailsText = document.createElement("mpc-node-expander-cdata");
        detailsText.textContent = "<![CDATA[" + this.node.nodeValue + "]]>";
        if (/\n/.test(this.node.nodeValue || "")) {
            this.summary.textContent = this.node.nodeName;
            this.details.appendChild(detailsText);
            this.$expandable = true;
        }
        else {
            this.summary.appendChild(detailsText);
        }
    };
    NodeExpander.prototype.$processingInstructionNode = function () {
        this.details.setAttribute("type", "processing-instruction-node");
        var detailsText = document.createElement("text");
        detailsText.textContent = "<?" + this.node.nodeName + " " + this.node.nodeValue + "?>";
        if (/\n/.test(this.node.nodeValue || "")) {
            this.summary.textContent = this.node.nodeName;
            this.details.appendChild(detailsText);
            this.$expandable = true;
        }
        else {
            this.summary.appendChild(detailsText);
        }
    };
    NodeExpander.prototype.$commentNode = function () {
        this.details.setAttribute("type", "comment-node");
        var detailsText = document.createElement("mpc-node-expander-comment");
        detailsText.textContent = "<!--" + this.node.nodeValue + "-->";
        if (/\n/.test(this.node.nodeValue || "")) {
            this.summary.textContent = this.node.nodeName;
            this.details.appendChild(detailsText);
            this.$expandable = true;
        }
        else {
            this.summary.appendChild(detailsText);
        }
    };
    NodeExpander.prototype.$documentNode = function () {
        var _this = this;
        this.details.setAttribute("type", "document-node");
        this.summary.textContent = this.node.nodeName;
        if (this.$expandable = this.node.hasChildNodes()) {
            this.$onexpand = function () {
                if (!_this.$wasExpanded) {
                    var chldIndex = 0;
                    var chldLength = _this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (_this.node.childNodes[chldIndex].nodeType == _this.node.TEXT_NODE && /^\s*$/.test(_this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        _this.details.appendChild(new NodeExpander({
                            node: _this.node.childNodes[chldIndex]
                        }).details);
                    }
                }
            };
        }
    };
    NodeExpander.prototype.$documentTypeNode = function () {
        this.details.setAttribute("type", "document-type-node");
        var summaryText = document.createElement("mpc-node-expander-document-type");
        summaryText.textContent = "<!DOCTYPE " + this.node.nodeName + ">";
        this.summary.appendChild(summaryText);
    };
    NodeExpander.prototype.$documentFragmentNode = function () {
        var _this = this;
        this.details.setAttribute("type", "document-fragment-node");
        this.summary.textContent = this.node.nodeName;
        if (this.$expandable = this.node.hasChildNodes()) {
            this.$onexpand = function () {
                if (!_this.$wasExpanded) {
                    var chldIndex = 0;
                    var chldLength = _this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (_this.node.childNodes[chldIndex].nodeType == _this.node.TEXT_NODE && /^\s*$/.test(_this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        _this.details.appendChild(new NodeExpander({
                            node: _this.node.childNodes[chldIndex]
                        }).details);
                    }
                }
            };
        }
    };
    NodeExpander.version = "2019-11-05";
    return NodeExpander;
}(ExtendableExpander));
/// <reference path="module.ts" />
/// <reference path="propertyexpander.ts" />
/// <reference path="nodeexpander.ts" />
var ConsoleModule = /** @class */ (function (_super) {
    __extends(ConsoleModule, _super);
    function ConsoleModule(target) {
        if (target === void 0) { target = null; }
        var _this = _super.call(this, {
            name: "Console",
            type: "console"
        }) || this;
        _this.$functions = [
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
        _this._console = null;
        _this.target = null;
        _this.$lines = document.createElement("mpc-console-lines");
        _this.$output = _this.$lines;
        _this.$counter = {};
        _this.$groups = [];
        _this.$timer = {};
        _this.preserveLog = false;
        _this._errorListener = (function (event) {
            try {
                var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
                if ("colno" in event) {
                    args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
                    args.push(event.colno);
                }
                _this.$createLine(args, "error");
            }
            catch (e) {
                _this.$createLine(["Uncaught:", e], "error");
            }
        }).bind(_this);
        _this.element.appendChild(_this.$lines);
        var $input = document.createElement("mpc-console-input-line");
        _this.element.appendChild($input);
        var $this = _this;
        // @ts-ignore
        _this.$codeMirror = CodeMirror($input, {
            mode: "javascript",
            tabSize: 2,
            indentWithTabs: false,
            lineWrapping: true,
            showCursorWhenSelecting: true,
            extraKeys: {
                // @ts-ignore
                Enter: function (codeMirror) {
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
                        }
                        catch (e) {
                            $this.$createLine(["Uncaught:", e], "error");
                        }
                    }
                },
                // @ts-ignore
                "Shift-Enter": function (codeMirror) {
                    codeMirror.replaceSelection("\n");
                },
                "Ctrl-L": function () {
                    $this.$clear();
                }
            }
        });
        _this.bind(target);
        return _this;
    }
    ConsoleModule.prototype.$eval = function (code) {
        if (this.target) {
            return this.target.eval.call(null, code);
        }
        else {
            this.$createLine(["Failed to evaluate '%s': console is not linked to a window", code], "error");
            return null;
        }
    };
    ConsoleModule.prototype.$toString = function (value) {
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
    };
    ConsoleModule.prototype.$createLine = function (args, type) {
        var _this = this;
        var line = document.createElement("mpc-console-line");
        var index = 0;
        var length = args.length;
        if (typeof args[0] == "string") {
            var regexp = /%[sidfoOc]/;
            var tmp = line;
            index++;
            args[0].split(/(%[sidfoOc])/).forEach(function (str) {
                if (regexp.test(str) && index < length) {
                    switch (str) {
                        case "%s":
                            tmp.appendChild(new PropertyExpander({
                                property: _this.$toString(args[index++])
                            }).details);
                            break;
                        case "%i":
                        case "%d":
                            tmp.appendChild(new PropertyExpander({
                                property: parseInt(_this.$toString(args[index++]))
                            }).details);
                            break;
                        case "%f":
                            tmp.appendChild(new PropertyExpander({
                                property: parseFloat(_this.$toString(args[index++]))
                            }).details);
                            break;
                        case "%o":
                            if (_this.target && typeof args[index] == "object" && NodeExpander.isNode(args[index])) {
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
                            var tmp2 = document.createElement("font");
                            tmp2.setAttribute("style", args[index++]);
                            tmp.appendChild(tmp2);
                            tmp = tmp2;
                            break;
                    }
                }
                else {
                    tmp.appendChild(document.createTextNode(str));
                }
            });
        }
        for (index; index < length; index++) {
            if (typeof args[index] == "string") {
                line.appendChild(document.createTextNode(" " + args[index]));
            }
            else if (this.target && typeof args[index] == "object" && NodeExpander.isNode(args[index])) {
                line.appendChild(new NodeExpander({
                    node: args[index]
                }).details);
            }
            else {
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
    };
    ConsoleModule.prototype.$clear = function () {
        while (this.$lines.firstChild) {
            DOMHelper.remove(this.$lines.firstChild);
        }
        this.$output = this.$lines;
    };
    ConsoleModule.prototype.assert = function (test, message) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        if (test) {
            optionalParams.unshift(message);
            if (typeof message == "string") {
                optionalParams[0] = "Assertion Failed: " + optionalParams[0];
            }
            else {
                optionalParams.unshift("Assertion Failed");
            }
            this.$createLine(optionalParams, "error");
        }
    };
    ConsoleModule.prototype.clear = function () {
        this.$clear();
        this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
    };
    ConsoleModule.prototype.count = function (countTitle) {
        var $countTitle = "$" + countTitle;
        if ($countTitle in this.$counter === false) {
            this.$counter[$countTitle] = 0;
        }
        if (countTitle) {
            this.log(countTitle, ++this.$counter[$countTitle]);
        }
        else {
            this.log(++this.$counter[$countTitle]);
        }
    };
    // @ts-ignore
    ConsoleModule.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.$createLine(arguments, "debug");
    };
    ConsoleModule.prototype.dir = function (value) {
        this.$createLine(["%O", value], "dir");
    };
    ConsoleModule.prototype.dirxml = function (value) {
        this.$createLine(["%o", value], "dirxml");
    };
    // @ts-ignore
    ConsoleModule.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.$createLine(arguments, "error");
    };
    // @ts-ignore
    ConsoleModule.prototype.group = function (groupTitle) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
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
    };
    // @ts-ignore
    ConsoleModule.prototype.groupCollapsed = function (groupTitle) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
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
    };
    ConsoleModule.prototype.groupEnd = function () {
        if (0 in this.$groups) {
            this.$output = this.$groups.pop();
        }
    };
    // @ts-ignore
    ConsoleModule.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.$createLine(arguments, "info");
    };
    // @ts-ignore
    ConsoleModule.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.$createLine(arguments, "log");
    };
    ConsoleModule.prototype.time = function (timerName) {
        var $timerName = "$" + timerName;
        if ($timerName in this.$timer === false) {
            this.$timer[$timerName] = Date.now();
        }
    };
    ConsoleModule.prototype.timeEnd = function (timerName) {
        var $timerName = "$" + timerName;
        var $time = 0;
        if ($timerName in this.$timer) {
            $time = Date.now() - this.$timer[$timerName];
            delete this.$timer[$timerName];
        }
        this.log("%s: %fms", timerName || "default", $time);
    };
    // @ts-ignore
    ConsoleModule.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.$createLine(arguments, "warn");
    };
    ConsoleModule.prototype.bind = function (target) {
        if (this.target) {
            this.target.removeEventListener && this.target.removeEventListener("error", this._errorListener);
            this.$createLine(["%cNavigated to %s", "color:#00f;", this.target.location], "log");
            if (!this.preserveLog) {
                this.$clear();
            }
        }
        this.target = target;
        if (this.target) {
            this.target.addEventListener("error", this._errorListener);
            var $this_1 = this;
            try {
                this.target.console = this._console = new Proxy(this.target.console, {
                    get: function ($target, p) {
                        if (p in $target === false) {
                            return;
                        }
                        if ($this_1.target === target && $this_1.$functions.indexOf(p) >= 0 && p in $this_1) {
                            return function () {
                                $this_1[p].apply($this_1, arguments);
                                return $target[p].apply($target, arguments);
                            };
                        }
                        return $target[p];
                    }
                });
            }
            catch (e) {
                this.error(e);
            }
        }
    };
    ConsoleModule.version = "2019-11-05";
    return ConsoleModule;
}(ExtendableModule));
/// <reference path="module.ts" />
var ModuleHost = /** @class */ (function () {
    function ModuleHost() {
        this.element = document.createElement("mpc-module-host");
    }
    ModuleHost.version = "2019-11-05";
    return ModuleHost;
}());
/// <reference path="module.ts" />
/// <reference path="consolemodule.ts" />
var PageModule = /** @class */ (function (_super) {
    __extends(PageModule, _super);
    function PageModule() {
        var _this = _super.call(this, {
            name: "PageView",
            type: "pageview"
        }) || this;
        _this.console = new ConsoleModule();
        _this.console.bind(window);
        return _this;
    }
    PageModule.version = "2019-11-05";
    return PageModule;
}(ExtendableModule));
/// <reference path="module.ts" />
/// <reference path="consolemodule.ts" />
var PageViewModule = /** @class */ (function (_super) {
    __extends(PageViewModule, _super);
    function PageViewModule(url) {
        if (url === void 0) { url = "about:blank"; }
        var _this = _super.call(this, {
            name: "PageView",
            type: "pageview"
        }) || this;
        _this.iframe = document.createElement("iframe");
        _this.iframe.src = url;
        _this.console = new ConsoleModule();
        _this.iframe.addEventListener("load", function () {
            if (_this.iframe.contentWindow) {
                _this.console.bind(_this.iframe.contentWindow);
            }
        });
        _this.element.appendChild(_this.iframe);
        return _this;
    }
    PageViewModule.version = "2019-11-05";
    return PageViewModule;
}(ExtendableModule));
//# sourceMappingURL=devtools.es5.js.map