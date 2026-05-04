import { useState, useEffect, useRef } from 'react';
import { SystemStatus, SensorData, generateMockData } from '@/lib/vibe-data-sim';

export interface HistoryRecord {
  id: string;
  time: string;
  status: string;
  peakArus: number;
  description: string;
}

export function useSensorData() {
  const [status, setStatus] = useState<SystemStatus>('disconnected');
  const [isPaused, setIsPaused] = useState(false);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<SensorData[]>([]);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  
  const currentPeakRef = useRef(0);

  const connect = () => {
    setStatus('connecting');
    setIsPaused(false);
    setTimeout(() => {
      setStatus('waiting');
    }, 2000);
  };
  
  const disconnect = () => {
    setStatus('disconnected');
    setIsPaused(false);
    setChartData([]);
    setHistoryRecords([]);
    setCurrentData(null);
  };

  const resetSensor = () => {
    setStatus('waiting');
    setIsPaused(false);
    setChartData([]);
    setHistoryRecords([]);
  };
  
  const pauseSimulation = () => {
    setIsPaused(true);
  };

  const toggleState = () => {
    const states: SystemStatus[] = ['disconnected', 'connecting', 'waiting', 'active-negative', 'active-positive'];
    const nextIndex = (states.indexOf(status) + 1) % states.length;
    setStatus(states[nextIndex]);
    if (states[nextIndex] === 'disconnected') {
      setChartData([]);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status !== 'disconnected' && status !== 'connecting' && !isPaused) {
      // Synchronize internal tick with current status
      let tick = 0;
      if (status === 'waiting') tick = 0;
      else if (status === 'active-negative') tick = 25;
      else if (status === 'active-positive') tick = 50;
      
      let internalStatus = status;

      interval = setInterval(() => {
        tick = (tick + 1) % 75; // 75 ticks * 200ms = 15 seconds full cycle
        
        let nextStatus = internalStatus;
        if (tick === 0) nextStatus = 'waiting';
        else if (tick === 25) nextStatus = 'active-negative';
        else if (tick === 50) nextStatus = 'active-positive';

        if (nextStatus !== internalStatus) {
          internalStatus = nextStatus;
          setStatus(nextStatus);
          setChartData([]); // Clear chart data to start drawing a new sweep
          
          if (nextStatus === 'waiting') {
            currentPeakRef.current = 0;
          } else if (nextStatus === 'active-negative') {
            const peak = Number((0.5 + Math.random() * 2.0).toFixed(2));
            currentPeakRef.current = peak;
            setHistoryRecords(h => [{
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString(),
              status: 'Aman',
              peakArus: peak,
              description: `Aman (Arus stabil di titik rendah: ${peak} µA)`
            }, ...h]);
          } else if (nextStatus === 'active-positive') {
            const peak = Number((15 + Math.random() * 20.0).toFixed(2));
            currentPeakRef.current = peak;
            setHistoryRecords(h => [{
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString(),
              status: 'Bahaya',
              peakArus: peak,
              description: `Bahaya! Terjadi lonjakan konduktivitas arus hingga ${peak} µA`
            }, ...h]);
          }
        }

        // Calculate scanning progress
        let progress = 0;
        if (internalStatus === 'waiting') progress = tick / 24;
        else if (internalStatus === 'active-negative') progress = (tick - 25) / 24;
        else if (internalStatus === 'active-positive') progress = (tick - 50) / 24;

        // Map progress to potential range: -0.2V to +0.6V
        const tegangan = -0.2 + (progress * 0.8);
        const newData = generateMockData(internalStatus, tegangan, currentPeakRef.current);
        
        setCurrentData(newData);
        setChartData(prev => [...prev, newData]);

      }, 200); // 200ms tick for smooth graph rendering
    }
    
    return () => clearInterval(interval);
  }, [status, isPaused]);
  
  return { 
    status, 
    isPaused,
    currentData, 
    chartData, 
    historyRecords, 
    connect, 
    disconnect,
    resetSensor, 
    pauseSimulation,
    toggleState 
  };
}
