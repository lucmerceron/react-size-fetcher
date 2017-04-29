# React-Size-Fetcher

ReactSizeFetcher is a simple-to-use React library to transparently and dynamically retrieve the DOM sizes of a component.
Gives { clientHeight, clientWidth, scrollHeight, scrollWidth } informations about the component.

It is a tiny (4kB) library.

[![Travis Build](https://img.shields.io/travis/lucmerceron/react-size-fetcher.svg?style=flat-square)](https://travis-ci.org/lucmerceron/react-size-fetcher/) [![Version](https://img.shields.io/npm/v/react-size-fetcher.svg?style=flat-square)](https://github.com/lucmerceron/react-size-fetcher) [![Code Coverage](https://img.shields.io/codecov/c/github/lucmerceron/react-size-fetcher.svg?style=flat-square)](https://codecov.io/gh/lucmerceron/react-size-fetcher)

## Installation

```
npm install --save react-size-fetcher
```

## Usage
SizeFetcher is a [Higher Order Component](https://facebook.github.io/react/docs/higher-order-components.html), you just need to give it a component and it will give you back an enhanced component. That enhanced component will now take a function prop called `sizeChange` which will be called at the first render of the component and everytime the component size changes.

Here is a simple way to use the library:

```javascript
import SizeFetcher from 'react-size-fetcher'
import ComponentToObserve from './ComponentToObserve'
const EnhancedComponent = SizeFetcher(ComponentToObserve)

class AwareComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      subComponentSize = null
    }
  }
  render() {
    const { subComponentSize } = this.state

    return (
      <div>
        <h1>The size of the sub component is {JSON.stringify(subComponentSize, null, 2)</h1>
        <EnhancedComponent sizeChange={size => this.setState(size)} {/* ComponentToObserve usual props */}/>
      </div>
    )
  }
}
```

SizeFetcher will watch for receiving props, state manipulation or window size change and calls `sizeChange` function if the component size (clientHeight, clientWidth, scrollHeight or scrollWidth) changed. You can bypass this verification so the component will trigger the sizeChange function at every change by giving it an option object:
```
const EnhancedComponent = SizeFetcher(ComponentToObserve, { noComparison: true})
```


## Change Log
This project adheres to [Semantic Versioning](http://semver.org/).
You can find every release documentation documented on the [Releases](https://github.com/lucmerceron/react-size-fetcher/releases) page.

## License
MIT