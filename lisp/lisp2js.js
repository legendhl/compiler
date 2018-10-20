/**
 * 接收代码字符串，分割成 token 组成的数组。
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */
function tokenizer(input) {

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
    var tokens = tokenizer(input);
    var ast = parser(tokens);
    var newAst = transformer(ast);
    var output = codeGenerator(newAst);

    return output;
}