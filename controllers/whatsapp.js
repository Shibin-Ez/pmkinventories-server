import twilio from "twilio";

const sendWhatsAppMessage = async () => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      from: "whatsapp:+14155238886",
      body: "Hello, there!",
      to: "whatsapp:+916282326665",
    });

    console.log(message.sid);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};

// Call the function
sendWhatsAppMessage();
