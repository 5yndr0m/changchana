const converter = require('json-2-csv')
const moment = require('moment')
const { default: createStrapi } = require('strapi')

module.exports = {
  exportCSV: async (ctx) => {
    let { contentType } = ctx.request.query

    if (contentType) {
      try {
        let data = await strapi.query(contentType).find()
        const csv = await converter.json2csvAsync(data)
        ctx.set('Content-disposition', `attachment; filename=${moment().format('DD-MM-YY')}-${contentType}-export.csv`)
        ctx.set('Content-type', 'text/csv')
        ctx.body = csv
        // print CSV string
        console.log(csv)
      } catch (err) {
        console.log(err)
        ctx.status = 500
        ctx.body = {
          success: false,
          error: err.message
        }
      }
    } else {
      ctx.status = 404
      ctx.body = 'No contentType provided'
    }
  },
}
