import React from 'react'
import PropTypes from 'prop-types'

import FunctionalComponent from './FunctionalComponent'

const ComposedFunctionalComponent = ({ content, subContent }) => (
  <div className="composed-functional-component">
    <h1>Component</h1>
    <p>{content}</p>
    <h1>Sub Component</h1>
    <FunctionalComponent content={subContent} />
  </div>
)

ComposedFunctionalComponent.propTypes = {
  content: PropTypes.string.isRequired,
  subContent: PropTypes.string.isRequired,
}

export default ComposedFunctionalComponent
