import request from "request";

const sendWhatsAppMessage = async (phoneNumber, message) => {
  const url = 'https://api.whatsapp.com/send/';
  const data = {
    phone: phoneNumber,
    message: message
  };

  return request.post(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

const main = async () => {
  const phoneNumber = '+916282326665';
  const message = 'This is a test message.';

  const response = await sendWhatsAppMessage(phoneNumber, message);

  if (response.statusCode === 200) {
    console.log('Message sent successfully');
  } else {
    console.log('Error sending message:', response.statusCode);
  }
};

main();
