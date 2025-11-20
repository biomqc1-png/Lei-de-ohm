import { UNIT_MULTIPLIERS, VOLTAGE_UNITS, CURRENT_UNITS, RESISTANCE_UNITS } from '../constants';
import { UnitType, CalculationResult } from '../types';

/**
 * Converts a value from its specified unit to its base unit (V, A, Ω).
 * @param value The numerical value.
 * @param unit The unit of the value.
 * @returns The value in its base unit.
 */
export const convertToBaseUnit = (value: number, unit: UnitType): number => {
  return value * (UNIT_MULTIPLIERS[unit] || 1);
};

/**
 * Converts a value from its base unit to a specified display unit.
 * @param value The numerical value in base units.
 * @param displayUnit The target display unit.
 * @returns The value converted to the display unit.
 */
export const convertFromBaseUnit = (value: number, displayUnit: UnitType): number => {
  if (!UNIT_MULTIPLIERS[displayUnit]) {
    console.warn(`Unit multiplier not found for ${displayUnit}, defaulting to 1.`);
    return value;
  }
  return value / UNIT_MULTIPLIERS[displayUnit];
};

/**
 * Automatically determines the most appropriate display unit for a given base value.
 * @param baseValue The value in its base unit (Volts, Amperes, or Ohms).
 * @param unitCategory An array of UnitType (e.g., VOLTAGE_UNITS, CURRENT_UNITS).
 * @returns The most appropriate UnitType for display.
 */
export const getAppropriateDisplayUnit = (baseValue: number, unitCategory: UnitType[]): UnitType => {
  const absValue = Math.abs(baseValue);

  // Sort units by their multiplier in descending order
  const sortedUnits = [...unitCategory].sort((a, b) => UNIT_MULTIPLIERS[b] - UNIT_MULTIPLIERS[a]);

  for (const unit of sortedUnits) {
    const convertedValue = convertFromBaseUnit(baseValue, unit);
    // Check if the converted value is between 0.1 and 1000 (inclusive) or if it's the base unit.
    if ((convertedValue >= 0.1 && convertedValue < 1000) || unit === unitCategory[0]) {
      return unit;
    }
  }

  // Fallback to the base unit if no suitable unit is found
  return unitCategory[0];
};

/**
 * Calculates the unknown value (Voltage, Current, or Resistance) based on Ohm's Law.
 * @param voltage Base unit voltage (Volts).
 * @param current Base unit current (Amperes).
 * @param resistance Base unit resistance (Ohms).
 * @returns The calculated value and its automatically determined unit, or null if calculation is not possible.
 */
export const calculateOhm = (
  voltage?: number | null,
  current?: number | null,
  resistance?: number | null
): CalculationResult | string | null => {
  const v = voltage ?? null;
  const i = current ?? null;
  const r = resistance ?? null;

  let resultValue: number | null = null;
  let resultUnitCategory: UnitType[] = [];
  let error: string | null = null;

  if (v !== null && i !== null && r === null) {
    // Calculate R = V / I
    if (i === 0) {
      error = "Não é possível dividir por corrente zero (I=0) para calcular resistência.";
    } else {
      resultValue = v / i;
      resultUnitCategory = RESISTANCE_UNITS;
    }
  } else if (v !== null && r !== null && i === null) {
    // Calculate I = V / R
    if (r === 0) {
      error = "Não é possível dividir por resistência zero (R=0) para calcular corrente.";
    } else {
      resultValue = v / r;
      resultUnitCategory = CURRENT_UNITS;
    }
  } else if (i !== null && r !== null && v === null) {
    // Calculate V = I * R
    resultValue = i * r;
    resultUnitCategory = VOLTAGE_UNITS;
  } else if (
    (v !== null && i === null && r === null) ||
    (i !== null && v === null && r === null) ||
    (r !== null && v === null && i === null)
  ) {
    return null; // Only one value provided, nothing to calculate
  } else if (v !== null && i !== null && r !== null) {
    return "Muitos valores fornecidos, por favor, insira apenas dois."; // More than two values provided
  } else if (v === null && i === null && r === null) {
    return null; // No values provided
  }

  if (error) {
    return error;
  }

  if (resultValue !== null && resultUnitCategory.length > 0) {
    const appropriateUnit = getAppropriateDisplayUnit(resultValue, resultUnitCategory);
    const displayValue = convertFromBaseUnit(resultValue, appropriateUnit);
    return { value: parseFloat(displayValue.toFixed(6)), unit: appropriateUnit }; // Format to 6 decimal places for precision
  }

  return null;
};
