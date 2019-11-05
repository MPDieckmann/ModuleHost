"use strict";
class ModuleHost {
    constructor(options) {
        this.element = document.createElement("mpc-module-host");
        this.$header = document.createElement("mpc-module-host-header");
        this.$moduleHeaders = document.createElement("mpc-module-host-module-headers");
        this.$activeModule = null;
        this.modules = [];
        this.$moduleHeaderMap = new Map();
        var viewModeToggle = document.createElement("button");
        viewModeToggle.textContent = "splitscreen";
        viewModeToggle.id = "view-mode-toggle";
        var viewModes = ["fullscreen", "splitscreen"];
        viewModeToggle.addEventListener("click", event => {
            let i = viewModes.indexOf(this.viewMode);
            if (i + 1 >= viewModes.length) {
                i = 0;
            }
            else {
                i++;
            }
            this.viewMode = viewModes[i];
            viewModeToggle.textContent = this.viewMode;
        });
        this.viewMode = "splitscreen";
        this.$header.appendChild(viewModeToggle);
        this.$header.addEventListener("click", event => {
            let target = event.target;
            while (target && target.tagName.toLowerCase() != "mpc-module-header") {
                target = target.parentElement;
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
    get viewMode() {
        return this._viewMode;
    }
    set viewMode(value) {
        if (value == "fullscreen" ||
            value == "splitscreen") {
            this._viewMode = value;
            this.element.setAttribute("view-mode", value);
        }
    }
    attachModule(module) {
        this.$moduleHeaders.appendChild(module.header);
        this.element.appendChild(module.element);
        this.$moduleHeaderMap.set(module.header, module);
        this.modules.push(module);
        if (!this.$activeModule) {
            this.$activeModule = module;
            this.$activeModule.onfocus();
            this.$activeModule.header.setAttribute("active", "");
            this.$activeModule.element.setAttribute("active", "");
        }
        module.onattach(this);
    }
    removeModule(module) {
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
        this.modules.splice(index, 1);
    }
}
ModuleHost.version = "2019-11-05";
class ExtendableModule extends EventTarget {
    constructor(options) {
        super();
        this.element = document.createElement("mpc-module");
        this.header = document.createElement("mpc-module-header");
        this.element.setAttribute("type", options.type);
        this.header.textContent = options.name;
    }
    onfocus() { }
    onblur() { }
    onattach(host) { }
}
ExtendableModule.version = "2019-11-05";
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
class ExtendableExpander {
    constructor(options = {}) {
        this.details = document.createElement("mpc-expander");
        this.summary = document.createElement("mpc-expander-label");
        this.$wasExpanded = false;
        this.details.appendChild(this.summary);
        this.summary.addEventListener("click", event => {
            if (this.$expandable && !this.details.hasAttribute("open")) {
                this.details.setAttribute("open", "");
                typeof this.$onexpand == "function" && this.$onexpand.call(this, event);
                if (this.$wasExpanded == false) {
                    this.$wasExpanded = true;
                }
            }
            else {
                this.details.removeAttribute("open");
                typeof this.$oncollapse == "function" && this.$oncollapse.call(this, event);
            }
            event.preventDefault();
        });
        this.$onexpand = options.onexpand || null;
        this.$oncollapse = options.oncollapse || null;
    }
    get $expandable() {
        return this.details.hasAttribute("expandable");
    }
    set $expandable(value) {
        if (value) {
            this.details.setAttribute("expandable", "");
        }
        else {
            this.details.removeAttribute("expandable");
        }
    }
}
ExtendableExpander.version = "2019-11-05";
class Expander extends ExtendableExpander {
    constructor(options) {
        super(options);
        this.label = options.label;
    }
    get label() {
        return this.summary.innerHTML;
    }
    set label(value) {
        this.summary.innerHTML = value;
    }
    get expandable() {
        return this.$expandable;
    }
    set expandable(value) {
        this.$expandable = value;
    }
    get wasExpanded() {
        return this.$wasExpanded;
    }
    set wasExpanded(value) {
        this.$wasExpanded = value;
    }
    get onexpand() {
        return this.$onexpand;
    }
    set onexpand(value) {
        this.$onexpand = value;
    }
    get oncollapse() {
        return this.$oncollapse;
    }
    set oncollapse(v) {
        this.$oncollapse = v;
    }
}
Expander.version = "2019-11-05";
class PropertyExpander extends ExtendableExpander {
    constructor(options) {
        super();
        this.property = options.property;
        switch (this.toType()) {
            case "boolean":
                this.$boolean();
                break;
            case "function":
                this.$function();
                break;
            case "iterable":
                this.$iterable();
                break;
            case "null":
                this.$null();
                break;
            case "number":
                this.$number();
                break;
            case "object":
                this.$object();
                break;
            case "regexp":
                this.$regexp();
                break;
            case "string":
                this.$string();
                break;
            case "symbol":
                this.$symbol();
                break;
            default:
                throw "Cannot handle typeof property: " + typeof this.property;
        }
        this.summary.innerHTML = '<mpc-property-expander-value type="' + (this.details.getAttribute("type") || "").replace("-property", "") + '">' + this.summary.innerHTML + '</mpc-property-expander-value>';
    }
    $createValue(prop) {
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
    $createGet(prop) {
        var placeholder = document.createElement(this.details.tagName);
        placeholder.setAttribute("type", "property-placeholder");
        placeholder.innerHTML = '<mpc-expander-label><mpc-property-expander-key type="' + prop.type + '">' + prop.key.toString() + '</mpc-property-expander-key>: <mpc-property-expander-value type="placeholder">(...)</mpc-property-expander-value></mpc-expander-label>';
        placeholder.addEventListener("click", () => {
            var expander;
            try {
                expander = new PropertyExpander({
                    property: prop.get.call(this.property)
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
    }
    $createGetter(prop) {
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
    $createSetter(prop) {
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
    $propertySorter(a, b) {
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
    }
    $properties() {
        this.$expandable = true;
        this.$onexpand = () => {
            if (!this.$wasExpanded) {
                var values = Object.create(null);
                var prototypes = [];
                var tmp = this.property;
                do {
                    prototypes.unshift(tmp);
                } while (tmp = Object.getPrototypeOf(tmp));
                prototypes.forEach(tmp => {
                    Object.getOwnPropertyNames(tmp).forEach(name => {
                        var desc = Object.getOwnPropertyDescriptor(tmp, name);
                        if (desc && ("get" in desc || tmp === this.property)) {
                            values[name] = Object.assign(desc, {
                                key: name,
                                type: isNaN(parseInt(name)) ? "string" : "number",
                                owner: tmp
                            });
                        }
                    });
                    Object.getOwnPropertySymbols(tmp).forEach(name => {
                        var desc = Object.getOwnPropertyDescriptor(tmp, name);
                        if (desc && ("get" in desc || tmp === this.property)) {
                            values[name] = Object.assign(desc, {
                                key: name,
                                type: "symbol",
                                owner: tmp
                            });
                        }
                    });
                });
                [].concat(Object.getOwnPropertyNames(values), Object.getOwnPropertySymbols(values)).sort(this.$propertySorter).forEach(key => {
                    var prop = values[key];
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
        };
    }
    $boolean() {
        this.details.setAttribute("type", "boolean-property");
        this.summary.textContent = this.property.toString();
    }
    $function() {
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
    }
    $iterable() {
        this.details.setAttribute("type", "iterable-property");
        this.summary.textContent = this.property.constructor.name + "[" + this.property.length + "]";
        this.$properties();
    }
    $null() {
        this.details.setAttribute("type", "null-property");
        this.summary.textContent = String(this.property);
    }
    $number() {
        this.details.setAttribute("type", "number-property");
        this.summary.textContent = this.property.toString();
    }
    $object() {
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
    }
    $regexp() {
        this.details.setAttribute("type", "regexp-property");
        this.summary.textContent = this.property.toString();
        this.$properties();
    }
    $string() {
        this.details.setAttribute("type", "string-property");
        this.summary.textContent = '"' + this.property + '"';
    }
    $symbol() {
        this.details.setAttribute("type", "symbol-property");
        this.summary.textContent = this.property.toString();
    }
    toType() {
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
    }
}
PropertyExpander.version = "2019-11-05";
class NodeExpander extends ExtendableExpander {
    constructor(options) {
        super();
        this.node = options.node;
        switch (this.node.nodeType) {
            case this.node.ELEMENT_NODE:
                this.$elementNode();
                break;
            case this.node.ATTRIBUTE_NODE:
                this.$attributeNode();
                break;
            case this.node.TEXT_NODE:
                this.$textNode();
                break;
            case this.node.CDATA_SECTION_NODE:
                this.$cdataSectionNode();
                break;
            case this.node.PROCESSING_INSTRUCTION_NODE:
                this.$processingInstructionNode();
                break;
            case this.node.COMMENT_NODE:
                this.$commentNode();
                break;
            case this.node.DOCUMENT_NODE:
                this.$documentNode();
                break;
            case this.node.DOCUMENT_TYPE_NODE:
                this.$documentTypeNode();
                break;
            case this.node.DOCUMENT_FRAGMENT_NODE:
                this.$documentFragmentNode();
                break;
            default:
                throw "Cannot handle nodeType: " + this.node.nodeType;
        }
    }
    static isNode(object) {
        if (!(typeof object == "object" && object !== null) ||
            !("nodeName" in object && "nodeType" in object && "nodeValue" in object) ||
            !("DOCUMENT_NODE" in object)) {
            return false;
        }
        if (object.nodeType == object.DOCUMENT_NODE) {
            if (!("defaultView" in object && typeof object.defaultView == "object" && object.defaultView !== null) ||
                !("Node" in object.defaultView && typeof object.defaultView.Node == "function") ||
                !(object instanceof object.defaultView.Node)) {
                return false;
            }
        }
        else if (!("ownerDocument" in object && typeof object.ownerDocument == "object" && object.ownerDocument !== null) ||
            !("defaultView" in object.ownerDocument && typeof object.ownerDocument.defaultView == "object" && object.ownerDocument.defaultView !== null) ||
            !("Node" in object.ownerDocument.defaultView && typeof object.ownerDocument.defaultView.Node == "function") ||
            !(object instanceof object.ownerDocument.defaultView.Node)) {
            return false;
        }
        return true;
    }
    $elementNode() {
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
        this.$expandable = (this.node.shadowRoot !== null) || this.node.hasChildNodes();
        if (this.node instanceof this.node.ownerDocument.defaultView.HTMLIFrameElement) {
            try {
                this.node.contentDocument;
                this.$expandable = true;
            }
            catch (e) { }
        }
        if (this.$expandable) {
            summaryStart += "&gt;";
            var summaryEnd = "&lt;/" + this.node.localName + "&gt;";
            summaryText = summaryStart + "\u2026" + summaryEnd;
            var lastChild = document.createElement("mpc-expander-label");
            lastChild.innerHTML = summaryEnd;
            this.details.appendChild(lastChild);
            this.$oncollapse = () => {
                this.summary.innerHTML = summaryText;
            };
            this.$onexpand = () => {
                this.summary.innerHTML = summaryStart;
                if (this.node instanceof this.node.ownerDocument.defaultView.HTMLIFrameElement) {
                    try {
                        let expander = new NodeExpander({
                            node: this.node.contentDocument
                        });
                        expander.summary.appendChild(document.createTextNode(" "));
                        let i = document.createElement("i");
                        i.textContent = "(" + this.node.contentDocument.URL + ")";
                        expander.summary.appendChild(i);
                        this.details.insertBefore(expander.details, lastChild);
                    }
                    catch (e) { }
                }
                if (!this.$wasExpanded) {
                    if (this.node.shadowRoot) {
                        this.details.insertBefore(new NodeExpander({
                            node: this.node.shadowRoot
                        }).details, lastChild);
                    }
                    var chldIndex = 0;
                    var chldLength = this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        this.details.insertBefore(new NodeExpander({
                            node: this.node.childNodes[chldIndex]
                        }).details, lastChild);
                    }
                }
            };
        }
        this.summary.innerHTML = summaryText;
    }
    $attributeNode() {
        this.details.setAttribute("type", "attribute-node");
        var attrText = " <mpc-node-expander-attr-name>" + this.node.localName + "</mpc-node-expander-attr-name>";
        if (this.node.nodeValue) {
            attrText += '="<mpc-node-expander-attr-value>' + this.node.nodeValue + '</mpc-node-expander-attr-value>"';
        }
        this.summary.innerHTML = attrText;
    }
    $textNode() {
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
    }
    $cdataSectionNode() {
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
    }
    $processingInstructionNode() {
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
    }
    $commentNode() {
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
    }
    $documentNode() {
        this.details.setAttribute("type", "document-node");
        this.summary.textContent = this.node.nodeName;
        if (this.$expandable = this.node.hasChildNodes()) {
            this.$onexpand = () => {
                if (!this.$wasExpanded) {
                    var chldIndex = 0;
                    var chldLength = this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        this.details.appendChild(new NodeExpander({
                            node: this.node.childNodes[chldIndex]
                        }).details);
                    }
                }
            };
        }
    }
    $documentTypeNode() {
        this.details.setAttribute("type", "document-type-node");
        var summaryText = document.createElement("mpc-node-expander-document-type");
        summaryText.textContent = "<!DOCTYPE " + this.node.nodeName + ">";
        this.summary.appendChild(summaryText);
    }
    $documentFragmentNode() {
        this.details.setAttribute("type", "document-fragment-node");
        if (this.node instanceof this.node.ownerDocument.defaultView.ShadowRoot) {
            this.summary.textContent = "#shadow-root (" + this.node.mode + ")";
        }
        else {
            this.summary.textContent = this.node.nodeName;
        }
        if (this.$expandable = this.node.hasChildNodes()) {
            this.$onexpand = () => {
                if (!this.$wasExpanded) {
                    var chldIndex = 0;
                    var chldLength = this.node.childNodes.length;
                    for (chldIndex; chldIndex < chldLength; chldIndex++) {
                        if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
                            continue;
                        }
                        this.details.appendChild(new NodeExpander({
                            node: this.node.childNodes[chldIndex]
                        }).details);
                    }
                }
            };
        }
    }
}
NodeExpander.version = "2019-11-05";
class ConsoleModule extends ExtendableModule {
    constructor(target = null) {
        super({
            name: "Console",
            type: "console"
        });
        this.$functions = [
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
        this.consoleProxy = null;
        this.target = null;
        this.$lines = document.createElement("mpc-console-lines");
        this.$output = this.$lines;
        this.$counter = {};
        this.$groups = [];
        this.$timer = {};
        this.preserveLog = false;
        this._errorListener = ((event) => {
            try {
                var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
                if ("colno" in event) {
                    args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
                    args.push(event.colno);
                }
                this.$createLine(args, "error");
            }
            catch (e) {
                this.$createLine(["Uncaught:", e], "error");
            }
        }).bind(this);
        this.element.appendChild(this.$lines);
        var $input = document.createElement("mpc-console-input-line");
        this.element.appendChild($input);
        var $this = this;
        this.$codeMirror = CodeMirror($input, {
            mode: "javascript",
            tabSize: 2,
            indentWithTabs: false,
            lineWrapping: true,
            showCursorWhenSelecting: true,
            extraKeys: {
                Enter(codeMirror) {
                    var value = codeMirror.getValue().trim();
                    if (value != "") {
                        try {
                            var line = document.createElement("mpc-console-line");
                            line.setAttribute("type", "input");
                            $this.$output.appendChild(line);
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
                "Shift-Enter"(codeMirror) {
                    codeMirror.replaceSelection("\n");
                },
                "Ctrl-L"() {
                    $this.$clear();
                }
            }
        });
        this.bind(target);
    }
    $eval(code) {
        if (this.target) {
            return this.target.eval.call(null, code);
        }
        else {
            this.$createLine(["Failed to evaluate '%s': console is not linked to a window", code], "error");
            return null;
        }
    }
    $toString(value) {
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
    $createLine(args, type) {
        var line = document.createElement("mpc-console-line");
        var index = 0;
        var length = args.length;
        if (typeof args[0] == "string") {
            var regexp = /%[sidfoOc]/;
            var tmp = line;
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
    }
    $clear() {
        while (this.$lines.firstChild) {
            DOMHelper.remove(this.$lines.firstChild);
        }
        this.$output = this.$lines;
    }
    assert(test, message, ...optionalParams) {
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
    }
    clear() {
        this.$clear();
        this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
    }
    count(countTitle) {
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
    }
    debug(message, ...optionalParams) {
        this.$createLine(arguments, "debug");
    }
    dir(value) {
        this.$createLine(["%O", value], "dir");
    }
    dirxml(value) {
        this.$createLine(["%o", value], "dirxml");
    }
    error(message, ...optionalParams) {
        this.$createLine(arguments, "error");
    }
    group(groupTitle, ...optionalParams) {
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
    groupCollapsed(groupTitle, ...optionalParams) {
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
    groupEnd() {
        if (0 in this.$groups) {
            this.$output = this.$groups.pop();
        }
    }
    info(message, ...optionalParams) {
        this.$createLine(arguments, "info");
    }
    log(message, ...optionalParams) {
        this.$createLine(arguments, "log");
    }
    time(timerName) {
        var $timerName = "$" + timerName;
        if ($timerName in this.$timer === false) {
            this.$timer[$timerName] = Date.now();
        }
    }
    timeEnd(timerName) {
        var $timerName = "$" + timerName;
        var $time = 0;
        if ($timerName in this.$timer) {
            $time = Date.now() - this.$timer[$timerName];
            delete this.$timer[$timerName];
        }
        this.log("%s: %fms", timerName || "default", $time);
    }
    warn(message, ...optionalParams) {
        this.$createLine(arguments, "warn");
    }
    bind(target) {
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
            const $this = this;
            try {
                this.target.console = this.consoleProxy = new Proxy(this.target.console, {
                    get($target, p) {
                        if (p in $target === false) {
                            return;
                        }
                        if ($this.target === target && $this.$functions.indexOf(p) >= 0 && p in $this) {
                            return function () {
                                $this[p].apply($this, arguments);
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
    }
    onattach(host) {
        super.onattach(host);
        this.header.click();
    }
}
ConsoleModule.version = "2019-11-05";
class PageViewModule extends ExtendableModule {
    constructor(url = "about:blank") {
        super({
            name: "PageView",
            type: "pageview"
        });
        this.iframe = document.createElement("iframe");
        this.iframe.src = url;
        this.console = new ConsoleModule();
        this.iframe.addEventListener("load", () => {
            if (this.iframe.contentWindow) {
                this.console.bind(this.iframe.contentWindow);
            }
        });
        this.element.appendChild(this.iframe);
    }
    onattach(host) {
        super.onattach(host);
        host.attachModule(this.console);
    }
}
PageViewModule.version = "2019-11-05";
//# sourceMappingURL=devtools.js.map