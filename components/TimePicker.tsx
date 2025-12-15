import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHour(h || '00');
      setMinute(m || '00');
    } else {
        setHour('00');
        setMinute('00');
    }
  }, [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    setHour(newHour);
    onChange(`${newHour}:${minute}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value;
    setMinute(newMinute);
    onChange(`${hour}:${newMinute}`);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // 5-minute steps could be: Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div className="flex items-center space-x-2 bg-white border-2 border-slate-200 rounded-xl px-3 h-14 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
      <Clock size={20} className="text-slate-400 shrink-0" />
      <div className="flex items-center space-x-1">
        <select
          value={hour}
          onChange={handleHourChange}
          className="bg-transparent text-xl font-bold text-slate-800 outline-none appearance-none cursor-pointer text-center w-12 hover:text-blue-600 transition-colors"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-xl font-bold text-slate-400">:</span>
        <select
          value={minute}
          onChange={handleMinuteChange}
          className="bg-transparent text-xl font-bold text-slate-800 outline-none appearance-none cursor-pointer text-center w-12 hover:text-blue-600 transition-colors"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
