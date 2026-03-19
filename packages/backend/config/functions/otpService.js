const axios = require('axios');
const SETTINGS = {
  env: process.env.NODE_ENV,
  endpoint: process.env.THAIBULK_OTP_ENPOINT,
  apiKey: process.env.THAIBULK_API_KEY,
  apiSecret: process.env.THAIBULK_API_SECRET,
  mockCodeValid: "123456",
};

const otpRequest = async (payloads) => {
  try {
    if (SETTINGS.env === "development") {
      return {
        success: true,
        data: {
          status: "success",
          token: "TOKEN_FROM_MOCK_OTP_SERVICE",
          refno: "ABCDE"
        },
      };
    } else {
      const { mobile } = payloads;
      const response = await axios.post(`${SETTINGS.endpoint}/request`, {
        "key": SETTINGS.apiKey,
        "secret": SETTINGS.apiSecret,
        "msisdn": mobile,
      });
      return {
        success: true,
        data: JSON.parse(JSON.stringify(response.data)),
      };
    }
  } catch (error) {
    let message = error.message;
    let statusCode = 400;
    if (error.response && error.response.data) {
      const { errors, code } = error.response.data;
      statusCode = code;
      if (errors.length) {
        message = errors[0].message;
      } else {
        message = "unprocessable";
      }
    }
    return {
      statusCode,
      message,
    }
  }
}

const otpVerify = async (payloads) => {
  try {
    const { token, code } = payloads;
    if (SETTINGS.env === "development") {
      if (code === SETTINGS.mockCodeValid) {
        return {
          success: true,
          data: {
            status: "success",
            message: "Code is correct."
          }
        }
      } else {
        return {
          statusCode: 400,
          message: "Code is invalid."
        };
      }
    } else {
      const response = await axios.post(`${SETTINGS.endpoint}/verify`, {
        "key": SETTINGS.apiKey,
        "secret": SETTINGS.apiSecret,
        "token": token,
        "pin": code,
      });
      const data = JSON.parse(JSON.stringify(response.data));
      return {
        success: true,
        data,
      }
    }
  } catch (error) {
    let message = error.message;
    let statusCode = 400;
    if (error.response && error.response.data) {
      const { errors, code } = error.response.data;
      statusCode = code;
      if (errors.length) {
        message = errors[0].message;
      } else {
        message = "unprocessable";
      }
    }
    return {
      statusCode,
      message,
    }
  }
}

module.exports = {
  request: otpRequest,
  verify: otpVerify,
};
