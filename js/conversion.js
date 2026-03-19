/**
 * conversion.js
 * @author - developer
 * @version - 1.0
 */

function applyConversion(value, steps) {
    if (!steps) return value;
    const list = Array.isArray(steps) ? steps : [steps];
    let val = value;
    for (const step of list) {
        if (!step) continue;
        if (step.factor !== null && step.factor !== undefined) {
            val = val * step.factor;
        } else if (step.formula) {
            val = Function('"use strict"; const x = ' + val + '; return (' + step.formula + ')')();
        }
    }
    return parseFloat(val.toPrecision(10));
}

function compareValues(val1, unit1, val2, unit2, base1, base2) {
    if (Math.abs(base1 - base2) < 1e-9) return `${val1} ${unit1} is EQUAL to ${val2} ${unit2}`;
    if (base1 > base2) return `${val1} ${unit1} is GREATER than ${val2} ${unit2}`;
    return `${val1} ${unit1} is LESS than ${val2} ${unit2}`;
}

function performArithmetic(val1, val2, operator) {
    switch (operator) {
        case '+': return parseFloat((val1 + val2).toPrecision(10));
        case '-': return parseFloat((val1 - val2).toPrecision(10));
        case '*': return parseFloat((val1 * val2).toPrecision(10));
        case '/': return val2 !== 0 ? parseFloat((val1 / val2).toPrecision(10)) : 'Error: Division by zero';
        default: return NaN;
    }
}
