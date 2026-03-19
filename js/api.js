/**
 * api.js
 * @author - developer
 * @version - 1.0
 */
const API_BASE = 'http://localhost:3000';

async function getUnits(type) {
    const res = await fetch(`${API_BASE}/units?type=${type.toLowerCase()}`);
    if (!res.ok) throw new Error('Network error');
    return res.json();
}
