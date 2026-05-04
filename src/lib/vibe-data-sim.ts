export type SystemStatus = 'disconnected' | 'connecting' | 'waiting' | 'active-negative' | 'active-positive';

export interface SensorData {
  arus: number | null; 
  tegangan: number | null; 
  cfu: number | null;
  status: SystemStatus;
  timestamp: number;
}

export function generateMockData(status: SystemStatus, tegangan: number, peakArus: number): SensorData {
  const timestamp = Date.now();
  
  if (status === 'waiting') {
    // Waiting state: simulate baseline noise near 0
    const noise = (Math.random() - 0.5) * 0.1;
    let arus = 0 + noise;
    if (arus < 0) arus = 0;
    return {
      arus: Number(arus.toFixed(2)),
      tegangan: Number(tegangan.toFixed(2)),
      cfu: null,
      status,
      timestamp
    };
  }

  // Differential Pulse Voltammetry (DPV) Gaussian Peak Curve
  // Centered exactly at 0.24 V (as seen in the reference journal)
  const variance = 0.015;
  const currentArus = peakArus * Math.exp(-Math.pow(tegangan - 0.24, 2) / variance);
  
  // Add realistic electrochemical noise
  const noise = (Math.random() - 0.5) * 0.3; 
  let finalArus = currentArus + noise;
  if (finalArus < 0) finalArus = 0;

  // Calculate CFU roughly based on Peak Current
  let cfu = null;
  if (status === 'active-positive' && peakArus > 5) {
    cfu = Math.pow(10, peakArus / 5) * 10;
  }

  return {
    arus: Number(finalArus.toFixed(2)),
    tegangan: Number(tegangan.toFixed(2)),
    cfu: cfu ? Number(cfu.toExponential(2)) : null,
    status,
    timestamp
  };
}
