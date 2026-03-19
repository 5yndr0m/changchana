module.exports = {
  confirmVaccinated: async (ctx) => {
    let body = ctx.request.body
    let defaultPoint = 1000
    let { userId, issueBy } = body

    try {
      let user = await strapi
        .query('user', 'users-permissions')
        .findOne({ id: userId })

      if (!user) {
        ctx.status = 500
        ctx.body = {
          success: false,
          message: 'User not found',
        }

        return
      } else {
        if (!user.vaccinated) {
          let point = user.points ? user.points : 0

          // await strapi.query('point-logs').create({
          //   amount: defaultPoint,
          //   issue_by: issueBy,
          //   target_user: userId,
          // })
          await strapi
            .query('user', 'users-permissions')
            .update(
              { id: userId },
              { vaccinated: true }
              // { points: point + defaultPoint, vaccinated: true }
            )

          ctx.body = {
            success: true,
            message: `0 point added to User ${userId}`,
          }
        } else {
          ctx.body = {
            success: true,
            message: 'Already confirm',
          }
        }
      }
    } catch (err) {
      console.log(err)

      ctx.status = 500
      ctx.body = {
        success: false,
        message: `${err}`,
      }
    }
  },
  checkVaccinatedSubmitted: async ctx => {
    let userId = ctx.params.id
    
    if (userId) {
      try {
        let entry = await strapi.query('vaccinated').findOne({ user: userId })
        // console.log(entry)

        ctx.body = {
          success: true,
          entry,
        }
      } catch (err) {
        console.log(err)
        ctx.status = 500
        ctx.body = {
          success: false,
          message: `${err}`,
        }
      }
    } else {
      ctx.status = 500
      ctx.body = {
        success: false,
        message: 'No userId provided'
      }
    }
  }
}
