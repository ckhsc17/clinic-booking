'use client';
import { isBefore, getDay, startOfToday } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  selectableDates?: Set<string>; // <-- 加入這行
};

export default function CustomDatePicker({ selectedDate, onSelectDate, selectableDates }: DatePickerProps) {
  const isSunday = (date: Date) => getDay(date) === 0;
  const isBeforeToday = (date: Date) => isBefore(date, startOfToday());

  const isSelectable = (date: Date) => {
    if (!selectableDates) return true;
    const dateStr = date.toISOString().split('T')[0]; // yyyy-mm-dd
    return selectableDates.has(dateStr);
  };

  const isDisabled = (date: Date) => {
    return isBeforeToday(date) || isSunday(date) || !isSelectable(date);
  };

  return (
    <div className="w-full flex justify-center">
      <DatePicker
        selected={selectedDate}
        onChange={(d) => d && onSelectDate(d)}
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
