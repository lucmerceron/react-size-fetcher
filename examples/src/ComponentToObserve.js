import React from 'react'
import PropTypes from 'prop-types'

/* eslint-disable react/prefer-stateless-function */
class ComponentToObserve extends React.Component {
  render() {
    return (
      <div className="normal-component">
        {this.props.children}
      </div>
    )
  }
}
/* eslint-enable react/prefer-stateless-function */

ComponentToObserve.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ComponentToObserve
