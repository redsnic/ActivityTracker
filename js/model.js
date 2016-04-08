//Gestione del database

var dbName = "dbTrack";
var dbVersion = "1";
var db;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function (event) {
  console.error("Errore: Impossibile aprire indexedDB", event);
};

request.onsuccess = function (event) {
  console.log("Database aperto correttamente");
  db = event.target.result;
  console.log(db);
};

request.onupgradeneeded = function (event) {
  console.log("onUpgradeNeeded in esecuzione");
  db = event.target.result;
  if (!db.objectStoreNames.contains("dbTrack")) {

        console.log("Creazione dell'objectStore");

        var objectStore = db.createObjectStore("dbTrack", {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex("attività", "attività", {
            unique: false
        });
       
    }
    localStorage.setItem('tempo-ritraccia', 5);
    localStorage.setItem('mail-default', "");
}

function Attività() {
  this.nome = "";
  this.data = "";
  this.oraInizio = "";
  this.oraFine = "";
  this.tempo = "";
  this.note = "";
  this.posizione = "";
}

function ListaTutteLeAttività( inCallback ) {
    if(!db){setTimeout( ListaTutteLeAttività, 300); return;}
    var objectStore = db.transaction("dbTrack").objectStore("dbTrack");
    console.log("Creazione lista delle attività...");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("Attività trovata #" + cursor.value.id + " - " + cursor.value.nome);
            inCallback(null, cursor.value);
            cursor.continue();
        }
    };
}


function SalvaAttività (inAttività, inCallback){
  
  var transaction = db.transaction(["dbTrack"], "readwrite");
  console.log("salvataggio dell'attività");
    
  transaction.complete = function (event) {
    console.log("Finito");
  };
  transaction.onerror = function (event) {
  console.error("Errorore nel salvataggio: ", event);
  inCallback({
        error: event
        }, null);
  }
    var objectStore = transaction.objectStore("dbTrack");

    var request = objectStore.put(inAttività);
    request.onsuccess = function (event) {
        console.log("Attività salvata con id: " + request.result);
        
        inCallback(null, request.result);
    };  
    
  }

function CancellaAttività(inId, inCallback) {
    console.log("Cancellando l'attività #" + inId + " ...");
    var request = db.transaction(["dbTrack"], "readwrite").objectStore("dbTrack").delete(inId);

    request.onsuccess = function (event) {
        console.log("Attività cancellata!");
        inCallback();
    };
}

function CancellaTutto(inCallback) {
    console.log("Cancellando tutte le attività ...");
    var request = db.transaction(["dbTrack"], "readwrite").objectStore("dbTrack").clear();

    request.onsuccess = function (event) {
        console.log("Cancellato!");
        inCallback();
    };
}















