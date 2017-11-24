import React, { Component } from 'react'

class Save extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    const content = {
      user: this.props.user,
      content: this.props.content
    }
    const body = JSON.stringify(content)
    let promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      const url = `https://evening-savannah-67907.herokuapp.com/api/v1/sys/signals/${this.props.user}`

      xhr.open('PUT', 'https://evening-savannah-67907.herokuapp.com/api/v1/sys/signals/', true);

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.onload = () => {
        if (xhr.status !== 200) {
          reject('Unable to save')
        } else {
          resolve(xhr.responseText)
        }
      }
      xhr.onerror = () => {
        reject('Unable to save')
      }

      xhr.send(body)
    })

    promise.then(
      result =>alert('Successfully Saved'),
      error => alert(error)
    )
  }
  render() {
    return(
      <button
        onClick={this.handleClick}
      >
        Save
      </button>
    );
  }
}

export default Save
