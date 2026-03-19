/**
 * app.js - Entry point for QuantityMeasurement. Manages state and event listeners.
 * @author - developer
 * @version - 1.0
 */

document.addEventListener('DOMContentLoaded', async () => {

    const state = {
        type: 'Length',
        action: 'Conversion',
        fromUnit: '',
        toUnit: '',
        operator: '+'
    };

    const typeSelector  = document.getElementById('type-selector');
    const actionSelector = document.getElementById('action-selector');
    const fromSelect    = document.getElementById('from-select');
    const toSelect      = document.getElementById('to-select');
    const fromInput     = document.getElementById('from-input');
    const toInput       = document.getElementById('to-input');
    const historyPanel  = document.getElementById('history-panel');
    const historyToggle = document.getElementById('history-toggle');
    const opDisplayBtn  = document.getElementById('op-display-btn');
    const fromLabel     = document.getElementById('from-label');
    const toLabel       = document.getElementById('to-label');
    const resultCard    = document.getElementById('result-card');

    async function loadUnits(type) {
        try {
            const units = await getUnits(type);
            populateDropdown(fromSelect, units);
            populateDropdown(toSelect, units);
        } catch {
            showResult('Server unavailable', '');
        }
    }

    async function loadHistory() {
        try {
            const records = await getHistory();
            renderHistory(records);
        } catch {
            renderHistory([]);
        }
    }

    function showInToInput(value) {
        if (toInput) {
            toInput.value = value;
            toInput.style.color = '#3b5bdb';
            toInput.style.fontWeight = '800';
        }
    }

    function clearToInput() {
        if (toInput) {
            toInput.value = '';
            toInput.style.color = '#111';
        }
    }

    async function calculate() {
        const fVal = parseFloat(fromInput.value);
        const tVal = parseFloat(toInput.value);
        const fUnit = state.fromUnit;
        const tUnit = state.toUnit;

        if (isNaN(fVal) || !fUnit) return;

        try {
            if (state.action === 'Conversion') {
                if (!tUnit) return;
                const steps = await getConversion(fUnit, tUnit);
                const result = applyConversion(fVal, steps);
                showInToInput(result);
                const record = {
                    type: state.type,
                    action: 'Conversion',
                    expression: `${fVal} ${fUnit} → ${tUnit}`,
                    result: `${result} ${tUnit}`,
                    timestamp: new Date().toISOString()
                };
                try { await saveHistory(record); await loadHistory(); } catch(e) { console.warn('History save failed:', e); }

            } else if (state.action === 'Comparison') {
                if (isNaN(tVal) || !tUnit) return;
                let base1 = fVal, base2 = tVal;
                if (fUnit !== tUnit) {
                    try {
                        base1 = applyConversion(fVal, await getConversion(fUnit, tUnit));
                        base2 = tVal;
                    } catch {
                        base2 = applyConversion(tVal, await getConversion(tUnit, fUnit));
                        base1 = fVal;
                    }
                }
                const sentence = compareValues(fVal, fUnit, tVal, tUnit, base1, base2);
                showResult(sentence, '');
                const record = {
                    type: state.type,
                    action: 'Comparison',
                    expression: `${fVal} ${fUnit} vs ${tVal} ${tUnit}`,
                    result: sentence,
                    timestamp: new Date().toISOString()
                };
                try { await saveHistory(record); await loadHistory(); } catch(e) { console.warn('History save failed:', e); }

            } else {
                if (isNaN(tVal) || !tUnit) return;
                let v2 = tVal;
                if (fUnit !== tUnit) {
                    try { v2 = applyConversion(tVal, await getConversion(tUnit, fUnit)); } catch {}
                }
                const op = opDisplayBtn ? opDisplayBtn.dataset.op : state.operator;
                state.operator = op;
                const result = performArithmetic(fVal, v2, op);
                showResult(result, fUnit);
                const record = {
                    type: state.type,
                    action: 'Arithmetic',
                    expression: `${fVal} ${fUnit} ${op} ${tVal} ${tUnit}`,
                    result: `${result} ${fUnit}`,
                    timestamp: new Date().toISOString()
                };
                try { await saveHistory(record); await loadHistory(); } catch(e) { console.warn('History save failed:', e); }
            }
        } catch (e) {
            showResult('Error: ' + e.message, '');
        }
    }

    function setActionLabels(action) {
        const isArithmetic = action === 'Arithmetic';
        const isConversion = action === 'Conversion';
        if (fromLabel) fromLabel.textContent = isArithmetic ? 'VALUE 1' : 'FROM';
        if (toLabel)   toLabel.textContent   = isArithmetic ? 'VALUE 2' : 'TO';
        if (toInput) {
            toInput.readOnly = isConversion;
            toInput.placeholder = isConversion ? 'Result' : '0';
        }
        if (resultCard) resultCard.style.display = isConversion ? 'none' : 'block';
    }

    function attachEventListeners() {
        if (typeSelector) {
            typeSelector.querySelectorAll('.type-card').forEach(card => {
                card.addEventListener('click', async () => {
                    state.type = card.dataset.type;
                    setActive(typeSelector, card, '.type-card');
                    fromInput.value = '';
                    clearToInput();
                    state.fromUnit = '';
                    state.toUnit = '';
                    showResult('', '');
                    await loadUnits(state.type);
                });
            });
        }

        if (actionSelector) {
            actionSelector.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.action = btn.dataset.action;
                    setActive(actionSelector, btn, '.action-btn');
                    toggleOperators(state.action === 'Arithmetic');
                    setActionLabels(state.action);
                    fromInput.value = '';
                    clearToInput();
                    showResult('', '');
                });
            });
        }

        if (fromSelect) fromSelect.addEventListener('change', () => { state.fromUnit = fromSelect.value; calculate(); });
        if (toSelect)   toSelect.addEventListener('change',   () => { state.toUnit   = toSelect.value;   calculate(); });
        if (fromInput)  fromInput.addEventListener('input', () => calculate());
        if (toInput)    toInput.addEventListener('input', () => {
            if (state.action !== 'Conversion') calculate();
        });

        if (historyToggle && historyPanel) {
            historyToggle.addEventListener('click', () => historyPanel.classList.toggle('open'));
        }

        if (opDisplayBtn) {
            opDisplayBtn.addEventListener('click', () => setTimeout(() => calculate(), 60));
        }
        document.querySelectorAll('.op-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                state.operator = btn.dataset.op;
                setTimeout(() => calculate(), 60);
            });
        });
    }

    const firstCard = typeSelector ? typeSelector.querySelector('.type-card') : null;
    if (firstCard) setActive(typeSelector, firstCard, '.type-card');

    const firstBtn = actionSelector ? actionSelector.querySelector('.action-btn') : null;
    if (firstBtn) setActive(actionSelector, firstBtn, '.action-btn');

    toggleOperators(false);
    setActionLabels('Conversion');
    attachEventListeners();

    await loadUnits('Length');
    await loadHistory();

});
