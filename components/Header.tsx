import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold text-white mb-2">
        Calculadora da Lei de Ohm
      </h1>
      <p className="text-lg text-gray-300">
        Insira quaisquer dois valores para calcular o terceiro.
      </p>
    </header>
  );
};

export default Header;
