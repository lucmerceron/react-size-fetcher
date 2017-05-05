import React from 'react'
import EnhanceInnerComponent from './EnhanceInnerComponent'

const registeredType = {}
/*
* Here we will scan the children and search for composed component that it will
* enhance to detect when they update and notice our SizeFetcher component
*/
const EnhanceReactElement = (child, callback) => {
  let children
  // If there are children, retrieve them
  if (child && child.props && Object.prototype.hasOwnProperty.call(child.props, 'children')) children = child.props.children

  if (child && Array.isArray(child)) {
    // First case: the child is just an array of children
    return child.map(ch => EnhanceReactElement(ch, callback))
  } else if (children && Array.isArray(children)) {
    // Second case: the children are composed of multiple child
    return Object.assign({}, child, {
      props: Object.assign({}, child.props, {
        children: React.Children.map(children, ch => EnhanceReactElement(ch, callback)),
      }),
    })
  } else if (children && children instanceof Object) {
    // Third case: The children is alone
    return Object.assign({}, child, {
      props: Object.assign({}, child.props, {
        children: EnhanceReactElement(children, callback),
      }),
    })
  } else if (child && typeof child.type === 'function') {
    // Forth case: The children is actually an InnerComponent (A composed component)
    // Enhance the inner component type so we can detect when it updates
    // It is the limit, React reconciliation process

    // Only way to identify surely (without asumpsion on code base) a function
    const typeId = child.type.toString()
    if (!registeredType[typeId]) registeredType[typeId] = EnhanceInnerComponent(child.type)
    const EnhancedInner = registeredType[typeId]

    // Add the callback function to the props of the component
    const newProps = Object.assign(
      {},
      child.props,
      { sizeMayChange: () => callback() }
    )

    const EnhancerInnerElement = React.createElement(EnhancedInner, newProps)
    return EnhancerInnerElement
  }
  // No enhancement for String element
  return child
}

export default EnhanceReactElement