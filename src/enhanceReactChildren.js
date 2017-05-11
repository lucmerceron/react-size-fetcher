import React from 'react'
import proxyHighjacker from './proxyHighjacker'
import transparentHighjacker from './transparentHighjacker'

import { getDisplayName } from './utils/utils'

const registeredType = {}

/*
* Enhance the child with the prop sizeMayChange
* A react Element can be of two types:
*  1. function (FTRE): Components created by the user
*  2. string (STRE): DOM nodes
*/
const enhanceReactElement = (child, callback, componentsToWatch) => {
  if (child && typeof child.type === 'function') {
    // One way to identify surely, without assumption on the name, a function
    const funcSignature = `${componentsToWatch.indexOf(getDisplayName(child.type)) > -1 ? 'observed' : 'transparent'}-${child.type.toString()}`

    // We register the innerEnhancer so it won't remount sub element when update
    if (!registeredType[funcSignature]) {
      if (componentsToWatch.indexOf(getDisplayName(child.type)) > -1) {
        registeredType[funcSignature] = proxyHighjacker(child.type, callback, componentsToWatch)
      } else {
        registeredType[funcSignature] = transparentHighjacker(child.type, callback, componentsToWatch)
      }
    }
    const EnhancedInner = registeredType[funcSignature]

    // Add the callback function to the props of the component
    const newProps = Object.assign({}, child.props, componentsToWatch.indexOf(getDisplayName(child.type)) > -1 ? { sizeMayChange: callback } : {})
    // Children of the innerElement are managed by the enhancer
    const EnhancerInnerElement = React.createElement(EnhancedInner, newProps)

    return EnhancerInnerElement
  }
  // Return the child with its children enhanced
  return Object.assign({}, child, {
    props: Object.assign({}, child.props, {
      children: enhanceReactChildren(child.props ? child.props.children : null, callback, componentsToWatch)
    })
  })
}

/*
* Apply enhanceReactElement to each child of children
*/
const enhanceReactChildren = (children, callback, componentsToWatch) => {
  if (Array.isArray(children)) {
    return React.Children.map(children, child => enhanceReactChildren(child, callback, componentsToWatch))
  } else if (children instanceof Object) {
    return enhanceReactElement(children, callback, componentsToWatch)    
  } else {
    return children
  }
}

export default enhanceReactChildren