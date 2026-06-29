// src/mathEngine.ts

export interface StatResult {
  mean: number;
  variance: number;
  stdDev: number;
}

/**
 * Custom factorial function with validation for negative or non-integer values.
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial of negative or non-integer");
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Permutations: nPr = n! / (n - r)!
 */
export function computeNPr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error("Invalid nPr inputs");
  }
  return factorial(n) / factorial(n - r);
}

/**
 * Combinations: nCr = n! / (r! * (n - r)!)
 */
export function computeNCr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error("Invalid nCr inputs");
  }
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/**
 * Statistics: Mean, Variance, Standard Deviation
 */
export function computeStats(numbers: number[]): StatResult {
  if (numbers.length === 0) {
    throw new Error("Empty statistics array");
  }
  const n = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  // Population variance
  const squareDiffs = numbers.map(x => Math.pow(x - mean, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);

  return {
    mean: cleanFloat(mean),
    variance: cleanFloat(variance),
    stdDev: cleanFloat(stdDev),
  };
}

/**
 * Round results to 10 significant figures and remove floating point noise.
 */
export function cleanFloat(val: number): number {
  if (Math.abs(val) < 1e-14) return 0;
  const precisionStr = val.toPrecision(10);
  return parseFloat(precisionStr);
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'sqrt', 'ln', 'log'
]);

const PRECEDENCE: Record<string, number> = {
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
  '^': 4,
  'u-': 6
};

const ASSOCIATIVITY: Record<string, 'LEFT' | 'RIGHT'> = {
  '+': 'LEFT',
  '-': 'LEFT',
  '*': 'LEFT',
  '/': 'LEFT',
  '^': 'RIGHT',
  'u-': 'RIGHT'
};

/**
 * Splits expression string into semantic tokens.
 */
export function tokenize(expr: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < expr.length) {
    const char = expr[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (e.g. 123.45)
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      result.push(numStr);
      continue;
    }

    // Special constants
    if (char === 'π') {
      result.push('π');
      i++;
      continue;
    }
    if (char === 'e') {
      // If 'e' is followed by letters (part of a function name), parse as word
      if (i + 1 < expr.length && /[a-z]/i.test(expr[i + 1])) {
        let word = '';
        while (i < expr.length && /[a-z]/i.test(expr[i])) {
          word += expr[i];
          i++;
        }
        result.push(word);
      } else {
        result.push('e');
        i++;
      }
      continue;
    }

    // Function names
    if (/[a-z]/i.test(char)) {
      let word = '';
      while (i < expr.length && /[a-z]/i.test(expr[i])) {
        word += expr[i];
        i++;
      }
      result.push(word);
      continue;
    }

    // Operators and parentheses
    if (['+', '-', '*', '/', '^', '!', '(', ')', '²'].includes(char)) {
      result.push(char);
      i++;
      continue;
    }

    // Multiplications and division formatted differently
    if (char === '×') {
      result.push('*');
      i++;
      continue;
    }
    if (char === '÷') {
      result.push('/');
      i++;
      continue;
    }

    // Fallback: ignore or skip unknown chars
    i++;
  }
  return result;
}

/**
 * Preprocesses tokens to insert implicit multiplication, e.g. 2π -> 2 * π or 2(3) -> 2 * (3)
 */
export function preprocessTokens(tokens: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    if (i > 0) {
      const prev = tokens[i - 1];
      const isPrevOperand = !isNaN(Number(prev)) || prev === 'π' || prev === 'e' || prev === ')' || prev === '!' || prev === '²';
      const isCurrentOperandOrFunc = !isNaN(Number(current)) || current === 'π' || current === 'e' || current === '(' || FUNCTIONS.has(current);
      
      const shouldInsertStar = 
        (isPrevOperand && (current === 'π' || current === 'e' || current === '(' || FUNCTIONS.has(current))) ||
        (prev === ')' && !isNaN(Number(current))) ||
        (prev === '!' && !isNaN(Number(current))) ||
        (prev === '²' && !isNaN(Number(current)));

      if (shouldInsertStar) {
        result.push('*');
      }
    }
    result.push(current);
  }
  return result;
}

