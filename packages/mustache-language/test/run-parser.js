import { classHighlighter, highlightCode } from '@lezer/highlight'
import { mustache, mustacheLanguage } from '../dist/index.js'

const tree = mustacheLanguage.parser.parse('{{variable}}')
console.log(tree.toString())

const text1 = `
# This is the comment
; This is the comment
{{variable{{variable2}}}}
`

const tree1 = mustacheLanguage.parser.parse(text1)
console.log(tree1.toString())

const text2 = `
{{}}
`

const tree2 = mustacheLanguage.parser.parse(text2)
console.log(tree2.toString())

const text3 = `
greetings={{g-a}}
`
console.log(`text3`, text3, mustacheLanguage.parser.parse(text3).toString())

function emit(text, classes) {
  console.log(`text:`, text, `,`, `classes:`, classes)
}
function emitBreak() {
  console.log(`break`)
}

const lang = mustache()

highlightCode(
  text3,
  lang.language.parser.parse(text3),
  classHighlighter,
  emit,
  emitBreak
)
