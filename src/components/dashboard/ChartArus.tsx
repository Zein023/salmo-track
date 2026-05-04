"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SensorData } from "@/lib/vibe-data-sim";

export function ChartArus({ data }: { data: SensorData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[200px] bg-[#333333] rounded-lg flex items-center justify-center text-sm text-gray-300">
        Tidak ada data grafik
      </div>
    );
  }

  // Format data for Recharts, taking only valid data points
  const chartData = data.map((d, i) => ({
    time: i,
    arus: d.arus
  }));

  return (
    <div className="w-full h-[250px] bg-black/40 p-4 rounded-xl border border-white/5">
      <div className="text-sm font-semibold mb-4 text-white">Graph Arus Listrik (µA)</div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={true} horizontal={true} />
            <XAxis dataKey="time" hide />
            <YAxis 
              domain={[0, 50]} 
              stroke="#888" 
              fontSize={10} 
              tickFormatter={(val) => `${val}`} 
              tick={{fill: '#888'}}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', border: '1px solid #444', borderRadius: '8px' }}
              itemStyle={{ color: '#0ea5e9' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`${value} µA`, "Arus Listrik"]}
            />
            <Line 
              type="monotone" 
              dataKey="arus" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
