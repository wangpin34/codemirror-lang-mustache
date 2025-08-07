import { MyEditor } from './editor'

const editor = new MyEditor({
  initialDoc: `token={{token}}\nsecret={{secret}}`,
  dom: document.body,
})

editor.addChangeListener((doc) => {
  console.log('doc', doc)
})

editor.setVariables({ token: '123' })
