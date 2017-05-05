import React from 'react'
import PropTypes from 'prop-types'

import ComposedDynamicComponent from './ComposedDynamicComponent'

const ThreeLevelComponent = ({ subContent, lifeCycleCallback }) => (
  <div className="three-level-composed-dynamic-component">
    <h1>Component</h1>
    <ComposedDynamicComponent content={subContent} lifeCycleCallback={lifeCycleCallback} />
  </div>
)

ThreeLevelComponent.propTypes = {
  subContent: PropTypes.string.isRequired,
  lifeCycleCallback: PropTypes.func.isRequired,
}

export default ThreeLevelComponent
