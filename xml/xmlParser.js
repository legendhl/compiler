function InputStream(input) {
    let pos = 0, line = 1, col = 0;
    return {
        peek,
        next,
        eof,
        croak
    }
    function peek() {
        return input.charAt(pos);
    }
    function next() {
        let ch = input.charAt(pos++);
        if (ch === '\n') {
            line++;
            col = 0;
        } else {
            col++;
        }
        return ch;
    }
    function eof() {
        return peek() === '';
    }
    function croak(msg) {
        throw new Error(`${msg} at ${line}:${col}`);
    }
}

function Tokenizer(input) {
    let stream = InputStream(input);
    let stack = [];
    let cur = null;
    let curTag = null;
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
        return /\w/.test(ch);
    }
    function readNext() {
        readWhile(isWhiteSpace);
        let ch = stream.peek();
        if (ch === '<') {
            return readTagStart();
        } else if (ch === '>') {
            stream.next();
            curTag = null;
            return readNext();
        } else if (curTag !== null) {
            return readTagAttr();
        } else {
            return readTagValue();
        }
    }
    function readWhile(predicate) {
        let str = '';
        while (!stream.eof() && predicate(stream.peek())) {
            str += stream.next();
        }
        return str;
    }
    function readTagName(suffix) {
        let str = readWhile(isChar);
        curTag = str;
        return { type: `tagName${suffix}`, value: str };
    }
    function readTagAttr() {
        readWhile(isWhiteSpace);
        let key = readWhile(isChar);
        expectChar('=');
        expectChar('"');
        let value = readWhile(ch => /[^"]/.test(ch));
        expectChar('"');
        return { type: 'tagAttr', value: { [key]: value } };
    }
    function expectChar(ch) {
        if (ch !== stream.next()) {
            // TODO: not correct pos
            croak();
        }
        return ch;
    }
    function readTagValue() {
        let value = readWhile(ch => /[^<]/.test(ch));
        if (!value) {
            return null;
        }
        return { type: 'tagValue', value: value };
    }
    function readTagStart() {
        expectChar('<');
        if (stream.peek() === '/') {
            return readTagEnd();
        } else {
            return readTagName('Start');
        }
    }
    function readTagEnd() {
        stream.next();
        return readTagName('End');
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

const xml = `
<root>
    <note type="dairy">
        <author>legendhl</author>
        <count unit="word">360000</count>
    </note>
    <other>
        <node name="attr" key="what" id="8"></node>
    </other>
</root>
`;

let tokenizer = Tokenizer(xml);
while (!tokenizer.eof()) {
    console.log(tokenizer.next());
}