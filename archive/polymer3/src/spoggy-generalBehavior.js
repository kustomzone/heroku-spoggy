//inspire de node_modules/@polymer/lib/utils/async.js

import './js/rdf-ext-all-latest.js';
import * as lg from './spoggy-levelgraphBehavior.js';
import * as vis from './spoggy-visBehavior.js';

let app;
let db;
let network;



export const graph = {
  init(_app,   container, callback){
    app = _app;
    console.log("init rdf-ext");
    //  let test = rdf.namedNode("RDF-EXT ok")
    //  console.log(test);
    console.log("init vis");
    //  vis.graph.init( this, container, this._graphOk);
    network =   vis.graph.init( app, container, callback);
    console.log("init levelgraph");
    //  lg.base.init("spoggy", this._baseOk);
    db = lg.base.init("spoggy");
    //  console.log(db);
    var stream = db.getStream({ });

    stream.on("data", function(data) {
      console.log(data);
      var visTriplet = transform.level_to_Vis_Triplet(data);
      if (visTriplet.node != undefined){
        action.addNodeToVis(visTriplet.node);
      }
      if (visTriplet.edge != undefined){
        action.addEdgeToVis(visTriplet.edge);
      }
    });
    //  console.log("init sparql");
    //  console.log("init socket");
  }
};

