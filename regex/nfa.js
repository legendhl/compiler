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

function match(state, str) {
    let curList = [];
    let nextList = [];

    addState(curList, state);
    for (let c of str) {
        step(curList, c, nextList);
        [curList, nextList] = [nextList, curList];
    }
    return curList.some(state => state.c === MATCH);
}

function step(curList, c, nextList) {
    nextList.splice(0, nextList.length);
    curList.forEach(state => {
        if (state.c === c) {
            addState(nextList, state.next);
        }
    });
}

function addState(list, state) {
    if (!state || list.includes(state)) {
        return;
    }
    if (state.c === SPLIT) {
        addState(list, state.next);
        addState(list, state.next2);
    } else {
        list.push(state);
    }
}

function re(regexp, str) {
    let state = post2nfa(regexp);
    return match(state, str);
}

Array.prototype.peek = function() {
    if (!this.length) {
        return null;
    } else {
        return this[this.length - 1];
    }
}

function in2post(str) {
}

function isOper(ch) {
    return '()\\[]*+?{}^$|'.includes(ch);
}

function getPrecedence(oper) {
    // 运算符优先级：
    // \	转义符
    // (), (?:), (?=), []	圆括号和方括号
    // *, +, ?, {n}, {n,}, {n,m}	限定符
    // ^, $, \任何元字符、任何字符	定位点和序列（即：位置和顺序）
    // | “或”操作
    switch (oper) {
        case '\\':
            return 5;
        case '(':
        case ')':
        case '[':
        case ']':
            return 4;
        case '*':
        case '+':
        case '?':
            return 3;
        case '^':
        case '$':
            return 2;
        case '|':
            return 1;
        default:
            return 0;
    }
}

console.log(re('abb.+.a.', 'abba'));
