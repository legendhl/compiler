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
            throw new SyntaxError('Unexpected end of JSON input')
        }
        let pos = 0;
        return parseValue();

        function parseObject() {
            let obj = {};
            pos++; // skip {
            while (true) {
                let key = parseString();
                if (str[pos] !== ':') {
                    throw new SyntaxError(`Unexpected token ${str[pos]} in JSON at position ${pos}`);
                }
                pos++; // skip :
                let value = parseValue();
                obj[key] = value;
                let ch = str[pos++];
                if (ch === '}') {
                    break;
                } else if (ch === ',') {
                    continue;
                } else {
                    throw new SyntaxError(`Unexpected token ${ch} in JSON at position ${pos}`);
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
                let ch = str[pos++];
                if (ch === ']') {
                    break;
                } else if (ch === ',') {
                    continue;
                } else {
                    throw new SyntaxError(`Unexpected token ${ch} in JSON at position ${pos}`);
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
            } else {

            }
        }
        function parseString() {
            let s = '';
            if (str[pos] !== '"') {
                throw new SyntaxError(`Unexpected token ${str[pos]} in JSON at position ${pos}`);
            }
            pos++; // skip "
            while (str[pos] !== '"') {
                if (pos > len) {
                    throw new SyntaxError('Unexpected end of JSON input');
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
                throw new SyntaxError(`Unexpected token ${cur} in JSON at position ${pos}`);
            }
        }
    },

    stringify(json) {
        return json;
    }
}

const input = `{"num":1,"arr":[1,2,3],"obj":{"foo":"innerObject"},"isJson":true,"nothing":null,"str":"hello"}`;
console.log(JSON.parse(input));
const json = {};
console.log(JSON.stringify(json));