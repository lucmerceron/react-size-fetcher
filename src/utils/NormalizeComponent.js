import React from 'react'

import warning from './warning'

const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name
const isStateless = component => !component.render && !(component.prototype && component.prototype.render)

const NormalizeComponent = SchrodingerComponent => {
  const component = SchrodingerComponent
  let ComposedComponent = component

  // Managing component without state (functional component)
  if (isStateless(ComposedComponent)) {
    if (typeof component !== 'function') {
      warning('SizeFetcher has been called with neither a React Functional or Class Component')
      return null
    }
    ComposedComponent = class extends React.Component {
      render() {
        return component(this.props)
      }
    }
    ComposedComponent.displayName = getDisplayName(component)
  }

  return ComposedComponent
}

export default NormalizeComponent
