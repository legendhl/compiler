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

        function parseValue() {
            skipWhiteSpace();
            if (str[pos] === '{') {
                return parseObject();
            } else if (str[pos] === '[') {
                return parseArray();
            } else if (str[pos] === '"') {
                return parseString();
            } else if (/[\d-]/.test(str[pos])) {
                return parseNumber();
            } else if (str[pos] === 't') {
                return parseTrue();
            } else if (str[pos] === 'f') {
                return parseFalse();
            } else if (str[pos] === 'n') {
                return parseNull();
            } else {
                unexpectedToken(str[pos], pos);
            }
        }
        function parseObject() {
            let obj = {};
            next('{');
            while (true) {
                skipWhiteSpace();
                let key = parseString();
                skipWhiteSpace();
                next(':');
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
            next('[');
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
        function parseString() {
            let s = '';
            if (str[pos] !== '"') {
                unexpectedToken(str[pos], pos);
            }
            next('"');
            while (str[pos] !== '"') {
                if (pos > len) {
                    unexpectedEnd();
                }
                s += str[pos++];
            }
            next('"');
            return s;
        }
        function parseNumber() {
            let numberStr = '';
            let cur = str[pos];
            if (cur === '-') {
                numberStr += cur;
                cur = str[++pos];
            }
            while (/\d/.test(cur)) {
                numberStr += cur;
                cur = str[++pos];
            }
            if (cur === '.') {
                numberStr += cur;
                cur = str[++pos];
                while (/\d/.test(cur)) {
                    numberStr += cur;
                    cur = str[++pos];
                }
            }
            if (cur === 'e' || cur === 'E') {
                numberStr += cur;
                cur = str[++pos];
                if (cur === '-' || cur === '+') {
                    numberStr += cur;
                    cur = str[++pos];
                }
                if (/\d/.test(cur)) {
                    while (/\d/.test(cur)) {
                        numberStr += cur;
                        cur = str[++pos];
                    }
                } else {
                    unexpectedEnd();
                }
            }
            return parseFloat(numberStr);
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
                unexpectedToken(cur, pos - 1);
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
        return stringifyJson(json);

        function stringifyJson(json) {
            if (typeof json === 'string') {
                return `"${json}"`;
            } else if (typeof json === 'number') {
                return json.toString();
            } else if (typeof json === 'boolean') {
                return json.toString();
            } else if (json === null) {
                return 'null';
            } else if (Array.isArray(json)) {
                return stringifyArray(json);
            } else if (typeof json === 'object') {
                return stringifyObject(json);
            } else if (typeof json === 'undefined') {
                return undefined;
            }
        }
        function stringifyArray(arr) {
            let vArr = arr.filter(item => typeof item !== 'undefined')
                .map(item => stringifyJson(item));
            return `[${vArr.join(',')}]`;
        }
        function stringifyObject(obj) {
            let arr = [];
            for (let [key, value] of Object.entries(obj)) {
                if (typeof value !== 'undefined') {
                    arr.push(`"${key}"` + ':' + stringifyJson(value));
                }
            }
            return `{${arr.join(',')}}`
        }
    }
}

const input = ` { "num" : 128.85e+2 ,  \t"arr": [ 1 , 2 , 3 ] ,\n"obj":{"foo":"innerObject"},"isJson":true,"nothing":null,"str":"hello"}`;
console.log(JSON.parse(input));
const json = { num: 128.85, arr: [1, 2, 3], obj: { foo: 'innerObject' }, isJson: true, nothing: null, str: 'hello' };
console.log(JSON.stringify(json));