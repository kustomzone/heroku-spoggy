/**
* Custom agent prototype
* @param {String} id
* @constructor
* @extend eve.Agent
*/
function GraphAgent(id, app) {
  // execute super constructor
  eve.Agent.call(this, id);
  this.app = app;
  // connect to all transports configured by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
GraphAgent.prototype = Object.create(eve.Agent.prototype);
GraphAgent.prototype.constructor = GraphAgent;

/**
* Send a greeting to an agent
* @param {String} to
*/
GraphAgent.prototype.sayHello = function(to) {
  this.send(to, 'Hello ' + to + '!');
};

/**
* Handle incoming greetings. This overloads the default receive,
* so we can't use GraphAgent.on(pattern, listener) anymore
* @param {String} from     Id of the sender
* @param {*} message       Received message, a JSON object (often a string)
*/
GraphAgent.prototype.receive = function(from, message) {
  console.log(from + ' said: ' + JSON.stringify(message) );
  this.app.prop1 = message;


  if (typeof message == String && message.indexOf('Hello') === 0) {
    // reply to the greeting
    this.send(from, 'Hi ' + from + ', nice to meet you!');
    this.app.prop1 = message;
  }


  switch(message.type){
    case 'catchTriplet':
    let triplets = message.triplets;
    console.log(triplets)
    this.app.catchTriplet(triplets);
    break;
    case 'exportJson':
    this.app.exportJson();
    break;
    case 'exportTtl':
    this.app.exportTtl();
    break;
    case 'decortiqueFile':
    this.app.decortiqueFile(message.fichier, message.remplaceNetwork);
    break;
    case 'newGraph':
    this.app.newGraph();
    break;
    case 'addToGraph':
    console.log(message.data)
    this.app.addToGraph(message.data);
    break;
    case 'populateVis':
    console.log(message.data)
    this.app.populateVis(message.data);
    break;
    case 'importFromParam':
    console.log(message.params)
    this.app.importFromParam(message.params);
    break;

    default:
    console.log(message);
  }
};
