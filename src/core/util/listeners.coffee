
callListeners = (listeners,target)->
  listener(target) for listener in listeners

onCreateActorListeners=[]
onDestroyActorListeners=[]
onCreateDriverListeners=[]
onDestroyDriverListeners=[]


module.exports = {
  addOnCreateActor:(listener)->onCreateActorListeners.push(listener)
  addOnDestroyActor:(listener)->onDestroyActorListeners.push(listener)
  addOnCreateDriver:(listener)->onCreateDriverListeners.push(listener)
  addOnDestroyDriver:(listener)->onDestroyDriverListeners.push(listener)
  actorCreated:(actor)-> callListeners(onCreateActorListeners,actor)
  actorDestroyed:(actor)-> callListeners(onDestroyActorListeners,actor)
  driverCreated:(driver)-> callListeners(onCreateDriverListeners,driver)
  driverDestroyed:(driver)-> callListeners(onDestroyDriverListeners,driver)
}
