import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  let baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  switch (variant) {
    case 'primary':
      baseStyles += ' bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
    case 'secondary':
      baseStyles += ' bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      break;
    case 'danger':
      baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
