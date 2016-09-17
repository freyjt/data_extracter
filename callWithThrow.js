
//Gain visibility into the call you're trying to make
// Throw if element is not in list
exports.call = function(obj, call, parm_list) {
  if(Object.keys(obj).includes(call) {
    return obj[call](parm_list);
  } else { throw "Illegal Argument Exception"; }
}

