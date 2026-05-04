"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SensorData } from "@/lib/vibe-data-sim";

export function ChartArus({ data }: { data: SensorData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] bg-[#333333] rounded-lg flex items-center justify-center text-sm text-gray-300">
        Menyiapkan pemindaian DPV...
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] bg-black/40 p-4 rounded-xl border border-white/5 relative">
      <div className="text-sm font-semibold mb-4 text-white">Differential Pulse Voltammetry (DPV)</div>
      
      {/* Label Y-Axis */}
      <div className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 text-xs text-neutral-400 font-medium tracking-widest whitespace-nowrap">
        Current (µA)
      </div>

      <div className="h-[240px] w-full pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={true} horizontal={true} />
            <XAxis 
              dataKey="tegangan" 
              type="number"
              domain={[-0.2, 0.6]}
              ticks={[-0.2, 0.0, 0.2, 0.4, 0.6]}
              stroke="#888" 
              fontSize={12}
              tick={{fill: '#888'}} 
              axisLine={true}
              tickLine={true}
            />
            <YAxis 
              domain={[0, 40]} 
              stroke="#888" 
              fontSize={12} 
              tickFormatter={(val) => `${val}`} 
              tick={{fill: '#888'}}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', border: '1px solid #444', borderRadius: '8px' }}
              itemStyle={{ color: '#0ea5e9' }}
              labelFormatter={(label) => `Potential: ${Number(label).toFixed(2)} V`}
              formatter={(value) => [`${value} µA`, "Current"]}
            />
            <Line 
              type="monotone" 
              dataKey="arus" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Label X-Axis */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-neutral-400 font-medium tracking-widest">
        Potential (V)
      </div>
    </div>
  );
}
