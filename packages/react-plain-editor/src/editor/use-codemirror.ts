/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  HighlightStyle,
  LanguageSupport,
  syntaxHighlighting,
} from '@codemirror/language';
import React, { useEffect, useRef, useState } from 'react';
//@ts-ignore
import {
  EditorState,
  RangeSetBuilder,
  StateEffect,
  StateField,
} from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  hoverTooltip,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { basicSetup } from 'codemirror';
//@ts-ignore
import { tags as t } from '@lezer/highlight';
import { mustacheLanguage } from 'codemirror-lang-mustache';

// Define a plugin to create decorations based on the variable map
const mustacheDecorationPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.createDecorations(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        update.state.field(variableMapField) !==
          update.startState.field(variableMapField)
      ) {
        this.decorations = this.createDecorations(update.view);
      }
    }

    createDecorations(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      const variableMap = view.state.field(variableMapField);
      for (const { from, to } of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);
        const word = /\{\{\s*([\w]+)\s*\}\}/g;
        let m: RegExpExecArray | null;
        while ((m = word.exec(text))) {
          const start = from + m.index;
          const end = start + m[0].length;
          const variableName = m[1];
          const variableStart = start + 2; // Position after {{
          const variableEnd = end - 2; // Position before }}
          const className = variableMap.has(variableName)
            ? 'mustache-variable'
            : 'mustache-variable not-found';
          builder.add(
            variableStart,
            variableEnd,
            Decoration.replace({
              widget: new (class extends WidgetType {
                toDOM() {
                  const span = document.createElement('span');
                  span.className = className;
                  span.textContent = variableName;
                  return span;
                }
              })(),
            }),
          );
        }
      }
      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

const mustacheTooltip = hoverTooltip((view: EditorView, pos: number) => {
  const { from, to, text } = view.state.doc.lineAt(pos);
  const start = Math.max(from, pos - 10),
    end = Math.min(to, pos + 10);
  const word = /\{\{\s*([\w]+)\s*\}\}/g;
  let m = null;
  while ((m = word.exec(text.slice(start - from, end - from)))) {
    const fromPos = start + m.index,
      toPos = fromPos + m[0].length;
    if (fromPos <= pos && toPos >= pos) {
      const variableName = m[1];
      const variableMap = view.state.field(variableMapField);
      const variableValue = variableMap.get(variableName) || 'Unknown variable';
      return {
        pos: fromPos,
        end: toPos,
        above: true,
        create: () => {
          const dom = document.createElement('div');
          dom.className = 'tooltip';
          dom.textContent = variableValue;
          return { dom };
        },
      };
    }
  }
  return null;
});

const highlightStyle = HighlightStyle.define([
  { tag: t.bracket, class: 'mustache-bracket' },
  { tag: t.variableName, class: 'mustache-variable' },
  { tag: t.special(t.content), class: 'mustache-content' },
]);
const mustacheHighlighting = syntaxHighlighting(highlightStyle);

// Define an effect to update the variable map
const setVariableMapEffect = StateEffect.define<Map<string, string>>();

const variableMapField = StateField.define<Map<string, string>>({
  create() {
    return new Map();
  },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setVariableMapEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

// Function to update the variable map
function setVariableMap(map: Map<string, string>) {
  return setVariableMapEffect.of(map);
}

const initialVariableMap = new Map<string, string>([]);

const mustacheSupport = new LanguageSupport(mustacheLanguage, [
  mustacheHighlighting,
  mustacheTooltip,
]);

export const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%',
  },
});

interface Props {
  initialDoc: string;
  variables: Record<string, string>;
  onChange?: (state: EditorState) => void;
}

const useCodeMirror = <T extends Element>({
  initialDoc,
  variables,
  onChange,
}: Props): [React.MutableRefObject<T | null>, EditorView?] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const initialDocRef = useRef<string>(initialDoc);
  const onChangeRef = useRef<((state: EditorState) => void) | undefined>(
    onChange,
  );

  useEffect(() => {
    if (!refContainer.current) return;
    if (editorView) return;

    const startState = EditorState.create({
      doc: initialDocRef.current,
      extensions: [
        basicSetup,
        mustacheSupport, // Add the Mustache syntax
        variableMapField.init(() => initialVariableMap),
        mustacheDecorationPlugin,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            if (onChangeRef.current) {
              onChangeRef.current(update.state);
            }
          }
        }),
        //transparentTheme, // Optional theme
      ],
    });
    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);

    return () => {
      view.destroy(); // Cleanup on unmount
    };
  }, [refContainer]);

  useEffect(() => {
    if (!editorView) return;
    const variableMap = new Map<string, string>(Object.entries(variables));
    editorView.dispatch({
      effects: setVariableMap(variableMap),
    });
  }, [variables, editorView]);

  return [refContainer, editorView];
};

export default useCodeMirror;
