var AttivitàCorrente;
var AttivitàInCorso;
var stop;
 
//Prompt
document.querySelector('#btn-fin-att').addEventListener ('click', function () {
       if (document.getElementById('bot-new-att').disabled){              //verifica se è in registrazione un'attività
             document.querySelector('#fin-att').className = 'fade-in';
       }
});

document.querySelector('#btn-salva-impostazioni').addEventListener ('click', function () {
  if (document.getElementById('intervallo') != undefined ){
            localStorage.setItem('tempo-ritraccia', document.getElementById('intervallo').value);
  }
  localStorage.setItem('mail-default', document.getElementById('destinatario-default').value);
  document.getElementById('destinatario').value = localStorage.getItem('mail-default');
  utils.status.show('impostazioni salvate');
});


document.querySelector('#btn-erase').addEventListener ('click', function () {
  document.querySelector('#erase').className = 'fade-in';
});

document.querySelector('#btn-erase-att').addEventListener ('click', function () {
  document.querySelector('#erase-att').className = 'fade-in';
});

document.querySelector('#no-stop').addEventListener ('click', function () {
  document.querySelector('#fin-att').className = 'fade-out';
});

document.querySelector('#ok-stop').addEventListener ('click', function () {
  document.querySelector('#fin-att').className = 'fade-out';
  clearInterval(stop);
  ConcludiAttività();
});
 
