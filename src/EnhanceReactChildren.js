import React from 'react'
import EnhanceInnerComponent from './EnhanceInnerComponent'

const registeredType = {}

/*
* Enhance the child with the prop sizeMayChange
* A react Element can be of two types:
*  1. function (FTRE): Components created by the user
*  2. string (STRE): DOM nodes
*/
const EnhanceReactElement = (child, callback) => {
  if (child && typeof child.type === 'function') {
    // Only way to identify surely, without assumption on the name, a function
    const funcSignature = child.type.toString()
    // We register the innerEnhancer so it won't remount sub element when update
    if (!registeredType[funcSignature]) registeredType[funcSignature] = EnhanceInnerComponent(child.type)
    const EnhancedInner = registeredType[funcSignature]

    // Add the callback function to the props of the component
    const newProps = Object.assign({}, child.props, { sizeMayChange: callback })
    // Children of the innerElement are managed by the enhancer
    const EnhancerInnerElement = React.createElement(EnhancedInner, newProps)

    return EnhancerInnerElement
  } else if (child && child instanceof Object) {
    // Return the child with its children enhanced
    return Object.assign({}, child, {
      props: Object.assign({}, child.props, {
        children: EnhanceReactChildren(child.props ? child.props.children : null, callback)
      })
    })
  }
  return child
}

/*
* Apply EnhanceReactElement to each child of children
*/
const EnhanceReactChildren = (children, callback) => {
  if (Array.isArray(children)) {
    return children.map(child => EnhanceReactChildren(child, callback))
  } else if (children instanceof Object) {
    return EnhanceReactElement(children, callback)    
  } else {
    return children
  }
}

export default EnhanceReactChildren