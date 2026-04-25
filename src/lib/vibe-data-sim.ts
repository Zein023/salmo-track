export type SystemStatus = 'disconnected' | 'connecting' | 'waiting' | 'active-negative' | 'active-positive';

export interface SensorData {
  arus: number | null; // Electric current in µA
  tegangan: number | null; // Voltage in V
  deltaI: number | null; // Selisih arus
  cfu: number | null; // CFU/mL
  status: SystemStatus;
  timestamp: number;
}

// Base baseline is around 35 µA
const BASE_ARUS = 35;
const BASE_TEGANGAN = 3.3;

export function generateMockData(status: SystemStatus): SensorData {
  const timestamp = Date.now();
  
  if (status === 'waiting') {
    // State 1: Menunggu Deteksi, mencari baseline. Arus stabil di angka tinggi.
    const arusNoise = (Math.random() - 0.5) * 1.5; 
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    return {
      arus: Number((BASE_ARUS + arusNoise).toFixed(2)),
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      deltaI: 0,
      cfu: null,
      status,
      timestamp
    };
  }

  if (status === 'active-negative') {
    // State 2: Aman. Arus sedikit berfluktuasi tapi tetap tinggi (misal 33). Delta I ~ 2.
    const arusAman = 33;
    const arusNoise = (Math.random() - 0.5) * 1.5;
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    const currentArus = arusAman + arusNoise;
    const deltaI = BASE_ARUS - currentArus;
    
    return {
      arus: Number(currentArus.toFixed(2)),
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      deltaI: Number(deltaI.toFixed(2)),
      cfu: null,
      status,
      timestamp
    };
  }

  if (status === 'active-positive') {
    // State 3: Terdeteksi. Arus drop drastis ke 10. Delta I ~ 25.
    const arusDrop = 10;
    const arusNoise = (Math.random() - 0.5) * 2.0;
    const teganganNoise = (Math.random() - 0.5) * 0.05;
    const currentArus = arusDrop + arusNoise;
    const deltaI = BASE_ARUS - currentArus;
    
    // Perhitungan CFU/mL menggunakan inverse log (Math.pow) jika Delta I > 5
    // Misal formula kasar: CFU = 10 ^ (deltaI / 5) * 10
    let cfu = null;
    if (deltaI > 5) {
      cfu = Math.pow(10, deltaI / 5) * 10;
    }

    return {
      arus: Number(currentArus.toFixed(2)),
      tegangan: Number((BASE_TEGANGAN + teganganNoise).toFixed(2)),
      deltaI: Number(deltaI.toFixed(2)),
      cfu: cfu ? Number(cfu.toExponential(2)) : null, // Display in scientific notation roughly
      status,
      timestamp
    };
  }

  // Disconnected / Connecting
  return {
    arus: null,
    tegangan: null,
    deltaI: null,
    cfu: null,
    status,
    timestamp
  };
}
