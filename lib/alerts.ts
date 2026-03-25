// lib/alerts.ts

import nodemailer from "nodemailer";
import { clerkClient } from "@clerk/nextjs/server";

interface AlertData {
  monitorName: string;
  userId: string;
  url: string;
  error: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAlert(data: AlertData) {
  const { monitorName, url, error, userId } = data;

  try {
    // ✅ Get user's email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      console.log("❌ No email found for user:", userId);
      return;
    }

    console.log("📧 Sending alert to:", userEmail);

    const info = await transporter.sendMail({
      from: `"UptimeGuard" <${process.env.ALERT_FROM_EMAIL}>`,
      to: userEmail,          // ✅ Send to user's actual email
      subject: `🔴 ${monitorName} is DOWN!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #e74c3c;">⚠️ Website Down Alert</h2>
          <p><strong>Monitor:</strong> ${monitorName}</p>
          <p><strong>URL:</strong> ${url}</p>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #888;">— UptimeGuard Monitoring</p>
        </div>
      `,
    });

    console.log("📧 Email sent to:", userEmail);
    console.log("accepted:", info.accepted);
    console.log("rejected:", info.rejected);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}