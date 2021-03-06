/**
* Custom agent prototype
* @param {String} id
* @constructor
* @extend eve.Agent
*/
function GlobalAgent(id, app) {
  // execute super constructor
  // eve.system.init({transports: [{type: 'local'}]});
  /*eve.system.init({
  transports: [
  {
  type: 'local',
  id: 'myLocalTransport', // optional identifier for the transport
}
]
});*/
eve.Agent.call(this, id);

this.app = app;
// connect to all transports configured by the system
this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
GlobalAgent.prototype = Object.create(eve.Agent.prototype);
GlobalAgent.prototype.constructor = GlobalAgent;

/**
* Send a greeting to an agent
* @param {String} to
*/
GlobalAgent.prototype.sayHello = function(to) {
  this.send(to, 'Hello ' + to + '!');
};

/**
* Handle incoming greetings. This overloads the default receive,
* so we can't use GlobalAgent.on(pattern, listener) anymore
* @param {String} from     Id of the sender
* @param {*} message       Received message, a JSON object (often a string)
*/
GlobalAgent.prototype.receive = function(from, message) {
  console.log(from + ' said: ' + JSON.stringify(message) );
  this.app.prop1 = message;


  if (typeof message == String && message.indexOf('Hello') === 0) {
    // reply to the greeting
    this.send(from, 'Hi ' + from + ', nice to meet you!');
    this.app.prop1 = message;
  }

  switch(message.type){
    case 'recherche':
    console.log(message)
    this.app.lanceRecherche(message)
    break;
    case 'show':
    //    this.agentRecherche.send('agentEndpoints', {type: 'show', element: 'endpointsList' });
    var el = message.element;
    var element = this.app.$[el];
    this.app.showEndpointsList(element);
    break;
    case 'hide':
    //    this.agentRecherche.send('agentEndpoints', {type: 'show', element: 'endpointsList' });
    var el = message.element;
    var element = this.app.$[el];
    this.app.hideEndpointsList(element);
    break;
    case 'updateEndpointData':
    //    app.agentFuseki.send('agentGlobal', {type: "updateEndpointData", ping: this.status})
    console.log(message)
    if(message.error != undefined){this.app.error = message.error;}else if(message.ping != undefined){this.app.ping = message.ping;}
    if(message.server != undefined && message.server.datasets != undefined){this.app.datasets = message.server.datasets;}
    if(message.server != undefined && message.server.dataset != undefined){this.app.selected = message.server.selected;}

    break;
    default:
    console.log(message);
  }

};
