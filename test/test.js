import * as funcs from "./../src/funcs.js";

const { deepEquals } = funcs;

const testFunction = (title, fn, cases) => {
    let passingCount = 0;
    for(let { inputs, expected, options } of cases) {
        let actual = fn(...inputs);
        let passed = fn === deepEquals
            ? actual === expected
            : deepEquals(actual, expected, options);
        if(passed) {
            passingCount++;
        }
        else {
            console.error("Test case failed");
            console.error("Inputs:", inputs);
            console.error("Expected:", expected);
            console.error("Actual:", actual);
        }
    }
    if(passingCount === cases.length) {
        console.log(`All ${cases.length} test cases passed for ${title}`);
    }
    else {
        console.error(`${passingCount}/${cases.length} test cases passed for ${title}, failed ${cases.length - passingCount} test cases`);
    }
    console.log("-".repeat(30));
};

testFunction("deepEquals", deepEquals, [
    // booleans
    { inputs: [ true, false ], expected: false },
    { inputs: [ true, true ], expected: true },
    { inputs: [ true, 1 ], expected: false },
    // numbers
    { inputs: [ 1, 1.0 ], expected: true },
    { inputs: [ 1, 1.01 ], expected: false },
    { inputs: [ 1, 1n ], expected: true },
    { inputs: [ 1.0, 1n ], expected: true },
    { inputs: [ 1.0, 1n, { discardBig: false } ], expected: false },
    { inputs: [ NaN, NaN ], expected: false },
    // strings
    { inputs: [ "", "" ], expected: true },
    { inputs: [ "", [] ], expected: false },
    { inputs: [ "hello", "hello" ], expected: true },
    { inputs: [ "hello", "Hello" ], expected: false },
    { inputs: [ "hello", "helloworld" ], expected: false },
    // null
    { inputs: [ null, null ], expected: true },
    { inputs: [ null, false ], expected: false },
    // arrays
    { inputs: [ [ 1, 2, 3 ], [ 1, 2, 3 ] ], expected: true },
    { inputs: [ [ 1, 2, 3 ], [ 1, 3, 2 ] ], expected: false },
    { inputs: [ [ 1, 2, 3 ], [ 1, 2 ] ], expected: false },
    { inputs: [ [ 1, 2 ], [ 1, 2, 3 ] ], expected: false },
    { inputs: [ [], [] ], expected: true }, 
    { inputs: [ [], [ 1 ] ], expected: false }, 
    { inputs: [ [], 0 ], expected: false }, 
    // objects
    { inputs: [ { x: 15, y: 13 }, { y: 13, x: 15 } ], expected: true },
    { inputs: [ { x: 15, y: 13 }, { y: 15, x: 13 } ], expected: false },
    { inputs: [ [ 12, 3 ], [ 1, 2, 3 ] ], expected: false },
    { inputs: [ [ 1, 2, [ 3 ] ], [ 1, 2, [ 3 ] ] ], expected: true },
    { inputs: [ [ 1, 2, [ 3 ] ], [ 1, 2, [ 3, 5 ] ] ], expected: false },
    { inputs: [ [ { x: [ 1, 2, [ 3 ] ], y: "asdf" } ], [ { x: [ 1, 2, [ 3 ] ], y: "asdf" } ] ], expected: true },
    // TODO: objects with custom equals
]);

testFunction("findLinearStats", funcs.findLinearStats, [
    {
        inputs: [ [ 4n, 13n, -15n, 100n ], { min: true, sum: true } ],
        expected: { min: -15n, sum: 102n },
    },
    {
        inputs: [ [ 4n, 13n, -15n, 100n ], { max: true, sum: true } ],
        expected: { max: 100n, sum: 102n },
    },
    {
        inputs: [ [ 4n, 13n, -15n, 100n ], { } ],
        expected: { },
    },
    {
        inputs: [ [ 4n, 13n, -15n, 100n ], { max: false, min: true } ],
        expected: { min: -15n },
    },
    {
        inputs: [ [ 4n, 13n, -15n, 100n ], { min: true, max: true, sum: true, prod: true } ],
        expected: { min: -15n, max: 100n, sum: 102n, prod: -78000n },
    },
    {
        inputs: [ [], { min: true, max: true, sum: true, prod: true } ],
        expected: { min: Infinity, max: -Infinity, sum: 0n, prod: 1n },
    },
    {
        inputs: [ [], { min: true, max: true, sum: true, prod: true }, false ],
        expected: { min: Infinity, max: -Infinity, sum: 0, prod: 1 },
    },
    {
        inputs: [ [ 5, 3, 1 ], { min: true, max: true, sum: true, prod: true }, false ],
        expected: { min: 1, max: 5, sum: 9, prod: 15 },
    },
    {
        inputs: [ [ -1n, 1, 3n, 5n, 7 ], { min: true, max: true }, false ],
        expected: { min: -1n, max: 7 },
        options: { discardBig: false },
    },
]);

testFunction("factorial", funcs.factorial, [
    { inputs: [ 0n ], expected: 1n, options: { discardBig: false } },
    { inputs: [ 1n ], expected: 1n, options: { discardBig: false } },
    { inputs: [ 2n ], expected: 2n, options: { discardBig: false } },
    { inputs: [ 3n ], expected: 6n, options: { discardBig: false } },
    { inputs: [ 4n ], expected: 24n, options: { discardBig: false } },
    { inputs: [ 5n ], expected: 120n, options: { discardBig: false } },
    { inputs: [ 0 ], expected: 1, options: { discardBig: false } },
    { inputs: [ 1 ], expected: 1, options: { discardBig: false } },
    { inputs: [ 2 ], expected: 2, options: { discardBig: false } },
    { inputs: [ 3 ], expected: 6, options: { discardBig: false } },
    { inputs: [ 4 ], expected: 24, options: { discardBig: false } },
    { inputs: [ 5 ], expected: 120, options: { discardBig: false } },
]);

testFunction("anagramIndex", funcs.anagramIndex, [
    { inputs: [ [ ] ], expected: 0n },
    { inputs: [ [ 5n ] ], expected: 0n },
    { inputs: [ [ 2n, 1n, 0n ] ], expected: 5n },
    { inputs: [ [ 2n, 1n ] ], expected: 1n },
    { inputs: [ [ 0n, 1n, 2n ] ], expected: 0n },
    { inputs: [ [ 0n, 1n, 2n ] ], expected: 0n },
    { inputs: [ [ 5n, 6n, 7n ] ], expected: 0n },
    { inputs: [ [ -3n, -2n, -1n ] ], expected: 0n },
    { inputs: [ [ 7n, 6n, 5n ] ], expected: 5n },
    { inputs: [ [ 0n, 5n ] ], expected: 152n },
    { inputs: [ [ 1n, 2n, 3n, 4n, 0n, 5n ] ], expected: 152n },
    { inputs: [ [ 0n, 3n ] ], expected: 8n },
    { inputs: [ [ 1n, 2n, 0n, 3n ] ], expected: 8n },
    { inputs: [ [ 5n, 4n, 3n, 2n, 1n, 0n ] ], expected: 719n },
    { inputs: [ [ 5, 4, 3, 2, 1, 0 ] ], expected: 719 },
]);
