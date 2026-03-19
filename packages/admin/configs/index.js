const path = require('path')
const files = require.context('./', true, /^(?!import).*\.js$/)

const configs = {}

files.keys().map(key => {
  const extension = path.extname(key)
  if (extension === '.js' && key !== 'import.js') {
    const file = files(key)
    const moduleName = path.basename(key, extension)
    configs[moduleName] = file
  }
})

module.exports = configs