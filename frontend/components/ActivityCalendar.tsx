'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';

interface Day {
  date: Date;
  hasRecap: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export default function ActivityCalendar() {
  const { address } = useAccount();
  const [currentMonth] = useState(new Date());

  const generateCalendar = (): Day[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Day[] = [];

    // Add padding for days before month starts
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      const date = new Date(year, month, -startPadding + i + 1);
      days.push({
        date,
        hasRecap: false,
        isToday: false,
        isFuture: true,
      });
    }

    // Add actual month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isFuture = date > today;
      const isToday = date.getTime() === today.getTime();
      
      days.push({
        date,
        hasRecap: false, // Would check contract for actual data
        isToday,
        isFuture,
      });
    }

    return days;
  };

  const calendar = generateCalendar();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!address) {
    return (
      <div className="text-center text-gray-500 py-4">
        Connect your wallet to see your activity calendar
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 pb-2">
            {day}
          </div>
        ))}
        
        {calendar.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center rounded text-sm
              ${day.isFuture && !day.isToday ? 'text-gray-300 bg-gray-50' : ''}
              ${day.isToday ? 'ring-2 ring-blue-500 font-bold' : ''}
              ${day.hasRecap ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700'}
              ${!day.hasRecap && !day.isFuture && !day.isToday ? 'hover:bg-gray-100' : ''}
              ${day.date.getMonth() !== currentMonth.getMonth() ? 'opacity-30' : ''}
            `}
            title={day.hasRecap ? 'Recap submitted' : 'No recap'}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Recap submitted</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 border border-gray-300 rounded"></div>
          <span>No recap</span>
        </div>
      </div>
    </div>
  );
}
