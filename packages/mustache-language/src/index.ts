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
  { tag: t.content, class: 'mustache-content' },
])
const mustacheHighlighting = syntaxHighlighting(highlightStyle)

export const mustacheLanguage = LRLanguage.define({
  name: 'mustache',
  parser: parser.configure({
    props: [
      foldNodeProp.add({
        Mustache: foldInside, // Allow Mustache blocks to fold
      }),
      styleTags({
        LineComment: t.lineComment,
        MustacheStart: t.bracket, // Highlight `{{` as a bracket
        MustacheEnd: t.bracket, // Highlight `}}` as a bracket
        MustacheContent: t.content, // Highlight Mustache content

        MustacheIdentifier: t.variableName, // Highlight Identifiers within MustacheContent
        Identifier: t.name, // Highlight Identifiers globally
      }),
    ],
  }),
})

export function mustache() {
  return new LanguageSupport(mustacheLanguage, [mustacheHighlighting])
}
