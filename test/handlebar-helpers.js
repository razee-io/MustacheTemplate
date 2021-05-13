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
        assert.equal(-1, ret, '5 can not be added to abc');
    });
    it('should not add  abc + 20', function () {
        ret = HandlebarHelper.add('abc', 20)
        assert.equal(-1, ret, 'abc can not be added to 20');
    });
    it('should not add  abc + xyz', function () {
        ret = HandlebarHelper.add('abc', 'xyz')
        assert.equal(-1, ret, 'abc can not be added to xyz');
    });
    it('should not add  15 + ""', function () {
        ret = HandlebarHelper.add(15, '')
        assert.equal(-1, ret, '15 can not be added to ""');
    });
    it('should not add  "" + 101', function () {
        ret = HandlebarHelper.add('',101)
        assert.equal(-1, ret, '"" can not be added to 101');
    });
    it('should not add  undefined + 1001', function () {
        ret = HandlebarHelper.add(undefined,1001)
        assert.equal(-1, ret, 'undefined can not be added to 1001');
    });
    it('should not add  555 + undefined', function () {
        ret = HandlebarHelper.add(555, undefined)
        assert.equal(-1, ret, '555 can not be added to undefined');
    });
    it('should not add  undefined + undefined', function () {
        ret = HandlebarHelper.add(undefined, undefined)
        assert.equal(-1, ret, 'undefined can not be added to undefined');
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
    it('should add 0 + 0', function () {
        ret = HandlebarHelper.add(0, 0)
        assert.equal(0, ret, '0 + 0 = 0');
    });
    it('should add -20 + 20', function () {
        ret = HandlebarHelper.add(-20, 20)
        assert.equal(0, ret, '-20 + 20 = 0');
    });
    it('should add 19 + -20', function () {
        ret = HandlebarHelper.add(19, -20)
        assert.equal(-1, ret, '19 + -20 = -1');
    });
    //--- substring() tests
    it('should return undefined when all inputs are undefined', function () {
        ret = HandlebarHelper.substring(undefined,undefined,undefined)
        assert.equal(undefined, ret, 'unable to get substring for undefined inputs');
    });
    it('should return undefined when input string is undefined', function () {
        ret = HandlebarHelper.substring(undefined,3,9)
        assert.equal(undefined, ret, 'unable to get substring from undefined input string');
    });
    it('should return the input string when startIndex and endIndex are undefined', function () {
        ret = HandlebarHelper.substring('hello-world!',undefined,undefined)
        assert.equal('hello-world!', ret, 'substring is "hello-world!"');
    });
    it('should return substring, when endIndex is undefined', function () {
        ret = HandlebarHelper.substring('hello-world!',5)
        assert.equal('-world!', ret, 'substring is "-world!"');
    });
    it('should return substring, when a valid input string and indexes are provided', function () {
        ret = HandlebarHelper.substring('hello-world!',0,7)
        assert.equal('hello-w', ret, 'substring is "hello-w"');
    });
    it('should return substring, when: (0 < startIndex < data.length) and (startIndex < endIndex < data.length)', function () {
        ret = HandlebarHelper.substring('hello-world!',2,8)
        assert.equal('llo-wo', ret, 'substring is "llo-wo"');
    });
    it('should return substring, swapping the values of startIndex and endIndex when startIndex > endIndex', function () {
        ret = HandlebarHelper.substring('hello-world!',11,5)
        assert.equal('-world', ret, 'substring is "-world"');
    });
    it('should return substring, when endIndex > data.length', function () {
        ret = HandlebarHelper.substring('hello-world!',7,25)
        assert.equal('orld!', ret, 'substring is "orld!"');
    });
    it('should return substring, when startIndex < 0', function () {
        ret = HandlebarHelper.substring('hello-world!',-100,6)
        assert.equal('hello-', ret, 'substring is "hello-"');
    });
    it('should return an empty string as substring, when startIndex = endIndex', function () {
        ret = HandlebarHelper.substring('hello-world!',2,2)
        assert.equal('', ret, 'substring is an empty string');
    });
    it('should return the whole input string as substring, when startIndex < 0 and endIndex > str.length', function () {
        ret = HandlebarHelper.substring('hello-world!',-100,500)
        assert.equal('hello-world!', ret, 'substring is "hello-world!"');
    });
    //--- includes() tests
    it('should return false when all inputs are undefined', function () {
        ret = HandlebarHelper.includes(undefined,undefined,undefined)
        assert.equal(false, ret, 'includes returns false for undefined inputs');
    });
    it('should return false when valueToFind and indexFrom are undefined', function () {
        ret = HandlebarHelper.includes(["ca","eu","eq","us"],undefined,undefined)
        assert.equal(false, ret, 'includes returns false when valueToFind and indexFrom are undefined');
    });
    it('should return true when valueToFind is in string array and indexFrom is undefined', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'ca',undefined)
        assert.equal(true, ret, 'ca in ["ca","eu","eq","us"]');
    });
    it('should return true when inputs are all valid values and valueToFind is in string array', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'ca',0)
        assert.equal(true, ret, 'ca in ["ca","eu","eq","us"]');
    });
    it('should return true when inputs are all valid values and valueToFind is in string array', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'us',0)
        assert.equal(true, ret, 'us in ["ca","eu","eq","us"]');
    });
    it('should return false when valueToFind letter case is uppercase', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'CA',0)
        assert.equal(false, ret, 'CA not in ["ca","eu","eq","us"]');
    });
    it('should return false when valueToFind letter case has a mix of lowercase and uppercase letters', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'cA',0)
        assert.equal(false, ret, 'cA not in ["ca","eu","eq","us"]');
    });
    it('should return false when valueToFind is in string array but its position in array is < indexFrom', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'ca',1)
        assert.equal(false, ret, 'ca not in ["ca","eu","eq","us"] if when indexFrom = 1');
    });
    it('should return true when valueToFind is in string array and indexFrom < 0', function () {
        ret = HandlebarHelper.includes(['ca','eu','eq','us'],'ca',-4)
        assert.equal(true, ret, 'ca in ["ca","eu","eq","us"] when indexFrom < 0');
    });
    it('should return false when string array is empty', function () {
        ret = HandlebarHelper.includes([],'us',0)
        assert.equal(false, ret, 'us not in []');
    });
    it('should return false when valueToFind and indexFrom are undefined', function () {
        ret = HandlebarHelper.includes([3,4,50,100],undefined,undefined)
        assert.equal(false, ret, 'includes returns false when valueToFind and indexFrom are undefined');
    });
    it('should return true when valueToFind is in numeric array and indexFrom is undefined', function () {
        ret = HandlebarHelper.includes([3,4,50,100],4,undefined)
        assert.equal(true, ret, '4 in [3,4,50,100]');
    });
    it('should return true when inputs are all valid values and valueToFind is in numeric array', function () {
        ret = HandlebarHelper.includes([3,4,50,100],3,0)
        assert.equal(true, ret, '3 in [3,4,50,100]');
    });
    it('should return true when all inputs are valid values and valueToFind is in numeric array', function () {
        ret = HandlebarHelper.includes([1000,0,235,65,5],235,0)
        assert.equal(true, ret, '235 in [1000,0,235,65,5]');
    });
    it('should return true when all inputs are valid values and valueToFind is in numeric array', function () {
        ret = HandlebarHelper.includes([1000,0,235,65,5],5,0)
        assert.equal(true, ret, '5 in [1000,0,235,65,5]');
    });
    it('should return false when valueToFind is not in numeric array', function () {
        ret = HandlebarHelper.includes([1000,0,235,65,78],77,0)
        assert.equal(false, ret, '77 not in [1000,0,235,65,78]');
    });
    it('should return false when valueToFind is in numeric array but its position in array is < indexFrom', function () {
        ret = HandlebarHelper.includes([3,4,50,100],4,2)
        assert.equal(false, ret, '4 not in [3,4,50,100] when indexFrom = 2');
    });
    it('should return true when valueToFind is in numeric array and indexFrom < 0', function () {
        ret = HandlebarHelper.includes([3,4,50,100],3,-4)
        assert.equal(true, ret, '3 in [3,4,50,100] when indexFrom < 0');
    });
    it('should return false when numeric array is empty', function () {
        ret = HandlebarHelper.includes([],250,0)
        assert.equal(false, ret, '250 not in []');
    });
    it('should return false when valueToFind in arr AND indexFrom = arr.length', function () {
        ret = HandlebarHelper.includes([11,35,80,120],80,4)
        assert.equal(false, ret, '80 in [11,35,80,120] but indexFrom = arr.length');
    });
    it('should return false when valueToFind in arr AND indexFrom > arr.length', function () {
        ret = HandlebarHelper.includes([11,35,80,120],11,5)
        assert.equal(false, ret, '11 in [11,35,80,120] but indexFrom > arr.length');
    });
    it('should calculate the sha256 hash', function() {
        ret = HandlebarHelper.sha256('message')
        assert.equal(ret, 'ab530a13e45914982b79f9b7e3fba994cfd1f3fb22f71cea1afbf02b460c6d1d', 'sha256 of word message')
    });
    it('should check the input for sha256 hash', function() {
        ret = HandlebarHelper.sha256(356)
        assert.equal(ret, '', 'sha256 of integer is not calculated')
    });
    //--- concat() tests
    it('should return concatenate string when array has only 1 string', function () {
        ret = HandlebarHelper.concat(['Hello'])
        assert.equal('Hello', ret, 'concat string is "Hello"');
    });
    it('should return concatenate string when array has 2 strings', function () {
        ret = HandlebarHelper.concat(['Hello ','World'])
        assert.equal('Hello World', ret, 'concat string is "Hello World"');
    });
    it('should return concatenate string when array has 3 strings', function () {
        ret = HandlebarHelper.concat(['Hello ','World ','!!'])
        assert.equal('Hello World !!', ret, 'concat string is "Hello World !!"');
    });
    it('should not throw error when 0 inputs are passed in array', function () {
        ret = HandlebarHelper.concat([])
        assert.equal('', ret, 'empty array');
    });
    it('should concatenate and return string when non strings are passed in array', function () {
        ret = HandlebarHelper.concat(['Hello ', 123, ' ', true])
        assert.equal('Hello 123 true', ret, 'concat string is "Hello 123 true"');
    });
    it('should return concatenate string when params have only 1 string', function () {
        ret = HandlebarHelper.concat('Hello')
        assert.equal('Hello', ret, 'concat string is "Hello"');
    });
    it('should return concatenate string when params have 2 strings', function () {
        ret = HandlebarHelper.concat('Hello ','World')
        assert.equal('Hello World', ret, 'concat string is "Hello World"');
    });
    it('should return concatenate string when params have 3 strings', function () {
        ret = HandlebarHelper.concat('Hello ','World ','!!')
        assert.equal('Hello World !!', ret, 'concat string is "Hello World !!"');
    });
    it('should not throw error when 0 params are passed in', function () {
        ret = HandlebarHelper.concat()
        assert.equal('', ret, 'empty params');
    });
    it('should concatenate and return string when a non strings are passed in params', function () {
        ret = HandlebarHelper.concat('Hello ', 123, ' ', true)
        assert.equal('Hello 123 true', ret, 'concat string is "Hello 123 true"');
    });
});
