import React from 'react'
import { mount } from 'enzyme'

import SizeFetcher from '../index'
import NormalComponent from './NormalComponent'
import FunctionalComponent from './FunctionalComponent'
import ComposedNormalComponent from './ComposedNormalComponent'
import ComposedFunctionalComponent from './ComposedFunctionalComponent'
import ComposedDynamicComponent from './ComposedDynamicComponent'
import RandomString from './RandomString'

describe('Index', () => {
  // Simulating a window resize function
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth
    global.window.innerHeight = width || global.window.innerHeight
    global.window.dispatchEvent(new Event('resize'))
  }
  // Mocking console error function
  global.console.error = jest.fn()


  describe('SizeFetcher on Simple Components', () => {
    const EnhancedNormalComponent = SizeFetcher(NormalComponent, { noComparison: true })
    const EnhancedFunctionalComponent = SizeFetcher(FunctionalComponent)

    const normalComponentProps = {
      sizeChange: jest.fn(),
      lifeCycleCallback: jest.fn(),
      content: "Normal",
    }
    const functionalComponentProps = {
      sizeChange: jest.fn(),
      content: "Functional",
    }

    const WrapperEnhancedNormalComponent = mount(<EnhancedNormalComponent {...normalComponentProps} />)
    const WrapperEnhancedFunctionalComponent = mount(<EnhancedFunctionalComponent {...functionalComponentProps} />)

    it('should render correctly', () => {
      expect(WrapperEnhancedNormalComponent.find('.simple-normal-component').node).toBeDefined()
      expect(WrapperEnhancedFunctionalComponent.find('.simple-functional-component').node).toBeDefined()
    })
    it('should give props to normal or functional components', () => {
      expect(WrapperEnhancedNormalComponent.props()).toEqual(normalComponentProps)
      expect(WrapperEnhancedFunctionalComponent.props()).toEqual(functionalComponentProps)
    })
    it('should render the SizeFetcher name around the sub-component\'s one', () => {
      expect(WrapperEnhancedNormalComponent.name()).toEqual(`SizeFetcher(${NormalComponent.name})`)
      expect(WrapperEnhancedFunctionalComponent.name()).toEqual(`SizeFetcher(${FunctionalComponent.name})`)
    })
    it('should have called sizeChange function once at first mount', () => {
      expect(normalComponentProps.sizeChange.mock.calls.length).toEqual(1)
      expect(functionalComponentProps.sizeChange.mock.calls.length).toEqual(1)
    })
    it('should call sizeChange with a correctly strutured object (with zeros because no DOM)', () => {
      expect(normalComponentProps.sizeChange.mock.calls).toEqual([[
        { clientHeight: 0, clientWidth: 0, scrollHeight: 0, scrollWidth: 0 }
      ]])
      expect(functionalComponentProps.sizeChange.mock.calls).toEqual([[
        { clientHeight: 0, clientWidth: 0, scrollHeight: 0, scrollWidth: 0 }
      ]])
    })
    it('should call sizeChange function when new props are received and noComparison is true', () => {
      WrapperEnhancedNormalComponent.setProps({ content: "New Normal" })
      expect(normalComponentProps.sizeChange.mock.calls.length).toEqual(2)
      expect(WrapperEnhancedNormalComponent.html()).toContain("New Normal")
    })
    it('should not call sizeChange function when new props are received that did not change the size (no DOM)', () => {
      WrapperEnhancedFunctionalComponent.setProps({ content: "New Functional" })
      expect(functionalComponentProps.sizeChange.mock.calls.length).toEqual(1)
      expect(WrapperEnhancedFunctionalComponent.html()).toContain("New Functional")
    })
    it('should call the component life cycle hooks normally', () => {
      // [ [ 'didMount' ], [ 'willReceiveProps' ], [ 'didUpdate' ] ]
      expect(normalComponentProps.lifeCycleCallback.mock.calls.length).toEqual(3)
    })
    it('should call sizeChange function when the window size changes if size changed or no comparison actived', () => {
      window.resizeTo(1000, 1000)
      expect(normalComponentProps.sizeChange.mock.calls.length).toEqual(3)
      expect(functionalComponentProps.sizeChange.mock.calls.length).toEqual(1)
    })
    it('should not call sizeChange if the component is unmounted', () => {
      const savedNormalSizeChange = normalComponentProps.sizeChange.mock.calls
      const savedFunctionalSizeChange = functionalComponentProps.sizeChange.mock.calls
      WrapperEnhancedFunctionalComponent.unmount()
      WrapperEnhancedNormalComponent.unmount()
      window.resizeTo(1000, 1000)
      WrapperEnhancedNormalComponent.setProps({ content: "Normal" })
      WrapperEnhancedFunctionalComponent.setProps({ content: "Functional" })
      expect(normalComponentProps.sizeChange.mock.calls).toEqual(savedNormalSizeChange)
      expect(functionalComponentProps.sizeChange.mock.calls).toEqual(savedFunctionalSizeChange)
    })
  })
  describe('SizeFetcher on Non Component', () => {
    const EnhancedString = SizeFetcher(RandomString)
    
    const stringProps = {
      sizeChange: jest.fn(),
    }

    const WrapperEnhancedString = mount(<EnhancedString {...stringProps}/>)

    it('should not implement SizeFetcher on a string', () => {
      expect(WrapperEnhancedString.name()).toEqual('')
      expect(WrapperEnhancedString.html()).toEqual(null)
      expect(console.error).toBeCalled()
    })
  })
  describe('SizeFetcher on Composed Components', () => {
    const EnhancedComposedNormalComponent = SizeFetcher(ComposedNormalComponent, { noComparison: true })
    const EnhancedComposedFunctionalComponent = SizeFetcher(ComposedFunctionalComponent)
    const EnhancedComposedDynamicComponent = SizeFetcher(ComposedDynamicComponent, { noComparison: true })
    const EnhancedComposedDynamicShallowComponent = SizeFetcher(ComposedDynamicComponent, { noComparison: true, shallow: true })

    const composedNormalComponentProps = {
      sizeChange: jest.fn(),
      lifeCycleCallback: jest.fn(),
      content: "ComposedNormal",
      subContent: "Normal",
    }
    const composedFunctionalComponentProps = {
      sizeChange: jest.fn(),
      content: "ComposedFunctional",
      subContent: "Functional",
    }
    const composedDynamicComponentProps = {
      sizeChange: jest.fn(),
      lifeCycleCallback: jest.fn(),
      content: "ComposedNormal",
      subContent: "Normal",
    }
    const composedDynamicShallowComponentProps = {
      sizeChange: jest.fn(),
      lifeCycleCallback: jest.fn(),
      content: "ComposedNormal",
      subContent: "Normal",
    }

    const WrapperEnhancedComposedNormalComponent = mount(<EnhancedComposedNormalComponent {...composedNormalComponentProps} />)
    const WrapperEnhancedComposedFunctionalComponent = mount(<EnhancedComposedFunctionalComponent {...composedFunctionalComponentProps} />)
    const WrapperEnhancedComposedDynamicComponent = mount(<EnhancedComposedDynamicComponent {...composedDynamicComponentProps} />)
    const WrapperEnhancedComposedShallowDynamicComponent = mount(<EnhancedComposedDynamicShallowComponent {...composedDynamicShallowComponentProps} />)

    it('should render composed components correctly', () => {
      expect(WrapperEnhancedComposedNormalComponent.find('.composed-normal-component').node).toBeDefined()
      expect(WrapperEnhancedComposedFunctionalComponent.find('.composed-functional-component').node).toBeDefined()
    })
    it('should render simple components correctly', () => {
      expect(WrapperEnhancedComposedNormalComponent.find('.simple-normal-component').node).toBeDefined()
      expect(WrapperEnhancedComposedFunctionalComponent.find('.simple-functional-component').node).toBeDefined()
    })
    it('should correctly give props to composed and simple components', () => {
      expect(WrapperEnhancedComposedNormalComponent.props()).toEqual(composedNormalComponentProps)
      expect(WrapperEnhancedComposedFunctionalComponent.props()).toEqual(composedFunctionalComponentProps)
      expect(WrapperEnhancedComposedNormalComponent.children().last().props().content).toEqual(composedNormalComponentProps.subContent)
      expect(WrapperEnhancedComposedFunctionalComponent.children().last().props().content).toEqual(composedFunctionalComponentProps.subContent)
    })
    it('should render the SizeFetcher name around the sub-component\'s one', () => {
      expect(WrapperEnhancedComposedNormalComponent.name()).toEqual(`SizeFetcher(${ComposedNormalComponent.name})`)
      expect(WrapperEnhancedComposedFunctionalComponent.name()).toEqual(`SizeFetcher(${ComposedFunctionalComponent.name})`)
    })
    it('should render the EnhancerInner name around the sub-component\'s one', () => {
      expect(WrapperEnhancedComposedNormalComponent.children().last().name())
        .toEqual(`EnhancerInner(${NormalComponent.name})`)
      expect(WrapperEnhancedComposedFunctionalComponent.children().last().name())
        .toEqual(`EnhancerInner(${FunctionalComponent.name})`)
    })
    it('should give sizeMayChange props to simple component', () => {
      expect(WrapperEnhancedComposedNormalComponent.children().last().props().sizeMayChange).toBeDefined()
      expect(WrapperEnhancedComposedFunctionalComponent.children().last().props().sizeMayChange).toBeDefined()
    })
    it('should call sizeChange on sizeMayChange call if size changed or no comparison actived', () => {
      expect(composedNormalComponentProps.sizeChange.mock.calls.length).toEqual(3)
      expect(composedFunctionalComponentProps.sizeChange.mock.calls.length).toEqual(1)
      WrapperEnhancedComposedNormalComponent.children().last().props().sizeMayChange()
      WrapperEnhancedComposedFunctionalComponent.children().last().props().sizeMayChange()
      expect(composedNormalComponentProps.sizeChange.mock.calls.length).toEqual(4)
      expect(composedFunctionalComponentProps.sizeChange.mock.calls.length).toEqual(1)
    })
    it('should call sizeChange when dynamic sub-component changes by itself', () => {
      expect(composedDynamicComponentProps.sizeChange.mock.calls.length).toEqual(4)
      expect(WrapperEnhancedComposedDynamicComponent.html()).toContain("Dynamic")
    })
    it('should not call sizeChange when dynamic sub-component changes by itself on shallowed component', () => {
      expect(composedDynamicShallowComponentProps.sizeChange.mock.calls.length).toEqual(3)
      expect(WrapperEnhancedComposedShallowDynamicComponent.html()).toContain("Dynamic")
    })
    it('should not remount sub element state when SizeFetcher component update', () => {
      WrapperEnhancedComposedDynamicComponent.setProps({ content: 'New ComposedNormal'})
      expect(WrapperEnhancedComposedDynamicComponent.html()).toContain('New ComposedNormal')
      // didMount called only once: [ [ 'didMount' ], [ 'didUpdate' ], [ 'didUpdate' ] ]
      expect(composedDynamicComponentProps.lifeCycleCallback.mock.calls[0]
        .filter(lifeCycle => lifeCycle === 'didMount').length).toEqual(1)
      expect(composedDynamicComponentProps.sizeChange.mock.calls.length).toEqual(5)
    })
  })
})
