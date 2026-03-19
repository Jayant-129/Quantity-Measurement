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
