/**
 * selector {declaration1; declaration2; ... declarationN }
 * declaration  property: value
 */

const InputStream = require('../components/InputStream');

function Tokenizer(input) {
    let stream = InputStream(input);
    let cur = null;
    let curSelector = null;
    let lastType = null;
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
        if (ch === '{') {
            stream.next();
            return readNext();
        } else if (ch === '}') {
            stream.next();
            curSelector = null;
            return readNext();
        } else if (ch === ':') {
            stream.next();
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
    }
    function readProperty() {
        readWhile(isWhiteSpace);
    }
    function readValue() {
        readWhile(isWhiteSpace);
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
body {
    color: #000;
    background: #fff;
    margin: 0 10px;
    padding: 0;
    font-family: PingFangSC-Regular, Verdana, Arial;
}
`;

let tokenizer = Tokenizer(style);
while (!tokenizer.eof()) {
    console.log(tokenizer.next());
}