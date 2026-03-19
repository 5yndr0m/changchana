const OneSignal = require('onesignal-node')

const slugify = str => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace('%', 'เปอร์เซนต์') // Translate some charactor
    .replace(/[^\u0E00-\u0E7F\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '')
}

const sendPushNotification = async ({ content, heading, external_ids, additionalData }) => {
  const client = new OneSignal.Client(
    process.env.ONESIGNAL_APP_ID,
    process.env.ONESIGNAL_API_KEY
  )

  const notification = {
    contents: {
      en: content,
    },
    headings: {
      en: heading,
    },
    data: additionalData,
    ...(!external_ids ? { included_segments: ['Subscribed Users'] } : {}),
    ...(external_ids ? { include_external_user_ids: external_ids } : {}),
  }

  // using async/await
  try {
    console.log('Push notification to thrid party')
    const response = await client.createNotification(notification)
    console.log(response.body.id)
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      console.log(e.statusCode)
      console.log(e.body)
    }
  }
}

const imageDTO = (image, options) => {
  const opt = options || { mainSize: "original" };
  const { url, formats } = image || {};
  let result = null;

  if (url) {
    let mainURL = url;
    switch (opt.mainSize) {
      case "large":
        mainURL = formats?.large?.url;
        break;
      case "medium":
        mainURL = formats?.medium?.url;
        break;
      case "small":
        mainURL = formats?.small?.url;
        break;
      case "thumbnail":
        mainURL = formats?.thumbnail?.url;
        break;
    }
  

    result = {
      url: mainURL || url,
    };
  }

  return result;
};

module.exports = {
  slugify,
  sendPushNotification,
  imageDTO,
}
