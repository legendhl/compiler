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
    }
    function readProperty() {
    }
    function readValue() {
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