const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sendMailRoutes = require("./routes/sendMailRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Email routes
app.use("/sendmail", sendMailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
