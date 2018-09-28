class State {
    constructor(c, next, next2, type) {
        this.c = c; // character
        this.next = next; // a State
        this.next2 = next2; // another State
        this.type = type || 'next'; // 
    }
}

class Frag {
    constructor(start, end) {
        this.start = start; // start State
        this.end = end; // end State: array
    }
}

// creates a new pointer list containing the single pointer
function list(state) {
    return state;
}

// concatenates two pointer lists, returning the result
function append(l1, l2) {
}

//connects the dangling arrows in the pointer list to the state
// function patch(frag, state) {
//     frag.end = state;
// }
function patch(s1, s2) {
    while (s1[s1.type]) {
        s1 = s1[s1.type];
    }
    s1[s1.type] = s2;
}

const SPLIT = Symbol('split');
const MATCH = Symbol('match');

function post2nfa(str) {
    let stack = [];
    const matchState = new State(MATCH, null, null);
    // let state = null;
    for (let c of str) {
        if (c === '.') { // Catenation
            let e2 = stack.pop();
            let e1 = stack.pop();
            patch(e1, e2);
            stack.push(e1);
            // patch(e1, e2.start);
            // stack.push(new Frag(e1.start, e2.end));
        } else if (c === '|') { // Alternation
            let e2 = stack.pop();
            let e1 = stack.pop();
            let s = new State(SPLIT, e1.start, e2.start);
            stack.push(s);
            // stack.push(new Frag(s, append(e1.end, e2.end)));
        } else if (c === '?') { // Zero or one
            let e = stack.pop();
            let s = new State(SPLIT, e.start, null, 'next2');
            stack.push(s);
            // stack.push(new Frag(s, append(e.next, list(s.next2))));
        } else if (c === '*') { // Zero or more
            let e = stack.pop();
            let s = new State(SPLIT, e.start, null, 'next2');
            patch(e, s);
            // e.next = s;
            stack.push(s);
            // patch(e, s);
            // stack.push(new Frag(s, list(s.next2)));
        } else if (c === '+') { // One or more
            let e = stack.pop();
            let s = new State(SPLIT, e, null, 'next2');
            // e.next = s;
            patch(e, s);
            stack.push(e);
            // stack.push(new Frag(e.start, list(s.next2)));
        } else { // default
            let s = new State(c, null, null);
            // stack.push(new Frag(s, null));
            stack.push(s);
        }
    }

    let e = stack.pop();
    patch(e, matchState);
    return e;
}

let str = 'abb..a.';
let state = post2nfa(str);
console.log(state);