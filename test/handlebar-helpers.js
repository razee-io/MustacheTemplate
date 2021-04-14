var assert = require('chai').assert;
var HandlebarHelper = require('../src/handlebar-helpers');
describe('handlebar-helper', function () {
    it('should correctly say that 40 > 30 using gt', function () {
        ret = HandlebarHelper.gt(40, 30)
        assert.equal(ret, true, '40 is greater than 30)');
        ret = HandlebarHelper.gt(30, 40)
        assert.equal(ret, false, '30 is not greater than 40)');
    });
    it('should correctly say that 30 < 40 using lt', function () {
        ret = HandlebarHelper.lt(30, 40)
        assert.equal(ret, true, '30 is less than 40)');
        ret = HandlebarHelper.lt(40, 30)
        assert.equal(ret, false, '40 is not less than 30)');
    });
    it('should correctly say that 30 = 30 using eq and ne', function () {
        ret = HandlebarHelper.eq(30, 30)
        assert.equal(ret, true, '30 is equal to 30)');
        ret = HandlebarHelper.ne(30, 30)
        assert.equal(ret, false, '30 is not ne 30)');
    });
    it('should correctly say that 40 != 30 using eq and ne', function () {
        ret = HandlebarHelper.eq(40, 30)
        assert.equal(ret, false, '40 is not equal to 30)');
        ret = HandlebarHelper.ne(40, 30)
        assert.equal(ret, true, '40 is ne 30)');
    });
    it('should correctly say that 30 >= 30 using gte', function () {
        ret = HandlebarHelper.gte(30, 30)
        assert.equal(ret, true, '30 is greater than or equal to 30)');
    });
    it('should correctly say that 30 <= 30 using lte', function () {
        ret = HandlebarHelper.lte(30, 30)
        assert.equal(ret, true, '30 is less than or equal to 30)');
    });
    it('should correctly say that 40 > 30 using gte', function () {
        ret = HandlebarHelper.gt(40, 30)
        assert.equal(ret, true, '40 is greater than 30)');
        ret = HandlebarHelper.gt(30, 40)
        assert.equal(ret, false, '30 is not greater than 40)');
    });
    it('should correctly say that 30 < 40 using lte', function () {
        ret = HandlebarHelper.lt(30, 40)
        assert.equal(ret, true, '30 is less than 40)');
        ret = HandlebarHelper.lt(40, 30)
        assert.equal(ret, false, '40 is not less than 30)');
    });
    it('should correctly split ip:port when delimiter is :', function () {
        ret = HandlebarHelper.split("10.10.10.10:400", ":")
        assert.equal('10.10.10.10', ret[0], 'ip address is 10.10.10.10')
        assert.equal('400', ret[1], 'port is 400')
    });
    it('should correctly split on every character when delimiter is empty', function () {
        ret = HandlebarHelper.split("10.10.10.10:400", "")
        assert.equal(15, ret.length, 'should split on every character')
    });
    it('should not correctly split when delimiter is not string or data is not string', function () {
        ret = HandlebarHelper.split("10.10.10.10:400", 10)
        assert.equal(1, ret.length, 'there is no split')
        ret = HandlebarHelper.split(1000, "")
        assert.equal(1, ret.length, 'there is no split')
    });
    it('should not correctly split when delimiter is undefined', function () {
        ret = HandlebarHelper.split("10.10.10.10:400", undefined)
        assert.equal(1, ret.length, 'there is no split')
        ret = HandlebarHelper.split(undefined, ":")
        assert.equal(1, ret.length, 'there is no split')
    });
    it('should say that true and true is true', function () {
        ret = HandlebarHelper.and(true, true)
        assert.equal(true, ret, "and returns true when passed in true and true")
    });
    it('should say that true and false is false', function () {
        ret = HandlebarHelper.and(true, false)
        assert.equal(false, ret, "and returns false when passed in true and false")
    });
    it('should say that true or true is true', function () {
        ret = HandlebarHelper.or(true, true)
        assert.equal(true, ret, "or returns true when passed in true and true")
    });
    it('should say that true or false is true', function () {
        ret = HandlebarHelper.or(true, false)
        assert.equal(true, ret, "or returns true when passed in true and false")
    });
    it('should say that false or false is false', function () {
        ret = HandlebarHelper.or(false, false)
        assert.equal(false, ret, "or returns false when passed in false and false")
    });
    it('should assign value correctly', function () {
        var data = 'key'
        var options = []
        ret = HandlebarHelper.assign(data, 'what', options)
        assert.equal(options.data.root[data], 'what', "assign works correctly")
    });
    it('should correctly divide 30 / 6', function () {
        ret = HandlebarHelper.divide(30, 6)
        assert.equal(5, ret, '30 divided by 6 and got 5');
    });
    it('should correctly divide 0 / 6', function () {
        ret = HandlebarHelper.divide(0, 6)
        assert.equal(0, ret, '0 divided by 6 and got 0');
    });
    it('should correctly divide 10 / 3 and return 3', function () {
        ret = HandlebarHelper.divide(10, 3)
        assert.equal(3, ret, '10 divided by 3 and got 3');
    });
    it('should correctly divide 12.5 / 3 and return 4', function () {
        ret = HandlebarHelper.divide(12.5, 3)
        assert.equal(4, ret, '12.5 divided by 3 and got 4');
    });
    it('should correctly divide 0.66 / 3 and return 0', function () {
        ret = HandlebarHelper.divide(0.66, 3)
        assert.equal(0, ret, '0.66 divided by 3 and got 0');
    });
    it('should not correctly divide 30 / 0', function () {
        ret = HandlebarHelper.divide(30, 0)
        assert.equal('-1', ret, '30 can not be divided by 0');
    });
    it('should not correctly divide abc / 6', function () {
        ret = HandlebarHelper.divide('abc', 6)
        assert.equal('-1', ret, 'abc not a number and can not be divided by 6');
    });
    it('should not correctly divide 30 / abc', function () {
        ret = HandlebarHelper.divide(30, 'abc')
        assert.equal('-1', ret, '30 can not be divided by abc');
    });
    it('should not add 5 + abc', function () {
        ret = HandlebarHelper.add(5, 'abc')
        assert.equal(0, ret, '5 can not be added to abc');
    });
    it('should not add  abc + 20', function () {
        ret = HandlebarHelper.add('abc', 20)
        assert.equal(0, ret, 'abc can not be added to 20');
    });
    it('should not add  abc + xyz', function () {
        ret = HandlebarHelper.add('abc', 'xyz')
        assert.equal(0, ret, 'abc can not be added to xyz');
    });
    it('should not add  15 + ""', function () {
        ret = HandlebarHelper.add(15, '')
        assert.equal(0, ret, '15 can not be added to ""');
    });
    it('should not add  "" + 101', function () {
        ret = HandlebarHelper.add('',101)
        assert.equal(0, ret, '"" can not be added to 101');
    });
    it('should not add  undefined + 1001', function () {
        ret = HandlebarHelper.add(undefined,1001)
        assert.equal(0, ret, 'undefined can not be added to 1001');
    });
    it('should not add  555 + undefined', function () {
        ret = HandlebarHelper.add(555, undefined)
        assert.equal(0, ret, '555 can not be added to undefined');
    });
    it('should not add  undefined + undefined', function () {
        ret = HandlebarHelper.add(undefined, undefined)
        assert.equal(0, ret, 'undefined can not be added to undefined');
    });
    it('should add 7 + 15', function () {
        ret = HandlebarHelper.add(7, 15)
        assert.equal(22, ret, '7 + 15 = 22');
    });
    it('should add 100 + 2000', function () {
        ret = HandlebarHelper.add(100, 2000)
        assert.equal(2100, ret, '100 + 2000 = 2100');
    });
    it('should add 65.20 + 10', function () {
        ret = HandlebarHelper.add(65.20, 10)
        assert.equal(75.20, ret, '65.20 + 10 = 75.20');
    });
    it('should add 65.20 + 105.35', function () {
        ret = HandlebarHelper.add(65.20, 105.35)
        assert.equal(170.55, ret, '65.20 + 105.35 = 170.55');
    });
    it('should add 3 + 0', function () {
        ret = HandlebarHelper.add(3, 0)
        assert.equal(3, ret, '3 + 0 = 3');
    });
    it('should add 0 + 9', function () {
        ret = HandlebarHelper.add(0, 9)
        assert.equal(9, ret, '0 + 9 = 9');
    });
});
