import React from 'react'
import PropTypes from 'prop-types'

const FunctionalComponent = ({ content }) => (
  <div className="simple-functional-component">
    <h1>A Random Functional Title</h1>
    <h2>A Random Sub-Title</h2>
    <p>{content}</p>
  </div>
)

FunctionalComponent.propTypes = {
  content: PropTypes.string.isRequired,
}

export default FunctionalComponent
