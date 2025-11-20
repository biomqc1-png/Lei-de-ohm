export enum UnitType {
  VOLT = 'V',
  MILLIVOLT = 'mV',
  KILOVOLT = 'kV',
  AMPERE = 'A',
  MILLIAMPERE = 'mA',
  KILOAMPERE = 'kA',
  OHM = 'Ω',
  MILLIOHM = 'mΩ',
  KILOOHM = 'kΩ',
}

export type ValueType = 'voltage' | 'current' | 'resistance';

export interface CalculationResult {
  value: number;
  unit: UnitType;
}
