/**
 * style: {declaration1, declaration2, ... declarationN }
 * declaration  property: value[,]
 */

const InputStream = require('../components/InputStream');

function Tokenizer(input) {
    let stream = InputStream(input);
    let cur = null;
    let styleStarted = false;
    return {
        peek,
        next,
        eof,
        croak
    }
    function isWhiteSpace(ch) {
        return /\s/.test(ch);
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
    function readNext() {
        readWhile(isWhiteSpace);
        let ch = stream.peek();
        if (ch === '') {
            return null;
        } else if (ch === '{') {
            styleStarted = true;
            return readProperty();
        } else if (ch === '}') {
            styleStarted = false;
            return readStyle();
        } else if (ch === ':') {
            return readValue();
        } else if (ch === ',') {
            if (styleStarted) {
                return readProperty();
            } else {
                return readStyle();
            }
        } else {
            return readStyle();
        }
    }
    function readStyle() {
        readWhile(isWhiteSpace);
    }
    function readProperty() {
        readWhile(isWhiteSpace);
    }
    function readValue() {
        readWhile(isWhiteSpace);
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
wrapper: {
    flex: 1
},
header: {
    zIndex: 3,
    flexDirection: 'row',
    flex: 1,
},
absolute: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
},
`;

let tokenizer = Tokenizer(style);
while (!tokenizer.eof()) {
    console.log(tokenizer.next());
}