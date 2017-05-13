# React-Size-Fetcher

ReactSizeFetcher is a simple-to-use React library to transparently and dynamically retrieve the DOM sizes of a sub-component.

It is a tiny (8kB) library.

[![Travis Build](https://img.shields.io/travis/wing-eu/react-size-fetcher.svg?style=flat-square)](https://travis-ci.org/wing-eu/react-size-fetcher/) [![Version](https://img.shields.io/npm/v/react-size-fetcher.svg?style=flat-square)](https://github.com/lucmerceron/react-size-fetcher/releases) [![Code Coverage](https://img.shields.io/codecov/c/github/wing-eu/react-size-fetcher.svg?style=flat-square)](https://codecov.io/gh/wing-eu/react-size-fetcher)

## Installation

```
npm install --save react-size-fetcher
```

## Documentation

SizeFetcher is a [Higher Order Component](https://facebook.github.io/react/docs/higher-order-components.html); by giving it a component, it will return an enhanced component.
```javascript
const EnhancedComponent = SizeFetcher(ComponentToObserve, [options])
```
The enhanced component is special, it will be a copy of the given component but will accept a new prop called `sizeChange`.
```javascript
<EnhancedComponent {/* ComponentToObserve Props */} sizeChange={size => console.log('Size Changed: ', size)} />
```
sizeChange is a function with one argument, it will be called with an `Object` representing the size of the component when the component did mount and when its size change.
```javascript
// Size Changed: { clientWidth: 120, clientHeight: 230, scrollWidth: 120, scrollHeight: 430 }
```

### Arguments
* Component (React Component): This can be a [React Functional or Class Component](https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components).
* [options] (Object): Available options:
  * [noComparison] (Boolean): Default value: false. This option allow you to bypass SizeFetcher optimization. SizeFetcher usually compare all the size and do not call `sizeChange` if the size did not change between two updates.
  `const EnhancedComponent = SizeFetcher(ComponentToObserve, { noComparison: true})`
  * [watchSubComponents] (Array): Default value: []. This option allow you to indicate if you want to watch specific sub-components. When defined, SizeFetcher will go through the render method of each sub component of the ComponentToObserve and add a proxy that will call `sizeChange` function when they update.
  `const EnhancedComponent = SizeFetcher(ComponentToObserve, { watchSubComponents: ['AccordionComponent', 'ListComponent'] })`
### Returns
A Higher-Order React Component that inherit from your initial component and take one more props named `sizeChange`. sizeChange is suceptible to be called when the component receives new props, updates its state or when the window resize.

### Example
Here is a simple way to use the library:

```javascript
import SizeFetcher from 'react-size-fetcher'
import ComponentToObserve from './ComponentToObserve'
const EnhancedComponent = SizeFetcher(ComponentToObserve)

class AwareComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      subComponentSize: null
    }
  }
  render() {
    const { subComponentSize } = this.state

    return (
      <div>
        <h1>The size of the sub component is {JSON.stringify(subComponentSize, null, 2)}</h1>
        <EnhancedComponent sizeChange={size => this.setState({ subComponentSize: size })} {/* ComponentToObserve usual props */} />
      </div>
    )
  }
}
```

You can also enhance directly your ComponentToObserve by exporting if with SizeFetcher in your *ComponentToObserve.js* file:

```
export default SizeFetcher(ComponentToObserve)
```
or with a decorator
```
@SizeFetcher
class ComponentToObserve extends React.Component {
  ...
```

Some advanced examples can be find in the [docs](https://github.com/wing-eu/react-size-fetcher/tree/master/docs) folder of this repository. [Live example](https://wing-eu.github.io/react-size-fetcher/) also works.

## How does it work ?

SizeFetcher is what we call an inverse inheritance higher order function. It takes a component as parameters and return a component; which by inheriting from the ComponentToObserve, will be able to highjack the render of ComponentToObserve and add functions to its [lifecycle](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle).

### Highjacking the render
The render highjack is usefull for SizeFetcher in two ways:
1. To add a [ref]((https://facebook.github.io/react/docs/refs-and-the-dom.html)) to the componentToObserve output to retrieve and store its `DOM element`.
2. To enhance the rendered children if the `watchSubComponents` list option is not empty.

### Enhancing the lifecycle
SizeFetcher will modify three basic functions of ComponentToObserve's lifecycle:
1. componentDidMount: Add an event listener on the window resize.
2. componentWillUnmount: Remove the event listener on the window resize.
3. componentDidUpdate: Call the SizeFetcher returned component's private `handleSizeMayHaveChanged` function.

The window resize listener will also call `handleSizeMayHaveChanged` function on resize.

### handleSizeMayHaveChanged
This function calls the given ComponentToObserve's `sizeChange` prop if the size of the DOM element (retrieved earlier at highjacking step 1.) did change compared to the last call values. The option `noComparison` will bypass the comparison and call `sizeChange` at every `handleSizeMayHaveChange` call.

### Enhancing sub-components
This is were the magic happens. SizeFetcher will go through every sub component and look up for components' name that are in the `watchSubComponents` list and add to them a props called `sizeMayChange`. This props will be called everytime the sub-component updates. When this props is called, it will call the SizeFetcher returned component's private `handleSizeMayHaveChanged` function and trigger the sizeChange if pertinent.
 

## Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

You can find every release documented on the [Releases](https://github.com/lucmerceron/react-size-fetcher/releases) page.

## License
MIT
