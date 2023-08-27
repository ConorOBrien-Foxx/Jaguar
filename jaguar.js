// file left intentionally blank
/*

concatenative, non-stack based language

// say, focus = 28



*/

let vars = {
    sub: x => y => x - y,
    add: x => y => x + y,
    twice: fn => x => fn(fn(x)),
    4: 4,
    5: 5,
};

class JaguarInterpreter {
    constructor(tokens, scope = {}) {
        this.tokens = tokens;
        this.scope = scope;
        this.focus = null;
    }
    
    getTokenValue(token) {
        if(/^\d+/.test(token)) {
            return Number(token);
            // todo: bigints
        }
        return vars[token];
    }
    
    run() {
        for(let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            if(!this.focus) {
                this.focus = this.getTokenValue(token);
                continue;
            }
            let value = null;
            if(token === "(") {
                let depth = 1;
                let j;
                for(j = i + 1; depth > 0 && j < this.tokens.length; j++) {
                    if(this.tokens[j] === "(") depth++;
                    if(this.tokens[j] === ")") depth--;
                }
                let inner = this.tokens.slice(i + 1, j - 1);
                value = JaguarInterpreter.evalTokens(inner);
                i = j - 1;
            }
            else {
                value = this.getTokenValue(token);
            }
            console.log(token, this.focus, value);
            this.focus = this.focus(value);
        }
    }
    
    static evalTokens(tokens) {
        let evaluator = new JaguarInterpreter(tokens);
        evaluator.run();
        return evaluator.focus;
    }
}

let tokens = `
twice ( add 3 ) 8
`.trim().split(/\s+/);

console.log(tokens);

console.log(JaguarInterpreter.evalTokens(tokens));
