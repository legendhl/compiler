const { re } = require('./regex.js');
const expect = require('chai').expect;

describe('regex的测试', function () {
    it('纯字符匹配的测试', function () {
        expect(re('a', 'a')).to.be.ok;
        expect(re('b', 'a')).to.not.be.ok;
        expect(re('abcde', 'abcde')).to.be.ok;
        expect(re('abcdf', 'abcde')).to.not.be.ok;
    });
    it('+的测试', function () {
        expect(re('a+', 'a')).to.be.ok;
        expect(re('a+', 'aaa')).to.be.ok;
    });
    it('*的测试', function () {
        expect(re('a*', '')).to.be.ok;
        expect(re('a*', 'a')).to.be.ok;
        expect(re('a*', 'aaaa')).to.be.ok;
    });
    it('?的测试', function () {
        expect(re('a?', '')).to.be.ok;
        expect(re('a?', 'a')).to.be.ok;
        expect(re('a?', 'aa')).to.not.be.ok;
    });
    it('.的测试', function () {
        expect(re('.', 'a')).to.be.ok;
        expect(re('a.b', 'acb')).to.be.ok;
        expect(re('a.a', 'aab')).to.not.be.ok;
    });
    it('|的测试', function () {
        expect(re('a|b', 'a')).to.be.ok;
        expect(re('a|b', 'b')).to.be.ok;
        expect(re('ab|cd', 'ab')).to.be.ok;
        expect(re('ab|cd', 'cd')).to.be.ok;
        expect(re('abc|de', 'abcde')).to.not.be.ok;
    });
    it('()的测试', function () {
        expect(re('(a)', 'a')).to.be.ok;
        expect(re('(abc)', 'abc')).to.be.ok;
        expect(re('(ab)+', 'ababab')).to.be.ok;
        expect(re('a(b|c)d', 'abd')).to.be.ok;
        expect(re('a(b|c)d', 'abc')).to.not.be.ok;
        expect(re('a(bc)?d', 'ad')).to.be.ok;
        expect(re('a(bc)?d', 'abcd')).to.be.ok;
        expect(re('a(bc)?d', 'abcbcd')).to.not.be.ok;
        expect(re('a(bc)*d', 'abcad')).to.not.be.ok;
    });
});