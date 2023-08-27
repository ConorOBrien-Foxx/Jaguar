export const isNumeric = x =>
    typeof x === "number" || typeof x === "bigint";
    
export const matchBigIntTo = (base, reference) =>
    typeof reference === "bigint" ? BigInt(base) : Number(base);
    
export const floor = x =>
    typeof x === "bigint" ? x : Math.floor(x);

export const deepEquals = (left, right, options = {}) => {
    options.discardBig ??= true;
    if(Array.isArray(left)) {
        return Array.isArray(right)
            && left.length == right.length
            && left.every((el, idx) => deepEquals(el, right[idx], options));
    }
    else if(Array.isArray(right)) {
        return false;
    }
    else if(options.discardBig && isNumeric(left)) {
        // TODO: equality within a certain tolerance?
        return isNumeric(right) && left == right;
    }
    else if(typeof left !== typeof right) {
        return false;
    }
    else if(typeof left !== "object") {
        return left === right;
    }
    else if(left === null) {
        return right === null;
    }
    
    if(left[deepEquals.equals]) {
        return left[deepEquals.equals](right, options);
    }
    // assumption: equality is commutative
    else if(right[deepEquals.equals]) {
        return right[deepEquals.equals](left, options);
    }
    
    let leftKeys = Object.keys(left);
    let rightKeys = Object.keys(right);
    if(leftKeys.length !== rightKeys.length) {
        return false;
    }
    return leftKeys.every(key => Object.hasOwn(right, key) && deepEquals(left[key], right[key], options))
        && rightKeys.every(key => Object.hasOwn(left, key));
};
deepEquals.equals = Symbol("deepEquals.equals");

export const findLinearStats = (list, stats = {}, big = true) => {
    // TODO: error checking
    // TODO: automatically cast sum/prod without need for big parameter
    // TODO: maybe just allow mixed is fine, somehow?
    let min = Infinity,
        max = -Infinity,
        sum = 0n,
        prod = 1n;
    
    if(!big) {
        sum = 0;
        prod = 1;
    }
    
    for(let el of list) {
        if(stats.min && el < min) min = el;
        if(stats.max && el > max) max = el;
        if(stats.sum) sum += el;
        if(stats.prod) prod *= el;
    }
    
    let result = {};
    
    if(stats.min) result.min = min;
    if(stats.max) result.max = max;
    if(stats.sum) result.sum = sum;
    if(stats.prod) result.prod = prod;
    
    return result;
};

// TODO: memoize
export const factorial = n =>
    n == 0 || n == 1
        // this will return 1 in the appropriate bigint-ness
        ? n++ || n
        // we mutate --n because we don't want to use the same trick to calculate n-1
        : n * factorial(--n);

export const anagramIndex = list => {
    if(list.length === 0) {
        return 0n;
    }
    
    let one = typeof list[0] === "bigint" ? 1n : 1;
    let zero = one - one;
    
    // normalization step
    let { min, max } = findLinearStats(list, { min: true, max: true });
    
    // TODO: assert the list contains no duplicates
    if(min != 0) {
        list = list.map(el => el - min);
        max -= min;
    }
    
    // add implied elements to a prefix
    if(max >= list.length) {
        let prefix = [];
        for(let i = zero; i < max; i++) {
            if(!list.includes(i)) {
                prefix.push(i);
            }
        }
        list = prefix.concat(list);
    }
    
    let index = zero;
    // TODO: can we iteratively calculate factorial by walking backwards in the for loop?
    let product = factorial(max);
    for(let i = zero; i <= max; i++) {
        let earlierPermutationCount = zero;
        for(let j = i + one; j <= max; j++) {
            if(list[j] < list[i]) {
                earlierPermutationCount++;
            }
        }
        // index += earlierPermutationCount * factorial(max - i);
        index += earlierPermutationCount * product;
        if(max - i) {
            product /= max - i;
        }
    }
    
    return index;
};

export const range1 = max =>
    max >= 0
        ? Array.from({ length: max }, (_, i) => i)
        : Array.from({ length: -max }, (_, i) => -1 - i - max);
    
export const range2 = (min, max) =>
    min <= max
        ? Array.from({ length: max - min }, (_, i) => i + min)
        : Array.from({ length: min - max }, (_, i) => min - i);

export const permuteByAnagramIndex = (index, list) => {
    let remainingNumbers = Array.from({ length: list.length }, (_, i) => i);
    let permutation = [];
    
    let i = matchBigIntTo(list.length - 1, index);
    let factor = factorial(i);
    for(; i >= 0; i--) {
        let indexInRemaining = Math.floor(Number(index / factor));
        let targetIndex = remainingNumbers[indexInRemaining];
        
        permutation.push(list[targetIndex]);
        remainingNumbers.splice(indexInRemaining, 1);
        
        index %= factor;
        if(i) {
            factor /= i;
        }
    }

    return permutation;
};
