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
    function croak(msg){
        throw new Error(`${msg} at ${line}:${col}`);
    }
}

function Tokenizer(input) {
    let stream = InputStream(input);
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
        if (stream.peek() === '<') {
            return readTagName();
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
    function readTagName() {

    }
    function readTagValue() {
        
    }
    function peek() {

    }
    function next() {
        
    }
    function eof() {
        return peek() === null;
    }
    function croak() {
        
    }
}

const xml = `
<root>
    <note type="dairy">
        <author>legendhl</author>
        <count unit="word">360000</count>
    </note>
    <other>
        <node name="attr" key="what" id="8"/>
    </other>
</root>
`;

let tokenizer = Tokenizer(xml);
while (!tokenizer.eof()) {
    console.log(tokenizer.next());
}