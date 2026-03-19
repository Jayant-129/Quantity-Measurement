# QuantityMeasurement

A Vanilla JavaScript unit converter application supporting Length, Weight, Temperature, and Volume measurements.

## Use Cases

| UC ID | Name | Description |
|-------|------|-------------|
| UC-JS-01 | Create JSON Server Database | Sets up db.json with units, conversions, and history collections |
| UC-JS-02 | App Initialisation | Wires event listeners and loads default data on DOMContentLoaded |
| UC-JS-03 | Fetch Units by Type | GET /units?type=X from json-server |
| UC-JS-04 | Fetch Conversion Record | GET /conversions?from=X&to=Y |
| UC-JS-05 | Save to History | POST /history after every calculation |
| UC-JS-06 | Load History | GET /history sorted newest-first |
| UC-JS-07 | Apply Conversion | Multiply by factor or evaluate formula string |
| UC-JS-08 | Compare Two Values | Normalise both to base unit then compare |
| UC-JS-09 | Arithmetic Operation | Apply +/−/×/÷ after normalising TO value to FROM unit |
| UC-JS-10 | Populate Unit Dropdown | Fill a select with unit options after getUnits() |
| UC-JS-11 | Set Active Button | Highlight selected type card / action tab / operator button |
| UC-JS-12 | Show Result | Write calculated value and unit to the RESULT panel |
| UC-JS-13 | Toggle Operator Row | Show or hide the +/−/×/÷ buttons based on action mode |
| UC-JS-14 | Render History List | Clear and rebuild the history panel from an array of records |
| UC-JS-15 | Handle Type Card Click | Update state, reload units, reset result |
| UC-JS-16 | Handle Action Tab Click | Switch mode, toggle operator row, reset result |
| UC-JS-17 | Execute Calculation | Run conversion, comparison or arithmetic and display result |

## Setup

```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

Then open `index.html` in a browser.
