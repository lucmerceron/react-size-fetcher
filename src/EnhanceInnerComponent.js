import React from 'react'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name

const EnhanceInnerComponent = InnerComponent => {
  // const component = InnerComponent

  // const NewInnerComponent = class extends React.Component {
  //   render() {
  //     return component(this.props)
  //   }
  // }
  // NewInnerComponent.displayName = getDisplayName(component)

  class EnhancerInnerComponent extends InnerComponent {
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
