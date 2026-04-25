import { useState, useEffect } from 'react';
import { SystemStatus, SensorData, generateMockData } from '@/lib/vibe-data-sim';

export interface HistoryRecord {
  id: string;
  time: string;
  status: string;
  peakArus: number;
  deltaI: number;
  description: string;
}

export function useSensorData() {
  const [status, setStatus] = useState<SystemStatus>('disconnected');
  const [isPaused, setIsPaused] = useState(false);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<SensorData[]>([]);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  
  // Timer for the state machine
  const [cycleTime, setCycleTime] = useState(0);

  const connect = () => {
    setStatus('connecting');
    setIsPaused(false);
    setTimeout(() => {
      setStatus('waiting');
      setCycleTime(0);
    }, 2000);
  };
  
  const disconnect = () => {
    setStatus('disconnected');
    setIsPaused(false);
    setChartData([]);
    setHistoryRecords([]);
    setCurrentData(null);
    setCycleTime(0);
  };

  const resetSensor = () => {
    setStatus('waiting');
    setIsPaused(false);
    setChartData([]);
    setHistoryRecords([]);
    setCycleTime(0);
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

  // State Machine Effect
  useEffect(() => {
    if (status === 'disconnected' || status === 'connecting' || isPaused) return;

    const interval = setInterval(() => {
      setCycleTime(prev => {
        const nextTime = (prev + 1) % 15;
        
        let nextStatus = status;
        if (nextTime === 0) nextStatus = 'waiting';
        else if (nextTime === 5) nextStatus = 'active-negative';
        else if (nextTime === 10) nextStatus = 'active-positive';
        
        if (nextStatus !== status) {
          setStatus(nextStatus);
          
          // Generate history record on transition to active states
          if (nextStatus === 'active-negative') {
            setHistoryRecords(h => [{
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString(),
              status: 'Aman',
              peakArus: 33,
              deltaI: 2,
              description: 'Aman (Penurunan arus normal: 2 µA)'
            }, ...h]);
          } else if (nextStatus === 'active-positive') {
            setHistoryRecords(h => [{
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString(),
              status: 'Bahaya',
              peakArus: 10,
              deltaI: 25,
              description: 'Bahaya! Arus drop drastis melebihi ambang batas (Delta: 25 µA)'
            }, ...h]);
          }
        }
        
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, isPaused]);

  // Data polling for chart
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status !== 'disconnected' && status !== 'connecting' && !isPaused) {
      interval = setInterval(() => {
        const newData = generateMockData(status);
        setCurrentData(newData);
        setChartData(prev => {
          const newHistory = [...prev, newData];
          if (newHistory.length > 30) return newHistory.slice(newHistory.length - 30);
          return newHistory;
        });
      }, 1000);
    } else if (!isPaused) {
      setCurrentData(generateMockData(status));
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
