// src/internal/decorators.ts
function watch(propName) {
  return (protoOrDescriptor, name) => {
    const {updated} = protoOrDescriptor;
    protoOrDescriptor.updated = function(changedProps) {
      if (this.__hasBeenUpdated && changedProps.has(propName)) {
        const oldValue = changedProps.get(propName);
        const newValue = this[propName];
        if (oldValue !== newValue) {
          this[name].call(this, oldValue, newValue);
        }
      }
      updated.call(this, changedProps);
      this.__hasBeenUpdated = true;
    };
  };
}

export {
  watch
};
