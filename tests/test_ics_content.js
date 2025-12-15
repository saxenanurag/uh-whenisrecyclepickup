const fs = require('fs');
const vm = require('vm');

const scriptCode = fs.readFileSync('./script.js', 'utf8');
const dataCode = fs.readFileSync('./data.js', 'utf8');

const sandbox = {
    window: { URL: { createObjectURL: () => 'blob:mock' } },
    document: {
        body: { appendChild: () => { }, removeChild: () => { } },
        createElement: () => ({ setAttribute: () => { }, click: () => { } }),
        getElementById: () => ({ style: {}, value: '', addEventListener: () => { } }),
        querySelector: () => ({ style: {} })
    },
    Blob: class MockBlob { constructor(c) { this.content = c; } },
    console: console
};

vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox);
vm.runInContext(scriptCode, sandbox);

function testICSContent() {
    console.log("Testing ICS Content Generation...");
    // Mock getAllPickupDates to return a known delayed date for testing description
    const mockDates = [
        { date: new Date("2026-05-26T12:00:00"), isDelayed: true },
        { date: new Date("2026-06-08T12:00:00"), isDelayed: false }
    ];

    const ics = sandbox.generateICS(mockDates, "Bushnell", "Warrensville to Wrenford", "A", "Tuesday");

    // Checks
    if (ics.includes("SUMMARY:Recycling Pickup: Bushnell Route A")) {
        console.log("PASS: Summary format correct.");
    } else {
        console.error("FAIL: Summary format incorrect.");
    }

    if (ics.includes("Bushnell (Warrensville to Wrenford)\\nRoute A • Regular Schedule: Tuesday")) {
        console.log("PASS: Description header correct.");
    } else {
        console.error("FAIL: Description header incorrect.");
    }

    if (ics.includes("Delayed schedule")) {
        console.log("PASS: 'Delayed schedule' text found.");
    } else {
        console.error("FAIL: 'Delayed schedule' text missing.");
    }

    if (ics.includes("Recycling Routes PDF: https://www.universityheights.com")) {
        console.log("PASS: PDF links found.");
    } else {
        console.error("FAIL: PDF links missing.");
    }

    console.log("Test complete.");
}

testICSContent();
