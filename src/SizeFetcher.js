import React from 'react'
import PropTypes from 'prop-types'

import EnhanceReactChildren from './EnhanceReactChildren'
import warning from './utils/warning'

import { getDisplayName, isStateless } from './utils/utils'

/*
* Size Inversion Inheritence Higher Order Component
* This component is usefull when you need a transparant way for knowing the size of a sub component
* It will call the sizeChange function when the size of the sub component is first known and then everytime it changes
*/
const SizeFetcher = (SubComponent, options = { noComparison: false, shallow: false }) => {
  // const ComposedComponent = NormalizeComponent(SubComponent)
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

    render() {
      const elementsTree = super.render()

      const newChildren = options.shallow
        ? elementsTree.props.children
        : EnhanceReactChildren(elementsTree.props.children, this.privateHandleSizeMayHaveChanged.bind(this))
      // Here thanks to II, we can add a ref without the subComponent noticing
      const newProps = Object.assign({}, elementsTree.props, { ref: comp => (this.comp = comp) })
      // Create a new component from SubComponent render with new props
      const newElementsTree = React.cloneElement(elementsTree, newProps, newChildren)

      return newElementsTree
    }
  }
  Enhancer.displayName = `SizeFetcher(${getDisplayName(SubComponent)})`
  Enhancer.propTypes = {
    sizeChange: PropTypes.func.isRequired,
  }

  return Enhancer
}

export default SizeFetcher
