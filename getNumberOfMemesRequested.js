module.exports = message => {
  const receivedTextMessage = String(message);

  return isNaN(receivedTextMessage) ? 1 : parseInt(receivedTextMessage, 10);
}
