import React from 'react'
import PropTypes from 'prop-types'

import warning from './utils/warning'
import EnhanceInnerComponent from './EnhanceInnerComponent'
import NormalizeComponent from './utils/NormalizeComponent'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name

/*
* Size Inversion Inheritence Higher Order Component
* This component is usefull when you need a transparant way for knowing the size of a sub component
* It will call the sizeChange function when the size of the sub component is first known and then everytime it changes
*/
const SizeFetcher = (SubComponent, options = { noComparison: false, shallow: false }) => {
  const ComposedComponent = NormalizeComponent(SubComponent)
  if (!ComposedComponent) return () => null

  let registeredType = {}

  class Enhancer extends ComposedComponent {
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount()
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = this.comp

      this.privateSizeChanged(clientHeight, clientWidth, scrollHeight, scrollWidth)
      // Register an event listener on the resize so we are concious of possible size change
      window.addEventListener('resize', this.privateHandleSizeMayHaveChanged.bind(this))
    }
    componentDidUpdate() {
      if (super.componentDidUpdate) super.componentDidUpdate()

      this.privateHandleSizeMayHaveChanged()
    }
    componentWillUnmount() {
      if (super.componentWillUnmount) super.componentWillUnmount()

      window.removeEventListener('resize', this.privateHandleSizeMayHaveChanged.bind(this))
    }

    privateSizeChanged(clientHeight, clientWidth, scrollHeight, scrollWidth) {
      const { sizeChange } = this.props

      // First call of the callback, the component mounted and we need to give its size
      sizeChange({ clientHeight, clientWidth, scrollHeight, scrollWidth })
      // Register the dimension for future sake (comparison)
      this.privateRegisterComponentInfos(clientHeight, clientWidth, scrollHeight, scrollWidth)
    }
    privateHandleSizeMayHaveChanged() {
      if (!this.comp) return
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = this.comp

      if (options.noComparison ||
        (clientWidth !== this.clientWidth || clientHeight !== this.clientHeight ||
        scrollHeight !== this.scrollHeight || scrollWidth !== this.scrollWidth)) {
        this.privateSizeChanged(clientHeight, clientWidth, scrollHeight, scrollWidth)
      }
    }
    privateRegisterComponentInfos(clientHeight, clientWidth, scrollHeight, scrollWidth) {
      // Register the height & width so we can compare them in the future
      this.clientHeight = clientHeight
      this.clientWidth = clientWidth
      this.scrollHeight = scrollHeight
      this.scrollWidth = scrollWidth
    }
    /*
    * Here we will scan the children and search for composed component that it will
    * enhance to detect when they update and notice our SizeFetcher component
    */
    privateEnhanceChildren(child) {
      let children
      // If there are children, retrieve them
      if (child && child.props && Object.prototype.hasOwnProperty.call(child.props, 'children')) children = child.props.children

      if (child && Array.isArray(child)) {
        // First case: the child is just an array of children
        return child.map(ch => this.privateEnhanceChildren(ch))
      } else if (children && Array.isArray(children)) {
        // Second case: the children are composed of multiple child
        return Object.assign({}, child, {
          props: Object.assign({}, child.props, {
            children: React.Children.map(children, ch => this.privateEnhanceChildren(ch)),
          }),
        })
      } else if (children && children instanceof Object) {
        // Third case: The children is alone
        return Object.assign({}, child, {
          props: Object.assign({}, child.props, {
            children: this.privateEnhanceChildren(children),
          }),
        })
      } else if (child && typeof child.type === 'function') {
        // Forth case: The children is actually an InnerComponent (A composed component)

        // Enhance the inner component type so we can detect when it updates
        if (!registeredType[child.type.displayName]) registeredType[child.type.displayName] = EnhanceInnerComponent(child.type)
        const EnhancedInner = registeredType[child.type.displayName]

        // Add the callback function to the props of the component
        const newProps = Object.assign({}, child.props, { key: 0, sizeMayChange: () => this.privateHandleSizeMayHaveChanged() })

        const EnhancerInnerElement = React.createElement(EnhancedInner, newProps)
        return EnhancerInnerElement
      }
      // No enhancement for String element
      return child
    }

    render() {
      const elementsTree = super.render()

      const newChildren = options.shallow ? elementsTree.props.children : this.privateEnhanceChildren(elementsTree.props.children)
      // Here thanks to II, we can add a ref without the subComponent noticing
      const newProps = Object.assign({}, elementsTree.props, { ref: comp => (this.comp = comp) })
      // Create a new component from SubComponent render with new props
      const newElementsTree = React.cloneElement(elementsTree, newProps, newChildren)

      return newElementsTree
    }
  }
  Enhancer.displayName = `SizeFetcher(${getDisplayName(SubComponent)})`
  Enhancer.propTypes = {
    sizeChange: PropTypes.any.isRequired,
  }

  return Enhancer
}

export default SizeFetcher
