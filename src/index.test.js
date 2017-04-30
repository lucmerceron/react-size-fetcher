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
  // Mocking console error function
  global.console.error = jest.fn()

  let firstCallbackLength = 0
  let secondCallbackLength = 0
  const sizeChangeFirst = jest.fn(() => firstCallbackLength++)
  const sizeChangeSecond = jest.fn(() => secondCallbackLength++)
  const sizeChangeThird = jest.fn()
  const superLifeCycle = jest.fn()
  const justAString = "Not a react component"

  const Component = <div>ReactComponent</div>
  const initialProps = { test: 'ok' }
  class InnnerComponent extends React.Component {
    componentDidMount() {
      this.forceUpdate()
    }
    render() {
      return <div>InnerComponent</div>
    }
  }

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
  const InnerReactComponent = () => (<div>
    InnerComponent :
    <InnnerComponent />
  </div>)

  const EnhancedFunctionalComponent = SizeFetcher(FunctionalReactComponent, { noComparison: true })
  const EnhancedNormalComponent = SizeFetcher(NormalReactComponent)
  const NotAnEnhancedComponent = SizeFetcher(justAString)
  const EnhancedInnerComponent = SizeFetcher(InnerReactComponent, { noComparison: true })

  const WrapperEnhancedFunctionalComponent = mount(<EnhancedFunctionalComponent initialProps={initialProps} sizeChange={sizeChangeFirst}/>)
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
  it('should call sizeChange with a correctly strutured object', () => {
    expect(sizeChangeFirst.mock.calls).toEqual([[
      { clientHeight: 0, clientWidth: 0, scrollHeight: 0, scrollWidth: 0 }
    ]])
    expect(sizeChangeFirst.mock.calls).toEqual([[
      { clientHeight: 0, clientWidth: 0, scrollHeight: 0, scrollWidth: 0 }
    ]])
  })
  it('should transmit the initialProps to the initial component', () => {
    expect(WrapperEnhancedFunctionalComponent.props().initialProps).toEqual(initialProps)
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
  it('should call sizeChange function when an innerComponent update itseft', () => {
    const WrapperEnhancedInnerComponent = mount(<EnhancedInnerComponent sizeChange={sizeChangeThird}/>)
    console.log(WrapperEnhancedInnerComponent.html())
    // First call at mount then when sub component force its update
    expect(sizeChangeThird.mock.calls.length).toEqual(2)
  })
  it('should have called super life cycle hooks', () => {
    expect(superLifeCycle.mock.calls.length).toEqual(4)
  })
  it('should not implement SizeFetcher on a non-react component', () => {
    const WrapperNotAnEnhancedComponent = mount(<NotAnEnhancedComponent sizeChange={sizeChangeSecond}/>)
    expect(WrapperNotAnEnhancedComponent.name()).toEqual('')
    expect(WrapperNotAnEnhancedComponent.html()).toEqual(null)
    expect(console.error).toBeCalled()
  })
})
