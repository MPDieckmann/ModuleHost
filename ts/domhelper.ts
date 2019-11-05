namespace DOMHelper {
  export const version = "2019-11-05";
  export function prependChild<T extends Node = Node>(newChild: T, parentNode: Node): T {
    if (parentNode.firstChild) {
      parentNode.insertBefore(newChild, parentNode.firstChild);
    } else {
      parentNode.appendChild(newChild);
    }
    return newChild;
  }
  export function insertBefore<T extends Node = Node>(newChild: T, refChild: Node): T {
    if (refChild.parentNode) {
      refChild.parentNode.insertBefore(newChild, refChild);
    } else {
      throw new DOMException("The second argument <refChild> has no parentNode");
    }
    return newChild;
  }
  export function replaceChild<T extends Node = Node>(newChild: T, oldChild: Node): T {
    if (oldChild.parentNode) {
      oldChild.parentNode.replaceChild(newChild, oldChild);
    } else {
      throw new DOMException("The second argument <oldChild> has no parentNode");
    }
    return newChild;
  }
  export function remove<T extends Node = Node>(oldChild: T): T {
    if (oldChild.parentNode) {
      oldChild.parentNode.removeChild(oldChild);
    }
    return oldChild;
  }
  export function removeChild<T extends Node = Node>(oldChild: T, parentNode: Node): T {
    parentNode.removeChild(oldChild);
    return oldChild;
  }
  export function insertAfter<T extends Node = Node>(newChild: T, refChild: Node): T {
    if (refChild.parentNode) {
      if (refChild.nextSibling) {
        refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
      } else {
        refChild.parentNode.appendChild(newChild);
      }
    } else {
      throw new DOMException("The second argument <refChild> has no parentNode");
    }
    return newChild;
  }
  export function appendChild<T extends Node = Node>(newChild: T, parentNode: Node): T {
    parentNode.appendChild(newChild);
    return newChild;
  }
}