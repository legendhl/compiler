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
});