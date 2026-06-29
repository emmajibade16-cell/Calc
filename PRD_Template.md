# PRD — Mobile Scientific Calculator
## SEN 104 & SEN 214 Assignment (React Native + Expo)

---

## 1. Project Overview
Build a cross-platform mobile Scientific Calculator using React Native (Expo) 
and TypeScript. The app supports Basic and Scientific modes. All math logic 
must use JavaScript's native Math object only — no external math libraries.

### IMPORTANT: Unique Design Requirement
Before writing any UI code, the agent must randomly select one option from 
each category in Section 5 and commit to it for the entire codebase. 
The selection must be printed at the top of the first response and never 
changed mid-build.

---

## 2. Tech Stack & Constraints
- Framework: React Native via Expo (latest stable SDK)
- Language: TypeScript (strict mode)
- Styling: React Native StyleSheet only
- Navigation: Single screen app — no expo-router, no react-navigation
- Fonts: One @expo-google-fonts package matching the chosen typography style
- Must run on: Expo Go (dev), Android APK (final submission)

---

## 3. Project Structure
Agent must create files in this exact structure:

calculator-app/
├── App.tsx
├── src/
│   ├── mathEngine.ts
│   ├── theme.ts
│   ├── keyLayouts.ts
│   └── components/
│       ├── Display.tsx
│       ├── Keypad.tsx
│       ├── CalcButton.tsx
│       └── InputModal.tsx

No placeholder comments. Every file must be fully implemented.

---

## 4. Math Engine (src/mathEngine.ts)
Pure TypeScript, no imports except JS built-ins.

### Pipeline
1. Tokenizer — splits input into numbers, operators, 
   functions, constants, brackets, factorials.
   Must handle unary minus vs binary minus.
2. Shunting-Yard — converts tokens to RPN respecting 
   precedence. Power operator (^) is right-associative.
3. RPN Evaluator — processes RPN stack and returns number.

### Operations Required
Basic: +  -  *  /  ^  !  ( )
Trig (in degrees): sin cos tan asin acos atan sinh cosh tanh
Power/Log: sqrt  ln  log  x²
Constants: π  e
Combinatorics (via modal): nPr  nCr
Statistics (via modal): mean  variance  standard deviation

### Error Handling
Return "Error" string (not throw) for:
- Division by zero
- sqrt of negative
- asin/acos out of range
- Factorial of negative or non-integer
- Malformed expression
- Mismatched brackets

### Float cleanup
Round results to 10 significant figures to eliminate 
floating point noise (e.g. 0.1+0.2 = 0.3 not 0.30000000000000004)

---

## 5. Randomization Rules
Agent must pick ONE from each category before writing code.

### 5.1 Color Scheme
A) Cyberpunk Neon: bg #0A0A0F, neon magenta #FF0055, 
   cyan #00F0FF, yellow accents
B) Retro Terminal: bg #1C1E24, amber operators #FF9500, 
   green display text #39FF14
C) Nordic Pastel: light ash bg #ECEFF1, sage green + 
   lavender keys, white text
D) Premium Dark: bg #121212, elevated keys #2C2C2C, 
   gold accents #D4AF37
E) Forest & Earth: olive bg #2D3A2E, cream operators, 
   dark charcoal base

### 5.2 Key Shape
A) Perfect Circles — floating circular keys with gaps
B) Rounded Squircles — borderRadius 12–18
C) Pill/Capsule — wide elongated horizontal keys
D) Wireframe — transparent bg, colored border, glow on press

### 5.3 Layout
A) Classic — operators column on the right
B) Left-hand — operators column on the left
C) Top-heavy — scientific keys above basic keys
D) Split Grid — numbers center, brackets left, operators right

### 5.4 Typography
A) LED/Digital — Orbitron or Share Tech Mono
B) Modern Sans — Poppins or Inter
C) Monospace — JetBrains Mono or Fira Code

---

## 6. Display (src/components/Display.tsx)
Two text regions stacked vertically:

Top line — Expression:
- Shows equation being typed
- Prettify: * → ×, / → ÷, asin → sin⁻¹, sqrt → √, pi → π
- Horizontally scrollable for long expressions

Bottom line — Result:
- Large prominent font
- Shows live preview while typing (muted color)
- Shows final result after = (full color)
- Horizontally scrollable or auto-shrink for large numbers

---

## 7. Keypad (src/components/Keypad.tsx + CalcButton.tsx)
- Toggle between Basic and Scientific mode via 
  segmented control at top
- Basic mode: digits 0–9, . , AC, DEL, =, +, -, ×, ÷, ( )
- Scientific mode: all basic keys + sin cos tan inverses 
  hyperbolic sqrt ln log x² ^ π e nPr nCr STAT
- CalcButton must have pressed state visual feedback

---

## 8. Modals (src/components/InputModal.tsx)
Triggered by: nPr, nCr, STAT buttons

nPr modal: two inputs (n, r) → compute n!/(n-r)!
nCr modal: two inputs (n, r) → compute n!/(r!(n-r)!)
STAT modal: one comma-separated input → compute 
  mean, variance, standard deviation, display all three

---

## 9. Behavior Scenarios
1. App opens → display shows 0
2. User types expression → live preview updates
3. User presses = → result shown large, expression above
4. After =, pressing operator → continues from result
5. After =, pressing digit → clears and starts fresh
6. DEL → deletes last token (entire function name at once 
   e.g. "sin(" deleted as one unit not char by char)
7. Error → shows "Error", any key press recovers
8. AC → full reset to 0

---

## 10. APK Build Instructions
After completing the app, provide exact commands to:
1. Run on Expo Go (development)
2. Build a release Android APK using EAS Build:
   - npx eas build -p android --profile preview
   - Include eas.json preview profile configuration