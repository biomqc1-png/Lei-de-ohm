import React, { useState, useEffect, useCallback } from 'react';
import CalculatorInput from './components/CalculatorInput';
import Button from './components/Button';
import Header from './components/Header';
import { UnitType, ValueType, CalculationResult } from './types';
import { VOLTAGE_UNITS, CURRENT_UNITS, RESISTANCE_UNITS } from './constants';
import { convertToBaseUnit, calculateOhm } from './services/ohmService';

const App: React.FC = () => {
  const [voltageValue, setVoltageValue] = useState<string>('');
  const [voltageUnit, setVoltageUnit] = useState<UnitType>(UnitType.VOLT);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [currentUnit, setCurrentUnit] = useState<UnitType>(UnitType.AMPERE);
  const [resistanceValue, setResistanceValue] = useState<string>('');
  const [resistanceUnit, setResistanceUnit] = useState<UnitType>(UnitType.OHM);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calculatedField, setCalculatedField] = useState<ValueType | null>(null);

  const performCalculation = useCallback(() => {
    setError(null);
    setResult(null);
    setCalculatedField(null);

    const inputs: { type: ValueType; value: string; unit: UnitType }[] = [
      { type: 'voltage', value: voltageValue, unit: voltageUnit },
      { type: 'current', value: currentValue, unit: currentUnit },
      { type: 'resistance', value: resistanceValue, unit: resistanceUnit },
    ];

    const filledInputs = inputs.filter(input => input.value !== '');
    const validNumericInputs = filledInputs.filter(input => !isNaN(parseFloat(input.value)));

    if (validNumericInputs.length < 2) {
      return; // Need at least two valid inputs
    }

    if (validNumericInputs.length > 2) {
      setError("Muitos valores fornecidos. Por favor, insira apenas dois.");
      return;
    }

    const vBase = validNumericInputs.find(i => i.type === 'voltage')
      ? convertToBaseUnit(parseFloat(validNumericInputs.find(i => i.type === 'voltage')!.value), validNumericInputs.find(i => i.type === 'voltage')!.unit)
      : undefined;
    const iBase = validNumericInputs.find(i => i.type === 'current')
      ? convertToBaseUnit(parseFloat(validNumericInputs.find(i => i.type === 'current')!.value), validNumericInputs.find(i => i.type === 'current')!.unit)
      : undefined;
    const rBase = validNumericInputs.find(i => i.type === 'resistance')
      ? convertToBaseUnit(parseFloat(validNumericInputs.find(i => i.type === 'resistance')!.value), validNumericInputs.find(i => i.type === 'resistance')!.unit)
      : undefined;

    const calculationResult = calculateOhm(vBase, iBase, rBase);

    if (typeof calculationResult === 'string') {
      setError(calculationResult);
    } else if (calculationResult) {
      setResult(calculationResult);
      // Determine which field was calculated
      if (vBase === undefined) setCalculatedField('voltage');
      else if (iBase === undefined) setCalculatedField('current');
      else if (rBase === undefined) setCalculatedField('resistance');
    } else {
      // Should not happen if validNumericInputs.length is 2 and calculateOhm returns non-null error or result
      setError("Não foi possível calcular o valor. Verifique as entradas.");
    }
  }, [voltageValue, voltageUnit, currentValue, currentUnit, resistanceValue, resistanceUnit]);

  useEffect(() => {
    // Perform calculation whenever any input value or unit changes
    const timeoutId = setTimeout(() => {
      performCalculation();
    }, 300); // Debounce to prevent excessive calculations

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voltageValue, voltageUnit, currentValue, currentUnit, resistanceValue, resistanceUnit]);


  const handleReset = () => {
    setVoltageValue('');
    setVoltageUnit(UnitType.VOLT);
    setCurrentValue('');
    setCurrentUnit(UnitType.AMPERE);
    setResistanceValue('');
    setResistanceUnit(UnitType.OHM);
    setResult(null);
    setError(null);
    setCalculatedField(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <Header />

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <CalculatorInput
          label="Tensão (V)"
          value={calculatedField === 'voltage' && result ? result.value.toString() : voltageValue}
          onValueChange={setVoltageValue}
          unit={calculatedField === 'voltage' && result ? result.unit : voltageUnit}
          onUnitChange={setVoltageUnit}
          units={VOLTAGE_UNITS}
          placeholder="Ex: 12"
          disabled={calculatedField === 'voltage'}
        />
        <CalculatorInput
          label="Corrente (I)"
          value={calculatedField === 'current' && result ? result.value.toString() : currentValue}
          onValueChange={setCurrentValue}
          unit={calculatedField === 'current' && result ? result.unit : currentUnit}
          onUnitChange={setCurrentUnit}
          units={CURRENT_UNITS}
          placeholder="Ex: 1.5"
          disabled={calculatedField === 'current'}
        />
        <CalculatorInput
          label="Resistência (R)"
          value={calculatedField === 'resistance' && result ? result.value.toString() : resistanceValue}
          onValueChange={setResistanceValue}
          unit={calculatedField === 'resistance' && result ? result.unit : resistanceUnit}
          onUnitChange={setResistanceUnit}
          units={RESISTANCE_UNITS}
          placeholder="Ex: 8"
          disabled={calculatedField === 'resistance'}
        />

        {result && !error && (
          <div className="bg-green-600 text-white p-4 rounded-lg text-center font-bold text-xl mt-6">
            Resultado: {result.value} {result.unit}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button variant="secondary" onClick={handleReset} className="w-full">
            Limpar
          </Button>
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-xl">
        Programação Professor Marcio Costa
      </p>
    </div>
  );
};

export default App;