import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalEditor,
  TextNode,
  ParagraphNode,
  $createTextNode,
} from 'lexical';
import { useEffect } from 'react';
import {
  $createSentenceNode,
  SentenceNode,
} from '../../nodes/SentenceNode';
import { $wrapNodeInElement } from '@lexical/utils';

const paragraphType = ParagraphNode.getType();
const sentenceType = SentenceNode.getType();

const wrapSentence = (node: TextNode) => {
  $wrapNodeInElement(node, $createSentenceNode);
};

const splitSentencesOnPeriods = (
  parent: SentenceNode,
  node: TextNode,
) => {
  // If there are non-space characters after a period, split into a new sentence.
  if (!/\.\s+[^ \n\t]/.test(node.getTextContent())) return;

  // Split on first character after a period followed by whitespaces.
  const parts = node.getTextContent().split(/(?<=\.\s*)(?=[^ \n\t])/);

  if (parts.length < 2) return;

  const [first, ...rest] = parts;
  node.replace($createTextNode(first));
  let lastSentence = parent;
  for (const part of rest) {
    const newSentence = $createSentenceNode();
    const newTextNode = $createTextNode(part);
    newSentence.append(newTextNode);
    lastSentence.insertAfter(newSentence);
    lastSentence = newSentence;
    newTextNode.select(); // Reposition focus, otherwise it'll be focused at the end of the first text node
  }
};

const textNodeTransform = (node: TextNode) => {
  if (!node.isSimpleText()) return;

  const parent = node.getParent();
  if (parent === null) return;

  const parentType = parent.getType();

  if (parentType === paragraphType) wrapSentence(node);
  else if (parentType === sentenceType)
    splitSentencesOnPeriods(parent, node);
};

const useSentencePlugin = (editor: LexicalEditor) => {
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, textNodeTransform);
  }, [editor]);
};

const SentencePlugin = () => {
  const [editor] = useLexicalComposerContext();
  useSentencePlugin(editor);
  return null;
};

export default SentencePlugin;
