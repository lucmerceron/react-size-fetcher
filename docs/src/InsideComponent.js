import React from 'react'

class InsideComponent extends React.Component {
  constructor() {
    super()

    this.interval = null
    this.state = {
      styles: { width: 200, height: 200 },
    }
  }
  componentDidMount() {
    const giveRandomSize = () => Math.trunc(Math.random() * 50, 10) + 60

    if (this.interval) clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.setState({ styles: { width: giveRandomSize(), height: giveRandomSize() } })
    }, 3500)
  }
  render() {
    const { styles } = this.state

    return (
      <div className="inside-component" style={{ marginLeft: '40px', border: '1px solid blue', ...styles }}>
        <div>
          N-2 Component
        </div>
      </div>
    )
  }
}

export default InsideComponent
