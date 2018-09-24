const Css = require('./css');
const ReactStyle = require('./react');

function css2React(css) {
    let ast = Css.css2AST(css);
    ast = ast.map(item => {
        if (item.type === 'Selector') {
            item.type = 'ClassName';
            item.val = item.val.replace(/-\w/g, match => match.slice(1).toUpperCase()).slice(1);
            item.declarations = item.declarations.map(declaration => {
                declaration.val.property = declaration.val.property.replace(/-\w/g, match => match.slice(1).toUpperCase());
                // TODO declaration.val.value
                if (!/^\d*\.?\d+$/.test(declaration.val.value)) {
                    declaration.val.value = `'${declaration.val.value}'`;
                }
                return declaration;
            })
        }
        return item;
    });
    return ReactStyle.ast2React(ast);
}

function react2Css(style) {
    let ast = ReactStyle.react2AST(style);
    ast = ast.map(item => {
        if (item.type === 'ClassName') {
            item.type = 'Selector';
            item.val = '.' + item.val.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
            item.declarations = item.declarations.map(declaration => {
                declaration.val.property = declaration.val.property.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
                // TODO declaration.val.value
                if (declaration.val.value.startsWith('\'') && declaration.val.value.endsWith('\'')) {
                    declaration.val.value = declaration.val.value.substring(1, declaration.val.value.length - 1);
                }
                return declaration;
            })
        }
        return item;
    });
    return Css.ast2CSS(ast);
}

const style = `
.all {
    box-sizing: border-box;
}
.container {
    color: #000;
    background: #fff;
    padding: 0;
    font-family: PingFangSC-Regular, Verdana, Arial;
}
.filter-item {
    padding: 4px 10px;    margin: 0 0 2px;
}
`;

console.log(css2React(style));
// let ast = Css.css2AST(style);
// console.log(ast);
// console.log(Css.ast2CSS(ast));

const reactStyle = `
wrapper: {
    flex: 1
},
header: {
    zIndex: 3,
    flexDirection: 'row',
    flex: 1,
},
absolute: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
},
`;

// ast = ReactStyle.react2AST(reactStyle);
// console.log(ast);
// console.log(ReactStyle.ast2React(ast))
console.log(react2Css(reactStyle));