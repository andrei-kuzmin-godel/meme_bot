module.exports = message => {
  const receivedTextMessage = String(message);
  console.log(typeof Number(receivedTextMessage))

  return isNaN(receivedTextMessage) ? 1 : parseInt(receivedTextMessage, 10);
}
