import { UnitType } from './types';

export const UNIT_MULTIPLIERS: Record<UnitType, number> = {
  [UnitType.VOLT]: 1,
  [UnitType.MILLIVOLT]: 1e-3,
  [UnitType.KILOVOLT]: 1e3,
  [UnitType.AMPERE]: 1,
  [UnitType.MILLIAMPERE]: 1e-3,
  [UnitType.KILOAMPERE]: 1e3,
  [UnitType.OHM]: 1,
  [UnitType.MILLIOHM]: 1e-3,
  [UnitType.KILOOHM]: 1e3,
};

export const VOLTAGE_UNITS = [UnitType.VOLT, UnitType.MILLIVOLT, UnitType.KILOVOLT];
export const CURRENT_UNITS = [UnitType.AMPERE, UnitType.MILLIAMPERE, UnitType.KILOAMPERE];
export const RESISTANCE_UNITS = [UnitType.OHM, UnitType.MILLIOHM, UnitType.KILOOHM];

export const ALL_UNITS = [...VOLTAGE_UNITS, ...CURRENT_UNITS, ...RESISTANCE_UNITS];
