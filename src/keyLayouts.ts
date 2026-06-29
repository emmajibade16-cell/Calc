// src/keyLayouts.ts

export interface KeyConfig {
  value: string;
  label: string;
  type: 'number' | 'operator' | 'action' | 'sci';
}

export const BASIC_KEYS: KeyConfig[][] = [
  [
    { value: 'AC', label: 'AC', type: 'action' },
    { value: 'DEL', label: 'DEL', type: 'action' },
    { value: '(', label: '(', type: 'operator' },
    { value: ')', label: ')', type: 'operator' }
  ],
  [
    { value: '7', label: '7', type: 'number' },
    { value: '8', label: '8', type: 'number' },
    { value: '9', label: '9', type: 'number' },
    { value: '/', label: '÷', type: 'operator' }
  ],
  [
    { value: '4', label: '4', type: 'number' },
    { value: '5', label: '5', type: 'number' },
    { value: '6', label: '6', type: 'number' },
    { value: '*', label: '×', type: 'operator' }
  ],
  [
    { value: '1', label: '1', type: 'number' },
    { value: '2', label: '2', type: 'number' },
    { value: '3', label: '3', type: 'number' },
    { value: '-', label: '-', type: 'operator' }
  ],
  [
    { value: '0', label: '0', type: 'number' },
    { value: '.', label: '.', type: 'number' },
    { value: '=', label: '=', type: 'action' },
    { value: '+', label: '+', type: 'operator' }
  ]
];

export const SCI_KEYS: KeyConfig[][] = [
  [
    { value: 'sin(', label: 'sin', type: 'sci' },
    { value: 'cos(', label: 'cos', type: 'sci' },
    { value: 'tan(', label: 'tan', type: 'sci' },
    { value: '^', label: 'x^y', type: 'sci' }
  ],
  [
    { value: 'asin(', label: 'sin⁻¹', type: 'sci' },
    { value: 'acos(', label: 'cos⁻¹', type: 'sci' },
    { value: 'atan(', label: 'tan⁻¹', type: 'sci' },
    { value: '²', label: 'x²', type: 'sci' }
  ],
  [
    { value: 'sinh(', label: 'sinh', type: 'sci' },
    { value: 'cosh(', label: 'cosh', type: 'sci' },
    { value: 'tanh(', label: 'tanh', type: 'sci' },
    { value: 'sqrt(', label: '√', type: 'sci' }
  ],
  [
    { value: 'ln(', label: 'ln', type: 'sci' },
    { value: 'log(', label: 'log', type: 'sci' },
    { value: 'π', label: 'π', type: 'sci' },
    { value: 'e', label: 'e', type: 'sci' }
  ],
  [
    { value: 'nPr', label: 'nPr', type: 'sci' },
    { value: 'nCr', label: 'nCr', type: 'sci' },
    { value: 'STAT', label: 'STAT', type: 'sci' },
    { value: '!', label: 'x!', type: 'sci' }
  ]
];
