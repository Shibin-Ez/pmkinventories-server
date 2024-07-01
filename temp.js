const isoDateString = "2024-06-29T10:37:12.000Z";

// Convert the ISO string to a Date object
const date = new Date(isoDateString);

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

console.log(localeDateTimeString);