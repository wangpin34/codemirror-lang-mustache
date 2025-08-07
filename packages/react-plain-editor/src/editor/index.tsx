import { EditorState } from '@codemirror/state';
import { useCallback, useState } from 'react';
import './editor.css';
import useCodeMirror from './use-codemirror';

function Editor() {
  const [doc, setDoc] = useState('{{token}}');
  const handleChange = useCallback((state: EditorState) => {
    setDoc(state.doc.toString());
  }, []);

  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: doc,
    onChange: handleChange,
    variables: { token: 'the token value' },
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

  return (
    <main>
      <section>
        <button onClick={cleanDoc}>Clean</button>
      </section>
      <div className="editor-wrapper h-full" ref={refContainer}></div>
    </main>
  );
}

export default Editor;
