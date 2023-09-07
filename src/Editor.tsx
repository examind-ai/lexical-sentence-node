import { LexicalComposer } from '@lexical/react/LexicalComposer';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box } from '@mui/material';
import { MuiContentEditable, placeHolderSx } from './style';
import { editorTheme } from './theme';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { SentenceNode } from './nodes/SentenceNode';
import SentencePlugin from './plugins/SentencePlugin';

const Editor = () => {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'EssayEditor',
        theme: editorTheme,
        onError: (error: Error) => {
          throw error;
        },
        nodes: [SentenceNode],
      }}
    >
      <Box sx={{ position: 'relative', background: 'white' }}>
        <RichTextPlugin
          contentEditable={<MuiContentEditable />}
          placeholder={
            <Box sx={placeHolderSx}>Enter some text...</Box>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <SentencePlugin />
      </Box>
      <TreeViewPlugin />
    </LexicalComposer>
  );
};

export default Editor;
