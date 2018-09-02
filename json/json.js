/**
 * JSON的数据格式如下：
 * object:  {string:value[,]}
 * array:   [value[,]]
 * value:   string|number|object|array|true|false|null
 */

const JSON = {
    parse(str) {
        str += '';
        const len = str.length;
        if (!len) {
            unexpectedEnd();
        }
        let pos = 0;
        const json = parseValue();
        skipWhiteSpace();
        if (pos < len) {
            unexpectedToken(str[pos], pos);
        }
        return json;

        function parseObject() {
            let obj = {};
            pos++; // skip {
            while (true) {
                skipWhiteSpace();
                let key = parseString();
                skipWhiteSpace();
                if (str[pos] !== ':') {
                    unexpectedToken(str[pos], pos);
                }
                pos++; // skip :
                let value = parseValue();
                obj[key] = value;
                skipWhiteSpace();
                let ch = str[pos++];
                if (ch === '}') {
                    break;
                } else if (ch === ',') {
                    continue;
                } else {
                    unexpectedToken(ch, pos);
                }
            }
            return obj;
        }
        function parseArray() {
            let arr = [];
            pos++; // skip [
            while (true) {
                let value = parseValue();
                arr.push(value);
                skipWhiteSpace();
                let ch = str[pos++];
                if (ch === ']') {
                    break;
                } else if (ch === ',') {
                    continue;
                } else {
                    unexpectedToken(ch, pos);
                }
            }
            return arr;
        }
        function parseValue() {
            if (str[pos] === '{') {
                return parseObject();
            } else if (str[pos] === '[') {
                return parseArray();
            } else if (str[pos] === '"') {
                return parseString();
            } else if (/\d/.test(str[pos])) {
                return parseNumber();
            } else if (str[pos] === 't') {
                return parseTrue();
            } else if (str[pos] === 'f') {
                return parseFalse();
            } else if (str[pos] === 'n') {
                return parseNull();
            } else if (/\s/.test(str[pos])) {
                pos++;
                return parseValue();
            } else {
                unexpectedToken(str[pos], pos);
            }
        }
        function parseString() {
            let s = '';
            if (str[pos] !== '"') {
                unexpectedToken(str[pos], pos);
            }
            pos++; // skip "
            while (str[pos] !== '"') {
                if (pos > len) {
                    unexpectedEnd();
                }
                s += str[pos++];
            }
            pos++; // skip "
            return s;
        }
        function parseNumber() {
            let n = 0;
            let cur = str[pos];
            while (/\d/.test(cur)) {
                n = n * 10 + Number(cur);
                cur = str[++pos];
            }
            return n;
        }
        function parseTrue() {
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        }
        function parseFalse() {
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        }
        function parseNull() {
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        function next(expected) {
            let cur = str[pos++];
            if (cur !== expected) {
                unexpectedToken(cur, pos);
            }
        }
        function skipWhiteSpace() {
            while (/\s/.test(str[pos])) {
                pos++;
            }
        }
        function unexpectedEnd() {
            throw new SyntaxError('Unexpected end of JSON input');
        }
        function unexpectedToken(token, pos) {
            throw new SyntaxError(`Unexpected token ${token} in JSON at position ${pos}`);
        }
    },

    stringify(json) {
        return json;
    }
}

const input = ` { "num" : 1 ,  \t"arr": [ 1 , 2 , 3 ] ,\n"obj":{"foo":"innerObject"},"isJson":true,"nothing":null,"str":"hello"}`;
console.log(JSON.parse(input));
const json = {};
console.log(JSON.stringify(json));