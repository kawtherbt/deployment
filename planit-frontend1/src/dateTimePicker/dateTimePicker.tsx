// DateTimePickerWithIcon.tsx
import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./dateTimePicker.css";

interface DateTimePickerWithIconProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  error?: FieldError;
  onChange?: (date: Date | null) => void;
  required?: boolean;
}

const DateTimePickerWithIcon: React.FC<DateTimePickerWithIconProps> = ({
  name,
  control,
  placeholder,
  error,
  onChange,
  required = false,
}) => (
  <div className="datetime-picker-container">
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <div className="date-time-input-with-icon">
          <DatePicker
            id={name}
            selected={field.value ? new Date(field.value) : null}
            onChange={(date: Date | null, event?: React.SyntheticEvent<any>) => {
              field.onChange(date);
              if (onChange) onChange(date);
            }}
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            placeholderText={placeholder}
            className="date-time-input"
          />
          <div className="calendar-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      )}
    />
    {error && <p className="error-message">{String(error.message)}</p>}
  </div>
);

export default DateTimePickerWithIcon;