/**
 * selector {declaration1; declaration2; ... declarationN }
 * declaration  property: value
 */

const InputStream = require('../components/InputStream');

function Tokenizer(input) {
    let stream = InputStream(input);
    let cur = null;
    let curSelector = null;
    return {
        peek,
        next,
        eof,
        croak
    }
    function isWhiteSpace(ch) {
        return /\s/.test(ch);
    }
    function isChar(ch) {
        return /[a-zA-Z-]/.test(ch);
    }
    function readNext() {
        readWhile(isWhiteSpace);
        let ch = stream.peek();
        if (ch === '') {
            return null;
        } else if (ch === '{') {
            skipChar();
            return readNext();
        } else if (ch === '}') {
            skipChar();
            curSelector = null;
            return readNext();
        } else if (ch === ':') {
            skipChar();
            return readValue();
        } else if (curSelector) {
            return readProperty();
        } else {
            return readSelector();
        }
    }
    function readWhile(predicate) {
        let str = '';
        while (!stream.eof() && predicate(stream.peek())) {
            str += stream.next();
        }
        return str;
    }
    function expectChar(ch) {
        if (ch !== stream.next()) {
            croak();
        }
        return ch;
    }
    function readSelector() {
        readWhile(isWhiteSpace);
        let selector = readWhile(ch => /[^{}]/.test(ch)).trim();
        curSelector = selector;
        return { type: 'Selector', val: selector };
    }
    function readProperty() {
        readWhile(isWhiteSpace);
        let property = readWhile(ch => /[a-zA-Z-]/.test(ch)).trim();
        readWhile(isWhiteSpace);
        return { type: 'Property', val: property };
    }
    function readValue() {
        readWhile(isWhiteSpace);
        let value = readWhile(ch => /[^\n;]/.test(ch)).trim();
        skipChar();
        return { type: 'Value', val: value };
    }
    function skipChar() {
        stream.next();
    }
    function peek() {
        return cur || (cur = readNext());
    }
    function next() {
        let tok = cur;
        cur = null;
        return tok || readNext();
    }
    function eof() {
        return peek() === null;
    }
    function croak() {
        stream.croak(`Unexpected char ${stream.peek()}`);
    }
}

const style = `
* {
    box-sizing: border-box;
}
body {
    color: #000;
    background: #fff;
    padding: 0;
    font-family: PingFangSC-Regular, Verdana, Arial;
}
.filter-item {
    padding: 4px 10px;
    margin: 0 0 2px;
}
`;

let tokenizer = Tokenizer(style);
while (!tokenizer.eof()) {
    console.log(tokenizer.next());
}