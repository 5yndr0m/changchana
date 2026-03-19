import {
  getBasePath
} from "./chunk.MADZ6O6T.js";

// src/components/icon/library.ts
var registry = [
  {
    name: "default",
    resolver: (name) => `${getBasePath()}/assets/icons/${name}.svg`
  }
];
var watchedIcons = [];
function watchIcon(icon) {
  watchedIcons.push(icon);
}
function unwatchIcon(icon) {
  watchedIcons = watchedIcons.filter((el) => el !== icon);
}
function getIconLibrary(name) {
  return registry.filter((lib) => lib.name === name)[0];
}
function registerIconLibrary(name, options) {
  unregisterIconLibrary(name);
  registry.push({
    name,
    resolver: options.resolver,
    mutator: options.mutator
  });
  watchedIcons.map((icon) => {
    if (icon.library === name) {
      icon.redraw();
    }
  });
}
function unregisterIconLibrary(name) {
  registry = registry.filter((lib) => lib.name !== name);
}

export {
  watchIcon,
  unwatchIcon,
  getIconLibrary,
  registerIconLibrary,
  unregisterIconLibrary
};
