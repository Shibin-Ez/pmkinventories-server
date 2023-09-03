import mysql from "mysql2";

// create the connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "shibin",
  port: "3306",
  password: process.env.DBPASS,
  database: "inventorydb",
  authSwitchHandler: function ({ pluginName, pluginData }, cb) {
    if (pluginName === "mysql_native_password") {
      cb(null, mysql_native_password.Auth.generateToken("your_new_password"));
    }
  },
});

// establish connection
db.connect((error) => {
  if (error) {
    console.error("Error connecting to database:", error);
    return;
  }
  console.log("Connected to the database");
});
