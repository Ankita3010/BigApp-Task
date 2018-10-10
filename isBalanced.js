var isBalanced = (paranthesis) => {
    let length = paranthesis.length;
    let arr = paranthesis.split('');
    var paranMap = new Map();
    paranMap.set('(', ')');
    paranMap.set('{', '}');
    paranMap.set('[', ']');
    let compare =[];

    for(let i = 0 ; i< length; i++){
      if(arr[i] === ')' || arr[i] === '}' || arr[i] === ']'){
        let prev = compare.pop();
        if(!prev){
          return false;
        }
        let val = paranMap.get(prev);
        if(val !== arr[i]){
          return false;
        }
      }
      else {
        compare.push(arr[i]);
      }
    }
    if(compare.length === 0) { return true;}
    return false;
};

module.exports = {isBalanced};
