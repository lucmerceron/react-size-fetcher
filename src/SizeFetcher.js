import React from 'react'
import PropTypes from 'prop-types'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name || 'Component'
const isStateless = component => !component.render && !(component.prototype && component.prototype.render)

/*
* Size Inversion Inheritence Higher Order Component
* This component is usefull when you need a transparant way for knowing the size of a sub component
* It will call the sizeChange function when the size of the sub component is first known and then everytime it changes
*/
const SizeFetcher = sizeChange => SubComponent => {
  const component = SubComponent
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

  class Enhancer extends ComposedComponent {
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount()

      const { id } = this.props
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = this.comp

      // First call of the callback, the component mounted and we need to give its size
      sizeChange(id, { clientHeight, clientWidth, scrollHeight, scrollWidth })

      // Register the dimension for future sake (comparison)
      this.privateRegisterComponentInfos()

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

    privateHandleSizeMayHaveChanged() {
      const { id } = this.props
      if (!this.comp) return

      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = this.comp

      // Detect if the size changed (avoid unnecessary calls)
      if (clientWidth !== this.clientWidth || clientHeight !== this.clientHeight ||
        scrollHeight !== this.scrollHeight || scrollWidth !== this.scrollWidth) {
        sizeChange(id, { clientHeight, clientWidth, scrollHeight, scrollWidth })
        this.privateRegisterComponentInfos()
      }
    }
    privateRegisterComponentInfos() {
      if (!this.comp) return
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = this.comp

      // Register the height & width so we can compare them in the future
      this.clientHeight = clientHeight
      this.clientWidth = clientWidth
      this.scrollHeight = scrollHeight
      this.scrollWidth = scrollWidth
    }

    render() {
      // Retrieve the component render tree
      if (!super.render) return null
      const elementsTree = super.render()

      let newProps = {}
      if (elementsTree) {
        // Here thanks to II, we can add a ref without the subComponent noticing
        newProps = { ref: comp => {
          // Register the component to retrieve the DOM element
          this.comp = comp
          // Call the element ref when there is one
          if (elementsTree.props.ref) elementsTree.props.ref()
        } }
      }

      // Create a new component from SubComponent render with new props
      const newElementsTree = React.cloneElement(elementsTree, newProps, elementsTree.props.children)
      return newElementsTree
    }
  }
  Enhancer.displayName = `SizeFetcher(${getDisplayName(SubComponent)})`
  Enhancer.propTypes = {
    id: PropTypes.any.isRequired,
  }

  return Enhancer
}

export default SizeFetcher
