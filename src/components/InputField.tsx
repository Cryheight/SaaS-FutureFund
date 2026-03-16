import React, { useState, useEffect, useRef } from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function InputField({ label, value, onChange, type = 'number', min, max, step, prefix, suffix, placeholder }: InputFieldProps) {
  const [localValue, setLocalValue] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setLocalValue(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    onChange(raw);
  };

  const handleFocus = () => {
    focused.current = true;
  };

  const handleBlur = () => {
    focused.current = false;
    if (type === 'number') {
      const parsed = parseFloat(localValue);
      if (isNaN(parsed) || localValue.trim() === '') {
        setLocalValue(String(value));
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
        {prefix && <span className="px-3 py-2 bg-gray-100 text-gray-600 border-r border-gray-300 text-sm">{prefix}</span>}
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none text-sm bg-white"
        />
        {suffix && <span className="px-3 py-2 bg-gray-100 text-gray-600 border-l border-gray-300 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}
