import axios from "axios";
import https from "https";
import dns from "dns/promises";

export interface RootCauseAnalysis {
  category:
    | "dns_failure"
    | "ssl_error"
    | "connection_timeout"
    | "server_error"
    | "content_error"
    | "too_slow"
    | "unknown";
  description: string;
  suggestion: string;
  technicalDetail: string;
}

export async function analyzeRootCause(
  url: string,
  error: any
): Promise<RootCauseAnalysis> {
  const hostname = new URL(url).hostname;

  // CHECK 1: Is it a DNS problem?
  try {
    await dns.lookup(hostname);
  } catch (dnsError) {
    return {
      category: "dns_failure",
      description: "DNS resolution failed",
      suggestion:
        "Check if the domain name is correct and DNS records are configured properly.",
      technicalDetail: `DNS lookup failed for ${hostname}: ${dnsError}`,
    };
  }

  // CHECK 2: Is it an SSL/TLS problem?
  try {
    await checkSSL(hostname);
  } catch (sslError: any) {
    return {
      category: "ssl_error",
      description: "SSL/TLS certificate issue",
      suggestion:
        "The SSL certificate may be expired, self-signed, or misconfigured. Check your certificate status.",
      technicalDetail: `SSL error for ${hostname}: ${sslError.message}`,
    };
  }

  // CHECK 3: Connection timeout?
  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT" ||
    error?.message?.includes("timeout")
  ) {
    return {
      category: "connection_timeout",
      description: "Server is not responding (timeout)",
      suggestion:
        "The server may be overloaded, crashed, or blocked your request. Check server logs and resources.",
      technicalDetail: `Connection timed out after 10000ms`,
    };
  }

  // CHECK 4: Server returned an error status code?
  if (error?.response?.status) {
    const status = error.response.status;

    if (status >= 500) {
      return {
        category: "server_error",
        description: `Server returned HTTP ${status}`,
        suggestion:
          status === 502
            ? "Bad Gateway — your reverse proxy (Nginx/Cloudflare) can't reach the backend server."
            : status === 503
            ? "Service Unavailable — server is overloaded or under maintenance."
            : "Internal Server Error — check application logs for crashes or exceptions.",
        technicalDetail: `HTTP ${status} received from ${url}`,
      };
    }

    if (status === 404) {
      return {
        category: "content_error",
        description: "Page not found (404)",
        suggestion:
          "The monitored URL path may have changed. Update the monitor URL.",
        technicalDetail: `HTTP 404 received from ${url}`,
      };
    }
  }

  // CHECK 5: Connection refused?
  if (error?.code === "ECONNREFUSED") {
    return {
      category: "server_error",
      description: "Connection refused",
      suggestion:
        "The server is not accepting connections. The web server process (Nginx, Apache, Node) may have crashed.",
      technicalDetail: `ECONNREFUSED for ${url}`,
    };
  }

  return {
    category: "unknown",
    description: "Unknown error",
    suggestion:
      "Check server logs and network connectivity manually.",
    technicalDetail: error?.message || "No details available",
  };
}

// Helper: Check SSL certificate validity
function checkSSL(hostname: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        port: 443,
        method: "HEAD",
        rejectUnauthorized: true, // Will fail if SSL is invalid
        timeout: 5000,
      },
      (res) => {
        resolve();
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}