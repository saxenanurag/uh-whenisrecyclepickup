const fs = require('fs');
const path = require('path');

// Read data.js and script.js
const dataJsContent = fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8');
const scriptJsContent = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// Mock window/document/console
global.window = {};
global.document = {
    getElementById: (id) => {
        // Return a mock element with style and value
        return { 
            value: '', 
            addEventListener: () => {},
            style: { display: '' },
            innerText: ''
        };
    },
    querySelector: () => ({ style: {} })
};

// Mock STREET_DATA
const globalizedDataJs = dataJsContent.replace(/const /g, 'global.');
eval(globalizedDataJs);

// Evaluate script.js
eval(scriptJsContent);

// Test cases
const testCases = [
    { query: "Cedar", expected: true },
    { query: "Cedar Rd", expected: true },
    { query: "cedar rd", expected: true },
    { query: "University", expected: true },
    { query: "University Blvd", expected: true },
    { query: "S. Green", expected: true },
    { query: "Green", expected: true },
    { query: "NonExistent Street", expected: false }
];

console.log("Running search tests on updated script.js...");
let failed = false;
testCases.forEach(tc => {
    let results = [];
    try {
        results = findStreet(tc.query);
    } catch (e) {
        console.error("Error calling findStreet:", e);
        failed = true;
        return;
    }
    
    const found = results && results.length > 0;
    
    if (found !== tc.expected) {
        console.log(`[FAIL] Query: "${tc.query}" -> Found: ${found}, Expected: ${tc.expected}`);
        failed = true;
    } else {
        // console.log(`[PASS] Query: "${tc.query}"`);
    }
});

if (failed) {
    console.log("Tests failed.");
    process.exit(1);
} else {
    console.log("All tests passed.");
}
