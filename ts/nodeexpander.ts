/// <reference path="expander.ts" />

class NodeExpander<N extends Node> extends ExtendableExpander {
  public static readonly version = "2019-11-05";
  public static isNode(object: Node | any) {
    if (
      !(typeof object == "object" && object !== null) ||
      !("nodeName" in object && "nodeType" in object && "nodeValue" in object) ||
      !("DOCUMENT_NODE" in object)
    ) {
      return false;
    }
    if (object.nodeType == object.DOCUMENT_NODE) {
      if (
        !("defaultView" in object && typeof object.defaultView == "object" && object.defaultView !== null) ||
        !("Node" in object.defaultView && typeof object.defaultView.Node == "function") ||
        !(object instanceof object.defaultView.Node)
      ) {
        return false;
      }
    } else if (
      !("ownerDocument" in object && typeof object.ownerDocument == "object" && object.ownerDocument !== null) ||
      !("defaultView" in object.ownerDocument && typeof object.ownerDocument.defaultView == "object" && object.ownerDocument.defaultView !== null) ||
      !("Node" in object.ownerDocument.defaultView && typeof object.ownerDocument.defaultView.Node == "function") ||
      !(object instanceof object.ownerDocument.defaultView.Node)
    ) {
      return false;
    }
    return true;
  }
  public constructor(options: NodeExpander.Options<N>) {
    super();
    this.node = options.node;
    switch (this.node.nodeType) {
      case this.node.ELEMENT_NODE:
        (<NodeExpander<Element>><unknown>this).$elementNode();
        break;
      case this.node.ATTRIBUTE_NODE:
        (<NodeExpander<Attr>><unknown>this).$attributeNode();
        break;
      case this.node.TEXT_NODE:
        (<NodeExpander<Text>><unknown>this).$textNode();
        break;
      case this.node.CDATA_SECTION_NODE:
        (<NodeExpander<CDATASection>><unknown>this).$cdataSectionNode();
        break;
      case this.node.PROCESSING_INSTRUCTION_NODE:
        (<NodeExpander<ProcessingInstruction>><unknown>this).$processingInstructionNode();
        break;
      case this.node.COMMENT_NODE:
        (<NodeExpander<Comment>><unknown>this).$commentNode();
        break;
      case this.node.DOCUMENT_NODE:
        (<NodeExpander<Document>><unknown>this).$documentNode();
        break;
      case this.node.DOCUMENT_TYPE_NODE:
        (<NodeExpander<DocumentType>><unknown>this).$documentTypeNode();
        break;
      case this.node.DOCUMENT_FRAGMENT_NODE:
        (<NodeExpander<DocumentFragment>><unknown>this).$documentFragmentNode();
        break;
      default:
        throw "Cannot handle nodeType: " + this.node.nodeType;
    }
  }
  public readonly node: N;
  protected $elementNode(this: NodeExpander<Element>) {
    this.details.setAttribute("type", "element-node");
    var summaryStart = "&lt;" + this.node.localName;
    var attrIndex = 0;
    var attrLength = this.node.attributes.length;
    var attribute: Attr;
    for (attrIndex; attrIndex < attrLength; attrIndex++) {
      attribute = this.node.attributes[attrIndex];
      summaryStart += " <mpc-node-expander-attr-name>" + attribute.localName + "</mpc-node-expander-attr-name>";
      if (attribute.nodeValue) {
        summaryStart += '="<mpc-node-expander-attr-value>' + attribute.nodeValue + '</mpc-node-expander-attr-value>"';
      }
    }
    var summaryText = summaryStart + " />";
    this.$expandable = (this.node.shadowRoot !== null) || this.node.hasChildNodes();
    if (this.node instanceof (<{ HTMLIFrameElement: typeof HTMLIFrameElement; }><unknown>this.node.ownerDocument.defaultView).HTMLIFrameElement) {
      try {
        this.node.contentDocument;
        this.$expandable = true;
      } catch (e) { }
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
      }
      this.$onexpand = () => {
        this.summary.innerHTML = summaryStart;
        if (this.node instanceof (<{ HTMLIFrameElement: typeof HTMLIFrameElement; }><unknown>(<Document>this.node.ownerDocument).defaultView).HTMLIFrameElement) {
          try {
            let expander = new NodeExpander({
              node: this.node.contentDocument
            });
            expander.summary.appendChild(document.createTextNode(" "));
            let i = document.createElement("i");
            i.textContent = "(" + this.node.contentDocument.URL + ")";
            expander.summary.appendChild(i);
            this.details.insertBefore(expander.details, lastChild);
          } catch (e) { }
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
      }
    }
    this.summary.innerHTML = summaryText;
  }
  protected $attributeNode(this: NodeExpander<Attr>) {
    this.details.setAttribute("type", "attribute-node");
    var attrText = " <mpc-node-expander-attr-name>" + this.node.localName + "</mpc-node-expander-attr-name>";
    if (this.node.nodeValue) {
      attrText += '="<mpc-node-expander-attr-value>' + this.node.nodeValue + '</mpc-node-expander-attr-value>"';
    }
    this.summary.innerHTML = attrText;
  }
  protected $textNode(this: NodeExpander<Text>) {
    this.details.setAttribute("type", "text-node");
    if (this.node.nodeValue) {
      var detailsText = document.createElement("mpc-node-expander-text");
      detailsText.textContent = this.node.nodeValue;
      if (/\n/.test(this.node.nodeValue)) {
        this.summary.textContent = this.node.nodeName;
        this.details.appendChild(detailsText);
        this.$expandable = true;
      } else {
        this.summary.appendChild(detailsText);
      }
    } else {
      this.summary.textContent = this.node.nodeName;
    }
  }
  protected $cdataSectionNode(this: NodeExpander<CDATASection>) {
    this.details.setAttribute("type", "cdata-node");
    var detailsText = document.createElement("mpc-node-expander-cdata");
    detailsText.textContent = "<![CDATA[" + this.node.nodeValue + "]]>";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.details.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $processingInstructionNode(this: NodeExpander<ProcessingInstruction>) {
    this.details.setAttribute("type", "processing-instruction-node");
    var detailsText = document.createElement("text");
    detailsText.textContent = "<?" + this.node.nodeName + " " + this.node.nodeValue + "?>";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.details.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $commentNode(this: NodeExpander<Comment>) {
    this.details.setAttribute("type", "comment-node");
    var detailsText = document.createElement("mpc-node-expander-comment");
    detailsText.textContent = "<!--" + this.node.nodeValue + "-->";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.details.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $documentNode(this: NodeExpander<Document>) {
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
      }
    }
  }
  protected $documentTypeNode(this: NodeExpander<DocumentType>) {
    this.details.setAttribute("type", "document-type-node");
    var summaryText = document.createElement("mpc-node-expander-document-type");
    summaryText.textContent = "<!DOCTYPE " + this.node.nodeName + ">";
    this.summary.appendChild(summaryText);
  }
  protected $documentFragmentNode(this: NodeExpander<DocumentFragment>) {
    this.details.setAttribute("type", "document-fragment-node");
    if (this.node instanceof (<{ ShadowRoot: typeof ShadowRoot; }><unknown>this.node.ownerDocument.defaultView).ShadowRoot) {
      this.summary.textContent = "#shadow-root (" + this.node.mode + ")";
    } else {
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
      }
    }
  }
}

declare namespace NodeExpander {
  interface Options<N extends Node> {
    node: N
  }
}
