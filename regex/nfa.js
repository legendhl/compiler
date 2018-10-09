const SPLIT = Symbol('split');
const MATCH = Symbol('match');
const CATENATION = Symbol('Catenation');

Array.prototype.peek = function () {
    if (!this.length) {
        return null;
    } else {
        return this[this.length - 1];
    }
}

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

function post2nfa(postRegex) {
    let stack = [];
    const matchState = new State(MATCH);
    let state, s1, s2, s;
    for (let c of postRegex) {
        if (c === CATENATION) { // Catenation
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

function in2post(str) {
    let operStack = [];
    let stack = [];
    for (let i = 0; i < str.length; i++) {
        let s = str[i];
        if (!isOper(s)) {
            if (i > 0 && str[i - 1] !== '(' && str[i - 1] !== '|') {
                pushOper(CATENATION, operStack, stack);
            }
            stack.push(s);
        } else if (s === '(' || s === ')') {
            if (s === '(') {
                if (stack.length) {
                    pushOper(CATENATION, operStack, stack);
                }
                operStack.push(s);
            } else {
                while (operStack.peek() !== '(') {
                    stack.push(operStack.pop());
                }
                operStack.pop();
            }
        } else {
            pushOper(s, operStack, stack);
        }
    }
    function pushOper(oper, operStack, stack) {
        if (!operStack.length || operStack.peek() === '(') {
            operStack.push(oper);
        } else if (getPrecedence(oper) > getPrecedence(operStack.peek())) {
            operStack.push(oper);
        } else {
            stack.push(operStack.pop());
            pushOper(oper, operStack, stack);
        }
    }
    while (operStack.length) {
        stack.push(operStack.pop());
    }
    return stack;
}

function isOper(ch) {
    return '()\\[]*+?{}^$|'.includes(ch) || ch === CATENATION;
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
        case CATENATION:
            return 2;
        case '|':
            return 1;
        default:
            return 0;
    }
}

function regex2nfa(regex) {
    let postRegex = in2post(regex);
    return post2nfa(postRegex);
}

module.exports = { State, regex2nfa, SPLIT, MATCH };