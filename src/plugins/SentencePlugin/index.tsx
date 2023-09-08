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

  // (.*?\.): Captures everything up to and including the period. This is our first capturing group.
  // (\s+\S.*): Captures whitespace characters, followed by a non-whitespace character, followed by any number of other characters. This is our second capturing group.
  const matches = node.getTextContent().match(/(.*?\.)(\s+\S.*)/);

  if (!matches || matches.length < 3) return;

  const [, first, rest] = matches;
  node.setTextContent(first);

  const newSentence = $createSentenceNode();
  const newTextNode = $createTextNode(rest);
  newSentence.append(newTextNode);
  parent.insertAfter(newSentence);
  newTextNode.select(); // Reposition focus, otherwise it'll be focused at the end of the first text node
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
