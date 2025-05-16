'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isBefore, isSameDay, getDay, startOfToday } from 'date-fns';

export default function CustomDatePicker({ onSelectDate }) {
  const [date, setDate] = useState<Date | null>(null);

  const isSunday = (date: Date) => getDay(date) === 0;
  const isBeforeToday = (date: Date) => isBefore(date, startOfToday()) || isSameDay(date, startOfToday());

  const isDisabled = (date: Date) => {
    return isBeforeToday(date) || isSunday(date);
  };

  return (
    <div className="w-full flex justify-center">
      <DatePicker
        selected={date}
        onChange={(d) => {
          setDate(d);
          onSelectDate(d);
        }}
        inline
        dayClassName={(d) =>
          isDisabled(d)
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:bg-blue-100 cursor-pointer'
        }
        filterDate={(d) => !isDisabled(d)}
      />
    </div>
  );
}

/*
'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, isBefore, isSameDay, getDay, startOfToday } from 'date-fns';

export default function CustomDatePicker({ selectedDate, onSelectDate }) {
  const [date, setDate] = useState<Date | null>(null);

  const isSunday = (date: Date) => getDay(date) === 0;
  const isBeforeToday = (date: Date) => isBefore(date, startOfToday()) || isSameDay(date, startOfToday());

  const isDisabled = (date: Date) => {
    return isBeforeToday(date) || isSunday(date);
  };

  return (
    <div className="w-full flex justify-center">
      <DatePicker
        selected={date}
        onChange={(d) => {
          setDate(d);
          onSelectDate(d);
        }}
        inline
        dayClassName={(d) =>
          isDisabled(d)
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:bg-blue-100 cursor-pointer'
        }
        filterDate={(d) => !isDisabled(d)}
      />
    </div>
  );
}
  */