export const action = {
  addNodeToVis(data){
    // a fusionnner avec addnode, mais pb du callback
    //  console.log("add node to vis");
    //  console.log(data);
    var existVisNode = false;
    existVisNode = network.body.data.nodes.get({
      filter: function(node){
        //    console.log(node);
        return (node.id == data.id || node.label == data.label);
      }
    });
    //  console.log(existVisNode);
    try{
      if (existVisNode.length == 0){
        //  console.log("n'existe pas")
        network.body.data.nodes.add(data);

      }else{
        //    console.log("existe")
        //s'il existe déjà, ne serait-ce pas un renommage ?
        //  console.log("renomme");
        //  console.log(data);
        //existNode[0].label = data.label;
        //  editNode(data, null);
        //  console.log(network.body.data.nodes);
        delete data.x;
        delete data.y
        network.body.data.nodes.update(data);
      }
    }
    catch (err){
      console.log(err);
    }
  },

  addEdgeToVis(data){
    // a fusionner avec addedge, mais pb de callback
    //  console.log("add edge to vis");
    //  console.log(data);
    var existEdge = false;
    var voisins = [];
    //console.log(network);

    //  console.log("verification dans les differents stores accessibles pour savoir si un edge identique ou voisins existe");
    //  console.log("test vis Edge");
    try {
      existEdge = network.body.data.edges.get({
        filter: function(edge){
          if (data[0] != undefined){ // parfois edges.get retourne un tableau, parfois directement l'objet
          return (edge.id == data[0].id);
        }
        else{
          return (  edge.id == data.id);
        }
      }
    });
    //  console.log(existEdge);
    if (existEdge.length == 0){
      if (data[0] != undefined){ // parfois edges.get retourne un tableau, parfois directement l'objet
      network.body.data.edges.add(data[0]);
    }
    else{
      network.body.data.edges.add(data);
    }
  }else{
    //s'il existe déjà, ne serait-ce pas un renommage ?
    //  console.log("renomme");
    //  console.log(data);
    //existNode[0].label = data.label;
    //  editNode(data, null);
    //    console.log(network.body.data.edges);
    if (data[0] != undefined){ // parfois edges.get retourne un tableau, parfois directement l'objet
    network.body.data.edges.update({id: data[0].id, label: data[0].label});
  }
  else{
    network.body.data.edges.update({id: data.id, label: data.label});
  }
  //  console.log(network.body.data.edges);
}
}
catch (err) {
  console.log(err);
}
},
addNode(data, callback){
  console.log(data);
  let dataVis;
  let dataLevel;
  var nodeCree;
  if (data.format = "vis"){
    dataVis = data;
    dataLevel = transform.vis_To_Level_Node(data);
  }else{
    dataVis = transform.Level_To_Vis_Node(data);
    dataLevel= data;
  }
  let nodeInVis = test.nodeInVis(dataVis);
  let nodeInLevel = test.nodeInLevel(dataLevel);


  if (nodeInVis.length == 0){
    console.log("node VIS n'existe pas");
    nodeCree = callback(data);
    console.log(nodeCree);
  }else{
    console.log("node VIS existe");
    nodeCree = nodeInVis[0];
    network.body.data.nodes.update(data);
    action.nodeUpdateInLevel(data, nodeInVis[0]);
    callback(data);
    console.log(nodeCree);
  }

},
addEdge (data, callback){
  console.log(data);
  let dataVis;
  let dataLevel;
  var edgeCree;
  if (data.format = "vis"){
    dataVis = data;
    dataLevel = transform.vis_To_Level_Edge(data);
  }else{
    dataVis = transform.level_To_Vis_Edge(data);
    dataLevel = data;
  }
  let edgeInVis = test.edgeInVis(dataVis);
  let edgeInLevel = test.edgeInLevel(dataLevel);
  console.log(edgeInVis);
  if (edgeInVis.length == 0){
    console.log("edge VIS n'existe pas");
    edgeCree = callback(data);
    console.log(edgeCree);
  }else{
    console.log("edge VIS existe");
    edgeCree = edgeInVis[0];
    console.log(edgeCree);
  }
  //    callback(data);
},
nodeUpdateInLevel(data, old){
  console.log("DEBUT UPDATE");
  console.log(data);
  console.log(old);
  db.get({subject: old.id, predicate: "label"}, function(err, list) {
    console.log(list);
    db.del(list, function(err) {
      db.get({subject: old.id, predicate: "label"}, function(err, list2) {
        console.log(list2);
      });
    });
  });
  let dataVis;
  let dataLevel;
  if (data.format = "vis"){
    dataVis = data;
    dataLevel = transform.vis_To_Level_Node(data);
  }else{
    dataVis = transform.rdf_To_Level_Node(data);
    dataLevel = data;
  }
 let newNode = test.nodeInLevel(dataLevel);
  console.log(newNode);
  console.log("CA MARCHE TOUT SEUL, l'update ? SAns supprimer l'ancien ? à revoir");
},
delete(data, callback){
  console.log(data);

  var node = data.nodes[0];
  // suppression du noeud en subject ou en object
  db.get({subject: node}, function(err, list) {
    console.log(list);
    db.del(list, function(err) {
      db.get({}, function(err, list2) {
        console.log(list2);
      });
    });
  });
  db.get({object: node}, function(err, list) {
    console.log(list);
    db.del(list, function(err) {
      db.get({}, function(err, list2) {
        console.log(list2);
      });
    });
  });

  //supprime dans vis
  callback(data);

}

};
export const test = {
  nodeInVis(data){
    let existVisNode = false;
    existVisNode = network.body.data.nodes.get({
      filter: function(node){
        return (node.id == data.id || node.label == data.label);
      }
    });
    console.log(existVisNode);
    return existVisNode;
  },
  nodeInLevel (data){
    console.log("test node in level");
    console.log(data);
    db.get({predicate: data.predicate, object:data.object}, function(err, list) {
      //  db.get({  }, function(err, list) {

      if(list.length == 0){
        console.log("ecriture level Node");
        console.log(data);
        db.put({subject: data.subject, predicate: data.predicate, object: data.object, graph: data.graph, type: "node"});
        //  lg.base.putNode(data, function(){console.log(data.id+"->"+data.label+" : ajouté à LEVEL");});
      }else{
        console.log("Level Node existe déjà");
        console.log(list);
      }
    });

  },
  edgeInVis(data){
    var existEdge = false;
    var voisins = [];
    //console.log(network);

    console.log("verification dans les differents stores accessibles pour savoir si un edge identique ou voisins existe");
    console.log("test vis Edge");
    console.log(data);
    existEdge = network.body.data.edges.get({
      filter: function(edge){
        if (data[0] != undefined){ // parfois edges.get retourne un tableau, parfois directement l'objet
        //  return (edge.id == data[0].id);
        return ((edge.id == data[0].id) || (edge.from == data[0].from && edge.to == data[0].to && edge.label == data[0].label));
      }
      else{
        return ( (edge.id == data.id) ||  (edge.from == data.from && edge.to == data.to && edge.label == data.label));
      }
    }
  });
  console.log(existEdge);
  return existEdge;

},
edgeInLevel(data){
  console.log("test edge in level");
  console.log(data);
  db.get({subject:data.subject, predicate: data.predicate, object: data.object}, function(err, list) {
    //  db.get({  }, function(err, list) {
    console.log(list)
    if(list.length == 0){
      console.log("ecriture level Edge");
      db.put(data);
      console.log(data);
      db.put({subject: data.subject, predicate: data.predicate, object: data.object, graph: data.graph, type: "edge"});
      //  lg.base.putEdge(data, function(){console.log(data.from+"->"+data.label+" "+data.to+" : ajouté à LEVEL");});
    }else{
      console.log("Level Edge existe déjà");
      console.log(list);
    }
  })

}
};

export const transform = {
  level_to_Vis_Triplet(triplet){
    let result = {};
    if (triplet.type == "node"){

      let node = {};
      node.id = triplet.subject;
      node.label = triplet.object;
      result.node = node;
    }
    else{
      //  console.log("triplet de type edge");
      let edge = {};
      edge.from = triplet.subject;
      edge.label = triplet.predicate;
      edge.to = triplet.object;
      result.edge = edge;
    }
    //  console.log(result);
    return result;
  },
  vis_To_Level_Node(node){
    //  let triple = rdf.triple(rdf.blankNode(node.id), rdf.namedNode("label"), rdf.literal(node.label)); //,this.language
    let triple = {subject: node.id, predicate: "label", object: node.label}
    console.log(triple);
    return triple;
  },
  vis_To_Level_Edge(edge){
    //  let triple = rdf.triple(rdf.namedNode(edge.from), rdf.namedNode(edge.label), rdf.namedNode(edge.to));
    let triple = {subject: edge.from, predicate: edge.label, object: edge.to}
    console.log(triple);
    return triple;
  },
}
