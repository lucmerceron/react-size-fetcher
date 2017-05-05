import React from 'react'
import PropTypes from 'prop-types'

class ComponentToObserve extends React.Component {
  render() {
    return (
      <div className="normal-component">
        {this.props.children}
      </div>
    )
  }
}

ComponentToObserve.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ComponentToObserve
