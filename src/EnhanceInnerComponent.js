import React from 'react'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name
const isStateless = component => !component.render && !(component.prototype && component.prototype.render)

const EnhanceInnerComponent = InnerComponent => {
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
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount()
    }
    componentDidUpdate() {
      if (super.componentDidUpdate) super.componentDidUpdate()

      this.props.sizeMayChange()
    }
    render() {
      return super.render()
    }
  }

  EnhancerInnerComponent.displayName = `EnhancerInner(${getDisplayName(InnerComponent)})`

  return EnhancerInnerComponent
}

export default EnhanceInnerComponent
