import React from 'react'
import PropTypes from 'prop-types'

import enhanceReactChildren from './enhanceReactChildren'

import { getDisplayName, isStateless } from './utils/utils'

const transparentHighjacker = (InnerComponent, callback, componentsToWatch) => {
  // const ComposedComponent = NormalizeComponent(InnerComponent)
  const component = InnerComponent
  let ComposedComponent = component

  // Managing component without state (functional component)
  if (isStateless(ComposedComponent)) {
    ComposedComponent = class extends React.Component {
      render() {
        return component(this.props)
      }
    }
    ComposedComponent.displayName = getDisplayName(component)
  }

  
  class TransparentHighjacker extends ComposedComponent {
    render() {
      // Here we need to apply the same principle as SizeFetcher and enhance the inner component
      const innerElementsTree = super.render()
      if (!innerElementsTree) return null

      const newChildren = enhanceReactChildren(innerElementsTree.props.children, callback, componentsToWatch)
      const newElementsTree = React.cloneElement(innerElementsTree, innerElementsTree.props, newChildren)

      return newElementsTree
    }
  }

  TransparentHighjacker.displayName = getDisplayName(InnerComponent)

  return TransparentHighjacker
}

export default transparentHighjacker
