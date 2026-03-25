interface PingData {
  responseTime: number;
  checkedAt: Date;
}

// ALGORITHM: Moving Average + Standard Deviation
// This is simple but genuinely works for anomaly detection

export function detectAnomaly(recentPings: PingData[]): {
  isAnomalous: boolean;
  severity: "normal" | "warning" | "critical";
  message: string;
  predictedDowntime: number | null; // minutes until predicted crash
} {
  if (recentPings.length < 20) {
    return {
      isAnomalous: false,
      severity: "normal",
      message: "Not enough data yet",
      predictedDowntime: null,
    };
  }

  // Split data: older half = baseline, newer half = current
  const midpoint = Math.floor(recentPings.length / 2);
  const baseline = recentPings.slice(0, midpoint);
  const current = recentPings.slice(midpoint);

  // Calculate baseline stats
  const baselineAvg = average(baseline.map((p) => p.responseTime));
  const baselineStdDev = standardDeviation(
    baseline.map((p) => p.responseTime)
  );

  // Calculate current stats
  const currentAvg = average(current.map((p) => p.responseTime));

  // Z-Score: How many standard deviations is current avg 
  // from baseline avg?
  const zScore =
    baselineStdDev === 0
      ? 0
      : (currentAvg - baselineAvg) / baselineStdDev;

  // Check for TREND (is response time consistently increasing?)
  const trend = calculateTrend(current.map((p) => p.responseTime));

  // Decision logic
  if (zScore > 3 || trend > 0.8) {
    // Response time is WAY above normal AND trending up
    const predictedMinutes = estimateTimeToFailure(
      current.map((p) => p.responseTime)
    );

    return {
      isAnomalous: true,
      severity: "critical",
      message: `Response time is ${currentAvg.toFixed(
        0
      )}ms (normal: ${baselineAvg.toFixed(
        0
      )}ms). Trending upward rapidly.`,
      predictedDowntime: predictedMinutes,
    };
  } else if (zScore > 2 || trend > 0.5) {
    return {
      isAnomalous: true,
      severity: "warning",
      message: `Response time is higher than usual 
      (${currentAvg.toFixed(0)}ms vs normal ${baselineAvg.toFixed(0)}ms)`,
      predictedDowntime: null,
    };
  }

  return {
    isAnomalous: false,
    severity: "normal",
    message: "All normal",
    predictedDowntime: null,
  };
}

// ---- Helper Functions ----

function average(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function standardDeviation(nums: number[]): number {
  const avg = average(nums);
  const squareDiffs = nums.map((n) => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

// Linear regression slope — positive = response time increasing
function calculateTrend(values: number[]): number {
  const n = values.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Normalize slope (0 = flat, 1 = steeply increasing)
  const maxVal = Math.max(...values);
  return maxVal === 0 ? 0 : Math.min(slope / maxVal, 1);
}

// Estimate minutes until response time crosses 10-second 
// threshold (likely timeout/crash)
function estimateTimeToFailure(values: number[]): number | null {
  const n = values.length;
  if (n < 5) return null;

  const recentSlope =
    (values[n - 1] - values[n - 5]) / 5; // ms increase per check

  if (recentSlope <= 0) return null; // Not increasing

  const currentResponseTime = values[n - 1];
  const threshold = 10000; // 10 seconds = likely timeout

  const checksUntilFailure =
    (threshold - currentResponseTime) / recentSlope;

  // Convert checks to minutes (assuming 1 check per minute)
  return Math.max(1, Math.round(checksUntilFailure));
}