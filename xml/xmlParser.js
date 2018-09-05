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

let stream = InputStream(xml);
while (!stream.eof()) {
    console.log(stream.next());
}