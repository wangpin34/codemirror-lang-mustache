import { EditorState } from '@codemirror/state';
import { useCallback, useState } from 'react';
import './editor.css';
import useCodeMirror from './use-codemirror';
import { Button, Container, Link, Flex } from '@radix-ui/themes'
import { GitHubLogoIcon } from "@radix-ui/react-icons"
const DOC  = '{{name}} loves codemirror and mustache and {{other_name}}.'

function Editor() {
  const [doc, setDoc] = useState(DOC);
  const handleChange = useCallback((state: EditorState) => {
    setDoc(state.doc.toString());
  }, []);

  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: doc,
    onChange: handleChange,
    variables: { name: 'Penn Wang' },
  });
  const cleanDoc = useCallback(() => {
    if (editorView) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: '',
        },
      });
    }
  }, [editorView]);

  const resetDoc = useCallback(() => {
    if (editorView) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: DOC,

        },
      });
    }
  }, [editorView])

  return (
    <Container size="2">
      <Flex direction="column" gap="2" className="h-screen py-2">
      <section>
        <Button size="1" variant="soft" onClick={cleanDoc}>Clean</Button>
        <Button size="1" variant="soft" onClick={resetDoc}>Reset</Button>
      </section>
      <div className="flex flex-1">
        <div className="editor-wrapper h-full" ref={refContainer}></div>
      </div>
      <footer className="flex justify-end">
        <Link href="https://github.com/wangpin34/codemirror-lang-mustache">
          <GitHubLogoIcon />
        </Link>
      </footer>
      </Flex>
    </Container>
  );
}

export default Editor;
