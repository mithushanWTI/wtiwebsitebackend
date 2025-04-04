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

// Mapping serviceType to respective agent emails
const agentEmails = {
  Inbound: "akif.z@worldtravelisland.com",
  Outbound: "nimesha.d@worldtravelisland.com",
  AirTickets: "abdullah.k@worldtravelisland.com",
  VisaServices: "mohammed.d@worldtravelisland.com",
  MiceTours: "mithushan0099@gmail.com",
  CorporateTravel: "res@worldtravelisland.com",
};

// Route to handle form submission
app.post("/send-email", async (req, res) => {
  const { name, city, email, phone, whatsapp, destination, travelDate, people, serviceType, comments } = req.body;

  // Get recipient email based on serviceType
  const recipientEmail = agentEmails[serviceType];

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: "Invalid package type" });
  }

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
      Service Type: ${serviceType}
      Comments: ${comments}
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
