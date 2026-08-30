const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TCK-${timestamp}-${random}`;
};

export default generateTicketNumber;