module.exports = (length)=>{
  key='';
  while (length > 0) {
    key += Math.random()>0.5 ? String.fromCharCode(65+parseInt(Math.random()*25)) : String.fromCharCode(97+parseInt(Math.random()*25));
    length-=1;
  }
  return key;
};
