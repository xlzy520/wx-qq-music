const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {
    OPENID,
  } = cloud.getWXContext()
  try {
    return await db.collection('days').where({
        open_id: OPENID,
        _id: event._id
      })
      .update({
        data: {
          title: event.title,
          date: event.date
        },
      })
  } catch (e) {
    console.error(e)
  }
}
