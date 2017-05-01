import NormalizeComponent from './utils/NormalizeComponent'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name

const EnhanceInnerComponent = InnerComponent => {
  const ComposedComponent = NormalizeComponent(InnerComponent)

  class EnhancerInnerComponent extends ComposedComponent {
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
