require('source-map-support').install()
Actor = require('./core/actor')
router = require('./core/router')

router.registerFilter(/log/g,(message)->
  console.log('FILTER!!!')
  if message.body.message=='Hello World!!!'
    false
  else
    message.body = 'kfkjkdfj'
    message
)
logActor = new Actor({
  id:'log'
  process:(message,sender)->
    console.log(message)
  })


logActor.sendMessage('log',{ message:'Hello World!!!'})
logActor.sendMessage('broadcast',{ message:'broadcast'})
logActor.sendMessage('log',{ message:'Hello World2!!!'})
logActor.sendMessage('log',{ message:'Hello World2!!!'})
