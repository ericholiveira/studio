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
    function(done) {
      var mappedRoutes = actor1.mapRoute(ACTOR_2);
      expect(mappedRoutes.actor2).toBeDefined();
      expect(mappedRoutes.actor3).toBeUndefined();
      expect(mappedRoutes.actor4).toBeUndefined();
      mappedRoutes = actor1.mapRoute([ACTOR_3, ACTOR_4]);
      expect(mappedRoutes.actor3).toBeDefined();
      expect(mappedRoutes.actor4).toBeDefined();
      expect(mappedRoutes.actor1).toBeUndefined();
      expect(mappedRoutes.actor5).toBeUndefined();
      mappedRoutes = actor1.mapRoute(/actor[0-9]/g);
      expect(mappedRoutes.actor1).toBeDefined();
      expect(mappedRoutes.actor5).toBeDefined();
      mappedRoutes.actor5({}).then(done);
    });

});
