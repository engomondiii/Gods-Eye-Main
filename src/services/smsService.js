import axios from "axios";

const USERNAME = "YOUR_AT_USERNAME";
const API_KEY = "YOUR_AT_API_KEY";

export const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      "https://api.africastalking.com/version1/messaging",
      new URLSearchParams({
        username: USERNAME,
        to: phone,
        message: message,
        from: "GODSEYE"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "apiKey": API_KEY
        }
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.log("SMS error:", error);
    return { success: false, error };
  }
};