"use client";

import { useState } from "react";
import { useSensorData } from "@/hooks/use-sensor-data";
import { ChartArus } from "@/components/dashboard/ChartArus";
import { Settings, Clock, Check, Hexagon, ShieldCheck, AlertCircle, Hourglass, Info, RefreshCw, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { 
    status, 
    currentData, 
    chartData, 
    historyRecords, 
    connect, 
    disconnect,
    pauseSimulation,
    toggleState, 
    resetSensor 
  } = useSensorData();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const isDisconnected = status === 'disconnected';
  const isConnecting = status === 'connecting';
  const isWaiting = status === 'waiting';
  
  // Reactive UI State
  const isScanning = status === 'active-negative' || status === 'active-positive';
  const hasSpiked = (currentData?.arus ?? 0) > 5;
  
  const showWaiting = isWaiting;
  const showNegative = isScanning && !hasSpiked;
  const showPositive = isScanning && hasSpiked;

  // Format data for display
  const displayArus = currentData?.arus !== null ? currentData?.arus : '--';
  const displayTegangan = currentData?.tegangan !== null ? currentData?.tegangan : '--';

  const handleFinishTest = () => {
    pauseSimulation();
    setSummaryOpen(true);
  };

  const handleReturnToDashboard = () => {
    disconnect();
    setSettingsOpen(false);
    setSummaryOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Dev Toggle */}
      <button 
        onClick={toggleState} 
        className="fixed top-4 right-4 bg-white/10 text-xs px-2 py-1 rounded opacity-30 hover:opacity-100 transition z-50"
      >
        State: {status}
      </button>

      {/* Top Header */}
      <header className="flex items-center gap-3 pt-6 pb-12 justify-center md:justify-start">
        <img src="/logoPolban.png" alt="Logo Polban" className="w-10 h-10 object-contain" />
        <h1 className="text-2xl font-bold tracking-tight">SalmoTrack</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center md:justify-start relative">
        
        {/* State: Disconnected */}
        {(isDisconnected) && (
          <div className="flex-1 flex items-center justify-center">
            <button 
              onClick={connect}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-neutral-500/80 hover:bg-neutral-500 transition-colors flex items-center justify-center border-8 border-neutral-600/50 shadow-2xl"
            >
              <span className="text-2xl font-bold text-white tracking-widest">HUBUNGKAN</span>
            </button>
          </div>
        )}

        {/* State: Connecting */}
        {(isConnecting) && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-neutral-500/80 flex items-center justify-center border-8 border-neutral-600/50 animate-pulse">
              <span className="text-xl font-bold text-white tracking-widest">menghubungkan...</span>
            </div>
          </div>
        )}

        {/* State: Dashboard Grid (Waiting, Negative, Positive) */}
        {(showWaiting || showNegative || showPositive) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            
            {/* Status Block */}
            <div className="md:col-span-1">
              {showWaiting && (
                <Card className="bg-neutral-500 border-none text-white overflow-hidden rounded-2xl flex flex-col items-center justify-center p-8 text-center h-48 md:h-full min-h-[200px]">
                  <Hourglass className="w-16 h-16 text-neutral-300 mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold">Menunggu Deteksi</h2>
                  <p className="text-sm font-medium opacity-80 mt-2 italic">Kalibrasi Baseline...</p>
                </Card>
              )}
              {showNegative && (
                <Card className="bg-[#22c55e] border-none text-white overflow-hidden rounded-2xl h-48 md:h-full min-h-[200px] flex flex-col">
                  <div className="flex-1 flex items-center gap-4 p-6">
                    <ShieldCheck className="w-16 h-16 text-white" />
                    <h2 className="text-3xl font-bold leading-tight">Pemindaian Aman...</h2>
                  </div>
                  <div className="bg-black/20 w-full py-3 text-center text-sm font-bold italic">
                    Memantau potensi cemaran bakteri
                  </div>
                </Card>
              )}
              {showPositive && (
                <Card className="bg-[#ef4444] border-none text-white overflow-hidden rounded-2xl h-48 md:h-full min-h-[200px] flex flex-col">
                  <div className="flex-1 flex items-center gap-4 p-6">
                    <div className="bg-white rounded-full p-2 shrink-0">
                      <AlertCircle className="w-12 h-12 text-[#ef4444]" />
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">Salmonella Terdeteksi !</h2>
                  </div>
                  <div className="bg-black/20 w-full py-3 text-center text-sm font-bold italic">
                    CFU/mL (Estimasi): {currentData?.cfu ? `${currentData.cfu} CFU/mL` : '--'}
                  </div>
                </Card>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 md:col-span-1 h-32 md:h-full min-h-[160px]">
              <Card className="bg-[#525252] border-none text-white p-4 rounded-2xl flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-neutral-300 mb-2">Arus Puncak (Peak)</div>
                </div>
                <div className="text-4xl font-bold text-sky-400 flex items-baseline gap-1 mt-2">
                  {displayArus} <span className="text-xl font-bold text-white">µA</span>
                </div>
              </Card>
              <Card className="bg-[#525252] border-none text-white p-4 rounded-2xl flex flex-col justify-center">
                <div className="text-sm font-semibold text-neutral-300 mb-2">Tegangan Puncak</div>
                <div className="text-4xl font-bold text-[#4ade80] flex items-baseline gap-1 mt-2">
                  {displayTegangan} <span className="text-xl font-bold text-white">V</span>
                </div>
              </Card>
            </div>

            {/* Chart */}
            <div className="md:col-span-2 mt-4 md:mt-2">
              <ChartArus data={chartData} />
            </div>

          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="mt-auto pt-8 pb-4 flex items-center justify-between px-4">
        {/* History Button (Dialog) */}
        <Dialog>
          <DialogTrigger className="p-3 text-neutral-400 hover:text-white transition bg-[#2a2a2a] rounded-full border border-[#444] cursor-pointer">
            <Clock className="w-8 h-8" />
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-[#2a2a2a] text-white border-neutral-700 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Riwayat Deteksi Sensor</DialogTitle>
              <DialogDescription className="text-neutral-400">
                Data historis pengujian Salmonella menggunakan sensor rGO-AuNPs.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {historyRecords.length === 0 ? (
                <div className="text-center text-neutral-400 py-8">Belum ada data riwayat.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-700 hover:bg-neutral-800/50">
                      <TableHead className="text-neutral-300">Waktu</TableHead>
                      <TableHead className="text-neutral-300">Status</TableHead>
                      <TableHead className="text-neutral-300 text-right">Puncak Arus</TableHead>
                      <TableHead className="text-neutral-300">Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords.map((record) => (
                      <TableRow key={record.id} className="border-neutral-700 hover:bg-neutral-800/50">
                        <TableCell className="font-medium">{record.time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.status === 'Bahaya' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{record.peakArus} µA</TableCell>
                        <TableCell className="text-xs">{record.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Center action button */}
        {(showNegative || showPositive) && (
          <button 
            onClick={handleFinishTest}
            className="bg-[#22c55e] text-black w-32 h-14 rounded-full flex items-center justify-center hover:bg-[#1ea34d] transition shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            <Check className="w-8 h-8 stroke-[3]" />
          </button>
        )}
        
        {isConnecting && (
          <div className="w-32 h-14 flex items-center justify-center">
            <Check className="w-8 h-8 text-neutral-500" />
          </div>
        )}

        {isDisconnected && <div className="w-32"></div>}
        {showWaiting && <div className="w-32"></div>}

        {/* Settings Button (Dialog) */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger className="p-3 text-neutral-400 hover:text-white transition bg-[#2a2a2a] rounded-full border border-[#444] cursor-pointer">
            <Settings className="w-8 h-8" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#2a2a2a] text-white border-neutral-700">
            <DialogHeader>
              <DialogTitle>Pengaturan Sistem</DialogTitle>
              <DialogDescription className="text-neutral-400">
                Manajemen perangkat sensor SalmoTrack.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <button 
                onClick={() => alert("Silakan hubungi tim SalmoTrack untuk bantuan teknis terkait kalibrasi sensor.")}
                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700 text-left"
              >
                <Info className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="font-semibold">Bantuan & Cara Penggunaan</div>
                  <div className="text-xs text-neutral-400">Panduan penggunaan sensor rGO-AuNPs</div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  resetSensor();
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition border border-red-500/20 text-left text-red-400"
              >
                <RefreshCw className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Reset Sensor</div>
                  <div className="text-xs opacity-80">Hapus riwayat dan kalibrasi ulang dari awal</div>
                </div>
              </button>

              <button 
                onClick={handleReturnToDashboard}
                className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700 text-left mt-4"
              >
                <LogOut className="w-5 h-5 text-neutral-400" />
                <div className="font-semibold">Kembali ke Dashboard</div>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </footer>

      {/* Summary Modal */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="sm:max-w-2xl bg-[#2a2a2a] text-white border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-2xl">Ringkasan Hasil Deteksi</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Sesi pengujian telah dihentikan. Berikut adalah hasil rekapitulasi data terakhir.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col gap-6">
            <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center ${showPositive ? 'bg-[#ef4444]/20 border border-[#ef4444]' : 'bg-[#22c55e]/20 border border-[#22c55e]'}`}>
              {showPositive ? (
                <>
                  <AlertCircle className="w-16 h-16 text-[#ef4444] mb-4" />
                  <h3 className="text-2xl font-bold text-[#ef4444]">Bahaya (Salmonella Terdeteksi)</h3>
                  <p className="text-sm mt-2 opacity-90">Arus puncak melebihi batas toleransi. Ditemukan potensi cemaran bakteri.</p>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-16 h-16 text-[#22c55e] mb-4" />
                  <h3 className="text-2xl font-bold text-[#22c55e]">Aman (Salmonella Tidak Terdeteksi)</h3>
                  <p className="text-sm mt-2 opacity-90">Arus stabil di titik rendah. Tidak ada indikasi cemaran bakteri yang signifikan.</p>
                </>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Grafik Sesi Ini</div>
              <ChartArus data={chartData} />
            </div>

            <button 
              onClick={handleReturnToDashboard}
              className="w-full bg-neutral-100 hover:bg-white text-black font-bold py-4 rounded-xl transition mt-4"
            >
              Selesai & Kembali ke Awal
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
