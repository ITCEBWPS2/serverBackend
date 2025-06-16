import nodemailer from "nodemailer";
import Logger from "../utils/logger.js"; // Make sure the path is correct

export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    replyTo: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission from ${name}`,
    text: `Message from ${name} (${email}):\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);

    await Logger.info("com.ceb.emailctrl.sendEmail", "Contact email sent successfully", null, {
      sender: email,
      name,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    await Logger.error("com.ceb.emailctrl.sendEmail", "Failed to send email - " + error.message, null, {
      sender: email,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(500).json({ error: "Failed to send email" });
  }
};
