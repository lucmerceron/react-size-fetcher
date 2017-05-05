export const getDisplayName = wrappedComponent => wrappedComponent.displayName || wrappedComponent.name
export const isStateless = component => !component.render && !(component.prototype && component.prototype.render)
