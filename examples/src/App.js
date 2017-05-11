import React from 'react'
import PropTypes from 'prop-types'

import SizeFetcher from '../../src/index'
import ComponentToObserve from './ComponentToObserve'
import SimpleComponent from './SimpleComponent'

const EnhancedComponent = SizeFetcher(ComponentToObserve, { watchSubComponents: ['SimpleComponent', 'InsideComponent'] })

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      subComponentSize: null,
      childrenNumber: [Math.random() + ''],
    }
  }
  render() {
    const { subComponentSize, childrenNumber } = this.state

    return (
      <div className="composed-normal-component" style={{ fontSize: '14px' }}>
        <h1>Observed component {JSON.stringify(subComponentSize, null, 2)}</h1>
        <div style={{ border: '1px solid red' }}>
          <button onClick={() => {
            const childrenCopy = [...childrenNumber]
            childrenCopy.push(Math.random() + '')
            this.setState({ childrenNumber: childrenCopy })}
          }>
            Add N
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
