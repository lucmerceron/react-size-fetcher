import React from 'react'

class InsideComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      childrenNumber: [`${Math.random()}`],
    }
  }
  render() {
    const { childrenNumber } = this.state

    return (
      <div className="inside-component" style={{ marginLeft: '40px' }}>
        <button
          onClick={() => {
            const childrenCopy = [...childrenNumber]
            childrenCopy.push(`${Math.random()}`)
            this.setState({ childrenNumber: childrenCopy })
          }}
        >Add N-2</button>
        <div>
          {childrenNumber.map(child => <div key={child}>{child}</div>)}
        </div>
      </div>
    )
  }
}

InsideComponent.propTypes = {
}

export default InsideComponent
