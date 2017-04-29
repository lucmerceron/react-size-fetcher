import React from 'react'
import { mount } from 'enzyme'

import SizeFetcher from './index'

describe('SizeFetcher component', () => {
  // Simulating a window resize function
  beforeAll(() => {
    global.window.resizeTo = (width, height) => {
      global.window.innerWidth = width || global.window.innerWidth
      global.window.innerHeight = width || global.window.innerHeight
      global.window.dispatchEvent(new Event('resize'))
    }
  })

  const sizeChangeFirst = jest.fn()
  const sizeChangeSecond = jest.fn()

  const Component = <div>ReactComponent</div>

  const FunctionalReactComponent = () => Component
  class NormalReactComponent extends React.Component {
    render() {
      return Component
    }
  }

  const EnhancedFunctionalComponent = SizeFetcher(sizeChangeFirst, { noComparison: true })(FunctionalReactComponent)
  const EnhancedNormalComponent = SizeFetcher(sizeChangeSecond)(NormalReactComponent)

  const WrapperEnhancedNormalComponent = mount(<EnhancedNormalComponent />)
  const WrapperEnhancedFunctionalComponent = mount(<EnhancedFunctionalComponent />)

  it('should render with normal or functional sub-components', () => {
    expect(WrapperEnhancedFunctionalComponent.contains(Component)).toBeTruthy()
    expect(WrapperEnhancedNormalComponent.contains(Component)).toBeTruthy()
    expect(WrapperEnhancedNormalComponent.children()).toEqual(WrapperEnhancedFunctionalComponent.children())
  })
  it('should render the SizeFetcher name around the sub-component\'s one', () => {
    expect(WrapperEnhancedFunctionalComponent.name()).toEqual(`SizeFetcher(${FunctionalReactComponent.name})`)
    expect(WrapperEnhancedNormalComponent.name()).toEqual(`SizeFetcher(${NormalReactComponent.name})`)
  })
  it('should have called sizeChange function once at first mount', () => {
    expect(sizeChangeFirst.mock.calls.length).toEqual(1)
    expect(sizeChangeSecond.mock.calls.length).toEqual(1)
  })
  it('should call sizeChange function when new props received if size changed or no comparison actived', () => {
    WrapperEnhancedFunctionalComponent.setProps({ newProps: true })
    WrapperEnhancedNormalComponent.setProps({ newProps: true })
    expect(sizeChangeFirst.mock.calls.length).toEqual(2)
    expect(sizeChangeSecond.mock.calls.length).toEqual(1)
  })
  it('should call sizeChange function when the window size changes if size changed or no comparison actived', () => {
    window.resizeTo(1000, 1000)
    expect(sizeChangeFirst.mock.calls.length).toEqual(3)
    expect(sizeChangeSecond.mock.calls.length).toEqual(1)
  })
})
