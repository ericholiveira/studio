Studio = require('../../compiled/core/studio');

describe("An actor", function() {
  var ACTOR_1 = 'actor1',
    ACTOR_2 = 'actor2',
    ACTOR_3 = 'actor3',
    ACTOR_4 = 'actor4',
    ACTOR_5 = 'actor5';

  var actor1 = new Studio.Actor({
    id: ACTOR_1,
    process: function(message, sender) {}
  });
  var actor2 = new Studio.Actor({
    id: ACTOR_2,
    process: function(message, sender) {}
  });
  var actor3 = new Studio.Actor({
    id: ACTOR_3,
    process: function(message, sender) {}
  });
  var actor4 = new Studio.Actor({
    id: ACTOR_4,
    process: function(message, sender) {}
  });
  var actor5 = new Studio.Actor({
    id: ACTOR_5,
    process: function(message, sender) {}
  });

  it("should be able to attach routes with array, string and regex",
    function() {
      expect(actor1.actor2).toBeUndefined();
      actor1.attachRoute('actor2');
      expect(actor1.actor2).toBeDefined();
      expect(actor1.actor3).toBeUndefined();
      expect(actor1.actor4).toBeUndefined();
      actor1.attachRoute(['actor3', 'actor4']);
      expect(actor1.actor3).toBeDefined();
      expect(actor1.actor4).toBeDefined();
      expect(actor1.actor1).toBeUndefined();
      expect(actor1.actor5).toBeUndefined();
      actor1.attachRoute(/actor[0-9]/);
      expect(actor1.actor1).toBeDefined();
      expect(actor1.actor5).toBeDefined();
    });

});