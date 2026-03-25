// lib/alerts.ts
import { Resend } from 'resend';
import { clerkClient } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertData {
  monitorName: string;
  userId: string;
  url: string;
  error: string;
}

async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses[0]?.emailAddress || null;
  } catch {
    return null;
  }
}

export async function sendAlert(data: AlertData) {
  const { monitorName, url, error, userId } = data;

  try {
    const userEmail = await getUserEmail(userId);

    if (!userEmail) {
      console.log("❌ No email found for user:", userId);
      return { success: false, error: "No email found" };
    }

    console.log("📧 Sending alert to:", userEmail);

    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "UptimeGuard <onboarding@resend.dev>",
      to: userEmail,
      subject: `🔴 ${monitorName} is DOWN!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F4EAE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          
          <!-- Outer Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size: 20px; font-weight: 500; color: #000000; letter-spacing: -0.5px;">
                            ⚡ UptimeGuard
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Card -->
                  <tr>
                    <td style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                      
                      <!-- Red Alert Banner -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #EF4444; padding: 24px 32px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right: 12px; vertical-align: middle;">
                                  <div style="width: 40px; height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                                    🔴
                                  </div>
                                </td>
                                <td style="vertical-align: middle;">
                                  <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.7);">Alert</p>
                                  <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Website is Down</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Monitor Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
                        
                        <!-- Monitor Name -->
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(0,0,0,0.35);">Monitor</p>
                            <p style="margin: 6px 0 0 0; font-size: 28px; font-weight: 600; color: #000000; letter-spacing: -1px;">${monitorName}</p>
                          </td>
                        </tr>
                        
                        <!-- Info Grid -->
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; border-radius: 16px; overflow: hidden;">
                              
                              <!-- URL Row -->
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 80px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">URL</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000000; word-break: break-all;">
                                        <a href="${url}" style="color: #000000; text-decoration: underline; text-underline-offset: 3px;">${url}</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- Error Row -->
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 80px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">Error</td>
                                      <td style="font-size: 14px; font-weight: 600; color: #DC2626;">${error}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                              <!-- Time Row -->
                              <tr>
                                <td style="padding: 16px 20px;">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 80px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">Time</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000000;">${timestamp}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                            </table>
                          </td>
                        </tr>
                        
                        <!-- CTA Button -->
                        <tr>
                          <td style="padding-top: 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center">
                                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                                     style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: -0.3px;">
                                    View Dashboard →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 0; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.3); font-weight: 500;">
                        You're receiving this because you have monitoring enabled on UptimeGuard.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(0,0,0,0.2); font-weight: 500;">
                        © ${new Date().getFullYear()} UptimeGuard
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("❌ Resend error:", emailError);
      return { success: false, error: emailError.message };
    }

    console.log("✅ Email sent:", emailData);
    return { success: true, id: emailData?.id };
  } catch (err: any) {
    console.error("❌ Failed to send email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendRecoveryAlert(data: {
  monitorName: string;
  userId: string;
  url: string;
  downtimeMinutes: number;
}) {
  const { monitorName, url, downtimeMinutes, userId } = data;

  try {
    const userEmail = await getUserEmail(userId);
    if (!userEmail) return { success: false };

    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "UptimeGuard <onboarding@resend.dev>",
      to: userEmail,
      subject: `✅ ${monitorName} is back UP!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F4EAE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size: 20px; font-weight: 500; color: #000000; letter-spacing: -0.5px;">
                            ⚡ UptimeGuard
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Main Card -->
                  <tr>
                    <td style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                      
                      <!-- Green Recovery Banner -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #22C55E; padding: 24px 32px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right: 12px; vertical-align: middle;">
                                  <div style="width: 40px; height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                                    ✅
                                  </div>
                                </td>
                                <td style="vertical-align: middle;">
                                  <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.7);">Recovered</p>
                                  <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Website is Back Up</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
                        
                        <!-- Monitor Name -->
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(0,0,0,0.35);">Monitor</p>
                            <p style="margin: 6px 0 0 0; font-size: 28px; font-weight: 600; color: #000000; letter-spacing: -1px;">${monitorName}</p>
                          </td>
                        </tr>
                        
                        <!-- Info Grid -->
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; border-radius: 16px; overflow: hidden;">
                              
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">URL</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000;">
                                        <a href="${url}" style="color: #000; text-decoration: underline; text-underline-offset: 3px;">${url}</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">Downtime</td>
                                      <td style="font-size: 14px; font-weight: 600; color: #000;">
                                        ${downtimeMinutes < 1 ? "Less than a minute" : downtimeMinutes + " minutes"}
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                              <tr>
                                <td style="padding: 16px 20px;">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35); vertical-align: top; padding-top: 2px;">Recovered</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000;">${timestamp}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              
                            </table>
                          </td>
                        </tr>
                        
                        <!-- CTA -->
                        <tr>
                          <td style="padding-top: 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center">
                                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                                     style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: -0.3px;">
                                    View Dashboard →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 0; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.3); font-weight: 500;">
                        Your monitor is back online. No action needed.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(0,0,0,0.2); font-weight: 500;">
                        © ${new Date().getFullYear()} UptimeGuard
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("❌ Recovery email error:", emailError);
      return { success: false, error: emailError.message };
    }

    console.log("✅ Recovery email sent:", emailData);
    return { success: true, id: emailData?.id };
  } catch (err: any) {
    console.error("❌ Failed to send recovery email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendSSLExpiryAlert(data: {
  monitorName: string;
  userId: string;
  url: string;
  daysUntilExpiry: number;
  issuer: string;
}) {
  const { monitorName, url, daysUntilExpiry, issuer, userId } = data;

  try {
    const userEmail = await getUserEmail(userId);
    if (!userEmail) return { success: false };

    const isExpired = daysUntilExpiry <= 0;
    const isUrgent = daysUntilExpiry <= 7;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "UptimeGuard <onboarding@resend.dev>",
      to: userEmail,
      subject: isExpired 
        ? `🔴 SSL Certificate EXPIRED for ${monitorName}!` 
        : `⚠️ SSL Certificate expiring in ${daysUntilExpiry} days — ${monitorName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F4EAE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
                  
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size: 20px; font-weight: 500; color: #000; letter-spacing: -0.5px;">
                            ⚡ UptimeGuard
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                      
                      <!-- Banner -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: ${isExpired ? '#EF4444' : isUrgent ? '#F59E0B' : '#000000'}; padding: 24px 32px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right: 12px; vertical-align: middle;">
                                  <div style="width: 40px; height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px;">
                                    🔒
                                  </div>
                                </td>
                                <td style="vertical-align: middle;">
                                  <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.7);">SSL Certificate</p>
                                  <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.5px;">
                                    ${isExpired ? 'Certificate Expired' : `Expires in ${daysUntilExpiry} days`}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(0,0,0,0.35);">Monitor</p>
                            <p style="margin: 6px 0 0 0; font-size: 28px; font-weight: 600; color: #000; letter-spacing: -1px;">${monitorName}</p>
                          </td>
                        </tr>
                        
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4EAE6; border-radius: 16px; overflow: hidden;">
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35);">URL</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000;">
                                        <a href="${url}" style="color: #000; text-decoration: underline;">${url}</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35);">Issuer</td>
                                      <td style="font-size: 14px; font-weight: 500; color: #000;">${issuer}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 16px 20px;">
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width: 90px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.35);">Expires</td>
                                      <td style="font-size: 14px; font-weight: 600; color: ${isExpired ? '#DC2626' : isUrgent ? '#D97706' : '#000'};">
                                        ${isExpired ? 'EXPIRED' : `${daysUntilExpiry} days remaining`}
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding-top: 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center">
                                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                                     style="display: inline-block; background-color: #000; color: #fff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 600;">
                                    View Dashboard →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 32px 0; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.3); font-weight: 500;">
                        Renew your SSL certificate to avoid security warnings.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(0,0,0,0.2);">
                        © ${new Date().getFullYear()} UptimeGuard
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("❌ SSL alert error:", emailError);
      return { success: false, error: emailError.message };
    }

    console.log("✅ SSL alert sent:", emailData);
    return { success: true, id: emailData?.id };
  } catch (err: any) {
    console.error("❌ Failed to send SSL alert:", err);
    return { success: false, error: err.message };
  }
}