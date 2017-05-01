import React from 'react'
import PropTypes from 'prop-types'

import NormalComponent from './NormalComponent'

class ComposedNormalComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      unusedComposedState: null,
    }
  }
  render() {
    const { content, subContent, lifeCycleCallback } = this.props

    return (
      <div className="composed-normal-component">
        <h1>Component</h1>
        <p>{content}</p>
        <h1>Sub Component</h1>
        <NormalComponent content={subContent} lifeCycleCallback={lifeCycleCallback} />
      </div>
    )
  }
}

ComposedNormalComponent.propTypes = {
  content: PropTypes.string.isRequired,
  subContent: PropTypes.string.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default ComposedNormalComponent
