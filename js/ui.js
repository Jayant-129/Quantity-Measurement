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
