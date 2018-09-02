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
            } else if (/[\d-]/.test(str[pos])) {
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
            let num = 0;
            let negative = false;
            let cur = str[pos];
            if (cur === '-') {
                negative = true;
                cur = str[++pos];
            }
            while (/\d/.test(cur)) {
                num = num * 10 + Number(cur);
                cur = str[++pos];
            }
            if (cur === '.') {
                let exp = 0.1;
                cur = str[++pos];
                while (/\d/.test(cur)) {
                    num = num + Number(cur) * exp;
                    exp /= 10;
                    cur = str[++pos];
                }
            }
            if (cur === 'e' || cur === 'E') {
                let expNeg = true;
                cur = str[++pos];
                if (cur === '-') {
                    expNeg = false;
                    cur = str[++pos];
                } else if (cur === '+') {
                    cur = str[++pos];
                }
                let expNum = 0;
                if (/\d/.test(cur)) {
                    while (/\d/.test(cur)) {
                        expNum = expNum * 10 + Number(cur);
                        cur = str[++pos];
                    }
                    while (expNum--) {
                        if (expNeg) {
                            num *= 10;
                        } else {
                            num /= 10;
                        }
                    }
                } else {
                    unexpectedEnd();
                }
            }
            if (negative) {
                num = -num;
            }
            return num;
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

const input = ` { "num" : 128.85 ,  \t"arr": [ 1 , 2 , 3 ] ,\n"obj":{"foo":"innerObject"},"isJson":true,"nothing":null,"str":"hello"}`;
console.log(JSON.parse(input));
const json = {};
console.log(JSON.stringify(json));