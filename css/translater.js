const Css = require('./css');
const ReactStyle = require('./react');

function css2React(css) {

}

function react2Css(style) {

}

const style = `
* {
    box-sizing: border-box;
}
body {
    color: #000;
    background: #fff;
    padding: 0;
    font-family: PingFangSC-Regular, Verdana, Arial;
}
.filter-item {
    padding: 4px 10px;    margin: 0 0 2px;
}
`;

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