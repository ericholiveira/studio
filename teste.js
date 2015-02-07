var Studio = require('./compiled/core/studio');
var Actor = Studio.Actor;

var a = new Actor({
  id:'teste',
  process:function(message){
    for(var i=0;i<100000;i++);
    return message;
  }
});

var b = new Actor({
  id:'testePromise',
  process:function(message){
    return Studio.Q.fcall(function(){
      for(var i=0;i<100000;i++);
      return message;
    });
  }
});

var timeTeste = 0;
var timeTestePromise = 0;
var countTime = function(){
  var start = new Date().getTime();
  return a.send(a.id).then(function(){
    var end = new Date().getTime();
    timeTeste += (end-start);
  });
};
var countTimePromise = function(){
  var start = new Date().getTime();
  return a.send(b.id).then(function(){
    var end = new Date().getTime();
    timeTestePromise += (end-start);
  });
};
var i=0;
var promises = [];
for(i=0;i<1000;i++){
  promises.push(countTime());
}
for(i=0;i<1000;i++){
  promises.push(countTimePromise());
}
Studio.Q.all(promises).then(function(){
  console.log('Tempo total teste = '+timeTeste);
  console.log('Tempo total testePromise = '+timeTestePromise);
});
