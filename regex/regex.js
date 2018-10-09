const { regex2nfa, SPLIT, MATCH } = require('./nfa.js');

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
        if (state.c === c || state.c === '.') {
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

function re(regex, str) {
    let state = regex2nfa(regex);
    return match(state, str);
}

module.exports = { re };
