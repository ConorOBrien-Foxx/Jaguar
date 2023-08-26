// todo: add tests

const findLinearStats = (list, stats = {}, big = true) => {
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
        if(stats.prod) sum *= el;
    }
    
    let result = {};
    
    if(stats.min) result.min = min;
    if(stats.max) result.max = max;
    if(stats.sum) result.sum = sum;
    if(stats.prod) result.prod = prod;
    
    return result;
};

const anagramIndex = (list) => {
    // assert the list contains no duplicates
    
    let { min, max } = findLinearStats(list, { min: true, max: true });
    
    console.log(min, max);
    
    return [];
};


console.log(anagramIndex([1, 2, 3, 0]));
