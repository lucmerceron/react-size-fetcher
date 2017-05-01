import React from 'react'
import PropTypes from 'prop-types'

import DynamicComponent from './DynamicComponent'

class ComposedDynamicComponent extends React.Component {
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
        <DynamicComponent content={subContent} lifeCycleCallback={lifeCycleCallback} />
      </div>
    )
  }
}

ComposedDynamicComponent.propTypes = {
  content: PropTypes.string.isRequired,
  subContent: PropTypes.string.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default ComposedDynamicComponent