/**
 * Automatically appends missing closing parentheses for live preview evaluation.
 */
export function autoCloseParentheses(tokens: string[]): string[] {
  const closed = [...tokens];
  let openCount = 0;
  for (const t of tokens) {
    if (t === '(') openCount++;
    if (t === ')') openCount--;
  }
  while (openCount > 0) {
    closed.push(')');
    openCount--;
  }
  return closed;
}

/**
 * Shunting-Yard parser.
 */
export function shuntingYard(tokens: string[]): string[] {
  const output: string[] = [];
  const operators: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!isNaN(Number(token))) {
      output.push(token);
    } else if (token === 'π' || token === 'e') {
      output.push(token);
    } else if (FUNCTIONS.has(token)) {
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      let foundLparen = false;
      while (operators.length > 0) {
        const top = operators[operators.length - 1];
        if (top === '(') {
          operators.pop();
          foundLparen = true;
          break;
        } else {
          output.push(operators.pop()!);
        }
      }
      if (!foundLparen) {
        throw new Error("Mismatched brackets");
      }
      if (operators.length > 0 && FUNCTIONS.has(operators[operators.length - 1])) {
        output.push(operators.pop()!);
      }
    } else if (token === '!' || token === '²') {
      output.push(token);
    } else {
      // Operator
      let op = token;
      if (op === '-' || op === '+') {
        const isUnary = (i === 0 || ['+', '-', '*', '/', '^', '('].includes(tokens[i - 1]) || FUNCTIONS.has(tokens[i - 1]));
        if (isUnary) {
          if (op === '-') {
            op = 'u-';
          } else {
            continue; // Unary plus is a no-op
          }
        }
      }

      const p1 = PRECEDENCE[op];
      const assoc1 = ASSOCIATIVITY[op];

      while (operators.length > 0) {
        const top = operators[operators.length - 1];
        if (top === '(') {
          break;
        }

        if (FUNCTIONS.has(top)) {
          output.push(operators.pop()!);
          continue;
        }

        const p2 = PRECEDENCE[top];
        if (p2 === undefined) {
          break;
        }

        if ((assoc1 === 'LEFT' && p1 <= p2) || (assoc1 === 'RIGHT' && p1 < p2)) {
          output.push(operators.pop()!);
        } else {
          break;
        }
      }
      operators.push(op);
    }
  }

  while (operators.length > 0) {
    const top = operators.pop()!;
    if (top === '(' || top === ')') {
      throw new Error("Mismatched brackets");
    }
    output.push(top);
  }

  return output;
}

/**
 * Evaluates a list of RPN tokens.
 */
