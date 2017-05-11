import React from 'react'
import PropTypes from 'prop-types'

class DynamicComponent extends React.Component {
  constructor() {
    super()

    this.updateState = this.updateState.bind(this)
    this.state = {
      dynamicState: 'Default',
    }
  }
  componentDidMount() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('didMount')
    this.updateState()
  }
  componentDidUpdate() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('didUpdate')
  }

  updateState() {
    this.setState({ dynamicState: 'Dynamic' })
  }

  render() {
    const { dynamicState } = this.state
    const { content } = this.props

    return (
      <div className="simple-dynamic-component">
        <h1><span>A Random Title</span></h1>
        <h2>A Random Sub-Title</h2>
        <p>{content}</p>
        <p>{dynamicState}</p>
      </div>
    )
  }
}

DynamicComponent.propTypes = {
  content: PropTypes.string.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default DynamicComponent
