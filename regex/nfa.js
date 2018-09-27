class State {
    constructor(c, out, out1) {
        this.c = c;
        this.out = out;
        this.out1 = out1;
    }
}

class Frag {
    constructor(start, out) {
        this.start = start;
        this.out = out;
    }
}

// creates a new pointer list containing the single pointer
function list(state) {
}

// concatenates two pointer lists, returning the result
function append(l1, l2) {
}

//connects the dangling arrows in the pointer list to the state
function patch(list, state) {
}

function post2nfa(str) {
    let stack = [];
    // let state = null;
    for (let c of str) {
        if (c === '.') { // Catenation
            let e2 = stack.pop();
            let e1 = stack.pop();
            patch(e1.out, e2.start);
            stack.push(new Frag(e1.start, e2.out));
        } else if (c === '|') { // Alternation
            let e2 = stack.pop();
            let e1 = stack.pop();
            let s = new State(Split, e1.start, e2.start);
            stack.push(new Frag(s, append(e1.out, e2.out)));
        } else if (c === '?') { // Zero or one
            let e = stack.pop();
            let s = new State(Split, e.start, null);
            stack.push(new Frag(s, append(e.out, list(s.out1))));
        } else if (c === '*') { // Zero or more
            let e = stack.pop();
            let s = new State(Split, e.start, null);
            patch(e.out, s);
            stack.push(new Frag(s, list(s.out1)));
        } else if (c === '+') { // One or more
            let e = stack.pop();
            let s = new State(Split, e.start, null);
            patch(e.out, s);
            stack.push(new Frag(e.start, list(s.out1)));
        } else { // default
            let s = new State(c, null, null);
            stack.push(new Frag(s, list(s.out)));
        }
    }

    let e = stack.pop();
    patch(e.out, matchState);
    return e.start;
}