export type SystemStatus = 'disconnected' | 'connecting' | 'waiting' | 'active-negative' | 'active-positive';

export interface SensorData {
  arus: number | null; // Absolute Electric current in µA
  tegangan: number | null; // Voltage in V
  cfu: number | null; // CFU/mL
  status: SystemStatus;
  timestamp: number;
}

const BASE_TEGANGAN = 3.3;

export function generateMockData(status: SystemStatus): SensorData {
  const timestamp = Date.now();
  
  if (status === 'waiting') {
    // State 1: Menunggu Deteksi, Arus statis di 0 µA
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    return {
      arus: 0.00,
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      cfu: null,
      status,
      timestamp
    };
  }

  if (status === 'active-negative') {
    // State 2: Aman. Arus sangat rendah, sekitar 0.5 hingga 2.5 µA.
    const arusRandom = 0.5 + Math.random() * 2.0; 
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    
    return {
      arus: Number(arusRandom.toFixed(2)),
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      cfu: null,
      status,
      timestamp
    };
  }

  if (status === 'active-positive') {
    // State 3: Terdeteksi. Lonjakan drastis, 15 hingga 35 µA.
    const arusRandom = 15 + Math.random() * 20.0;
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    
    // Perhitungan CFU/mL secara kasar berdasarkan arus > 5µA
    let cfu = null;
    if (arusRandom > 5) {
      cfu = Math.pow(10, arusRandom / 5) * 10;
    }

    return {
      arus: Number(arusRandom.toFixed(2)),
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      cfu: cfu ? Number(cfu.toExponential(2)) : null,
      status,
      timestamp
    };
  }

  // Disconnected / Connecting
  return {
    arus: null,
    tegangan: null,
    cfu: null,
    status,
    timestamp
  };
}
