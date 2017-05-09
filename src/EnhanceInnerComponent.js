import React from 'react'
import PropTypes from 'prop-types'

import EnhanceReactChildren from './EnhanceReactChildren'

import { getDisplayName, isStateless } from './utils/utils'

const EnhanceInnerComponent = InnerComponent => {
  // const ComposedComponent = NormalizeComponent(InnerComponent)
  const component = InnerComponent
  let ComposedComponent = component

  // Managing component without state (functional component)
  if (isStateless(ComposedComponent)) {
    if (typeof component !== 'function') {
      warning('SizeFetcher has been called with neither a React Functional or Class Component')
      return () => null
    }
    ComposedComponent = class extends React.Component {
      render() {
        return component(this.props)
      }
    }
    ComposedComponent.displayName = getDisplayName(component)
  }

  class EnhancerInnerComponent extends ComposedComponent {
    componentDidUpdate() {
      if (super.componentDidUpdate) super.componentDidUpdate(...arguments)

      this.props.sizeMayChange()
    }
    render() {
      // Here we need to apply the same principle as SizeFetcher and enhance the inner component
      const innerElementsTree = super.render()
      if (!innerElementsTree) return null

      const newChildren = EnhanceReactChildren(innerElementsTree.props.children, this.props.sizeMayChange)
      const newElementsTree = React.cloneElement(innerElementsTree, innerElementsTree.props, newChildren)

      return newElementsTree
    }
  }

  EnhancerInnerComponent.displayName = `EnhancerInner(${getDisplayName(InnerComponent)})`
  EnhancerInnerComponent.propTypes = {
    sizeMayChange: PropTypes.func.isRequired,
  }

  return EnhancerInnerComponent
}

export default EnhanceInnerComponent
