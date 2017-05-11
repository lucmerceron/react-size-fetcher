import React from 'react'
import proxyHighjacker from './proxyHighjacker'
import transparentHighjacker from './transparentHighjacker'

import { getDisplayName } from './utils/utils'

const registeredType = {}
let enhanceReactElement

/*
* Apply enhanceReactElement to each child of children
*/
const enhanceReactChildren = (children, callback, componentsToWatch) => {
  if (Array.isArray(children)) {
    return React.Children.map(children, child => enhanceReactChildren(child, callback, componentsToWatch))
  } else if (children instanceof Object) {
    return enhanceReactElement(children, callback, componentsToWatch)
  }
  return children
}

/*
* Enhance the child with the prop sizeMayChange
* A react Element can be of two types:
*  1. function (FTRE): Components created by the user
*  2. string (STRE): DOM nodes
*/
enhanceReactElement = (child, callback, componentsToWatch) => {
  // The element is in the list to observe
  const toObserve = componentsToWatch.indexOf(getDisplayName(child.type)) > -1

  if (child && typeof child.type === 'function') {
    // One way to identify surely, without assumption on the name, a function
    const funcSignature = `${toObserve ? 'observed' : 'transparent'}-${child.type.toString()}`

    // We register the innerEnhancer so it won't remount sub element when update
    if (!registeredType[funcSignature]) {
      if (toObserve) {
        registeredType[funcSignature] = proxyHighjacker(child.type, callback, componentsToWatch)
      } else {
        registeredType[funcSignature] = transparentHighjacker(child.type, callback, componentsToWatch)
      }
    }
    const EnhancedInner = registeredType[funcSignature]

    // Add the callback function to the props of the component
    const newProps = Object.assign({}, child.props, toObserve ? { sizeMayChange: callback } : {})
    // Children of the innerElement are managed by the enhancer
    const EnhancerInnerElement = React.createElement(EnhancedInner, newProps)

    return EnhancerInnerElement
  }
  // Return the child with its children enhanced
  return Object.assign({}, child, {
    props: Object.assign({}, child.props, {
      children: enhanceReactChildren(child.props ? child.props.children : null, callback, componentsToWatch),
    }),
  })
}


export default enhanceReactChildren
