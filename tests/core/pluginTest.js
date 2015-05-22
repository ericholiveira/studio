Studio = require('../../compiled/core/studio');

describe("An plugin", function () {
	it("should receive actor creation event", function (done) {
    var creationTest = true;
    var ACTOR_ID = 'pluginActorCreation';
    Studio.use(function pluginActorCreation(opt){
      opt.listenTo.onCreateActor(function(actor){
        if(creationTest){
          creationTest = false;
          expect(actor.id).toBe(ACTOR_ID);
          done();
        }
      });
    });
    new Studio.Actor({
      id:ACTOR_ID,
      process:function(){}
    });
	});
  it("should receive actor destroy event", function (done) {
    var ACTOR_ID = 'pluginActorDestroy';
    Studio.use(function pluginActorDestroy(opt){
      opt.listenTo.onDestroyActor(function(actor){
        expect(actor.id).toBe(ACTOR_ID);
        done();
      });
    });
    new Studio.Actor({
      id:ACTOR_ID,
      process:function(){}
    }).destroy();
	});
  it("should receive driver creation event", function (done) {
    var creationTest = true;
    var DRIVER_ID = 'pluginDriverCreation';
    Studio.use(function pluginDriverCreation(opt){
      opt.listenTo.onCreateDriver(function(driver){
        if(creationTest){
          creationTest = false;
          expect(driver.id).toBe(DRIVER_ID);
          done();
        }
      });
    });
    new Studio.Driver({
      id:DRIVER_ID,
      parser:function(){}
    });
	});
  it("should receive driver destroy event", function (done) {
    var DRIVER_ID = 'pluginDriverDestroy';
    Studio.use(function pluginDriverDestroy(opt){
      opt.listenTo.onDestroyDriver(function(driver){
        expect(driver.id).toBe(driver.id);
        done();
      });
    });
    new Studio.Driver({
      id:DRIVER_ID,
      parser:function(){}
    }).destroy();
	});
  it("should be able to intercept send", function (done) {
    var ACTOR_ID_1="actor_intercept_send1", ACTOR_ID_2="actor_intercept_send2", preSend = false, postSend = false, messageToActor2='message';
    var actor1=new Studio.Actor({
      id:ACTOR_ID_1,
      process:function(){}
    });
    new Studio.Actor({
      id:ACTOR_ID_2,
      process:function(message){return message;}
    });
    Studio.use(function interceptSend(opt){
      opt.interceptSend(function(callSend){
        return function(sender,receiver,message,headers){
          preSend = true;
          return callSend(sender,receiver,message,headers).then(function(result){
            postSend = true;
            return result;
          });
        };
      });
    });
    actor1.send(ACTOR_ID_2,messageToActor2).then(function(message){
      expect(preSend).toBe(true);
      expect(postSend).toBe(true);
      expect(message).toBe(messageToActor2);
      done();
    });
  });
});
