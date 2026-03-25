// src/lib/ssl-checker.ts

import tls from "tls";

export interface SSLInfo {
  isValid: boolean;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  daysUntilExpiry: number;
  protocol: string;
  warning: string | null;
}

export function checkSSLCertificate(hostname: string): Promise<SSLInfo> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        rejectUnauthorized: false,
        timeout: 10000,
      },
      () => {
        const cert = socket.getPeerCertificate();

        if (!cert || !cert.valid_to) {
          socket.destroy();
          reject(new Error("No certificate found"));
          return;
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const now = new Date();
        const daysUntilExpiry = Math.floor(
          (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        let warning: string | null = null;

        if (daysUntilExpiry < 0) {
          warning = `⛔ SSL certificate EXPIRED ${Math.abs(
            daysUntilExpiry
          )} days ago!`;
        } else if (daysUntilExpiry < 7) {
          warning = `🔴 SSL certificate expires in ${daysUntilExpiry} days!`;
        } else if (daysUntilExpiry < 30) {
          warning = `🟡 SSL certificate expires in ${daysUntilExpiry} days. Renew soon.`;
        }

        // ─── FIX: Handle issuer being string or string[] ───
        const issuerOrg = cert.issuer?.O;
        const issuer: string = Array.isArray(issuerOrg)
          ? issuerOrg[0] || "Unknown"
          : issuerOrg || "Unknown";

        // ─── FIX: Handle protocol being string or null ───
        const protocol: string = socket.getProtocol() ?? "Unknown";

        resolve({
          isValid: daysUntilExpiry > 0 && socket.authorized,
          issuer,
          validFrom,
          validTo,
          daysUntilExpiry,
          protocol,
          warning,
        });

        socket.destroy();
      }
    );

    socket.on("error", (err) => {
      reject(err);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("SSL connection timed out"));
    });
  });
}