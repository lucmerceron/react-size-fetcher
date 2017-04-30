import React from 'react'
import PropTypes from 'prop-types'

import warning from './utils/warning'
import EnhanceInnerComponent from './EnhanceInnerComponent'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name
const isStateless = component => !component.render && !(component.prototype && component.prototype.render)

/*
* Size Inversion Inheritence Higher Order Component
* This component is usefull when you need a transparant way for knowing the size of a sub component
* It will call the sizeChange function when the size of the sub component is first known and then everytime it changes
*/
const SizeFetcher = (SubComponent, options = { noComparison: false }) => {
  const component = SubComponent
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

  class Enhancer extends ComposedComponent {
    constructor() {
      super()

      this.elementsTree = super.render()
      this.enhancedChildren = this.privateEnhanceChildren(this.elementsTree.props.children)

      this.privateHandleSizeMayHaveChanged = this.privateHandleSizeMayHaveChanged.bind(this)
      this.privateSizeChanged = this.privateSizeChanged.bind(this)
      this.privateRegisterComponentInfos = this.privateRegisterComponentInfos.bind(this)
    }
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
    privateEnhanceChildren(child) {
      let children
      if (child && child.props && Object.prototype.hasOwnProperty.call(child.props, 'children')) children = child.props.children

      // Zero case: the child is multiple
      if (child && Array.isArray(child)) {
        return child.map(ch => this.privateEnhanceChildren(ch))
      } else if (children && Array.isArray(children)) {
        // First case: the children is composed of multiple child
        return Object.assign({}, child, {
          props: Object.assign({}, child.props, {
            children: React.Children.map(children, ch => this.privateEnhanceChildren(ch)),
          }),
        })
      } else if (children && children instanceof Object) {
        // Second case: The children is the only one
        return Object.assign({}, child, {
          props: Object.assign({}, child.props, {
            children: this.privateEnhanceChildren(children),
          }),
        })
      } else if (child && typeof child.type === 'function') {
        // Third case: The children is actually an innerComponent
        const EnhancedInner = EnhanceInnerComponent(child.type)
        const display = <EnhancedInner {...child.props} sizeMayChange={() => this.privateHandleSizeMayHaveChanged()} />
        // console.log('-------', display, child)
        return display
      }
      // No enhancement
      return child
    }

    render() {
      // Here thanks to II, we can add a ref without the subComponent noticing
      const newProps = { ref: comp => (this.comp = comp) }
      // Create a new component from SubComponent render with new props
      const newElementsTree = React.cloneElement(this.elementsTree, newProps, this.enhancedChildren)
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
