const SPLIT = Symbol('split');
const MATCH = Symbol('match');

class State {
    constructor(c, next = null, next2 = null, endList = []) {
        this.c = c; // character
        this.next = next; // a State
        this.next2 = next2; // another State
        this.endList = [this]; // end state list
    }

    patch(state) {
        for (let s of this.endList) {
            if (!s.next) {
                s.next = state;
            } else if (!s.next2) {
                s.next2 = state;
            }
        }
    }
}


function post2nfa(str) {
    let stack = [];
    const matchState = new State(MATCH);
    let state, s1, s2, s;
    for (let c of str) {
        if (c === '.') { // Catenation
            s2 = stack.pop();
            s1 = stack.pop();
            s1.patch(s2);
            s1.endList = s2.endList;
            stack.push(s1);
        } else if (c === '|') { // Alternation
            s2 = stack.pop();
            s1 = stack.pop();
            state = new State(SPLIT, s1, s2);
            state.endList = s1.endList.concat(s2.endList)
            stack.push(state);
        } else if (c === '?') { // Zero or one
            s = stack.pop();
            state = new State(SPLIT, s);
            state.endList = state.endList.concat(s.endList);
            stack.push(state);
        } else if (c === '*') { // Zero or more
            s = stack.pop();
            state = new State(SPLIT, s);
            s.patch(state);
            stack.push(state);
        } else if (c === '+') { // One or more
            s = stack.pop();
            state = new State(SPLIT, s);
            s.patch(state);
            s.endList = [state];
            stack.push(s);
        } else { // default
            state = new State(c);
            stack.push(state);
        }
    }

    state = stack.pop();
    state.patch(matchState);
    return state;
}

let str = 'abb.+.a.';
let state = post2nfa(str);
console.log(state);
