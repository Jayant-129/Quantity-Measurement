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

async function getConversion(from, to) {
    if (from === to) return [{ factor: 1, formula: null }];
    const res = await fetch(`${API_BASE}/conversions`);
    if (!res.ok) throw new Error('Network error');
    const all = await res.json();
    const graph = {};
    for (const c of all) {
        if (!graph[c.from]) graph[c.from] = [];
        graph[c.from].push(c);
    }
    const queue = [[from, []]];
    const visited = new Set([from]);
    while (queue.length) {
        const [curr, path] = queue.shift();
        if (curr === to) return path;
        for (const edge of (graph[curr] || [])) {
            if (!visited.has(edge.to)) { visited.add(edge.to); queue.push([edge.to, [...path, edge]]); }
        }
    }
    throw new Error('Conversion not found');
}

async function saveHistory(record) {
    const res = await fetch(`${API_BASE}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to save history');
    return res.json();
}

async function getHistory() {
    const res = await fetch(`${API_BASE}/history?_sort=-timestamp`);
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
}

export { getUnits, getConversion, saveHistory, getHistory };
