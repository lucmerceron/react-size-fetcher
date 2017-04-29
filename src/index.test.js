import React from 'react'
import { mount } from 'enzyme'

import SizeFetcher from './index'

describe('SizeFetcher component', () => {
  // Simulating a window resize function
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth
    global.window.innerHeight = width || global.window.innerHeight
    global.window.dispatchEvent(new Event('resize'))
  }

  let firstCallbackLength = 0
  let secondCallbackLength = 0
  const sizeChangeFirst = jest.fn(() => firstCallbackLength++)
  const sizeChangeSecond = jest.fn(() => secondCallbackLength++)
  const superLifeCycle = jest.fn()

  const Component = <div>ReactComponent</div>

  const FunctionalReactComponent = () => Component
  class NormalReactComponent extends React.Component {
    componentDidMount() {
      superLifeCycle('didMount')
    }
    componentWillReceiveProps() {
      superLifeCycle('willReceiveProps')
    }
    componentDidUpdate() {
      superLifeCycle('didUpdate')
    }
    componentWillUnmount() {
      superLifeCycle('willUnmount')
    }
    render() {
      return Component
    }
  }

  const EnhancedFunctionalComponent = SizeFetcher(FunctionalReactComponent, { noComparison: true })
  const EnhancedNormalComponent = SizeFetcher(NormalReactComponent)

  const WrapperEnhancedFunctionalComponent = mount(<EnhancedFunctionalComponent sizeChange={sizeChangeFirst}/>)
  const WrapperEnhancedNormalComponent = mount(<EnhancedNormalComponent sizeChange={sizeChangeSecond}/>)

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
    expect(firstCallbackLength).toEqual(2)
    expect(secondCallbackLength).toEqual(1)
  })
  it('should call sizeChange function when the window size changes if size changed or no comparison actived', () => {
    window.resizeTo(1000, 1000)
    expect(firstCallbackLength).toEqual(3)
    expect(secondCallbackLength).toEqual(1)
  })
  it('should not call sizeChange if the component is unmounted', () => {
    WrapperEnhancedFunctionalComponent.unmount()
    WrapperEnhancedNormalComponent.unmount()
    window.resizeTo(1000, 1000)
    expect(firstCallbackLength).toEqual(3)
    expect(secondCallbackLength).toEqual(1)
  })
  it('should have called super life cycle hooks', () => {
    expect(superLifeCycle.mock.calls.length).toEqual(4)
  })
})