export function evaluateRPN(rpn: string[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else if (token === 'π') {
      stack.push(Math.PI);
    } else if (token === 'e') {
      stack.push(Math.E);
    } else if (token === 'u-') {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(-val);
    } else if (token === '!') {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(factorial(val));
    } else if (token === '²') {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      stack.push(val * val);
    } else if (FUNCTIONS.has(token)) {
      if (stack.length < 1) throw new Error("Malformed expression");
      const val = stack.pop()!;
      let res = 0;
      switch (token) {
        case 'sin':
          res = Math.sin(val * Math.PI / 180);
          break;
        case 'cos':
          res = Math.cos(val * Math.PI / 180);
          break;
        case 'tan':
          if (Math.abs(Math.cos(val * Math.PI / 180)) < 1e-14) {
            throw new Error("Division by zero");
          }
          res = Math.tan(val * Math.PI / 180);
          break;
        case 'asin':
          if (val < -1 || val > 1) throw new Error("asin/acos out of range");
          res = Math.asin(val) * 180 / Math.PI;
          break;
        case 'acos':
          if (val < -1 || val > 1) throw new Error("asin/acos out of range");
          res = Math.acos(val) * 180 / Math.PI;
          break;
        case 'atan':
          res = Math.atan(val) * 180 / Math.PI;
          break;
        case 'sinh':
          res = Math.sinh(val);
          break;
        case 'cosh':
          res = Math.cosh(val);
          break;
        case 'tanh':
          res = Math.tanh(val);
          break;
        case 'sqrt':
          if (val < 0) throw new Error("sqrt of negative");
          res = Math.sqrt(val);
          break;
        case 'ln':
          if (val <= 0) throw new Error("Invalid logarithm argument");
          res = Math.log(val);
          break;
        case 'log':
          if (val <= 0) throw new Error("Invalid logarithm argument");
          res = Math.log10(val);
          break;
        default:
          throw new Error("Unknown function");
      }
      stack.push(res);
    } else {
      // Binary operator
      if (stack.length < 2) throw new Error("Malformed expression");
      const b = stack.pop()!;
      const a = stack.pop()!;
      let res = 0;
      switch (token) {
        case '+':
          res = a + b;
          break;
        case '-':
          res = a - b;
          break;
        case '*':
          res = a * b;
          break;
        case '/':
          if (b === 0) throw new Error("Division by zero");
          res = a / b;
          break;
        case '^':
          res = Math.pow(a, b);
          if (isNaN(res)) throw new Error("Invalid power operation");
          break;
        default:
          throw new Error("Unknown operator");
      }
      stack.push(res);
    }
  }

  if (stack.length !== 1) {
    throw new Error("Malformed expression");
  }

  return cleanFloat(stack[0]);
}

/**
 * Top-level function that parses and evaluates a math expression string.
 * @param exprStr The raw string expression to evaluate
 * @param liveMode If true, attempts to balance unclosed parentheses before evaluating
 */
export function evaluateExpression(exprStr: string, liveMode = false): string {
  try {
    let tokens = tokenize(exprStr);
    if (tokens.length === 0) return '';

    // Check bracket balance
    let openCount = 0;
    for (const t of tokens) {
      if (t === '(') openCount++;
      if (t === ')') openCount--;
      if (openCount < 0) return 'Error';
    }

    // Validate consecutive operators
    for (let j = 0; j < tokens.length - 1; j++) {
      const curr = tokens[j];
      const next = tokens[j + 1];
      const isCurrOp = ['+', '-', '*', '/', '^'].includes(curr);
      const isNextOp = ['+', '-', '*', '/', '^'].includes(next);
      if (isCurrOp && isNextOp) {
        if (next !== '-') {
          return 'Error';
        }
        if (curr === '-' && next === '-') {
          return 'Error';
        }
      }
    }

    if (liveMode) {
      tokens = autoCloseParentheses(tokens);
    } else {
      if (openCount !== 0) return 'Error';
    }

    const preprocessed = preprocessTokens(tokens);
    const rpn = shuntingYard(preprocessed);
    const result = evaluateRPN(rpn);

    if (isNaN(result) || !isFinite(result)) {
      return 'Error';
    }
    return result.toString();
  } catch (error) {
    return 'Error';
  }
}

/**
 * Prettifies the list of token keys into a user-friendly expression string.
 */
export function formatExpression(exprArray: string[]): string {
  return exprArray.map((token, i) => {
    switch (token) {
      case '*': return ' × ';
      case '/': return ' ÷ ';
      case '^': return ' ^ ';
      case 'asin(': return 'sin⁻¹(';
      case 'acos(': return 'cos⁻¹(';
      case 'atan(': return 'tan⁻¹(';
      case 'sqrt(': return '√(';
      case 'π': return 'π';
      case 'e': return 'e';
      case '+': return ' + ';
      case '-':
        const prev = exprArray[i - 1];
        const isUnary = i === 0 || ['+', '-', '*', '/', '^', '('].includes(prev) || (prev && prev.endsWith('('));
        return isUnary ? '-' : ' - ';
      default: return token;
    }
  }).join('').trim();
}

