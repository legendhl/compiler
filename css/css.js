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
        } else if (curSelector) {
            return readDeclaration();
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
    function readDeclaration() {
        readWhile(isWhiteSpace);
        let property = readWhile(ch => /[a-zA-Z-]/.test(ch)).trim();
        if (!property) {
            croak();
        }
        readWhile(isWhiteSpace);
        expectChar(':');
        readWhile(ch => /\s/.test(ch) && ch !== '\n');
        let value = readWhile(ch => /[^\n;]/.test(ch)).trim();
        if (!value) {
            croak();
        }
        skipChar();
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

function css2AST(style) {
    let tokenizer = Tokenizer(style);
    let styles = [];
    while (!tokenizer.eof()) {
        let token = tokenizer.next();
        if (token.type === 'Selector') {
            token.declarations = [];
            styles.push(token);
        } else if (token.type === 'Declaration') {
            styles[styles.length - 1].declarations.push(token);
        }
    }
    return styles;
}

function ast2CSS(ast) {
    const tab = ' '.repeat(4);
    let css = ast.reduce((prev, cur) => {
        let str = '';
        str += `${cur.val} {\n`;
        str += cur.declarations.map(item => `${tab}${item.val.property}: ${item.val.value};`).join('\n');
        str += `${cur.declarations.length > 0 ? '\n' : ''}}\n`;
        return prev + str;
    }, '');
    return css;
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
    padding: 4px 10px;    margin: 0 0 2px;
}
`;

let ast = css2AST(style);
console.log(ast);
console.log(ast2CSS(ast))
// let tokenizer = Tokenizer(style);
// while (!tokenizer.eof()) {
//     console.log(tokenizer.next());
// }