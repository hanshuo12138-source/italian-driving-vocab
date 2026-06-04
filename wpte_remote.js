// Solo per WEBpatente

var domsplit=10 // 12 #30Q
var gruppo="gruppo di "
//var ban="ban.htm" (spostato in index)
var winesamepulssoluzioni = {text: 'Soluzioni',handler: function(){schedaesame.interfaccia.mostrasolu();},tooltipType: 'title', tooltip: 'Mostra le soluzioni di questo '+gruppo+'quiz'}
var winesamepulssugg = {text: 'Suggerimenti',handler: function(){schedaesame.interfaccia.mostrasugg();},tooltipType: 'title', tooltip: 'Mostra suggerimenti su questo '+gruppo+'quiz'}
var spiegcorr="Chiudere questa finestra per rivedere le risposte. Gli errori sono evidenziati in rosso, le risposte esatte in verde. Qualora si sia omessa una risposta, la soluzione esatta sar&#224; segnalata in blu."

//Esame preconfezionato
esamepreconf = eval(Cookies.get("epc"))
if ((esamepreconf==null) || (esamepreconf==0)) esamepreconf=-1
maxesamepreconf=662 // 603 #30Q

function opesapreconf_aggiorna(){
	esamepreconf *= -1
}
op.crea("esapreconf",esapreconf_default,"Utilizza le schede d'esame predefinite","Quiz",function(){opesapreconf_aggiorna()})

// esamepreconf in coerenza con l'opzione
if (op.valore("esapreconf"))
	esamepreconf=Math.abs(esamepreconf)
else	
	esamepreconf=Math.abs(esamepreconf)*-1
Cookies.set("epc",esamepreconf)
//alert(esamepreconf)


// Lingua (se non ci sono cookie imposta l'italiano)
var dum=Cookies.get("Lingua")
if (dum==null){lang="it"}else{lang=dum}
//*XUL* creacss (lang, lang+".css")
plang=lang+"/"


// Per riattivare le lingue popolare gli array con più di un valore
// Altrimenti il pulsante resta nascosto	
var linguedisp= new Array('it','fr','de')
//var linguedisp= new Array('it') // Solo italiano
var lingue = new Array();
lingue['it']={nome:'Italiano',pref:'it_IT'};
lingue['fr']={nome:'Francese',pref:'fr_FR'};
lingue['de']={nome:'Tedesco',pref:'de_de'};


function ricaricaargo(){
	if (winargo!=null){
		schedaargo.n=-1
		schedaargo.output=""
		schedaatt="schedaargo"
		schedaargo.caricaQuiz()
	}else{
		linguacambiando=2
		ricaricasolu()
	}	
}
function ricaricasolu(){
	if (winsolu!=null){
		schedasolu.n=-1
		schedasolu.output=""
		schedaatt="schedasolu"
		schedasolu.caricaQuiz()
	}else{
		linguacambiando=0	
		ricaricaesame()	
	}	
}
function ricaricaesame(){
	if (winesame!=null){
		schedaesame.n=-1
		schedaesame.output=""
		schedaatt= "schedaesame"  
		schedaesame.maxsoluzioni=0
		schedaesame.caricaQuiz()
	}else{ // Cancella la progbar se winesame non è stata mai aperta
		Ext.MessageBox.hide();
		linguacambiata=false
	}	
	
}


function cambialingua(item,e){
	// Risponde agli eventi del menu	
	
	Ext.MessageBox.show({
	title: 'Attendere, prego',
	msg: 'Traduzione in corso...',
	progressText: 'Inizializzazione...',
	width:300,
	progress:true,
	closable:false
	});
	
	
	rimuovicss(lang)
	lang=item.id.substr(2)
	plang=lang+"/"
	creacss (lang, lang+".css")
	/*
	if (sceglilingua0) sceglilingua0.setIconClass(lang);
	if (sceglilingua1) sceglilingua1.setIconClass(lang);
	if (sceglilingua2) sceglilingua2.setIconClass(lang);	
	*/
	if (sceglilingua0) sceglilingua0.setText(lingue[lang].nome);
	if (sceglilingua1) sceglilingua1.setText(lingue[lang].nome);
	if (sceglilingua2) sceglilingua2.setText(lingue[lang].nome);
	
	if (op.valore("salvaoff")==false){
		Cookies.set("Lingua",lang)
	}
	linguacambiata=true
	linguacambiando=1
	ricaricaargo()
}

// Crea il menù scegliglingua
var mnlingua0 = new Ext.menu.Menu({});
var mnlingua1 = new Ext.menu.Menu({});
var mnlingua2 = new Ext.menu.Menu({});
for (l=0;l<linguedisp.length;l++){
	/*
	mnlingua0.addMenuItem({text: lingue[linguedisp[l]].nome,icon:'grafica/flags/'+linguedisp[l]+'.gif',handler: cambialingua,id: 'mn'+linguedisp[l]})
	mnlingua1.addMenuItem({text: lingue[linguedisp[l]].nome,icon:'grafica/flags/'+linguedisp[l]+'.gif',handler: cambialingua,id: 'mn'+linguedisp[l]})
	mnlingua2.addMenuItem({text: lingue[linguedisp[l]].nome,icon:'grafica/flags/'+linguedisp[l]+'.gif',handler: cambialingua,id: 'mn'+linguedisp[l]})
	*/
	mnlingua0.addMenuItem({text: lingue[linguedisp[l]].nome,handler: cambialingua,id: 'mn'+linguedisp[l]})
	mnlingua1.addMenuItem({text: lingue[linguedisp[l]].nome,handler: cambialingua,id: 'mn'+linguedisp[l]})
	mnlingua2.addMenuItem({text: lingue[linguedisp[l]].nome,handler: cambialingua,id: 'mn'+linguedisp[l]})

}

// Crea il pulsante action sceglilingua
var sceglilingua0 = new Ext.Action({
	text: lingue[lang].nome,
	//iconCls: lang,
	//image: 'grafica/flags/'+lang+'.gif',
	//cls:'x-btn-text-icon',
	id: 'sceglilingua0', 
	tooltipType: 'title', 
	tooltip: 'Scegli la lingua',
	menu: mnlingua0,
	hidden: (linguedisp.length==1)?true:false
});	 

var sceglilingua1 = new Ext.Action({
	text: lingue[lang].nome,
	//iconCls: lang,
	//image: 'grafica/flags/'+lang+'.gif',
	//cls:'x-btn-text-icon',
	id: 'sceglilingua1', 
	tooltipType: 'title', 
	tooltip: 'Scegli la lingua',
	menu: mnlingua1,
	
	hidden: (linguedisp.length==1)?true:false
 });	
 var sceglilingua2 = new Ext.Action({
	text: lingue[lang].nome,
	//iconCls: lang,
	//image: 'grafica/flags/'+lang+'.gif',
	//cls:'x-btn-text-icon',
	id: 'sceglilingua2', 
	tooltipType: 'title', 
	tooltip: 'Scegli la lingua',
	menu: mnlingua2,
	hidden: (linguedisp.length==1)?true:false
 });	