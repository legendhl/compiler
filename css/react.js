/**
 * className: {declaration1, declaration2, ... declarationN }
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
        } else if (ch === ',') {
            skipChar();
            return readNext();
        } else if (ch === '{') {
            styleStarted = true;
            skipChar();
            return readDeclaration();
        } else if (ch === '}') {
            styleStarted = false;
            skipChar();
            return readNext();
        } else {
            if (styleStarted) {
                return readDeclaration();
            } else {
                return readClassName();
            }
        }
    }
    function readClassName() {
        readWhile(isWhiteSpace);
        let className = readWhile(ch => /[a-zA-Z_]/.test(ch));
        readWhile(isWhiteSpace);
        expectChar(':');
        return { type: 'ClassName', val: className };
    }
    function readDeclaration() {
        readWhile(isWhiteSpace);
        let property = readWhile(ch => /[a-zA-Z]/.test(ch));
        if (!property) {
            croak();
        }
        readWhile(isWhiteSpace);
        expectChar(':');
        readWhile(ch => /[\s]/.test(ch));
        let value = readWhile(ch => /[^\s,]/.test(ch));
        if (!value) {
            croak();
        }
        readWhile(ch => /\s/.test(ch) && ch !== '\n');
        let ch = stream.peek();
        if (ch !== ',' && ch !== '\n') {
            croak();
        }
        return { type: 'Declaration', val: { property, value } };
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