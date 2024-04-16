const nodemailer = require("nodemailer");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mykhankhan41@gmail.com",
    pass: "nkubwbviknndfjtp",
  },
});

const getEmailsFromExcel = async (filePath) => {
  const rows = await readXlsxFile(filePath);
  const emailColumnIndex = rows[0].findIndex(
    (cell) => cell.toLowerCase() === "email"
  );
  return rows.slice(1).map((row) => row[emailColumnIndex]);
};

const getEmailsFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data.email))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

exports.sendEmails = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileExtension = path.extname(req.file.path).toLowerCase();
  console.log("File extension:", fileExtension);
  let emails = [];

  try {
    if (fileExtension === ".xls" || fileExtension === ".xlsx") {
      emails = await getEmailsFromExcel(req.file.path);
    } else if (fileExtension === ".csv") {
      emails = await getEmailsFromCSV(req.file.path);
    } else {
      return res.status(400).send("Unsupported file type.");
    }

    emails.forEach((email) => {
      transporter.sendMail({
        from: "mykhankhan41@gmail.com",
        to: email,
        subject: "Notification",
        text: "Please check your inbox.",
      });
    });

    fs.unlinkSync(req.file.path);

    res.send("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(error.message);
  }
};

// const sgMail = require("@sendgrid/mail");
// const { SmsClient } = require("@azure/communication-sms");

// // Initialize SendGrid with your SendGrid API key
// sgMail.setApiKey("yourSendGridApiKey");

// // Initialize Azure Communication SMS client with your Azure Communication Services connection string
// const smsClient = new SmsClient("yourConnectionString");

// exports.sendEmailsAndSMS = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   const fileExtension = path.extname(req.file.path).toLowerCase();
//   console.log("File extension:", fileExtension);
//   let emails = [];
//   let phoneNumbers = [];

//   try {
//     if (fileExtension === ".xls" || fileExtension === ".xlsx") {
//       emails = await getEmailsFromExcel(req.file.path);
//       // You can also implement a function to get phone numbers from Excel
//     } else if (fileExtension === ".csv") {
//       emails = await getEmailsFromCSV(req.file.path);
//       // You can also implement a function to get phone numbers from CSV
//     } else {
//       return res.status(400).send("Unsupported file type.");
//     }

//     // Send emails
//     const emailPromises = emails.map((email) => {
//       const msg = {
//         to: email,
//         from: "mykhankhan41@gmail.com",
//         subject: "Notification",
//         text: "Please check your inbox.",
//       };
//       return sgMail.send(msg);
//     });
//     await Promise.all(emailPromises);

//     // Send SMS
//     const smsPromises = phoneNumbers.map((phoneNumber) => {
//       return smsClient.send({
//         from: "<Your Sender ID>", // Sender ID provided by Azure Communication Services
//         to: phoneNumber,
//         message: "This is a test SMS message.",
//       });
//     });
//     await Promise.all(smsPromises);

//     // Delete the uploaded file
//     fs.unlinkSync(req.file.path);

//     res.send("Emails and SMS sent successfully!");
//   } catch (error) {
//     console.error("Error sending emails and SMS:", error);
//     res.status(500).send(error.message);
//   }
// };
