import React from 'react';
import { UnitType } from '../types';

interface CalculatorInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  unit: UnitType;
  onUnitChange: (unit: UnitType) => void;
  units: UnitType[];
  placeholder?: string;
  disabled?: boolean;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
  placeholder,
  disabled = false,
}) => {
  const isCalculated = disabled && value !== '';

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex">
        <input
          type="text"
          inputMode="decimal"
          className={`
            flex-grow p-3 rounded-l-lg border-2
            ${isCalculated ? 'bg-indigo-100 text-indigo-900 border-indigo-400' : 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500'}
            transition-colors duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
          value={value}
          onChange={(e) => {
            // Allow only numbers and a single decimal point
            const inputValue = e.target.value;
            if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
              onValueChange(inputValue);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
        <select
          className={`
            p-3 rounded-r-lg border-2 border-l-0
            ${isCalculated ? 'bg-indigo-200 text-indigo-900 border-indigo-400' : 'bg-gray-600 text-white border-gray-600'}
            focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1
            appearance-none transition-colors duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as UnitType)}
          disabled={disabled}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalculatorInput;
