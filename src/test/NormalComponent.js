import React from 'react'
import PropTypes from 'prop-types'

class NormalComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      unusedState: null,
    }
  }
  componentDidMount() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('didMount')
  }
  componentWillReceiveProps() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('willReceiveProps')
  }
  componentDidUpdate() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('didUpdate')
  }
  componentWillUnmount() {
    const { lifeCycleCallback } = this.props

    lifeCycleCallback('willUnmount')
  }
  render() {
    const { content } = this.props

    return (
      <div className="simple-normal-component">
        <h1>A Random Title</h1>
        <h2>A Random Sub-Title</h2>
        <p>{content}</p>
      </div>
    )
  }
}

NormalComponent.propTypes = {
  content: PropTypes.string.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default NormalComponent
