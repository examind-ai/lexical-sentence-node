// Inspired by LexicalParagraphNode

import {
  $isTextNode,
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedElementNode,
  $isParagraphNode,
  ParagraphNode,
} from 'lexical';

export type SerializedSentenceNode = SerializedElementNode;

export class SentenceNode extends ElementNode {
  static getType(): string {
    return 'sentence';
  }

  static clone(node: SentenceNode): SentenceNode {
    return new SentenceNode(node.__key);
  }

  isInline(): boolean {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  // View

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement('sentence');
    return dom;
  }
  updateDOM(
    _prevNode: SentenceNode,
    _dom: HTMLElement,
    _config: EditorConfig,
  ): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      sentence: (_node: Node) => ({
        conversion: convertSentenceElement,
        priority: 0,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor);
    return {
      element,
    };
  }

  static importJSON(
    _serializedNode: SerializedSentenceNode,
  ): SentenceNode {
    const node = $createSentenceNode();
    return node;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: SentenceNode.getType(),
      version: 1,
    };
  }

  // Mutation

  insertNewAfter(
    _: RangeSelection,
    restoreSelection: boolean,
  ): ParagraphNode {
    const parent = this.getParentOrThrow();
    if ($isParagraphNode(parent))
      return parent.insertNewAfter(_, restoreSelection);

    // Something went wrong. We could create a SentenceNode here, but it wouldn't make sense to do that on Enter click.
    throw new Error(
      'SentenceNode must be a child of a ParagraphNode',
    );
  }

  collapseAtStart(): boolean {
    const children = this.getChildren();
    // If we have an empty (trimmed) first sentence and try and remove it,
    // delete the sentence as long as we have another sibling to go to
    if (
      children.length === 0 ||
      ($isTextNode(children[0]) &&
        children[0].getTextContent().trim() === '')
    ) {
      const nextSibling = this.getNextSibling();
      if (nextSibling !== null) {
        this.selectNext();
        this.remove();
        return true;
      }
      const prevSibling = this.getPreviousSibling();
      if (prevSibling !== null) {
        this.selectPrevious();
        this.remove();
        return true;
      }
    }
    return false;
  }
}

function convertSentenceElement(
  _element: HTMLElement,
): DOMConversionOutput {
  const node = $createSentenceNode();
  return { node };
}

export function $createSentenceNode(): SentenceNode {
  return $applyNodeReplacement(new SentenceNode());
}

export function $isSentenceNode(
  node: LexicalNode | null | undefined,
): node is SentenceNode {
  return node instanceof SentenceNode;
}
