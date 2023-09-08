import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalEditor,
  TextNode,
  $createTextNode,
  $isLineBreakNode,
  $isParagraphNode,
} from 'lexical';
import { useEffect } from 'react';
import {
  $createSentenceNode,
  $isSentenceNode,
  SentenceNode,
} from '../../nodes/SentenceNode';
import { $wrapNodeInElement } from '@lexical/utils';

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
  // Warning: lookbehind support was introduced in Safari 16.4 (March 25, 2023), so we'll need to patch this to support older browsers: https://caniuse.com/js-regexp-lookbehind
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

const moveToNewSentence = (node: TextNode) => {
  const parent = node.getParent();
  if (!$isSentenceNode(parent)) return;

  node.remove();

  const newSentence = $createSentenceNode();
  newSentence.append(node);
  parent.insertAfter(newSentence);
  node.select();
};

const textNodeTransform = (node: TextNode) => {
  if (!node.isSimpleText()) return;

  const parent = node.getParent();
  if (parent === null) return;

  if ($isParagraphNode(parent)) wrapSentence(node);
  else if ($isSentenceNode(parent))
    splitSentencesOnPeriods(parent, node);

  if ($isLineBreakNode(node.getPreviousSibling()))
    moveToNewSentence(node);
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
