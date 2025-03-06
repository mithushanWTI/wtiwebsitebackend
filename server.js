require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Email credentials from .env file
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to handle form submission
app.post("/send-email", async (req, res) => {
  const { name, city, email, phone, whatsapp, destination, travelDate, people, vacationType, packageType } = req.body;

  const inboundAgent = "mithushan123456@gmail.com"; // Replace with actual inbound email
  const outboundAgent = "mithushan0099@gmail.com"; // Replace with actual outbound email

  const recipientEmail = packageType === "Inbound" ? inboundAgent : outboundAgent;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `New Booking Request from ${name}`,
    text: `
      Name: ${name}
      City: ${city}
      Email: ${email}
      Phone: ${phone}
      WhatsApp: ${whatsapp}
      Destination: ${destination}
      Travel Date: ${travelDate}
      No. of People: ${people}
      Vacation Type: ${vacationType}
      Package Type: ${packageType}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
