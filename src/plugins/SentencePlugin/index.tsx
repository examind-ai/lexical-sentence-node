import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, TextNode, ParagraphNode } from 'lexical';
import { useEffect } from 'react';
import {
  $createSentenceNode,
  SentenceNode,
} from '../../nodes/SentenceNode';
import { $wrapNodeInElement } from '@lexical/utils';

const paragraphType = ParagraphNode.getType();
const sentenceType = SentenceNode.getType();

const textNodeTransform = (node: TextNode) => {
  const parent = node.getParent();
  if (parent === null) return;

  const parentType = parent.getType();

  if (parentType === sentenceType) return;

  if (parentType === paragraphType)
    $wrapNodeInElement(node, $createSentenceNode);
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
