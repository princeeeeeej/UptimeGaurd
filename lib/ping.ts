import axios from "axios";

export interface PingResult {
  statusCode: number | null;
  responseTime: number | null;
  isUp: boolean;
  errorMessage: string | null;
}


export async function pingUrl(url: string): Promise<PingResult> {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000, 
      validateStatus: () => true,
      headers: {
        "User-Agent": "UptimeGuard/1.0", 
      },
      maxRedirects: 5,
    });

    const responseTime = Date.now() - startTime;

    return {
      statusCode: response.status,
      responseTime: responseTime,
      isUp: response.status >= 200 && response.status < 400,
      errorMessage: null,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    return {
      statusCode: null,
      responseTime: responseTime,
      isUp: false,
      errorMessage: error.message || "Unknown error",
    };
  }
}