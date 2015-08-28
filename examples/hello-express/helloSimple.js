/**
 * Created by ericholiveira on 28/08/15.
 */
var Studio = require('../../compiled/core/studio'); //Studio namespace
var app = require('./app');
app.get('/simple', Studio.driverFactory(function(to,req,res){
    to({
        sender: 'expressDriver',
        receiver: 'helloActor',
        body: null,
        headers: null
    }).then(res.send.bind(res)).catch(function(message){
        res.send('Sorry, try again later => ' + message);
    });
}));

