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

function renderHistory(records) {
    const list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = '';
    if (!records || !records.length) { list.innerHTML = '<li class="no-history">No history yet.</li>'; return; }
    records.forEach(r => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `<span class="history-expr">${r.expression} = ${r.result}</span><span class="history-time">${new Date(r.timestamp).toLocaleString()}</span>`;
        list.appendChild(li);
    });
}

export { populateDropdown, setActive, showResult, toggleOperators, renderHistory };
