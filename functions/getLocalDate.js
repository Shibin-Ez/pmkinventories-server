const getLocalDate = () => {
  const date = new Date();

  // Convert the Date object to a locale date and time string for India
  const localeDateTimeString = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  let updatedString = "";
  for (let i=0; i<localeDateTimeString.length; i++) {
    if (localeDateTimeString[i] === ':') updatedString += ' ';
    else updatedString += localeDateTimeString[i];
  }

  return updatedString;
};

export default getLocalDate;