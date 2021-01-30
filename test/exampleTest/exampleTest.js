/**
 * Check the given object/array/map/set is empty
 * @param {*} _obj 
 */
function isEmpty(_obj) {
    if (Array.isArray(_obj) && _obj.length == 0) return true;
    if (_obj instanceof Set && _obj.size == 0) return true;
    if (_obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}

describe("isEmpty", function() {
    let test1 = [];
    let test2 = {};
    let test3 = [1,2,3];
    let test4 = {id: 3};

    it("check [] is empty", function() {
      assert.equal(isEmpty(test1), true);
    });

    it("check {} is empty", function() {
        assert.equal(isEmpty(test2), true);
    });
  
    it("check [1,2,3] is empty", function() {
        assert.equal(isEmpty(test3), false);
    });

    it("check {id: 3} is empty", function() {
        assert.equal(isEmpty(test4), false);
    });

});