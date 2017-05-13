import React from 'react'

import SizeFetcher from '../../src/index'
import ComponentToObserve from './ComponentToObserve'
import SimpleComponent from './SimpleComponent'

const EnhancedComponent = SizeFetcher(ComponentToObserve, { watchSubComponents: ['InsideComponent'] })

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      subComponentSize: null,
      childrenNumber: [`${Math.random()}`],
    }
  }
  render() {
    const { subComponentSize, childrenNumber } = this.state

    return (
      <div className="composed-normal-component" style={{ fontSize: '14px' }}>
        <h1>Observed component {JSON.stringify(subComponentSize, null, 2)}</h1>
        <div style={{ border: '1px solid red', display: 'inline-block' }}>
          <button
            onClick={() => {
              const childrenCopy = [...childrenNumber]
              childrenCopy.push(`${Math.random()}`)
              this.setState({ childrenNumber: childrenCopy })
            }}
          >
            Add N-1
          </button>
          <div>
            <EnhancedComponent sizeChange={size => this.setState({ subComponentSize: size })}>
              {childrenNumber.map(child => <SimpleComponent key={child} />)}
            </EnhancedComponent>
          </div>
        </div>
      </div>
    )
  }
}

export default App
