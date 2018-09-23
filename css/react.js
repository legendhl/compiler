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
            readWhile(isWhiteSpace);
            if (!stream.eof()) {
                expectChar(',');
            }
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

function react2AST(style) {
    let tokenizer = Tokenizer(style);
    let styles = [];
    while (!tokenizer.eof()) {
        let token = tokenizer.next();
        if (token.type === 'ClassName') {
            token.declarations = [];
            styles.push(token);
        } else if (token.type === 'Declaration') {
            styles[styles.length - 1].declarations.push(token);
        }
    }
    return styles;
}

function ast2React(ast) {
    const tab = ' '.repeat(4);
    let style = ast.reduce((prev, cur) => {
        let str = '';
        str += `${cur.val}: {\n`;
        str += cur.declarations.map(item => `${tab}${item.val.property}: ${item.val.value}`).join(',\n');
        str += `${cur.declarations.length > 0 ? '\n' : ''}}\n`;
        return prev + str;
    }, '');
    return style;
}

const reactStyle = {
    react2AST,
    ast2React
}

module.exports = reactStyle;
