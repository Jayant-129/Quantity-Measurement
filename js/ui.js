/**
 * ui.js
 * @author - developer
 * @version - 1.0
 */

function populateDropdown(selectEl, units) {
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="" disabled selected>-- Select Unit --</option>';
    units.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.symbol;
        opt.textContent = `${u.label} (${u.symbol})`;
        selectEl.appendChild(opt);
    });
}

function setActive(parentEl, clickedEl, selector) {
    if (!parentEl) return;
    parentEl.querySelectorAll(selector).forEach(el => el.classList.remove('active'));
    clickedEl.classList.add('active');
}

function showResult(value, unit) {
    const valEl = document.getElementById('result-value');
    const unitEl = document.getElementById('result-unit');
    if (!valEl) return;
    valEl.textContent = (value !== null && value !== undefined && value !== '') ? value : '—';
    if (unitEl) unitEl.textContent = unit || '';
    valEl.classList.remove('animate');
    void valEl.offsetWidth;
    valEl.classList.add('animate');
}

function toggleOperators(show) {
    const wrapper = document.getElementById('operator-wrapper');
    const spacer  = document.getElementById('op-spacer');
    if (wrapper) wrapper.style.display = show ? 'flex' : 'none';
    if (spacer)  spacer.style.display  = show ? 'none' : 'block';
}
