const qs = require('qs')

export default function({ route, redirect, store }) {
  if (!process.server) {
    if (store.state.currentLocale) {
      setTimeout(
        () =>
          window.history.replaceState(
            {},
            null,
            route.path +
              `?${qs.stringify({
                locale: store.state.currentLocale,
                ...(route.query ? route.query : {}),
              })}`
          ),
        0
      )
    }
  }
}