document.querySelector('#no-erase').addEventListener ('click', function () {
   document.querySelector('#erase').className = 'fade-out';
});
//e-mail
document.querySelector('#e-mail').addEventListener ('click', function () {
  try{
  InvioMail();
  document.getElementById('testo').value = "Mail di riepilogo generata automaticamente da ActivityTracker";
  }catch (e){
    window.location.href = "mailto:"+ document.getElementById('destinatario').value +"?body=" + encodeURIComponent(document.getElementById('testo').value) + "&subject=" + encodeURIComponent('Riepilogo CRI Tracker');
    document.getElementById('testo').value = "Mail di riepilogo generata automaticamente da ActivityTracker";
  }
  document.querySelector('#mail-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-mappa').addEventListener ('click', function () {
    if ((AttivitàCorrente.posizione != "|") && (AttivitàCorrente.posizione != "") && (AttivitàCorrente.posizione != undefined)){
             PreparaMappa();
             document.querySelector('#mappa').className = 'current';
             document.querySelector('[data-position="current"]').className = 'left';
    }
    else { utils.status.show('Nessuna posizione tracciata per questa attività'); }
});

document.querySelector('#btn-mappa-back').addEventListener ('click', function () {
  document.querySelector('#mappa').className = 'right';
  document.querySelector('[data-position="current"]').className = 'left';
});


function InvioMail() {
  
    var AutomaticoMsg = document.getElementById('testo').value;
    console.log( document.getElementById('testo').value );
    var shareActivity = new MozActivity({
        name: "new",
        data: {
            type: "mail",
            body: document.getElementById('testo').value,
            url: "mailto:"+ document.getElementById('destinatario').value +"?body=" + encodeURIComponent(AutomaticoMsg) + "&subject=" + encodeURIComponent('Riepilogo CRI Tracker')
        }
    });
    shareActivity.onerror = function (e) {
        console.log("Errore e-mail", e);
    };
}

//BACK
document.querySelector('#btn-reg-att-back').addEventListener ('click', function () {
  document.querySelector('#reg-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-rie-att-back').addEventListener ('click', function () {
  document.querySelector('#rie-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-dettagli-back').addEventListener ('click', function () {
  document.querySelector('#Dettagli').className = 'right';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-settings-back').addEventListener ('click', function () {
  document.querySelector('#settings').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-mail-att-back').addEventListener ('click', function () {
  document.querySelector('#mail-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
  document.getElementById('testo').value = "Mail di riepilogo generata automaticamente da Cri Tracker";
});

document.querySelector('#btn-new-att-back').addEventListener ('click', function () {
  document.querySelector('#new-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

//CANCEL
document.querySelector('#btn-cancel-reg-att').addEventListener ('click', function () {
  document.querySelector('#reg-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-cancel-new-att').addEventListener ('click', function () {
  document.querySelector('#new-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-cancel-mail-att').addEventListener ('click', function () {
  document.querySelector('#mail-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
  document.getElementById('testo').value = "Mail di riepilogo generata automaticamente da ActivityTracker";
});

document.querySelector('#btn-cancel-settings').addEventListener ('click', function () {
  document.querySelector('#settings').className = 'right'; 
  document.querySelector('[data-position="current"]').className = 'current';
});


//MAIN BTN
document.querySelector('#btn-reg-att').addEventListener ('click', function () {
  document.querySelector('#reg-att').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-rie-att').addEventListener ('click', function () {
  AggiornaListaAttività();
  document.querySelector('#rie-att').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
  
});

document.querySelector('#btn-new-att').addEventListener ('click', function () {
   if (!document.getElementById('bot-new-att').disabled){                         //verifica se è in registrazione un'attività
             document.querySelector('#new-att').className = 'current';
             document.querySelector('[data-position="current"]').className = 'left';
   }
      
});

document.querySelector('#btn-mail-att').addEventListener ('click', function () {
  document.getElementById('testo').value = document.getElementById('testo').value + '\n' + '\n' + " Nome | Giorno | Inizio | Fine | Tempo | Note  " + '\n' ;
  ListaTutteLeAttività( function (err, value) {      
     var TestoAttività = (" " + value.nome + " | " + value.data +   " | " + value.oraInizio  + "  | " + value.oraFine + "  |  " + value.tempo + "h" + "  | Note: " + value.note + "");
     document.getElementById('testo').value = document.getElementById('testo').value + '\n' + TestoAttività;
       
  });
  document.querySelector('#mail-att').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#btn-settings').addEventListener ('click', function () {
  document.querySelector('#settings').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});
  
//Avvio registrazione attività TODO
document.querySelector('#btn-save-new-att').addEventListener ('click', function () {
  PreparaAttività();
  document.querySelector('#new-att').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

//CODICE

document.querySelector('#ok-erase').addEventListener ('click', function () {
  CancellaTutto(function (err, succ) {
        console.log("callback cancellazione", err, succ);
        if (!err) {
            AggiornaListaAttività();
            utils.status.show('Tutte le attività sono state cancellate');
            console.log("OK");
        }
    });
  
   document.querySelector('#erase').className = 'fade-out';
    document.querySelector('#settings').className = 'right'; 
   document.querySelector('[data-position="current"]').className = 'current';

});

//Cancella la singola attività
document.querySelector('#no-erase-att').addEventListener ('click', function () {
  document.querySelector('#erase-att').className = 'fade-out';
});
document.querySelector('#ok-erase-att').addEventListener ('click', function () {
   CancellaAttività(AttivitàCorrente.id, function (err, succ) {
        console.log("callback cancellazione", err, succ);
        if (!err) {
            AggiornaListaAttività();
            utils.status.show('Attività cancellata');
            console.log("OK");
        }
    });
   document.querySelector('#erase-att').className = 'fade-out';
    document.querySelector('#Dettagli').className = 'right';
   document.querySelector('[data-position="current"]').className = 'left';

});


//Gestione ListaAttività
function AggiornaListaAttività(){
  
        console.log("Refresh ListaAttività");
        var ContainerListaAttività = document.getElementById("ListaAttività");
  
        while (ContainerListaAttività.hasChildNodes()) {
            ContainerListaAttività.removeChild(ContainerListaAttività.lastChild);
        }
  
     ListaTutteLeAttività( function (err, value) {
        var ItemAttività = document.createElement("li");
        var ParagrafoAttività = document.createElement("p");  
        var TestoAttività = document.createTextNode(value.nome + " | " + value.data + " | " + value.tempo + "h");
      
        ItemAttività.addEventListener("click", function (e) {
            console.log("Apertura dettagli attività: #" + value.id);
            MostraDettagliAttività(value); 
            
           document.querySelector('#Dettagli').className = 'current';
            document.querySelector('[data-position="current"]').className = 'left';
        });
  
  

        ParagrafoAttività.appendChild(TestoAttività);
        ItemAttività.appendChild(ParagrafoAttività);
        ListaAttività.appendChild(ItemAttività);


    });

}

function PreparaAttività(){
   var date = new Date(); 
   var day = date.getDate();
   var month = date.getMonth()+1;
   var year = date.getFullYear();
   var hour = date.getHours();
   var minute = date.getMinutes();
   var sday = date.getDate();
   var smonth = date.getMonth()+1;
   var syear = date.getFullYear();
   var shour = date.getHours();
   var sminute = date.getMinutes();
   
   if (day<10){
     sday = "0" + sday
   }
   if (month<10){
     smonth = "0" + smonth
   }
   if (hour<10){
     shour = "0" + shour
   }
   if (sminute<10){
     sminute = "0" + sminute
   }
  
    AttivitàInCorso = new Attività();
    AttivitàInCorso.nome = document.getElementById('area-new').value;
    AttivitàInCorso.data =  sday + '/' + smonth + '/' + syear;
    AttivitàInCorso.oraInizio =   shour + ":" +  sminute;
    AttivitàInCorso.note =  document.getElementById('note-new').value;
    TrovaLocaioneCorrente();
    document.getElementById('bot-new-att').disabled = true;
    document.getElementById('bot-fin-att').disabled = false;
    stop = setInterval(TrovaLocaioneCorrente, (localStorage.getItem('tempo-ritraccia')*1000));
    utils.status.show('Tracciamento attività iniziato');
}

function ConcludiAttività(){
   var date = new Date(); 
   var day = date.getDate();
   var month = date.getMonth()+1;
   var year = date.getFullYear();
   var hour = date.getHours();
   var minute = date.getMinutes();
   var sday = date.getDate();
   var smonth = date.getMonth()+1;
   var syear = date.getFullYear();
   var shour = date.getHours();
   var sminute = date.getMinutes();
   
   if (day<10){
     sday = "0" + sday
   }
   if (month<10){
     smonth = "0" + smonth
   }
   if (hour<10){
     shour = "0" + shour
   }
   if (sminute<10){
     sminute = "0" + sminute
   }
  
   AttivitàInCorso.oraFine =   shour + ":" +  sminute;
   AttivitàInCorso.tempo = CalcTempo(AttivitàInCorso.oraInizio, AttivitàInCorso.oraFine);
   
     SalvaAttività(AttivitàInCorso, function (err, succ) {
        console.log("callback salvataggio", err, succ);
        if (!err) {
            console.log("OK");
            utils.status.show('Attività salvata');
        }
    });
  document.getElementById('bot-new-att').disabled = false;
  document.getElementById('bot-fin-att').disabled = true;
}


function MostraDettagliAttività(value){
   var lista = document.getElementById("ListaDettagli"); 
   AttivitàCorrente = value
   while (lista.hasChildNodes()) {
            lista.removeChild(lista.lastChild);
        }
  
    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Nome: " + value.nome);
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);
  
    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Data: " + value.data);
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);
  
    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Inizio: " + value.oraInizio);
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);

    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Fine: " + value.oraFine);
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);

    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Tempo: " + value.tempo + "h");
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);

    var ItemDettagli = document.createElement("li");
    var ParagrafoDettagli = document.createElement("p");  
    var TestoDettagli = document.createTextNode("Note: " + value.note);
  
    ParagrafoDettagli.appendChild(TestoDettagli);
    ItemDettagli.appendChild(ParagrafoDettagli);
    ListaDettagli.appendChild(ItemDettagli);
    
}
// calcolo tempo di servizio
function CalcTempo(ini, fin){
  
  var inih = ini.substring(0,2);
  var inim = ini.substring(3,5);
  var finh = fin.substring(0,2);
  var finm = fin.substring(3,5);

  var imin = parseInt( finm) - parseInt( inim);
  var ihou = parseInt( finh) - parseInt( inih);

  if (imin < 0){
    imin += 60;
    ihou -= 1;
  }
  var outh = ihou.toString();
  var outm = imin.toString();
  
  if  (ihou < 10)
    outh = "0" + outh;
  if  (imin < 10)
    outm = "0" + outm;

  return (outh + ":" + outm);
}
//Primo refresh
window.onload = function () {
  AggiornaListaAttività();
  document.getElementById('destinatario').value = localStorage.getItem('mail-default');
  document.getElementById('destinatario-default').value = localStorage.getItem('mail-default');
  console.log(localStorage.getItem('tempo-ritraccia'));
  if ((localStorage.getItem('tempo-ritraccia') == "") ||  (localStorage.getItem('tempo-ritraccia') == undefined) || (localStorage.getItem('tempo-ritraccia') == null))
  localStorage.setItem('tempo-ritraccia', 5);
  document.getElementById('intervallo').value = localStorage.getItem('tempo-ritraccia');
}

function PreparaMappa(position) {
  
  
  var Coordinate = AttivitàCorrente.posizione;
  console.log(AttivitàCorrente.posizione);
  console.log( EstraiLongitudine(Coordinate));
  var latlng = new google.maps.LatLng(EstraiLatitudine(Coordinate),EstraiLongitudine(Coordinate));
  var options = { 
    zoom : 15,  
    center : latlng, 
    mapTypeId : google.maps.MapTypeId.ROADMAP 
    };
    var map = new google.maps.Map (document.getElementById('div-mappa'), options);
    new google.maps.Marker ({ map : map, 
                          animation : google.maps.Animation.DROP,
                          position : latlng  
             });  
    var CoordinatePercorso = [latlng];
  while(Coordinate.length > 4){   
     latlng = new google.maps.LatLng(EstraiLatitudine(Coordinate),EstraiLongitudine(Coordinate));
     CoordinatePercorso.push(latlng);

     console.log(latlng.lat());
     console.log(latlng.lng());
     Coordinate = RiduciCoordinate(Coordinate);
     console.log(Coordinate);
     }
      var Percorso = new google.maps.Polyline({
         path: CoordinatePercorso,
         geodesic: true,
         strokeColor: '#FF0000',
         strokeOpacity: 1.0,
         strokeWeight: 4
  });
  Percorso.setMap(map);

  
}

function EstraiLatitudine(stringa){
  var out = '';
  var i=1;
  while (stringa[i] != ":" && (i<stringa.length)){
    out = out + stringa[i];
    i++;
  }
  return parseFloat(out);
}

function EstraiLongitudine(stringa){
  
  var out = '';
  var i=1;
  while ((stringa[i] != ":")  && (i<stringa.length)){
    i++;
  }
  i++;
  while ((stringa[i] != "|") && (i<stringa.length)){
    out = out + stringa[i];
    i++;
  }
  return parseFloat(out);
}

function RiduciCoordinate(stringa){
  var out = '';
  var i=1;
  while ((stringa[i] != "|") && (i<stringa.length)){
    i++;
  }
  for (i; i<stringa.length; i++){
    out = out + stringa[i];
  }
  return out;
}

//Salvataggio attività registrata
document.querySelector('#btn-save-reg-att').addEventListener ('click', function () {
   var AttivitàInRegistrazione = new Attività();
   AttivitàInRegistrazione.nome = document.getElementById('area-reg').value;
   AttivitàInRegistrazione.data = document.getElementById('data-reg').value;
   AttivitàInRegistrazione.oraInizio =  document.getElementById('oraInizio-reg').value;
   AttivitàInRegistrazione.oraFine =  document.getElementById('oraFine-reg').value;
   AttivitàInRegistrazione.tempo =  CalcTempo(AttivitàInRegistrazione.oraInizio, AttivitàInRegistrazione.oraFine);
   AttivitàInRegistrazione.note =  document.getElementById('note-reg').value;
   AttivitàInRegistrazione.posizione = ""
   
  //TODO TROVA ERRORI IN INPUT
   SalvaAttività(AttivitàInRegistrazione, function (err, succ) {
        console.log("callback salvataggio", err, succ);
        if (!err) {
            console.log("OK");
            utils.status.show('Attività salvata');
        }
    });
   //Animazione
   document.querySelector('#reg-att').className = 'right';
   document.querySelector('[data-position="current"]').className = 'current';
});

//Test Geo
function TrovaLocaioneCorrente(){
	var geoService = navigator.geolocation;
	if (geoService) {
		navigator.geolocation.getCurrentPosition(MostraLocaioneCorrente,errorHandler);
	} else {
		console.log("Your Browser does not support GeoLocation.");
	}
}

function MostraLocaioneCorrente(position){
	AttivitàInCorso.posizione = (AttivitàInCorso.posizione + '|' + position.coords.latitude + ":" + position.coords.longitude);
  console.log(AttivitàInCorso.posizione);
}

function errorHandler(error){
	  console.log("Errore nella localizzazione: " + error.code + ", Messaggio: " + error.message);
}







