/**
 * 接收代码字符串，分割成 token 组成的数组。
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */
function tokenizer(input) {
    let tokens = [];
    for (let i = 0; i < input.length; i++) {
        let ch = input[i];
        if (/\s/.test(ch)) {
            continue;
        } else if (ch === '(' || ch === ')') {
            tokens.push({ type: 'paren', value: ch });
        } else if (/\d/.test(ch)) {
            let numStr = '';
            while (/\d/.test(ch)) {
                numStr += ch;
                ch = input[++i];
            }
            tokens.push({ type: 'number', value: parseInt(numStr) });
        } else {
            let str = '';
            while (/\w/.test(ch)) {
                str += ch;
                ch = input[++i];
            }
            tokens.push({ type: 'name', value: str });
        }
    }
    return tokens;
}

/**
 *  语法分析器接受 token 数组，然后转化为 AST
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
function parser(tokens) {

}

// 转换器，将原AST转为新AST
function transformer(ast) {

}

// 根据AST生成代码
function codeGenerator(ast) {

}

function compiler(input) {
    let tokens = tokenizer(input);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    let output = codeGenerator(newAst);

    return output;
}