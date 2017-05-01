# React-Size-Fetcher

ReactSizeFetcher is a simple-to-use React library to transparently and dynamically retrieve the DOM sizes of a sub-component.

It is a tiny (8kB) library.

[![Travis Build](https://img.shields.io/travis/lucmerceron/react-size-fetcher.svg?style=flat-square)](https://travis-ci.org/lucmerceron/react-size-fetcher/) [![Version](https://img.shields.io/npm/v/react-size-fetcher.svg?style=flat-square)](https://github.com/lucmerceron/react-size-fetcher/releases) [![Code Coverage](https://img.shields.io/codecov/c/github/lucmerceron/react-size-fetcher.svg?style=flat-square)](https://codecov.io/gh/lucmerceron/react-size-fetcher)

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
  * [noComparison] (Boolean): Default value: false. This option allow you to bypass SizeFetcher optimization. SizeFetcher will compare all the size and not call `sizeChange` if the size did not change between two updates.
  `const EnhancedComponent = SizeFetcher(ComponentToObserve, { noComparison: true})`
  * [shallow] (Boolean): Default value: false. This option allow you to optimize SizeFetcher if your ComponentToObserve does not contain sub-component (React Component) that can change in size. 
  `const EnhancedComponent = SizeFetcher(ComponentToObserve, { shallow: true})`
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

## Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

You can find every release documented on the [Releases](https://github.com/lucmerceron/react-size-fetcher/releases) page.

## License
MIT