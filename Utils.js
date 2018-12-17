const Array = {};
Array.getFrom = getFrom;

/* Gets first item from an Array
   where checkValue is the value of the item's attribute value */
function getFrom(attribute, checkValue, list) {
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item[attribute] === checkValue) {
            return item;
        }
    }
    return null;
}

module.exports = {
  Array: Array
};
