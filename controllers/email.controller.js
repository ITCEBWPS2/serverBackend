import nodemailer from "nodemailer";
import Logger from "../utils/Logger.js";

export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation example
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    await Logger.error(
      "com.ceb.emailctrl.sendEmail",
      "Email service credentials not configured",
      req.user?._id || null,
      { ip: req.ip, userAgent: req.get("User-Agent") }
    );
    return res.status(500).json({ error: "Email service not configured properly" });
  }

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

    await Logger.info(
      "com.ceb.emailctrl.sendEmail",
      "Contact email sent successfully",
      req.user?._id || null,
      {
        sender: email,
        name,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      }
    );

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    await Logger.error(
      "com.ceb.emailctrl.sendEmail",
      "Failed to send email - " + error.message,
      req.user?._id || null,
      {
        sender: email,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      }
    );

    res.status(500).json({ error: "Failed to send email" });
  }
};
