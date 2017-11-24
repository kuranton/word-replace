import React, { Component } from 'react'
import {Editor, EditorState, ContentState, CompositeDecorator, SelectionState, Modifier} from 'draft-js'
import Save from './Save'
import './App.css'

const styles = {
  'blueUpper': {
    textTransform: 'uppercase',
    color: 'blue'
  },
  'bold': {
    fontWeight: 'bold'
  },
  'greenBold': {
    fontWeight: 'bold',
    color: 'green'
  },
  'orangeBold': {
    fontWeight: 'bold',
    color: 'orange'
  }
}

const templates = [
  {
    regex: /\band\b/gi,
    style: 'blueUpper'
  },
  {
    regex: /\bor\b/gi,
    style: 'blueUpper'
  },
  {
    regex: /\blower(\sthan)?\b/gi,
    style: 'bold'
  },
  {
    regex: /\bhigher(\sthan)?\b/gi,
    style: 'bold'
  },
  {
    regex: /\bexponential\smoving\saverage\b/gi,
    style: 'greenBold'
  },
  {
    regex: /\b(simple\s)?moving\saverage\b/gi,
    style: 'orangeBold'
  }
]

const decorators = templates.map(template => {
  const {regex, style} = template
  return ({
    strategy: makeStrategyHandler(regex),
    component: makeDecoratorComponent(style)
  })
})

const compositeDecorator = new CompositeDecorator([...decorators]);

function makeDecoratorComponent(style) {
  const DecoratorComponent = (props) => {
    return <span style={styles[style]}>{props.children}</span>
  }
  return DecoratorComponent
}

function makeStrategyHandler(handleRegex) {
  return function(contentBlock, callback, contentState) {
    findWithRegex(handleRegex, contentBlock, callback)
  }
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '01ea24d5-f5e9-419f-9f3c-3187fac54242',
      editorState: EditorState.createEmpty(compositeDecorator)
    }
  }

  componentWillMount() {
    this.getPersonalLink()
  }

  getPersonalLink() {
    let promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('GET', `https://evening-savannah-67907.herokuapp.com/api/v1/sys/signals/${this.state.user}`, false)

      xhr.onload = () => {
        if (xhr.status !== 200) {
          reject('Error receiving your saved content from server')
        } else {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        }
      }
      xhr.onerror = () => {
        reject('Unable to save')
      }

      xhr.send()
    })

    promise.then(response => {
      console.log(response)
      if(response.content) {
        const content = ContentState.createFromText(response.content)
        this.setState({
          editorState: EditorState.createWithContent(content, compositeDecorator)
        })
      }
    }, error => {
      alert(error)
      console.log(error)
    })
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    })
  }

  render() {
    return(
      <div className="container">
        <Editor
          className={'editor'}
          editorState={this.state.editorState}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
        <Save
          user={this.state.user}
          content={this.state.editorState.getCurrentContent().getPlainText( )}
        />
      </div>
    );
  }
}

export default App
