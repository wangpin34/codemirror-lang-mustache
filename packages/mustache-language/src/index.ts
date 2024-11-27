import {
  HighlightStyle,
  LRLanguage,
  LanguageSupport,
  foldInside,
  foldNodeProp,
  syntaxHighlighting,
} from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'
import { parser } from './syntax.grammar'

/* The `const highlightStyle` declaration is defining a custom syntax highlighting style for a specific
language feature. In this case, it is defining how certain tokens or elements should be visually
styled in the syntax highlighting of a Mustache templating language. */
const highlightStyle = HighlightStyle.define([
  { tag: t.bracket, class: 'mustache-bracket' },
  { tag: t.variableName, class: 'mustache-variable' },
  { tag: t.special(t.content), class: 'mustache-content' },
])
const mustacheHighlighting = syntaxHighlighting(highlightStyle)

export const mustacheLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      foldNodeProp.add({
        Mustache: foldInside, // Allow Mustache blocks to fold
      }),
      styleTags({
        Identifier: t.variableName,
        String: t.string,
        LineComment: t.lineComment,
        MustacheStart: t.bracket, // Highlight `{{` as a keyword or another suitable tag
        MustacheEnd: t.bracket, // Highlight `}}` as a keyword or another suitable tag
        MustacheContent: t.variableName, // Highlight Mustache content specifically
        Mustache: t.special(t.content), // Highlight Mustache content specifically
      }),
    ],
  }),
})

export function mustache() {
  return new LanguageSupport(mustacheLanguage, [mustacheHighlighting])
}
