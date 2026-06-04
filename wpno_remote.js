/* WEBpatente */	

function printme(wintp,ele,titolo){
	if (wintp!=null){
		wintp=eval(wintp)
		dum=getWin(wintp,ele).innerHTML
	}else{
		dum=ele
	}
	if (titolo!="") {
		if(titolo.charAt(0)!="^") 
			dum="<div class='titololez'>"+titolo+"</div>"+dum
		else
			titolo=titolo.substr(1)	
	}	
	if (extprn==true){
		stampaesterna(dum)
	}else{
		if (window.frames["toprint"]!=null){
			iftp=window.frames["toprint"]
		}else{ //Xul
			if (wintp==null) wintp=winesame // Stampa scheda
			iftp=getWin(wintp,"toprint").contentWindow
		}	
		//if(iftp.document.getElementById("divtoprint")!=null){	
			iftp.document.getElementById("divtoprint").innerHTML=dum
			if (titolo!="") iftp.document.title=titolo
			iftp.printself()
		//}
		
	}
}
function stampascheda(item,e){
	schedaesame.stampa(item.id)
}

var selargo=" class='selargosel'>";
if (capmin[0]!=null){ //WEBpatentino
	for (i in argomenti){
		selargo+="<option value='"+(fineargo[i]+1)+"'>"+(parseInt(i)+1)+". "+argomenti[i]+" (Cap. "+capmin[i]+")</option>";
	}	
}else{ //WEBpatent 4.0
	for (i in argomenti){
		//selargo+="<option value='"+(fineargo[i]+1)+"'>"+(parseInt(i)+1)+((cappeso[i]==1)?"*":"")+". "+argomenti[i]+"</option>";
		selargo+="<option value='"+(fineargo[i]+1)+"'>"+(parseInt(i)+1)+". "+argomenti[i]+" "+((cappeso[i]>0)?("("+Array(cappeso[i]+1).join("*")+")"):"")+"</option>";
	}
}	
selargo+="</select>";	
//argomenti non va azzerato


function perc(a,b){
	if (b==0) return "-"; else return Math.round((a*100/b)*100)/100;
}
function media(a,b){
	if (b==0) return "-"; else return Math.round((a/b)*100)/100;
}
function rnd(inf,sup){
	return Math.round((sup-inf)*Math.random()+inf);
}
function zerostr(s){
	for (var i=0;i<s.length;i++){
		if (s.charAt(i)!="0"){
			return s.substr(i)
		}
	}
}
function toglicar(s,c){
	if (s.charAt(0)==c)
		return s.substr(1)
	else
		return s	
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function toglipar(s){ 
	// toglie le parentesi
	var car="", ret="";
	var noret=false;
	for (var i=0;i<s.length;i++){
		car=s.charAt(i)
		if (car=="("){
			noret=true
		}
		if (noret==false) ret+=car;
		if (car==")"){
			noret=false;
		}		
	}
	return ret
}

function trovaeportasu(a,v,pos){
	for (var i=0;i<a.length;i++){
		if (a[i]==v){
			if (i==pos) return;
			else{
				a[i]=a[pos]; a[pos]=v;
				return
			}	
		}
	}
}
function d2h(d) {return parseInt(d).toString(36);}
function h2d(h) {return parseInt(h,36);} 
function schedasplit(s,d){
	var cd=""
	for(var i=0;i<s.length;i+=d){
		cd+=d2h(zerostr(s.substr(i,d)))+"-"
	}
	return cd.substr(0,cd.length-1)
}
function schedajoin(s,d){
	var cd=""
	var tmp=s.split("-")
	for (var i=0;i<tmp.length;i++){
		cd+=zerofit(h2d(tmp[i]).toString(),d)
	}
	return cd
}
function tcaricascheda(){ // N.B. tutti i valori sono stringhe
	this.esinco
	this.dom
	this.rip
	this.esmin
	this.essec
	this.solut
	this.quizatt="0"
	this.correz=false
	this.leggicookie= function(){
		this.esinco=eval(Cookies.get("esinco")) //Bool
		this.dom=Cookies.get("dom")
		this.rip=Cookies.get("rip")
		this.essec=Cookies.get("essec")
		this.esmin=Cookies.get("esmin")
		this.solut=Cookies.get("solut")
		this.quizatt=Cookies.get("quizatt")
		this.correz=eval(Cookies.get("correz")) //Bool
	}
	this.compsolut=function(){
		var su1=""; var su2="";
		var mmq=schedaesame.maxquiz/2
		for (var n=0;n<schedaesame.maxquiz;n++){
			//alert(schedaesame.quesiti[n].soluzioniutente)
			for (var m=0;m<schedaesame.maxris;m++){
				//if (schedaesame.quesiti[n].soluzioniutente[m]==undefined)
				if (schedaesame.quesiti[n].soluzioniutente[m]==null)
					var dum="0";
				else 	
					dum=(schedaesame.quesiti[n].soluzioniutente[m]=="V")?"1":"2";
				if (n<(mmq)) su1+=dum; else su2+=dum;
			}
		}
		if (su1=="") su1="0"
		if (su2=="") su2="0"	
		return parseInt(su1,3)+"-"+parseInt(su2,3)
	}
	this.importa=function(p){
		var tmp=p.split("|")
		if(tmp.length==2){ //Scheda non corretta
			this.esinco=true
			this.dom=tmp[0]
			this.rip=tmp[1]	
			this.essec="01"
			this.esmin=""+maxminuti
			this.solut="0-0"
			this.correz=false
		}else{ //Scheda corretta
			this.esinco=false
			this.dom=tmp[0]
			this.rip=tmp[1]
			this.esmin=tmp[2]
			this.essec=tmp[3]
			this.solut=tmp[4]
			this.correz=true
		}
		this.quizatt=0
		esameincorso=this.esinco
		
		Cookies.set("dom", this.dom) // Imposta questo come nuovo esame precedente
		Cookies.set("rip", this.rip) 
		dom=schedajoin(this.dom,domsplit)
		rip=schedajoin(this.rip,10)
		schedaprec=true
	}
	this.esporta=function(filfor){
		if (filfor==null) filfor=0	
		if (dom!=null) {
			if (esameincorso)
				this.salvaesporta(true)
			else{
				Ext.MessageBox.confirm('Richiesta di conferma', 'Si vogliono salvare anche le soluzioni dell\'utente?', function(btn){
   				if(btn=='yes')
   					casc.salvaesporta(false,filfor)
   				else
   					casc.salvaesporta(true,filfor)
   				});		
   			}	
			
		}else{ //Non si è mai generata una scheda
			Ext.Msg.show({
   			title:'Impossibile procedere',
   			msg: 'Per poter esportare una scheda di esame occorre averla prima generata, facendo click sul pulsante "Simulazione di Esame".',
   			buttons: Ext.Msg.OK,
   			animEl: 'elId',
   			icon: Ext.MessageBox.ERROR
			});
		}
	}
	this.salvaesporta= function(soloquesiti, filfor){
		if (soloquesiti)
			wp4url=schedasplit(dom,domsplit)+"|"+schedasplit(rip,10);
		else 
			wp4url=schedasplit(dom,domsplit)+"|"+schedasplit(rip,10)+"|"+this.esmin+"|"+this.essec+"|"+this.compsolut(); // salva anche le soluzioni utente
		//alert(wp4url)	
		salva(wp4url,filfor) //La funzion salva si trova su wpnojs.js ed è un wrapper per off_salva() che si trova in versioni.js
	}
}

function leggischedaprec(){
	if (op.valore('memfin')==false){ 
		esameincorso=false
		schedaprec=false
	}else{
		casc.leggicookie()
		esameincorso=casc.esinco
		if (esameincorso==null) esameincorso=false
		dom=casc.dom
		if (dom!=null){
			dom=schedajoin(dom,domsplit)
			rip=schedajoin(casc.rip,10)
			schedaprec=true
		}
	}
	Cookies.set("esinco",+esameincorso) //+ =toInt	
	return esameincorso
}


function sorteggiatesto(str){
	txt=str.split("|");
	so= txt[rnd(0,txt.length-1)];
	return so;
}

function termometro(perc,lung){
	return "<div class='termb'><table cellpadding='0' style='width: "+lung+"px;' class='term'><tr><td class='termtd'>"+
	((isNaN(perc))?"<div style='width: "+lung+"px;' class='term0'> </div>":("<div class='termr' style='width: "+ Math.round(perc*lung/100) +"px'>"+perc+"%</div>"+
	"<div class='termv' style='width: "+ (lung-Math.round(perc*lung/100)) +"px'>"+(Math.round((100-perc)*100)/100)+"%</div>"))+ 
	"</td></tr></table></div>";
}

function topzione(nome,valore,descrizione,gruppo,secambia,tipo,nuovo){
	this.nome=nome;
	this.valore=valore;
	this.descrizione=descrizione;
	this.gruppo=(gruppo!=null)?gruppo:'default'
	this.nuovo=null;
	this.secambia=secambia;
	this.nascondi=false;
	this.tipo=(tipo!=null)?tipo:0
}

// *** MANUALE --------------------------------------------------------------------------------------------------------------------------------------
var l // oggetto su file da caricare
function tlez(numero,titolo,intro,nocache){
	this.numero=numero;
	this.titolo=titolo;
	this.intro=intro;
	this.sugg=new Array();
	this.nocache=nocache;
}
var manuale={
	titolilezioni: [], //<-- caricato da dati.js
	lezioni: [],
	callback: {},
	lezatt: null,
	catfigatt: 0,
	ritornalezione: function (lez, cbk){
		if (this.lezatt!=lez){
			this.callback = cbk
			this.lezatt=lez
			if ((this.lezioni[lez]==null)||(this.lezioni[lez].nocache==true)) {
				this.lezioni[lez]= new tlez
				this.lezioni[lez].numero= lez
				figtrov="";
				this.jsel = creascript("lez",percquiz+"lez/"+"lez"+lez+".js")
			}else{
				this.ultlez=this.lezioni[this.lezatt].intro
				this.ritornatesto()
			}	
		}else{
			return this.lezioni[lez]
		}	
	},
	continua: function(){
		this.lezioni[this.lezatt]=l
		//this.callback(this.lezatt)
		eval("var tmpfig=figurecitate(["+figtrov.substr(0,figtrov.length-1)+"])");
		figtrov="";
		this.lezioni[this.lezatt].intro+=tmpfig
		this.ultlez=this.lezioni[this.lezatt].intro
		this.ritornatesto()
	},
	sellez: null,
	ritornasellez: function(){	
		if (this.sellez==null){
			var tmp=" id='sellez' class='sellezsel'>"
			for (i=0;i<titolilezioni.length;i++){
				this.titolilezioni[i]=titolilezioni[i]
				tmp+="<option value='"+i+"'>"+this.titolilezioni[i]+"</option>";
			}	
			this.sellez=tmp+"</select>\n";
			titolilezioni=null
		}
		return this.sellez
	},
	ritornatesto: function(){
		for (x=manuale.ultsugg;x<manuale.lezioni[manuale.lezatt].sugg.length;x++){
			var tmpsugg
			tmpsugg=suggerimenti.carica(manuale.lezioni[manuale.lezatt].sugg[x],manuale.ritornatesto)
			if (tmpsugg==null) {
				return
			}else{
				prog(x,manuale.lezioni[manuale.lezatt].sugg.length-1) //aggiorna progressbar (func in index.htm)
				manuale.ultsugg=x+1
				manuale.ultlez+="<br/><div class='sugg'><div class='titolo'>"+tmpsugg.titolo+"</div>";
				if (tmpsugg.segnale>0) {
					manuale.ultlez+="<div class='contfig'><img class='figura' src='"+prefimg+tmpsugg.segnale+".gif' onclick='ingrandisci("+tmpsugg.segnale+")' title='Figura nr. "+tmpsugg.segnale+". Fare click per ingrandire.' /></div>";
					stringi=""
				}else{
					stringi=" style='height: auto;'"
				}
				manuale.ultlez+="<div class='testo'"+stringi+">"+LZString.decompress(tmpsugg.testo)+"</div><div class='esercitati'>Esercitati su questo argomento: "+mostrarif(tmpsugg.riferimento)+".</div></div>";
			}
		}
		Ext.MessageBox.hide() //Aggiunto mobi
		manuale.ultsugg=0
		var tmplezfig=(ver.app=="WEBpatente")?41:26;
		if ((manuale.lezatt!=0) && (manuale.lezatt!=tmplezfig)) manuale.ultlez+=altroaiuto+diraut
		manuale.callback(manuale.lezatt)
	},
	stampa: function(){
		printme("winmanu", "panmanu",this.titolilezioni[this.lezatt])
	},
	ultsugg: 0,
	ultlez: ""
}

function mostrarif(r){
	var ret=""
	var x
	for (x=0;x<r.length;x++){
		ret+="<a href='javascript:quizargomento("+r[x]+")' class='esercitati' title='Inizia l’esercizio per argomento'><b>"+((gruppo=="")?"quiz":"gruppo")+" n. "+r[x]+"</b></a>, ";
	}
	return ret.substr(0,ret.length-2)
}

// *** SUGGERIMENTI ---------------------------------------------------------------------------------------------------------------------------------
var s // oggetto su file da caricare
function tsugg(numero,titolo,segnale,testo,riferimento){
	this.numero=numero;
	this.titolo=titolo;
	this.segnale=segnale;
	this.testo=testo;
	this.riferimento=new Array();
}
var suggerimenti={
	sugg: [],
	callback: {},
	suggatt: null,
	jsel:{},
	carica: function(sugg, cbk){
		if(this.sugg[sugg]==null){
			this.sugg[sugg]= new tsugg
			this.sugg[sugg].numero=sugg
			this.callback = cbk
			this.suggatt=sugg
			this.jsel = creascript("sugg",this.suggfile(sugg))
		}else{
			return (this.sugg[sugg])
		}
	},
	continua: function(){
		this.sugg[this.suggatt]=s
		figtrov="";
		var tmpsugg="<div class='suggtext' title='Suggerimento n. "+this.suggatt+"'>"+cercafig(this.sugg[this.suggatt].testo)+"</div>"
		eval("var tmpfig=figurecitate(["+figtrov.substr(0,figtrov.length-1)+"])");
		figtrov="";
		this.sugg[this.suggatt].testo= LZString.compress(tmpsugg+tmpfig);
		this.callback(this.suggatt)
	},
	stampa: function(){
		printme("winsugg", "pansugg",this.sugg[this.suggatt].titolo)	
	},
	suggfile: function(sugg){
		return percquiz+"sugg/"+"h"+sugg+".js"
	}
	
}

function figurecitate(f){
	if ((f.length>0) && (app.flags.mostracitate)){
		var ret="";
		f.sort(function(a,b){return a-b});
		var t=[]
		for (x=0;x<f.length;x++){
			if (t[f[x]]==null){
				ret+="<div class='fc_contfig'><div class='fc_bordo'><img class='ieimg fc_figura' src='"+prefimg+f[x]+".gif' onclick='ingrandisci("+f[x]+")' title='Figura n. "+f[x]+". Fare click per visualizzarne un ingrandimento' /></div>Fig. "+f[x]+" </div>";
				t[f[x]]=1;
			}
		}
		return "<div class='fc_spc0'>"+ret+"</div><div class='fc_spc1'></div>";
	}else return "";
}
 
 
// *** OPZIONI --------------------------------------------------------------------------------------------------------------------------------------
var percalt=""
function topzioni(nome){
	this.nome=nome;
	this.opzioni=new Array();
	this.nomi=new Array();
	this.aggiorna=function(){
		for (i=0;i<this.nomi.length;i++){
			if (this.opzioni[this.nomi[i]].nuovo!=null){
				this.opzioni[this.nomi[i]].valore=this.opzioni[this.nomi[i]].nuovo;
				Cookies.set(this.opzioni[this.nomi[i]].nome,this.opzioni[this.nomi[i]].valore);
				// Esegui funzione secambia
				if (this.opzioni[this.nomi[i]].secambia !=null){ 
					this.opzioni[this.nomi[i]].secambia(this.opzioni[this.nomi[i]].nuovo) 
				}
			}
		}	
	}  
	this.commuta=function(nome){
		if (this.opzioni[nome].nuovo==null)
			this.opzioni[nome].nuovo=(this.opzioni[nome].valore)?false:true;
		else	
			this.opzioni[nome].nuovo=(this.opzioni[nome].nuovo)?false:true;
		return this.opzioni[nome].nuovo;
	}
	this.crea=function(nome,valore,descrizione,gruppo,secambia,tipo){
		var cook=Cookies.get(nome);
		if (cook!=null) 
			valore=eval(cook); 
		else 
			Cookies.set(nome,valore);	
		this.opzioni[nome]=new topzione(nome,valore,descrizione,gruppo,secambia,tipo);
		this.nomi.push(nome)
	}
	this.eseguise=function(nome,valore,func){
		if (this.opzioni[nome].valore==valore){
			if(typeof func=="function")
				return func();
			else
				return func;	
		}	
	}
	this.imposta=function(nome,valore){ //Attenzione: non modifica i cookie
		this.opzioni[nome].valore=valore;
	}
	this.ritmostra=function(gruppo){
		if (gruppo==null) gruppo='default'
		ret="<table class='opzioni' style='width:100%'>"
		//Sost alla funz commuta(), 5 righe sotto: opener."+this.nome+".commuta(\""+this.nomi[i]+"\") 
		for (i=0;i<this.nomi.length;i++){
			if (this.opzioni[this.nomi[i]].nascondi==false){
				if (this.opzioni[this.nomi[i]].gruppo==gruppo){
					this.opzioni[this.nomi[i]].nuovo=null;
					if (this.opzioni[this.nomi[i]].tipo==0){
						ret+="<tr><td class='opzioni col1'>"+
						"<a href='javascript:void(0)'><img class='opckimg' id='"+this.nomi[i]+"' src='"+pregrafica+"grafica/"+percalt+"ck"+((this.opzioni[this.nomi[i]].valore)?"c":"u")+".gif' onclick='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((commuta(\""+this.nome+"\",\""+this.nomi[i]+"\"))?\"c\":\"u\")+\"o.gif\"' onmouseover='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((this.src.lastIndexOf(\"cku.gif\")!=-1)?\"u\":\"c\")+\"o.gif\"' onmouseout='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((this.src.lastIndexOf(\"ckuo.gif\")!=-1)?\"u\":\"c\")+\".gif\"' /></a>"+
						"</td><td class='opzioni col2'>"+this.opzioni[this.nomi[i]].descrizione+"</td></tr>"
					}else{
						ret+="<tr><td colspan='2'>"+this.opzioni[this.nomi[i]].descrizione+"<td></tr>"
					}	
				}
			}
		}
		return ret+"</table>"
	}	
	this.mostra=function(div,gruppo){
		getWin(winopt,div).innerHTML=this.ritmostra(gruppo)
	}	
	this.valore=function(nome){
		return this.opzioni[nome].valore
	}
}

// *** RISULTATI ------------------------------------------------------------------------------------------------------------------------------------

function trisultati(){
	this.esamisvolti=0;
	this.esamifalliti=0;
	this.erroriesame=0;
	this.erroriesamecap = new Array(0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0);
	this.ultimiesami = new Array();
	//this.ultimiesami = new Array(15,10,8,2,5,4,6,0,3)
	this.svoltiargo=0
	this.erroriargocap = new Array(0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0);
	this.opcapitoli=0
	this.aggiungiultimi = function(errori){
		if (this.ultimiesami.length==this.maxultimi) this.ultimiesami.shift()
		this.ultimiesami.push(errori)		
	}
	this.ultimifallimenti=function(){
		var ret=0
		for (i=0;i<this.ultimiesami.length;i++)
			if (this.ultimiesami[i]>this.maxerrori) ret++
		return ret	
	}
	this.ultimierrori=function(){
		var ret=0
		for (i=0;i<this.ultimiesami.length;i++)
			ret+=this.ultimiesami[i]
		return ret	
	}
	this.tabellaesame=function(){
		var ultfal=this.ultimifallimenti()
		var ulterr=this.ultimierrori()
		return "<table class='tabris' id='tabrisesa'><tr><th> </th><th class='thris'>Tutte</th><th class='thris'>Ultime</th></tr>"+
		"<tr><th class='thrisl'>Prove svolte</th><td class='tdris'>"+this.esamisvolti+"</td><td class='tdris'>"+this.ultimiesami.length+"</td></tr>"+
		"<tr><th class='thrisl'>Prove fallite</th><td class='tdris'>"+this.esamifalliti+"</td><td class='tdris'>"+ultfal+"</td></tr>"+
		"<tr><th class='thrisl'>Fallimenti per prova</th><td class='tdris'>"+media(this.esamifalliti,this.esamisvolti)+"</td><td class='tdris'>"+media(ultfal,this.ultimiesami.length)+"</td></tr>"+
		"<tr><th class='thrisl'>Totale errori</th><td class='tdris'>"+this.erroriesame+"</td><td class='tdris'>"+ulterr+"</td></tr>"+
		"<tr><th class='thrisl'>Errori per prova</th><td class='tdris'>"+media(this.erroriesame,this.esamisvolti)+"</td><td class='tdris'>"+media(ulterr,this.ultimiesami.length)+"</td></tr>"+
		"</table>"
	}
	this.graficoultimi=function(){
		var riga1="", riga2=""	
		//var cambiasfondo=(this.maxrisposte==30)?" style='background-image: url(\""+pregrafica+"grafica/graficos30"+((ver.mobi==true)?"M":"")+".gif\");'":"";
		var cambiasfondo=" style='background-image: url(\""+pregrafica+"grafica/graficos"+this.maxrisposte+"-"+this.maxerrori+((ver.mobi==true)?"M":"")+".gif\");'";
		for  (i=0;i<this.maxultimi;i++){
			if (i<this.ultimiesami.length){
				//riga1+="<td class='grafico_b'"+cambiasfondo+"><img src='"+pregrafica+"grafica/bar"+((this.ultimiesami[i]>this.maxerrori)?"r":"v")+((grafultlargbarr==28)?"M":"")+".gif' class='barris' style='height: "+((this.maxrisposte-this.ultimiesami[i])*(7-this.maxrisposte/10)*((grafultlargbarr==28)?2:1))+"px;' /></td>" // 3 in WEBpatente, 4 in WEBpatentino
				riga1+="<td class='grafico_b'"+cambiasfondo+"><img src='"+pregrafica+"grafica/bar"+((this.ultimiesami[i]>this.maxerrori)?"r":"v")+((grafultlargbarr==28)?"M":"")+".gif' class='barris' style='height: "+(120/this.maxrisposte*(this.maxrisposte-this.ultimiesami[i]))+"px;' /></td>" // 120px è l'altezza del grafico
				riga2+="<td class='grafico_n'>"+(this.maxrisposte-this.ultimiesami[i])+"</td>"
			}else{
				riga1+="<td class='grafico_b'"+cambiasfondo+"></td>";
				riga2+="<td class='grafico_n'></td>";
			}	
		}
		return "<table class='tabris'><tr><th class='thris'>Risposte esatte nelle ultime "+this.maxultimi+" prove</th></tr><tr><td class='tdris'><table class='grafico' style='width: "+(this.maxultimi*grafultlargbarr)+"px'><tr>"+riga1+"</tr><tr>"+riga2+"</tr></table></td></tr></table>"
	}
	this.percfallimenti=function(){
		var ultfal=this.ultimifallimenti()
		perctutfal=perc(this.esamifalliti,this.esamisvolti)
		percultfal=perc(ultfal,this.ultimiesami.length)
		return "<table class='tabris'><tr><th class='thris' id='percfall1'>Prove</th><th class='thris'>Fallimenti / Successi</th></tr>"+
		"<tr><th class='thrisl'>Tutte</th><td class='tdris'>"+ termometro(perctutfal,termlun)+  "</td></tr>"+
		"<tr><th class='thrisl'>Ultime</th><td class='tdris'>"+ termometro(percultfal,termlun)+  "</td></tr></table>"
	}	
	this.percerrori=function(){
		var ulterr=this.ultimierrori()
		perctuterr=perc(this.erroriesame,this.esamisvolti*this.maxrisposte)
		perculterr=perc(ulterr,this.ultimiesami.length*this.maxrisposte)
		percultimaerr=perc(this.ultimiesami[this.ultimiesami.length-1],this.maxrisposte)
		return "<table class='tabris'><tr><th class='thris' id='percerr1'>Prove</th><th class='thris'>Risposte errate / esatte</th></tr>"+
		"<tr><th class='thrisl'>Tutte</th><td class='tdris'>"+ termometro(perctuterr,termlun)+  "</td></tr>"+
		"<tr><th class='thrisl'>Ultime</th><td class='tdris'>"+ termometro(perculterr,termlun)+  "</td></tr>"+
		"<tr><th class='thrisl'>Ultima</th><td class='tdris'>"+ termometro(percultimaerr,termlun)+  "</td></tr></table>"
	}	
	this.erroriargo=function(){
		var ret=0
		for (i=0;i<this.erroriargocap.length;i++)
			ret+=this.erroriargocap[i]
		return ret	
	}
	this.tabellaargo=function(){
		var toterr = this.erroriargo()
		return "<table class='tabris' id='tabrisargo'><tr><th class='thris' style='width: 50%'>Risposte</th><th class='thris'>Errori</th></tr>"+
		"<tr><td class='tdris'>"+this.svoltiargo+"</td><td class='tdris'>"+toterr+"</td></tr></table>"
	}
	this.percerroriargo=function(){
		percerarg=perc(this.erroriargo(),this.svoltiargo)
		return "<table class='tabris'><tr><th class='thris'>Risposte errate / esatte</th></tr>"+
		"<tr><td class='tdris'>"+ termometro(percerarg,termlun)+ "</td></tr></table>";
	}

	this.tabellacap=function(){
		var tabcap=""
		if (capmin.length>0){ // WEBpatentino
			var argo=0
			for (i=0;i<10;i++){
				argcap=""
				errcap=((this.opcapitoli==0)?this.erroriesamecap[i]:0)+this.erroriargocap[i]
				while(capmin[argo]==(i+1)){
					argcap+=(trim(toglipar(argomenti[argo]))+". ")
					argo++
				}
				tabcap+="<tr><td class='tdris'>"+(i+1)+"</td><td class='tdrisl'>"+argcap+"</td><td class='tdris'>"+errcap+"</td></tr>"
			}
			return "<table class='tabris' id='tabcap'><tr><th class='thris'>Cap.</th><th class='thris'>Argomenti</th><th class='thris'>Errori</th></tr>"+
			tabcap+"</table>"
		}else{ //WEBpatente 4.0
			for (var i=0;i<10;i++){
				tabcap+="<tr>";
				for (var j=0;j<3;j++){
					var cap=(i+(9*j));
					if (cap>=finecap.length){
						cap=""
						var capinfo=""
						var errcap=""
						var caplab=""
					}else{
						var errcap=((this.opcapitoli==0)?this.erroriesamecap[cap-1]:0)+this.erroriargocap[cap-1]
						var capinfo=" title=\""+argomenti[cap-1]+"\" style='cursor:pointer' onclick=\"Ext.example.msg('Per tua informazione','Il capitolo "+cap+" riguarda: "+argomenti[cap-1]+". Prevede "+(cappeso[cap-1]+1)+" quiz nella prova di esame.')\"";
						//var caplab=cap+((cappeso[cap-1]==1)?"*":"<span style='visibility:hidden'>*</span>")
						var caplab=cap+((cappeso[cap-1]>0)?(Array(cappeso[cap-1]+1).join("*")):"")
					}
					tabcap+=(i==0)?"<th  class='thris' style='width:16%'>Cap.</th><th  class='thris' style='width:16%'>Err.</th>":"<th class='thris'"+capinfo+">"+caplab+"</th><td  class='tdris'>"+errcap+"</td>" 
				}	
				tabcap+="</tr>"
			}
			return "<table class='tabris' id='tabcap'>"+tabcap+"</table>";
		}
	}
	this.impostaopcapitoli=function(){
		return "<table class='opcap'><tr><td class='opcapcol1'><a href='javascript:void(0)'>"+
		"<img class='opckimg' src='"+pregrafica+"grafica/"+percalt+"ck"+((this.opcapitoli==0)?"c":"u")+".gif' onclick='riscommutaopcapitoli()' onmouseover='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((risopcapitoli()==0)?\"c\":\"u\")+\"o.gif\"' onmouseout='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((risopcapitoli()==0)?\"c\":\"u\")+\".gif\"' alt='' /></a></td>"+
		"<td class='opcapcol2'>Includi gli errori delle prove di esame nella tabella degli errori per capitolo"+((ver.mobi==true)?"":" (a destra)")+".</td></tr></table>"
	}
	this.commutaopcapitoli=function(){
		if (this.opcapitoli==0) this.opcapitoli=1; else this.opcapitoli=0;
		this.impostacookie()
		mostraris(1)
	}

	this.impostacookie=function(){
		if (op.valore("salvaoff")==false){
			for (i in this){
				var tipopar=typeof(eval("this."+i))
				if (tipopar=="function") break; // -> 
				Cookies.set(i, eval("this."+i))
			}	
		}
	}
	// Proprietà senza cookie
	this.maxultimi = 20;
	this.maxerrori = maxerrori;
	this.maxrisposte = (maxquizesame*maxrispesame)
	if (op.valore("salvaoff")==false){
		for (i in this){
			var tipopar=typeof(eval("this."+i))
			if (tipopar=="function") break; // -> 
			var cook = Cookies.get(i)
			if (cook!=null){ 
				if (tipopar=="object")
					eval("this."+i+"=["+unescape(cook)+"]")
				else	
					eval("this."+i+"="+cook)
			}	
		}
	}	
}// Risultati


// *** QUIZ -----------------------------------------------------------------------------------------------------------------------------------------

function tquiz(numero,domanda,domandat,soluzioni,segnale,suggerimento,soluzioniutente) {
	this.numero=numero;
	this.capitolo=0;
	this.nummin=""; // <- usato in wp4
	this.quizass=0;
	this.rispass= new Array()
	this.domanda = domanda;
	this.domandat = domandat;
	this.risposte = new Array();
	this.rispostet = new Array();
	this.oscurate=0 //##
	this.soluzioni = soluzioni;
	this.segnale= segnale;
	this.sugg=suggerimento;
	this.ordine = new Array();
	this.soluzioniutente=soluzioniutente;
	this.maxris=0; //<- non usato in nint
	this.disordina = function(inordine) {
		var totris
		totris=this.risposte.length-1
		var dumord=[] //##
		for (i=0;i<this.risposte.length;i++){
			this.ordine[i]=i;
			dumord[i]=i //##
		}
	
		if(inordine==false){
			//##
			this.ordine=[]
			while (dumord.length>0){
				var o=parseInt(Math.random()*dumord.length)
				this.ordine.push(dumord[o])
				dumord.splice(o,1)
			}
			// Se c'è una o più risposte nascoste le sposta in fondo.
			if (rispnascquiz!=""){
				if (rispnascquiz.indexOf("|"+this.numero+"|")!=-1){ //Questo quiz ha risposte nascoste
					consolemsg("Quiz con risposte nascoste ("+this.numero+")")
					var dumr=rispnasc[this.numero].substr(1,rispnasc[this.numero].length-2).split("|")
					for (var i=0;i<dumr.length;i++){
						for (var j=0;j<this.ordine.length;j++){
							if (this.ordine[j]==dumr[i]){
								this.ordine.splice(j,1)																
							}
						}
						this.ordine.push(Number(dumr[i]))
						this.oscurate++
					}
					consolemsg(this.ordine)
				}
			}
			//##
		}

	}
	this.mostra = function(qn,maxris,name, corr){
		dumris=""
		if (maxris==0) maxris=this.risposte.length
		for (x=0;x<maxris;x++){
			rn=(qn*maxris)+x
			dumris+="<tr><td class='c_risposta'>"+(x+1)+") "+this.risposte[this.ordine[x]]+"</td><td>"
			if (corr==false){
				dumris+="<img class='v' id='"+name+"V"+rn+"' src='"+pregrafica+"grafica/v.gif' alt='' onclick='"+name+".rispondi("+rn+",\"V\", "+qn+","+x+")' />"+
				"<img class='f' id='"+name+"F"+rn+"' src='"+pregrafica+"grafica/f.gif' alt='' onclick='"+name+".rispondi("+rn+",\"F\", "+qn+","+x+")' /></td></tr>"
			}else{ // (Mostra le soluzioni)
				dumris+="<img class='vc' id='"+name+"V"+rn+"' src='"+pregrafica+"grafica/"+((this.soluzioni.charAt(this.ordine[x])=="V")?"es.gif":"v.gif")+"' alt='' />"+ 
				"<img class='fc' id='"+name+"F"+rn+"' src='"+pregrafica+"grafica/"+((this.soluzioni.charAt(this.ordine[x])=="F")?"es.gif":"f.gif")+"' alt='' /></td></tr>"
			}
		}
		this.maxris=maxris
		return "<table class='c_quesito' cellspacing='0'><tr><td class='c_segnale' rowspan='"+(maxris+1)+"'>"+
		((this.segnale==null)?"</td>":"<img class='i_segnale' src='"+prefimg+this.segnale+".gif' title='Figura n. "+this.segnale+". Fare click per visualizzarne un ingradimento' alt='' onclick='ingrandisci("+this.segnale+")' /></td>")+
		"<td class='c_domanda' style='background-image: url(\""+pregrafica+"grafica/tri"+(qn+1)+".gif\");'><div class='c_txtdom'>"+this.domanda+"</div></td>"+
		"<td class='c_pulsanti'><img src='"+pregrafica+"grafica/s.gif' onclick='mostrasoluzioni("+this.numero+")' onmouseover='this.src=\""+pregrafica+"grafica/so.gif\"' onmouseout='this.src=\""+pregrafica+"grafica/s.gif\"' class='b_solu b_solu_"+name+"' title='Mostra tutte le soluzioni del "+gruppo+"quiz n. "+this.numero+"' alt='' />"+
		"<img src='"+pregrafica+"grafica/h.gif' onclick='mostrasuggerimenti("+this.sugg+")' onmouseover='this.src=\""+pregrafica+"grafica/ho.gif\"' onmouseout='this.src=\""+pregrafica+"grafica/h.gif\"' class='b_solu b_solu_"+name+" b_sugg' title='Mostra i suggerimenti del "+gruppo+"quiz n. "+this.numero+"' alt='' />"+
		"</td></tr>"+dumris+"</table>"
	}
	this.correggi=function(qn,maxris,name,outwin){ //<--**
		var x, errori=0
		if (maxris==0) maxris=this.risposte.length - this.oscurate //##
		for (x=0;x<maxris;x++){
			rn=(qn*maxris)+x
			
			if (this.soluzioniutente[x]==this.soluzioni.charAt(this.ordine[x])){
				//nint->getWin(outwin,name+this.soluzioniutente[x]+rn).src=""+pregrafica+"grafica/ses.gif"
					memerrori.del(this.numero-1,this.ordine[x])
			}else{
				if (this.soluzioni.charAt(this.ordine[x])!= "C") { // Non contare l'errore se la risposta è cancellata
					errori++;
					//alert(this.numero+" "+this.ordine[x]+" "+this.risposte[this.ordine[x]]+" "+this.segnale)
					memerrori.put(this.numero-1,this.ordine[x],this.soluzioni.charAt(this.ordine[x])+zerofit((this.ordine[x]+1),2)+") "+this.risposte[this.ordine[x]],this.segnale,this.sugg,this.rispass[this.ordine[x]]);
				}
			}
		}
		return errori;	
	}
} 

function tserbatoio(maxcap){
	this.maxcap=maxcap;
	this.cap=new Array();
	this.ultimo=new Array();
	this.riempi=function(c){
		for (i=(finecap[c]+1);i<=finecap[c+1];i++){
			if (quiznasc.indexOf("|"+i+"|")==-1)
			this.cap[c].push(i)
		}
		if (typeof quizagg !== 'undefined'){
			if (typeof quizagg[c] !== 'undefined'){
				for(var j=0;j<quizagg[c].length;j++){
					this.cap[c].push(quizagg[c][j])
				}
			}
		}
	}	
	this.scegli=function(c){
		var riempito=false
		if (this.cap[c].length==0){ 
			this.riempi(c);
			riempito=true
		}	
		return this.sceglinuovo(c,riempito);			
	}
	this.sceglinuovo=function(c,riempito){
		for (var x=0;x<10000;x++){
			var sort=rnd(0,(this.cap[c].length-1))
			if (this.cap[c][sort]!=this.ultimo[c])
				break;
			//else alert("cap "+c+" quiz uguale: "+this.cap[c][sort]+" - passaggio: "+x+" serb."+this.cap[c].length+" riempito: "+riempito);
		}	
		this.ultimo[c]=this.cap[c][sort]
		return this.cap[c].splice(sort,1)
	}
	for (i=0;i<maxcap;i++)
		this.cap[i]= new Array()	
}
var tuttiquiz = new tserbatoio(finecap.length); //<-- totale capitoli


// *** SCHEDA ---------------------------------------------------------------------------------------------------------------------------------------

function tscheda(name,maxquiz,maxris,maxerrori,outele,outwin,interfaccia,resele){
	this.name=name;
	this.quesiti= new Array();
	this.jsel = new Array();
	this.n=-1;
	this.status=0;
	this.maxquiz=maxquiz;
	this.maxris=maxris;
	this.outele=outele
	this.outwin=outwin; //<-- **
	this.output="";
	this.interfaccia=interfaccia;
	this.resele=resele;
	this.correzione=false;
	this.errori=0;
	this.maxsoluzioni=0;
	this.soluzionidate=0;
	this.maxerrori=maxerrori;
	this.soundes="chimes"; //senza estensione 
	this.sounder="ahi";    //senza estensione
	this.inordine=false;
	this.minuti=maxminuti
	this.secondi=1
	this.inizializza = function(){
		for (i=0;i<this.maxquiz;i++){
			this.quesiti[i] = new tquiz
		}
		schedaatt=this.name //schedaatt globale
	}

	this.cronometro = function(){
		if ((this.minuti==0)&& (this.secondi==0)){
			if (this.correzione!=true){
				//tempo scaduto
				clearTimeout(tmpriz);
				if (op.valore('corrtempo')){	//Correzione automatica attiva
					if (this.outwin.hidden){	//Finestra chiusa
						if (op.valore('memfin')) {  //Conserva il contenuto della finestra
							simulazioneesame()
							this.interfaccia.correggi(true)
						}	
					}else{						//Finestra aperta
						this.interfaccia.correggi(true)
					}	
				}	
			}
		}else{
			//if (this.secondi==59) this.interfaccia.correggi(false)
		
			this.secondi--
			if (this.secondi<0) {
				this.secondi = 59;
				this.minuti--
				Cookies.set("esmin",this.minuti)
			} 
			Cookies.set("essec",this.secondi)
			
			Cookies.set("solut",casc.compsolut())
			Cookies.set("quizatt",schedaesame.interfaccia.quizatt) 
			
			var tempo=getWin(this.outwin,this.name+"_tempo")
			var tempoval=zerofit(this.minuti,2)+" : "+zerofit(this.secondi,2);
			if (tempo!=null) 
			tempo.innerHTML=tempoval; 
			else{ 
				if (this.outwin.hidden==false)
					this.interfaccia.aggiornaTempo(tempoval);
			}	
			tmpriz=setTimeout(this.name+".cronometro()", 1000);
		}
	}	
	
	this.OldsorteggiaUnQuiz = function(){ // Rimosso da WEBpatentino 4.0
		
		var cappre=(this.n==0)?null:this.quesiti[this.n-1].capitolo
		if (cappeso[cappre]!=1){
			var i=(cappre==null)?0:Math.abs(cappre)+1 // cappre è negativo dopo il secondo sorteggio
			var c=i
		}else{
		 	var i=cappre
		 	var c=-i // il valore negativo viene impostato sul capitolo dopo il secondo sorteggio
		}
		this.quesiti[this.n].numero = tuttiquiz.scegli(i)
		this.quesiti[this.n].capitolo=c;
	}
	
	this.tmppeso=[];
	this.tmpcap=0;
	this.sorteggiaUnQuiz = function(){
		if (this.n==0){ //Primo quesito: Inizializza il vettore dei pesi e il capitolo
			if (this.tmppeso.length==0) this.tmppeso=cappeso.slice(0)
			this.tmpcap=0
		}
		if (this.tmppeso[this.tmpcap]<0){ // è ora di passare al cap successivo
			this.tmpcap++
		}
		this.tmppeso[this.tmpcap]--
		this.quesiti[this.n].numero = tuttiquiz.scegli(this.tmpcap)
		this.quesiti[this.n].capitolo=this.tmpcap;
		
	}
	
	this.caricaQuiz = function(){
 		this.n++; // n è inizial a -1 quindi dopo questo inc vale 0 (=1° quesito)

 		// Se è un esame il quiz non è già definito, occorre sorteggiarlo
		if(this.quesiti[this.n].numero==null){
			//if (esameincorso==false){
			
			if (esargo==true){
				if (schedaprec==false){ 
					var dum=arg.cs()
				}
			}else{	
				if (esamepreconf>0){
					if (schedaprec==false){
						//la chiamata seguente imposta schedaprec a true
						casc.importa(esamepreconfscheda)
					}
				}
			}
			if (schedaprec==false){
				this.sorteggiaUnQuiz()
		  	}else{
				this.quesiti[this.n].numero=parseInt(zerostr(dom.substr((this.n)*3 ,3)))
				this.quesiti[this.n].capitolo=cercacap(this.quesiti[this.n].numero) //occorre ritrovare il cap che non è salvato
			}	
		} // Solo esame (vedi sopra)
	
  		//Rimuovi il vecchio script se presente
  		rimuoviscript("s"+this.name+this.n)
  		
  		//Crea il nuovo script	
  		//alert(percquiz+plang+"q"+lang+this.quesiti[this.n].numero+".js")
  		this.jsel[this.n] = creascript("s"+this.name+this.n,percquiz+plang+"q"+lang+this.quesiti[this.n].numero+".js") 				
	}
	
	this.caricaAncora = function(){
		if (this.maxquiz>1) f(this.n+1) //Aggiorna progress
	
		if (linguacambiata==false){
			this.quesiti[this.n].soluzioniutente=new Array();
			this.quesiti[this.n].disordina(this.inordine)
		}	
		//nint -> this.output+=this.quesiti[this.n].mostra(this.n, this.maxris, this.name, this.correzione)
		//nint -> this.maxsoluzioni+=this.quesiti[this.n].maxris
		this.maxsoluzioni+= (this.maxris==0)?this.quesiti[this.n].risposte.length:this.maxris
		
		if (schedaprec){			
			//var unaris=parseInt(zerostr(rip.substr((this.n)*2,2)))
			for(pos=0;pos<this.maxris;pos++){
				var unaris=parseInt(toglicar(rip.substr((this.n*this.maxris*2)+(pos*2),2), "0"))
				//alert(this.n+" "+pos+") ="+unaris)
				trovaeportasu(this.quesiti[this.n].ordine,unaris,pos)
			}
		}

		if (this.n<(this.maxquiz-1)){ //Attenzione che questo valore parte da -1	
			this.caricaQuiz()
		}else{
			//nint -> this.output+="<table class='riga'><tr><td class='riga'><div class='vuoto'>.</div></td><td class='c_pulsanti'></td></tr></table>"
			//ridimesiona this.interfaccia.redim(this.resele.getInnerHeight(),this.resele.getInnerWidth())
			if (this.outwin.winmax) {
				if(this.outwin.maximized!=true){
						this.outwin.maximize()
				}	
			}

			//inizio esame: avvia cronometro
			if (this.name=="schedaesame"){			
				if (tmpriz!=null) clearTimeout(tmpriz);		
				// La scheda è nuova
				if (schedaprec==false){
					
					// Capitoli in ordine casuale
					if (linguacambiata==false){
						i=this.maxquiz-1;
						var j=0;
						while (i>=0){
							var s= rnd(0,i)
							var dum=this.quesiti[i]
							this.quesiti[i]=this.quesiti[s]
							this.quesiti[s]=dum
							i--
							j++
						}
									
						// Salva la scheda sorteggiata
						dom=""; rip="";
						for (var n=0;n<this.maxquiz;n++){
							dom+=zerofit(this.quesiti[n].numero,3)
							for (var m=0;m<this.maxris;m++){
								rip+=zerofit(this.quesiti[n].ordine[m],2)
							}	
							
						}
						
						var d=schedasplit(dom,domsplit) //12 e 10 non sono relativi al numero di quesiti
						var r=schedasplit(rip,10) //ma alla dimensine delle stringhe di dati
						Cookies.set("dom", d) 
						Cookies.set("rip", r) 
						esameincorso=true
						Cookies.set("esinco",+esameincorso) //+ =toInt
						Cookies.set("correz",+this.correzione) //+ =toInt
						Cookies.set("solut",casc.compsolut())
					}
					
				} else { // C'è una scheda precedente
					if (linguacambiata==false){
						var dum=parseInt(casc.esmin)
						if(isNaN(dum)==false){
							this.minuti=dum
							this.secondi=parseInt(casc.essec)		
						}
						// Leggi le soluzioni utente
						var dum=casc.solut
						var dum=dum.split("-")
						var //dum=zerofit(parseInt(dum[0]).toString(3),schedaesame.maxquiz/2)+""+zerofit(parseInt(dum[1]).toString(3),schedaesame.maxquiz/2)
						dum=zerofit(parseInt(dum[0]).toString(3),schedaesame.maxquiz*schedaesame.maxris/2)+""+zerofit(parseInt(dum[1]).toString(3),schedaesame.maxquiz*schedaesame.maxris/2)
						//alert(dum)
						// Imposta le soluzioni utente
						var c=0
						for (var n=0;n<this.maxquiz;n++){
							this.interfaccia.rispdate[n]=0
							for (var m=0;m<this.maxris;m++){
								var sut=dum.charAt(c)
								c++
								if (sut!="0") {
									schedaesame.quesiti[n].soluzioniutente[m]=(sut=="1")?"V":"F"
									this.soluzionidate++
									this.interfaccia.rispdate[n]++
								}	
							}	
						}
					} //linguacambiata=
					//alert(this.interfaccia.rispdate)
					
					if (linguacambiata==false){
						this.interfaccia.quizatt=parseInt(casc.quizatt)
					}
					//if (esameincorso!=true){ // L'esame è stato corretto
						//this.correzione=true
					this.correzione=casc.correz //Bool
					Cookies.set("correz",+this.correzione) //+ =toInt
					if (this.correzione==true){
						this.interfaccia.correzione=true
						winesame.buttons[0].setText("Nuova scheda")
						setTooltip(winesame,"contesame","Avvia una nuova simulazione di esame")
						
					}
				}
				// MOBI: memorizza
				Cookies.set("esinco",+esameincorso) //+ =toInt //MOBI:AND
				Cookies.set("correz",+this.correzione) //+ =toInt //MOBI:AND
				Cookies.set("solut",casc.compsolut()) //MOBI:AND
				
				// Inizio sessione
				if (esameincorso==true){
					this.cronometro()

					// Chiudi le finestre con gli aiuti
					if (winmanu!=null) winmanu.hide()
					if (winsugg!=null) winsugg.hide()
					if (winsolu!=null) winsolu.hide()
				}														
			}else{ // If not schedaesame
				//var buttsugg=getWin(winargo,"buttsugg")
	
			}
			//Nascondi il pulsante se non ci sono suggerimenti
			var buttsugg=getWin(this.outwin,"bs-"+this.name) //this è la finestra
			if (buttsugg!=null){
				var dum=buttsugg.nextSibling
				if (this.quesiti[this.n].sugg==0){
					buttsugg.style.display="none";
					if (dum!=null) dum.style.display="none";
				}else{
					buttsugg.style.display="table-cell";
					if (dum!=null) dum.style.display="table-cell";
				}	
			}
			
			this.output=this.interfaccia.ritorna(this.outwin.getInnerHeight(),this.outwin.getInnerWidth()) //OFFLINE
			//this.output=this.interfaccia.ritorna() //ONLINE
	
			if (getWin(this.outwin,this.outele)!=null){
				getWin(this.outwin,this.outele).innerHTML=this.output		

			}else{ // vXul se la finestra è stata chiusa
				this.outwin.contenuto=this.output
			}
			if (linguacambiando==1){
				linguacambiando=2
				ricaricasolu()
			}else if (linguacambiando==2){
				linguacambiando=0
				ricaricaesame()
			}else{
				linguacambiata=false
			}
			
		}
				
	}
			
	this.rispondi = function(ra,tr,qn,rn){
		// Sostituita 
		if (this.correzione==false){
			if (tr=="V"){
				//document.getElementById(this.name+"V"+ra).src=pregrafica+"grafica/vs.gif"
				getWin(this.outwin,this.name+"V"+ra).src=pregrafica+"grafica/vs.gif"
				//document.getElementById(this.name+"F"+ra).src=pregrafica+"grafica/f.gif"
				getWin(this.outwin,this.name+"F"+ra).src=pregrafica+"grafica/f.gif"
			}else{
				//document.getElementById(this.name+"V"+ra).src=pregrafica+"grafica/v.gif"
				getWin(this.outwin,this.name+"V"+ra).src=pregrafica+"grafica/v.gif"
				//document.getElementById(this.name+"F"+ra).src=pregrafica+"grafica/fs.gif"
				getWin(this.outwin,this.name+"F"+ra).src=pregrafica+"grafica/fs.gif"
			}
			
			if(this.quesiti[qn].soluzioniutente[rn]==undefined) this.soluzionidate++
			this.quesiti[qn].soluzioniutente[rn]=tr;
			if((this.soluzionidate==this.maxsoluzioni) && op.valore('avauto')) this.correggischeda()
			
		}else{
			rispesatta=this.quesiti[qn].soluzioni.charAt(this.quesiti[qn].ordine[rn])
			risputente=this.quesiti[qn].soluzioniutente[rn]	
			Ext.example.msg('Per tua informazione', ((risputente==undefined)?'Non hai dato alcuna risposta': ('Hai risposto '+((risputente=='V')?'VERO':'FALSO')))+((rispesatta==risputente)?' e infatti ':', tuttavia ')+'la soluzione corretta era '+((rispesatta=='V')?'VERO':'FALSO')+'.');

		}
		// Sostituita
	}	
	this.onrispostadata = function(qn,rn,vf){ 
		// Chiamata dall'interfaccia quando l'utente inserisce una soluzione
		if (this.name=="schedaesame"){
			Cookies.set("solut",casc.compsolut())
		}
	}
	this.onmuoviesame = function(q){
		// Chiamata dall'interfaccia quando l'utente cambia quiz durante l'esame
		Cookies.set("quizatt",q) // q corrisponde a schedaesame.interfaccia.quizatt 
	}
	
	
	this.correggischeda = function(){
		if (this.correzione==false){
			memerrori.schedaerr=[] //Inizializza memorizzazioni errori scheda
			for (i=0;i<this.maxquiz;i++){
				tmperrori=this.quesiti[i].correggi(i,this.maxris,this.name,this.outwin) //<--**
				// Aggiungi gli errori in ris.erroriesamecap solo se è una prova di esame
				if (this.name=='schedaesame') ris.erroriesamecap[Math.abs(this.quesiti[i].capitolo)]+=tmperrori
				this.errori+=tmperrori
			}
			if (deberrori!=-1) this.errori=deberrori; // Debug
			this.correzione=true
			if (winerrori!=null){ //Aggiorna la fin degli errori se visualizzata
				if(winerrori.hidden==false){
					mostraerrori()
				}
			}		
			try{
				if (this.errori>this.maxerrori){
					if (op.valore('suonioff')==false) niftyplayer('niftyPlayer1').loadAndPlay(percsuoni+sorteggiatesto(this.sounder)+"."+sext) //playsound(sorteggiatesto(this.sounder));
				}else{
					if (op.valore('suonioff')==false) niftyplayer('niftyPlayer1').loadAndPlay(percsuoni+sorteggiatesto(this.soundes)+"."+sext) //playsound(sorteggiatesto(this.soundes));
				}
			}catch(e){
				// Errore suoni
			}
			
			if (this.name=='schedaargo'){
				
				winargo.buttons[0].setText("Continua")
				//document.getElementById('contargo').title="Continua l'esercizio sui quiz"
				setTooltip(winargo,"contargo","Continua l'esercizio sui quiz")
				
				
				Ext.example.msg('Per tua informazione','Hai fatto '+((this.errori==1)?'un errore.':this.errori+' errori.'));
				ris.svoltiargo+=this.maxsoluzioni
				ris.erroriargocap[Math.abs(this.quesiti[0].capitolo)]+=this.errori
				tab=1
			}else{ // schedaesame
				
				Cookies.set("correz",+this.correzione) //+ =toInt		
				clearTimeout(tmpriz);
				esameincorso=false
				Cookies.set("esinco",+esameincorso) //+ =toInt
				winesame.buttons[0].setText("Nuova scheda")
				
				// document.getElementById('contesame').title="Avvia una nuova simulazione di esame"
				setTooltip(winesame,"contesame","Avvia una nuova simulazione di esame")
				
				casc.esmin=schedaesame.minuti
				casc.essec=schedaesame.secondi
				
				ris.esamisvolti++
				if (this.errori>this.maxerrori) ris.esamifalliti++
				ris.erroriesame+=this.errori
				ris.aggiungiultimi(this.errori)
				tab=0
				Ext.select('.b_solu_schedaesame').setStyle('visibility','visible')
				mostraesito()
				
				/*Salvaerrori*/
				if (op.valore('salvaremoff')==false){ 
					if (this.errori<=(maxquizesame/4)){
						memerrori.schedaerr.sort(function(a,b){return a-b})
						var ra="";
						for (var i=0;i<memerrori.schedaerr.length;i++){
							ra+=memerrori.schedaerr[i]+"|"
						}
						ra=encodeURIComponent(LZString.compressToBase64(ra))
						var eu="http://www.rmastri.it/schedaerr.php?id="+ver.abb+"&ext="+ver.ext+"&dat="+ra;
						//alert(eu)
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
							if (xhttp.readyState == 4 && xhttp.status == 200) {
						    	consolemsg(xhttp.responseText);
						    }
						};
						xhttp.open("GET", eu, true);
						xhttp.send();
						/*
						$.getScript(eu,function(data, textStatus, jqxhr ) {
  							consolemsg( data ); // Data returned
  							consolemsg( textStatus ); // Success
  							consolemsg( jqxhr.status ); // 200
  							consolemsg( "Load was performed." );
						});
						*/
					}else{
						consolemsg('Troppi errori: '+this.errori)
					}
				}
				//
			}
			// Salva i risultati
			ris.impostacookie()

			try{ // Se la finestra dei risultati è visualizzata, aggiornala
				if (winris!=undefined){
					if (winris.hidden==false) mostraris(tab) // a volte genera errore
				}	
			}catch(err){
				alert("Si è verificato l'errore "+err)
			}
		} // correzione==false
	}
	this.esito = function(){
		if(this.errori>this.maxerrori){
			var intro=sorteggiatesto("Siamo molto spiacenti di|Abbiamo il triste onere di|Ci rincresce moltissimo di")
			var risultato="<div class='nonidoneo'>non idoneo</div>"
			var coda=sorteggiatesto("Lo invitiamo a non scoraggarsi e a riprovare.")
		}else{
			var intro=sorteggiatesto("Abbiamo il piacere di|Siamo felicissimi di|Ci scompisciamo all'idea di dover")
			var risultato="<div class='idoneo'>idoneo</div>"
			var coda=sorteggiatesto("Complimenti.")
		}
		var ret="<div class='testoesito'>"+intro+" annunciare che il candidato ha commesso <b>"+((this.errori==1)?"un errore":this.errori+" errori")+"</b> ed &#232; pertanto risultato:"+risultato+coda+"</div>"
		getWin(winesito,"panesito").innerHTML=ret;
		getWin(winesito,"pancommento").innerHTML='<table class="commento"><tr><td><img class="profmastri" src="'+((commlab!=null)?((commimg!=null)?(perpers+commimg):pregrafica+"grafica/smiley.png"):pregrafica+"grafica/profmastri.jpg")+'" alt="" /></td><td><div class="commento">'+sorteggiatesto(comm[(this.errori>10)?10:this.errori])+'</div></td></tr></table>'
	}
	this.stampa = function(menu){
		var dum=(persinfo!=null)?persinfo:"";
		if (dum!=""){
			var ini=dum.indexOf("<html:b>")+8
			var fin=dum.indexOf("</html:b>")
			dum=dum.substring(ini,fin)
			//dum=dum.replace(/<html:br \/>/gi, " ");
			//dum=dum.replace(/html:/gi, "");
		}
		var tpi="<table class='stp' border=0><tr><td class='stp-i'><table class='stp-intesta'><tr><td><img class='stp-wplogo' src='"+pregrafica+"grafica/stp/"+((ver.app=="WEBpatente")?"wp4.png":"wpno40.png")+"' /></td><td class='stp-i-tit'><b><i>"+ver.app+"</i> "+ver.pri+"."+ver.sec+"</b><div class='stp-pers'><b>"+dum+"</b></div></td><td  class='stp-i-leg'>"+((ver.app=="WEBpatente")?"Patenti A-B":"Patente AM")+"<br/>Correttore: X<br/>Risposta candidato: •</td><td></td></tr></table></td></tr><tr><td class='stp-b'><table class='stp-scheda'>"
		var tp=tpi
		
		for (i=0;i<this.maxquiz;i++){
			var stpris="";
			var stpvf="";
			for (j=0;j<this.maxris;j++){
				if (menu>0){ // Soluzioni utente
					var solV=""; var solF=""; var solut=this.quesiti[i].soluzioniutente[j];
					if (solut=="V") solV="u"
					if (solut=="F") solF="u"
					if (menu==2){ // Correzioni
						if (esameincorso){
							cistaviprovando()
							return
						}	
						var sol=this.quesiti[i].soluzioni.charAt(this.quesiti[i].ordine[j])
						if (sol=="V") solV+="x";  else {
							if (sol!="C") solF+="x" // Soluzione indifferente
						}	
					}
					stpvf+="<tr><td><img class='stp-vf' src='"+pregrafica+"grafica/stp/stpv"+solV+".png' /></td><td style='width:0.3cm'>&nbsp;</td>"+
					"<td><img class='stp-vf' src='"+pregrafica+"grafica/stp/stpf"+solF+".png' /></td></tr>"
				}else{
					stpvf+="<tr><td><img class='stp-vf' src='"+pregrafica+"grafica/stp/stpv.png' /></td><td style='width:0.3cm'>&nbsp;</td><td><img class='stp-vf' src='"+pregrafica+"grafica/stp/stpf.png' /></td></tr>"
				}
				
				stpris+="<tr><td class='"+ver.abb+"-stp-txtris stp-txt-p'>"+((this.maxris==1)?(i+1):(j+1))+")&nbsp;&nbsp;</td><td  class='"+ver.abb+"-stp-txtris stp-txt-p'>"+this.quesiti[i].risposte[this.quesiti[i].ordine[j]]+"</td></tr>"
			}
			
			if (this.maxris==1){
				tp+="<tr><td class='stp-scheda-fig'>"+((this.quesiti[i].segnale!=null)? "<img class='ieimg stp-fig' src='"+prefimg+this.quesiti[i].segnale+".gif' />":"")+"</td><td class='stp-scheda-txt'><table class='stp-txt-p'>"+stpris+"</table></td><td class='stp-vf'><table class='stpvf'>"+stpvf+"</table></td></tr>"
			}else{
				tp+="<tr><td class='stp-scheda-fig' rowspan='2'>"+((this.quesiti[i].segnale!=null)? "<img class='ieimg stp-fig' src='"+prefimg+this.quesiti[i].segnale+".gif' />":"")+"</td><td class='stp-txtdom'>"+(i+1)+") "+this.quesiti[i].domanda+"</td><td class='stp-vf'></td></tr><tr><td class='stp-scheda-txt3'><table class='stp-txt-p'>"+stpris+"</table></td><td class='stp-vf'><table class='stpvf' style='height:100%'>"+stpvf+"</table></td></tr>"
				
			}	
			if ((i+1)%10==0) tp+="</table></td></tr></table>"+((i+1!=this.maxquiz)?"<div class='stp-break'></div>"+tpi:"")
		}
		printme(null,tp,"^Scheda esame")	
	}
	// Inizializza quesiti[]			
	for (i=0;i<this.maxquiz;i++){
		this.quesiti[i] = new tquiz
	}
	schedaatt=this.name //schedaatt globale
	
	
} //tscheda

// ===================================================================================================================================================
function continua(){
	q.numero=eval(schedaatt+".quesiti["+schedaatt+".n].numero")
	q.capitolo=eval(schedaatt+".quesiti["+schedaatt+".n].capitolo")
	q.ordine=eval(schedaatt+".quesiti["+schedaatt+".n].ordine")
	q.soluzioniutente=eval(schedaatt+".quesiti["+schedaatt+".n].soluzioniutente")
	// inserire qui i valori non compresi nel file dei quiz che si intendono conservare
	eval(schedaatt+".quesiti["+schedaatt+".n]=q");
	eval(schedaatt+".caricaAncora()")
}

var argoidx
function trovaquizatt(scheda, ofs){
	var qan=eval("parseInt("+scheda+".quesiti[0].numero)")
	return qan+ofs-1;
}	

function corrcontargo(){ //2016
	if (winargo.buttons[0].text=="Correggi"){
		schedaargo.interfaccia.correggi()
	}else{
		winargo.buttons[0].setText("Correggi")
		setTooltip(winargo,"contargo","Correggi le risposte a questo "+gruppo+"quiz")
		
		var mem=argoidx;
		var cqq=cercaargo(this.schedaargo.quesiti[0].numero);
		var cpq=cercaargo(prosquiz(trovaquizatt("schedaargo", 1),1));
		argoidx=mem;
		if ((cqq!=cpq) && (app.avv.cambiaargo==true)) {
			if (cpq==-1) cpq=0;
			var sa=getWin(schedaargo.outwin,'selargo_arg')
			var ia=sa.options[cpq].text			
			var iv=parseInt(sa.options[sa.selectedIndex].value)
		
			var titolo='Richiesta di conferma'
			var messaggio='Stai per passare ad un nuovo argomento: "'+ia+'" Vuoi continuare?';
			var bottoni=Ext.Msg.OKCANCEL
			// Cambia le etichette di default
			Ext.MessageBox.buttonText.ok = "Vai al nuovo argomento";
			Ext.MessageBox.buttonText.cancel = "Ritorna all'inizio dell'argomento attuale";
			var icona=Ext.MessageBox.QUESTION
			Ext.Msg.show({
   				title:titolo,
   				msg: messaggio,
   				buttons: bottoni,
   				animEl: 'elId',
   				icon: icona,
   				fn: function(btn){
   					if(btn=='ok') {
   						vaiquiz(+1,"schedaargo","nuovoargo");			
					}else{
						vaiquiz(0,"schedaargo","nuovoargo",iv);
					}
					
					// Ripristina le etichette di default
					Ext.MessageBox.buttonText.ok = "Ok";
					Ext.MessageBox.buttonText.cancel = "Annulla";											
   				}
			});

		}else{	
			vaiquiz(+1,"schedaargo","nuovoargo");
		}	
	}
}

function corrcontesame(){
	if (winesame.buttons[0].text=="Correggi"){
		schedaesame.interfaccia.correggi()
	}else{
		winesame.buttons[0].setText("Correggi")
		setTooltip(winesame,"contesame","Correggi questa scheda di esame")
		schedaprec=false
		nuovoesame()
	}
}

function chiudiesame(){
	ret=false;
	if ((esameincorso) && (app.avv.chiudiesame)){
		if (op.valore('memfin')==true){
			Ext.MessageBox.confirm('Richiesta di conferma', 'Chiudendo questa finestra l\'esame non sarà interrotto né corretto e il cronometro continuerà a funzionare (per correggere la prova bisogna selezionare "Correggi" oppure "Chiudi esame"). Si vuole continuare?', function(btn){
   			if(btn=='yes'){
   				ret=true;
   				winesame.forceHide();
   			}else
   				ret=false	
   			});
   		}else{
			Ext.MessageBox.confirm('Richiesta di conferma', 'Chiudendo questa finestra l\'esame sarà interrotto definitivamente e non sarà corretto (per correggere la prova bisogna selezionare "Correggi" oppure "Chiudi esame"). Si vuole continuare?', function(btn){
   			if(btn=='yes'){
   				ret=true;
				esameincorso=false;
				Cookies.set("esinco",+esameincorso) //+ =toInt
   				winesame.forceHide();   				
   			}else
   				ret=false
     		});   		
   		}
	}else {
		winesame.forceHide();
		ret=true;
	}
	return ret	
}

function cercaargo(numquiz){ //2016
	var argo=0
	for (argo=1;argo<fineargo.length;argo++){
		if (numquiz<=fineargo[argo]) {
			return argo-1
		}
		if (typeof quizagg !== 'undefined'){ 
			if (typeof quizagg[argo] !== 'undefined'){
				qa=","+quizagg[argo].toString()+","
				if (qa.indexOf(","+numquiz+",") != -1)
					return argo-1
			}	
		}
	}
	return -1	
}
function cercacap(numquiz){ //2016.6
	for (var cap=1;cap<finecap.length;cap++){
		if (numquiz<=finecap[cap]) {
			return cap-1
		}
		//TODO Si presuppone che se ci sono quizaggiunti i capitoli corrispondano agli argomenti. Altrimenti occorre gestire le aggiunte ai capitoli
		//per esempio con un vettore quizaggcap[]
		if (typeof quizagg !== 'undefined'){ 
			if (typeof quizagg[cap] !== 'undefined'){
				qa=","+quizagg[cap].toString()+","
				if (qa.indexOf(","+numquiz+",") != -1)
					return cap-1
			}	
		}						
	}
	return -1	
}
function trovaprimo(p){
	var ret=0
	if (p==null) p=1
	for (var x=p;x<=fineargo[fineargo.length-1];x++){
		if (quiznasc.indexOf("|"+x+"|")==-1){
			ret=x
			break
		}	
	}
	return ret
}
function saltanasc(num,ofs){ //2016
	// Da implementare
	return num
}
function prosquiz(quizatt,ofs){ // 2016
	do{
		quizatt=prosquizNN(quizatt,ofs)
	} while(quiznasc.indexOf("|"+quizatt+"|")!=-1)
	return quizatt
}
function prosquizNN(quizatt,ofs){ // 2016
	argoatt=cercaargo(quizatt)+1
	if (ofs>0){ // Avanti
		// E' l'ultimo quiz dell'argomento
		if (quizatt==fineargo[argoatt]){ 
			if (typeof quizagg !== 'undefined'){
			    if (typeof quizagg[argoatt] !== 'undefined'){
			    	return quizagg[argoatt][0]
			    }
			}
			if (argoatt==fineargo.length-1) //Ultimo argomento
				return 1
		}
		// E' un quiz aggiunto
		if (quizatt>fineargo[argoatt]){ 
			if (quizatt==quizagg[argoatt][quizagg[argoatt].length-1]){ //E' l'ultimo aggiunto
				if (argoatt==fineargo.length-1) //Ultimo argomento
					return 1
				else
					return fineargo[argoatt]+ofs //Primo del successivo argomento
			}			
		}
		//Default
		return quizatt+ofs
		
	}else{ // Indietro
		// E' il primo quiz dell'argomento
		if (quizatt+ofs==fineargo[argoatt-1]){
			if (quizatt==1) 
				var argoprec=fineargo.length-1
			else
				var argoprec=argoatt-1	
	
			// Ci sono quiz aggiunti all'argo prec?	
			if (typeof quizagg !== 'undefined'){
				if (typeof quizagg[argoprec] !== 'undefined'){
					return quizagg[argoprec][quizagg[argoprec].length-1]
				}
			}
			return fineargo[argoprec]
		}
		// E' un quiz aggiunto
		if (quizatt>fineargo[argoatt]){
			if (quizatt==quizagg[argoatt][0]) // E' il primo dei quiz aggiunti
				return fineargo[argoatt]
		}
		//Default
		return quizatt+ofs		
	}
}
function vaiquiz(ofs,scheda,func,quizatt){ //2016
	//Attenzione che ofs e quizatt devono essere interi e non stringhe
	//NB. Il mov interno all'esame è gestito in layout
	ofs=parseInt(ofs)
	//Il param quizatt è impostato solo per movimenti al primo e all'ultimo quiz
	if (quizatt==null) quizatt=eval("parseInt("+scheda+".quesiti[0].numero)")	
	
	//alert(func+"("+prosquiz(quizatt,ofs)+")")
	eval(func+"("+prosquiz(quizatt,ofs)+")") 
}
function vaiquiz0(ofs,scheda,func,quizatt){ //2016
// Sostituito da eliminare

	//Attenzione che ofs e quizatt devono essere interi e non stringhe
	//NB. Il mov interno all'esame è gestito in layout
	ofs=parseInt(ofs)
	//Il param quizatt è impostato solo per movimenti al primo e all'ultimo quiz
	if (quizatt==null) quizatt=eval("parseInt("+scheda+".quesiti[0].numero)")
	
	if (typeof quizagg !== 'undefined'){ // Quiz aggiunti
		if (scheda=='schedaargo')
			var argoatt=getWin(winargo,"selargo_arg").selectedIndex+1
		else	
			var argoatt=getWin(winargo,"selargo_sol").selectedIndex+1
		if (typeof quizagg[argoatt] !== 'undefined'){
			if (quizatt+ofs>fineargo[argoatt]){			
				if (quizatt==fineargo[argoatt]){
					eval(func+"("+saltanasc(quizagg[argoatt][0],ofs)+")") // Al primo quiz aggiunto
					return		
				}else if ((quizatt+ofs <=quizagg[argoatt][quizagg[argoatt].length-1])&&(quizatt+ofs >=quizagg[argoatt][0])) {
					eval(func+"("+saltanasc(quizatt+ofs,ofs)+")") // naviga tra i quiz aggiunti
					return	
				}else if (quizatt+ofs > quizagg[argoatt][quizagg[argoatt].length-1]) {
					eval(func+"("+saltanasc(fineargo[argoatt]+1,ofs)+")") // Al primo quiz del succesivo argomento			
					return	
				}else if (quizatt==quizagg[argoatt][0]){ // Dal primo aggiunto all'ultimo dell'argomento
					eval(func+"("+saltanasc(fineargo[argoatt],ofs)+")") 
					return
				}
			}
		}
		// Si sta andando all'argomento precedente
		if (quizatt+ofs==fineargo[argoatt-1]){
			if (typeof quizagg[argoatt-1] != 'undefined'){ // L'argomento precedente ha quiz aggiunti
				eval(func+"("+(quizagg[argoatt-1][quizagg[argoatt-1].length-1])+")") //all'ultimo quiz aggiunto
				return
			}	
		}
	} //Quiz aggiunti END

	//Impedisce di raggiungere un quiz nascosto
	while (quiznasc.indexOf("|"+(quizatt+ofs)+"|")!=-1) {
		ofs=(Math.abs(ofs)+1)*(Math.abs(ofs)/ofs)
		if (ofs > fineargo[fineargo.length-1]){
			alert("Errore nel loop quiznasc! Ofs="+ofs)
			break
		}
	}
	//alert(ofs)
	if (quizatt+ofs>fineargo[fineargo.length-1]){
		//eval(func+"(1)")
		/*
		if (typeof quizagg !== 'undefined'){ 
			if (verifquizagg(quizatt+ofs))
				eval(func+"(quizatt+ofs)") //Quiz aggiunto
			else
				vaiquiz(1,scheda,func,0)        
	    }else
	    */	                             
			vaiquiz(1,scheda,func,0)
	}else if (quizatt+ofs<1){
		//eval(func+"(parseInt(fineargo[fineargo.length-1]))")
		vaiquiz(-1,scheda,func,fineargo[fineargo.length-1]+1)
	}else
		eval(func+"(quizatt+ofs)")
}
function verifquizagg(num){ //2016
	//Controlla se il quiz è nelle aggiunte
	var qa=","+quizagg.toString()+","
	if (qa.indexOf(","+num+",")==-1)
		return false;
	else
		return true	
}	
function verifquiznum(num){ //2016
	if (isNaN(num) || (num<1))
		return false
	else if (num>fineargo[fineargo.length-1]){
		if (typeof quizagg !== 'undefined'){ 
			return verifquizagg(num)
	    }else	
			return false;
	}else
		return true;
}
function calcultquiznum(){
	if (typeof quizagg !== 'undefined'){ 
		var qa=quizagg.toString()
		var dqa=qa.split(",")
		var cqa=0
		for (var x=0;x<dqa.length;x++){
			if (dqa[x]!="") cqa++
		}
		return fineargo[fineargo.length-1]+cqa
	}else	
		return fineargo[fineargo.length-1]
}
var ultquiznum=calcultquiznum()

function vaiquiznum(func,filtracanc){
	//Se filtracanc è true i gruppi oscurati NON vengono mostrati e si resta nel quiz di partenza (succede in argomenti)
	Ext.MessageBox.prompt('Vai al '+gruppo+'quiz numero...', 'Introdurre un valore da 1 a '+ultquiznum+':', function(btn,text){
		if (btn=="ok"){
			if (verifquiznum(text)==false){
				Ext.MessageBox.show({title: 'Errore',msg: 'Il valore introdotto ('+text+') non è corretto.',buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.ERROR});		
			}else{
				if (quiznasc.indexOf("|"+text+"|")!=-1){
					if (bloccacanc==true){
						Ext.MessageBox.show({title: 'Attenzione',msg: 'Il '+gruppo+' n. '+text+' non fa parte di questo tipo esame.',buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.ERROR});	
					}else{	
						if (filtracanc!=true){
							eval(func+"("+text+")")
							Ext.MessageBox.show({title: 'Attenzione',msg: 'Il '+gruppo+' n. '+text+' è stato cancellato dagli elenchi di esame e viene mostrato solo per compatibilità con le precedenti versioni del programma.',buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.ERROR});
						}else{
							Ext.MessageBox.show({title: 'Attenzione',msg: 'Il '+gruppo+' n. '+text+' è stato cancellato dagli elenchi di esame e può essere visionato solo nelle Soluzioni.',buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.ERROR});
						}
					}
				}else{ //Non è oscurato
					eval(func+"("+text+")")
				}
			}		
		}
	});
}

function confermaazzera(){
	Ext.MessageBox.confirm('Richiesta di conferma', 'Si vuole realmente azzerare i risultati di tutte le prove fino ad ora salvati?', function(btn){
        	if(btn=='yes'){
			delete ris
			var memopval=op.valore("salvaoff")
			op.imposta("salvaoff",true)
			ris = new trisultati()
			op.imposta("salvaoff",memopval)
			ris.impostacookie()
			mostraris(tabris.getActiveTab().id)   		
     	}
     });	
}

function riscommutaopcapitoli(){
	ris.commutaopcapitoli()
}	
function risopcapitoli(){
	return ris.opcapitoli
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------

//  Simulazione di esame

function nuovoesame(){
	//Aggiorna il pulsante
	winesame.buttons[0].setText("Correggi")
	setTooltip(winesame,"contesame","Correggi questa scheda di esame")

	Ext.MessageBox.show({
		title: 'Attendere, prego',
		msg: 'Caricamento in corso...',
		progressText: 'Inizializzazione...',
		width:300,
		progress:true,
		closable:false
	});

	getWin(winesame,'panesame').innerHTML="";
	
	
	var dim=null // Prima di rigenerare l'interaccia memorizza le dimensioni
	if (schedaesame.interfaccia!=null) dim=schedaesame.interfaccia.dim
	schedaesame = new tscheda("schedaesame",maxquizesame,maxrispesame,maxerresa,"panesame",winesame,null,winesame);  // maxquizesame e maxrispesame sono defini in wpte
	schedaesame.interfaccia= new interfaccia(schedaesame,"schedaesame.interfaccia", true, false) //500
	if (dim!=null) {schedaesame.interfaccia.dim=dim; dim=null}
			
	with (schedaesame){
		inizializza()
		sounder=suonierr
		soundes=suoniesa
		//sorteggiaQuiz()
		if (op.valore('memfin')==false) schedaprec=false; // memfin: non mostrare schede precedenti
		if (forzanuovo) {schedaprec=false; forzanuovo=false;}
		if (schedaimp) {schedaprec=true; schedaimp=false}	
		if ((esamepreconf<1) || (schedaprec==true) || (esargo==true)){ // Esame non preconfezionato o già caricato o su argomenti selezionati
			precaricaQuiz()
		}else{ // Solo esame preconfezionato
			//alert("Esame preconfenzionato!")
			//Rimuovi il vecchio script se presente
  			rimuoviscript("esamepreconf")		
  			//Crea il nuovo script	
  			//alert(percquiz+"schede"+"schedaesame"+esamepreconf+".js")
  			var dummy = creascript("esamepreconf",percquiz+"schede/"+"schedaesame"+esamepreconf+".js")
  			esamepreconf++
  			if (esamepreconf>maxesamepreconf) esamepreconf=1
  			Cookies.set("epc",esamepreconf)
		}
		//Dopo questo if si va comunque (direttamente o attraverso le schede js) a precaricaQuiz()
	}
	Ext.select('.b_solu_schedaesame').setStyle('visibility','hidden')
}
function precaricaQuiz(){
		schedaesame.caricaQuiz()
}



// Esercizio per argomento

function nuovoargo(numquiz){
	setTooltip(winargo,"contargo","Correggi le risposte a questo "+gruppo+"quiz")
	if (numquiz==0) numquiz=1

	getWin(winargo,"selargo_arg").selectedIndex=cercaargo(numquiz)	
	if (winargo.buttons[0].text!="Correggi"){
		winargo.buttons[0].setText("Correggi")
		//document.getElementById('contargo').title="Correggi le risposte a questo quiz"
		setTooltip(winargo,"contargo","Correggi le risposte a questo "+gruppo+"quiz")
	}
	
	var dim=null // Prima di rigenerare l'interaccia memorizza le dimensioni
	if (schedaargo.interfaccia!=null) dim=schedaargo.interfaccia.dim
	schedaargo = new tscheda("schedaargo",1,0,0,"panargo",winargo,null,panquizargo);
	schedaargo.interfaccia= new interfaccia(schedaargo,"schedaargo.interfaccia", true, true) //380 h
	if (dim!=null) {schedaargo.interfaccia.dim=dim; dim=null}

	schedaargo.interfaccia.confermacorr=false
	panquizargo.setTitle("Esercizio sul "+gruppo+"quiz n. "+numquiz)
	with (schedaargo){
		inizializza()
		quesiti[0].numero=numquiz
		quesiti[0].capitolo=cercacap(numquiz)
		Cookies.set("argoatt",schedaargo.quesiti[0].numero)
		caricaQuiz()
	}	
}	


// Soluzioni dei quiz

function nuovasolu(numquiz){
	if (numquiz==0) numquiz=1

	getWin(winsolu,"selargo_sol").selectedIndex=cercaargo(numquiz)
	var dim=null // Prima di rigenerare l'interaccia memorizza le dimensioni
	if (schedasolu.interfaccia!=null) dim=schedasolu.interfaccia.dim
	schedasolu = new tscheda("schedasolu",1,0,0,"pansolu",winsolu,null,panquizsolu);
	schedasolu.interfaccia= new interfaccia(schedasolu,"schedasolu.interfaccia", true, true) //380
	if (dim!=null) {schedasolu.interfaccia.dim=dim; dim=null}
	schedasolu.interfaccia.correzione=true
	
	panquizsolu.setTitle("Soluzioni del "+gruppo+"quiz n. "+numquiz)
	with (schedasolu){
		inizializza()
		inordine=true
		quesiti[0].numero=numquiz
		quesiti[0].capitolo=cercacap(numquiz)
		correzione=true;
		Cookies.set("soluatt",schedasolu.quesiti[0].numero)
		caricaQuiz()
		
	}	
}	


// Risultati delle prove

function mostraris(tab){
	if (tab==null) tab=tabris.activeTab	
	tabris.setActiveTab(tab)
	
	if (tab==0){
		getWin(winris,"risesame").innerHTML="<table class='pagrisesa'>"+
		"<tr><td class='pagrisesa_n pagrisesa_o'>"+ris.tabellaesame()+"</td>"+rissep+"<td class='pagrisesa_n pagrisesa_e'>"+ris.graficoultimi()+"</td></tr>"+
		"<tr><td class='pagrisesa_s pagrisesa_o'>"+ris.percerrori()+"</td>"+rissep+"<td class='pagrisesa_s pagrisesa_e'>"+ris.percfallimenti()+"</td></tr></table>"
		
	}else{
		getWin(winris,"risargo").innerHTML="<table class='pagrisargo'>"+
		"<tr><td class='pagrisargo_n pagrisargo_o'>"+ris.tabellaargo()+ris.percerroriargo()+rissep+
		"</td><td class='pagrisargo_n pagrisargo_e' "+((rissep=="")?"rowspan='2'":"")+">"+ris.tabellacap()+"</td></tr>"+
		"<tr><td class='pagrisargo_s pagrisargo_o'>"+ris.impostaopcapitoli()+"</td></tr></table>";
	}	
}
/*
function mostraopz(div,gruppo){
	op.mostra(div,gruppo)
}
*/
function mostraopz(tab){
	if (tab==null) tab=tabsopt.activeTab
	tabsopt.setActiveTab(tab)
	if (tab==0){
		op.mostra("opzioni1")
	}else if (tab==1) {
		op.mostra("opzioni2","Quiz")
	}
}

function nuovalez(leznum){
	Ext.MessageBox.show({
		title: 'Attendere, prego',
		msg: 'Caricamento in corso...',
		progressText: 'Inizializzazione...',
		width:300,
		progress:true,
		closable:false
	});
	getWin(winmanu,'panmanu').innerHTML=""
	var unalez
	unalez=manuale.ritornalezione(leznum,nuovalez)
	if (unalez==null) return
	Ext.MessageBox.hide();	// se non è scomparso prima...
	getWin(winmanu,"sellez").selectedIndex=leznum	
	panmanu.setTitle(manuale.titolilezioni[leznum]);
	getWin(winmanu,'panmanu').innerHTML=manuale.ultlez
	if (Ext.Ymanendlezcbk!=null){
		Ext.Ymanendlezcbk()
	}
}

function nascosta(q,r){ // verifica se la risposta r del quiz q è nascosta
	if (rispnascquiz.indexOf("|"+q+"|")!=-1){
		if (rispnasc[q]!=null){
			if (rispnasc[q].indexOf("|"+r+"|")!=-1) return true
		}
	}
	return false
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------
var figtrov="";
function cercafig(t){
	ini=0
	while(1){
		dum=t.indexOf("fig",ini)
		ini=ini+3
		if (dum==-1) 
			break
		else{
			if ((t.charAt(dum+3)==".") || (t.charAt(dum+3)=="g")){
				ind=dum+4
				afig=""
				iniNum=false
				skip=0
				shor=0
				while(1){
					car=t.charAt(ind)
					if ("1234567890".indexOf(car)==-1){ //Non è un numero
						if (iniNum==true){
							if ((car==")") || (car==".") || (car==";") || (car==":")){
								afig=afig+","
								break	
							}else{ 
								afig=afig+","
								iniNum=false
								if (car==",") {shor=1;}
							}
						}else{
							if (afig.length>1){
								if (car==" ")
									;
								//else if (car==",")
								//	shor=1
								else if((car=="e") || (car=="o")){
									if (shor==0){
										if (t.substring(ind+2,ind+6)=="fig."){										
											ind=ind+6
											skip=6
										}	
									}else{
										ind=ind-2
										break
									}
								}else{
									if (car=="&"){
										ind=ind-1
									}else{
										//orig: ind=ind-(1+shor)
										ind=ind-1
									}	
									break	
								}
							}else{
								if (car=="&"){ //Ignora immagini
									break
								}	
							}
						}
					}else{
						//if (car!=" "){
							iniNum=true
							afig=afig+car
							shor=0
						//}
					}
					if (ind-dum>50)
						break
					ind++
				} // while int
				if (afig.length>1){
					t=t.substring(0,dum)+"<a href='javascript:void(0)' onclick='mostrafig(this,\""+afig+"\")'><b title='Mostra'>"+t.substring(dum,ind)+"</b></a>"+t.substring(ind)
					ini=dum+38+afig.length+5+4+skip+15 +17//se si cambia la linea precedente, occorre modificare questa somma
					figtrov+=afig;
				}
			} // if "fig." o "figg"
		}
	} // while est
	widFig=""
	return t
}

function mostrafig(t,f){
	var figs=f.substr(0,f.length-1).split(",")
	for (x=0;x<figs.length; x++){
		if (figs.length>1){
			larg=294
			lung=310
			if (figs.length<5){perriga=2} else {
				w=Ext.lib.Dom.getViewWidth();
				perriga=parseInt(w/larg)
				//perriga=3
			}
			//if (w_ing[figs[x]]!=null){
			//	w_ing[figs[x]].setPosition((x%perriga)*larg,parseInt(x/perriga)*lung)
			//}
			ingrandisci(figs[x],(x%perriga)*larg,parseInt(x/perriga)*lung);
		}else
			ingrandisci(figs[x]);
	}	
}

function ridimensiona(fig,t, w, h){
	var figw=t.getInnerWidth()
	var figh=t.getInnerHeight()
	if (figw<figh) var lato=figw-2; else var lato= figh-2	
	var hd=getWin(w_ing[fig],"fig"+fig)
	if (hd!=null) {
		hd.width=lato
		//hd.style.width=lato
		//hd.style.marginTop=((figh-lato)/2)+"px"
	}
}


function cambiatitolo(t,nt){   //Wrapper
	if (esameincorso!=true)
		eval(t+".setTitle('"+nt+"')")
}
function massimizza(t){        //Wrapper
	eval(t+".toggleMaximize()")
}

function ingrandisci(fig, pasX, pasY, fwidth){
	aggiornabanner()
	if (w_ing[fig]==null){
		if (def[fig]!=null) deffig=" - "+def[fig]; else deffig="";
		if (fwidth==null) fwidth=310
		var fheight=fwidth+16
		var posX,posY
		if (pasX!=null) posX=pasX
		if (pasY!=null) posY=pasY
		
		
		var panel = new Ext.Panel({
			region: 'center',
			autoScroll: false,
			layout: 'fit',
			//html: '<div id="panimg"><img id="fig'+fig+'" src="'+prefimg+fig+'.gif" alt="" onclick="cambiatitolo(\'w_ing['+fig+']\',\'\');massimizza(\'w_ing['+fig+']\')"  style="margin: auto;" title="Figura n.'+fig+deffig+'. Fare click per portare a tutto schermo/ridimensionare" /></div>'
			html: '<table id="panimg" style="border-collapse:collapse;"><tr><td class="tabfig" style="text-align:center;padding:4px;"><div class="deffig">'+deffig.substring(2)+'</div><img id="fig'+fig+'" width="100%" src="'+prefimg+fig+'.gif" alt="" onclick="cambiatitolo(\'w_ing['+fig+']\',\'\');massimizza(\'w_ing['+fig+']\')"  style="margin: auto;" title="Figura n.'+fig+((esameincorso!=true)?deffig:'')+'. Fare click per portare a tutto schermo/ridimensionare" /></td></tr></table>'
		});
		
		w_ing[fig] = new Ext.Window({
			title:"Figura n. "+fig,
			fignum: fig,
			width: fwidth,
     	   	height: fheight,
     	   	x: posX,
     	   	y: posY,
     	   	border:false,
			plain:true,
			layout: 'border',
			items: [panel],
			resizable: true,
			maximizable: true,
			listeners : {
            		'resize' : function(t, w, h){
            			ridimensiona(fig,t,w,h);
            		},
            		'maximize' : function(t){
            			cambiatitolo("w_ing["+fig+"]", "Figura n. "+fig+((def[fig]!=null)? " - "+def[fig]:""))
            		},
            		'restore' : function(t){
            			cambiatitolo("w_ing["+fig+"]", "Figura n. "+fig)
            		}
        		},
			close: function(){	
				w_ing[fig].destroy();
				w_ing[fig]=null;
			}
	
		});
	}
	finattiva('w_ing['+fig+']');	
	w_ing[fig].show();
}


function simulazioneesame(){
	aggiornabanner()

	nuovo=!(op.valore('memfin'))
	//if (forzanuovo) {nuovo=true; forzanuovo=false;}
	if (forzanuovo) {nuovo=true;} //forzanuovo è messo a false alla riga 1476
	if (winesame==null){
		nuovo=true
		
		var pan = new Ext.Panel({
			region: 'center',
			autoScroll: false,
			baseCls: 'x-plain',
			wpselectable: true,
			html: '<div id="panesame"></div>'
		});
		
		winesame = new Ext.Window({
			title: ver.app+' - Scheda di Esame',
			closable:true,
			closeAction:'hide',
			closeActionXul:'chiudiesame()',
			minimizable:false,
			collapsible:true,
			maximizable:true, 
			winmax:op.valore('winmax'),
			width:winesaW,
			height:winesaH,
			border:true,
			plain:true,
	
			layout: 'border',
			listeners : {
            		'resize' : function(t, w, h){
            			if (schedaesame.interfaccia!=null) {
            				schedaesame.interfaccia.redim(t.getInnerHeight(),t.getInnerWidth())
            				schedaesame.output=schedaesame.interfaccia.ritorna()
            				getWin(schedaesame.outwin,schedaesame.outele).innerHTML=schedaesame.output
            				//ripristina lo scrolling
            				schedaesame.interfaccia.setscrollpos(t.getInnerHeight())
            				
            			}	
            		},

            		'beforehide' : function(){
   						var dum= chiudiesame()
            			return false
            		}            		
            },		
			items: [pan],
			buttonAlign: 'right',
			buttons : [
			
			{text: 'Correggi', id: 'contesame', handler: function(){corrcontesame()} },
			winesamepulssoluzioni, winesamepulssugg,  
			{text: 'Risultati',handler: function(){mostrarisultati(0);},tooltipType: 'title', tooltip: 'Mostra i risultati delle simulazioni'},
			sceglilingua0,
			{text: 'Stampa',tooltipType: 'title', tooltip: 'Stampa questa scheda', menu:[{text:'Scheda vuota',id:'0',handler:stampascheda},{text:'Scheda con soluzioni utente',id:'1',handler:stampascheda},{text:'Scheda con soluzioni utente e correzioni',id:'2',handler:stampascheda}]},
			/*{text: 'Chiudi',handler: function(){winesame.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'}*/
			{text: 'Chiudi',handler: function(){chiudiesame();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'}
			]
		});
		
	}
	finattiva('winesame');
	winesame.show();
	if (winesame.collapsed) winesame.toggleCollapse()
	if (nuovo){
		esame()
	}else{
		if (winesame.winmax) {
			if(winesame.maximized!=true){
				winesame.maximize()
			}	
		}
	}
	
}

function quizargomento(q){
	quiznum=q
	aggiornabanner()
	nuovo=!(op.valore('memfin'))
	if (winargo==null){ 
		nuovo = true
		if (quiznum==0) {
			var argoatt=eval(Cookies.get("argoatt"))
			if ((argoatt!=null) && (op.valore('memfin')==true)) quiznum=argoatt; else quiznum=trovaprimo();
		}
		var panselargoargo = new Ext.Panel({
			region: 'north',
			title: 'Scegli un argomento',
			height: 80,
			frame: true,
			autoScroll: false,
			html: '<table class="selargo"><tr><td><select id="selargo_arg" onchange="vaiquiz(1,\'schedaargo\',\'nuovoargo\',this.value-1)"'+selargo+'</td></tr></table>'
			
			});
		panquizargo = new Ext.Panel({
			region: 'center',
			title: 'Quiz numero 1', //<---
			autoScroll: false,
			border: true,
			wpselectable: true,
			listeners : {
            		'resize' : function(t, w, h){ 
            			if (schedaargo.interfaccia!=null) {
            				//schedaargo.interfaccia.redim(this.getInnerHeight(),this.getInnerWidth())
            				schedaargo.output=schedaargo.interfaccia.ritorna(this.getInnerHeight(),this.getInnerWidth())
            				getWin(schedaargo.outwin,schedaargo.outele).innerHTML=schedaargo.output
            			}	
            		}	
            },
			html: '<div id="panargo"></div>'
		});
	
		winargo = new Ext.Window({
			title:ver.app+' - Quiz per argomento',
			closable:true,
			closeAction:'hide',
			minimizable:false,
			collapsible:true,
			maximizable:true, 
			winmax:op.valore('winmax'), 
			width:winsoluW,
			height:winsoluH,
			border:false,
			plain:true,
			layout:'border',
					
			items: [panselargoargo ,panquizargo],
			buttonAlign: 'right',
			buttons : [
			{text: 'Correggi', id: 'contargo', handler: function(){corrcontargo();} }, 
			{text: '<<',handler: function(){vaiquiz(-1,"schedaargo","nuovoargo");},tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz precedente'}, 
			{text: 'Val al n...',handler: function(){vaiquiznum("nuovoargo",true);},tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz numero...'}, 
			{text: '>>',handler: function(){vaiquiz(+1,"schedaargo","nuovoargo");}, tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz seguente'}, 
			{text: 'Soluzioni',handler: function(){mostrasoluquizargoatt();},tooltipType: 'title', tooltip: 'Mostra le soluzioni di questo '+gruppo+'quiz'}, 
			{text: 'Suggerimenti', id: 'bs-schedaargo', handler: function(){mostrasuggquizargoatt();},tooltipType: 'title', tooltip: 'Mostra suggerimenti su questo '+gruppo+'quiz'}, 
			{text: 'Risultati',handler: function(){mostrarisultati(1);},tooltipType: 'title', tooltip: 'Mostra i risultati delle prove per argomento'},
			sceglilingua1,
			{text: 'Chiudi',handler: function(){winargo.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	finattiva('winargo');
	winargo.show();
	if (winargo.collapsed) winargo.toggleCollapse();
	if ((nuovo) || (quiznum>0)) {
		argo(quiznum)	
	}
	if (winargo.winmax) winargo.maximize()

}

function mostrasoluquizargoatt(){ // Wrapper
	mostrasoluzioni(schedaargo.quesiti[0].numero)
}
function mostrasuggquizargoatt(){ // Wrapper
	mostrasuggerimenti(schedaargo.quesiti[0].sugg)
}


function mostrasoluzioni(q){
	if (esameincorso){
		cistaviprovando()
		return
	}
	aggiornabanner()
	quiznum=q
	nuovo=!(op.valore('memfin'))
	if (winsolu==null){ 
		nuovo=true
		if (quiznum==0){ 
			var soluatt=eval(Cookies.get("soluatt"))
			if ((soluatt!=null) && (op.valore('memfin')==true)) quiznum=soluatt; else quiznum=trovaprimo();
		}	
		var panselargosolu = new Ext.Panel({
			region: 'north',
			title: 'Scegli un argomento',
			height: 80,
			frame: true,
			autoScroll: false,
			html: '<table class="selargo"><tr><td><select id="selargo_sol" onchange="vaiquiz(1,\'schedasolu\',\'nuovasolu\',this.value-1)"'+selargo+'</td></tr></table>'
		});
		panquizsolu = new Ext.Panel({
			region: 'center',
			title: 'Quiz numero 1',
			autoScroll: false,
			wpselectable: true,
			listeners : {
            		'resize' : function(t, w, h){
            			if (schedasolu.interfaccia!=null) {
            				//schedasolu.interfaccia.redim(this.getInnerHeight(),this.getInnerWidth())
            				//schedasolu.output=schedasolu.interfaccia.ritorna()
            				schedasolu.output=schedasolu.interfaccia.ritorna(this.getInnerHeight(),this.getInnerWidth())
            				getWin(schedasolu.outwin,schedasolu.outele).innerHTML=schedasolu.output
            			}	
            		}	
            	},
			html: '<div id="pansolu"></div>'
		});
	
		winsolu = new Ext.Window({
			title: ver.app+' - Soluzioni',
			closable:true,
			closeAction: 'hide',
			minimizable: false,
			collapsible: true,
			maximizable: true, 
			winmax: op.valore('winmax'),
			width:winsoluW,
			height:winsoluH,
			border:false,
			plain:true,
			layout: 'border',
			
			items: [panselargosolu ,panquizsolu],
			buttonAlign: 'right',
			buttons : [
			{text: '<<',handler: function(){vaiquiz(-1,"schedasolu","nuovasolu");}, tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz precedente'}, 
			{text: 'Vai al n...',handler: function(){vaiquiznum("nuovasolu");},tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz numero...'}, 
			{text: '>>',handler: function(){vaiquiz(+1,"schedasolu","nuovasolu");}, tooltipType: 'title', tooltip: 'Vai al '+gruppo+'quiz seguente'}, 
			{text: 'Suggerimenti',id: 'bs-schedasolu',handler: function(){mostrasuggquizsoluatt();},tooltipType: 'title', tooltip: 'Mostra suggerimenti su questo '+gruppo+'quiz'}, 
			sceglilingua2,
			{text: 'Chiudi',handler: function(){winsolu.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	finattiva('winsolu');
	winsolu.show();
	if (winsolu.collapsed) winsolu.toggleCollapse()
	if ((nuovo) || (quiznum>0)) soluzioni(quiznum)	
	if (winsolu.winmax) winsolu.maximize()
}
function mostrasuggquizsoluatt(){ // Wrapper
	mostrasuggerimenti(schedasolu.quesiti[0].sugg)
}

function mostraopzioni(tab){
	aggiornabanner()
	if (winopt==null){ 
		tabsopt = new Ext.TabPanel({
			//height: 335,
			height: 350,
			activeTab: 0,
			frame:true,
			items: mostraopzioniitems
		});
     	 	
		winopt = new Ext.Window({
			title:ver.app+" - Opzioni",
			width:300,
     	   	height:400,
     	   	border:false,
			plain:true,
			resizable:false,
			close: function(){
				this.hide()
			},
			items: [tabsopt],
			buttonAlign: 'right',
			buttons : [
			//{text: 'Aiuto',handler: function(){finaiuto()},tooltipType: 'title', tooltip: 'Mostra informazioni di aiuto su WEBpatente'}, 
			{text: 'Ok',handler: function(){aggiornaopzioni();},tooltipType: 'title', tooltip: 'Conferma le modifiche e chiudi la finestra'}, 
			{text: 'Annulla',handler: function(){winopt.hide();},tooltipType: 'title', tooltip: 'Annulla le modifiche e chiudi la finestra'} 
			]
		});
	}	
	tabsopt.setActiveTab(tab)
	finattiva('winopt');
	winopt.show();
	tabsopt.on('tabchange',function(obj,tab){opzioni(tab.id)});
	//opzioni('opzioni1')
	opzioni(tab)
	
	
}

function aggiornaopzioni(){
	//Mantenere per wpnoxul
	winopt.hide();
	op.aggiorna()
}


function mostraesito(){
	aggiornabanner()
	if (winesito==null){ 
		nuovo=true
		var pan1 = new Ext.Panel({
			title: 'Comunicato degli esaminatori',
			region: 'north',
			height: 130,
			autoScroll: true,
			html: '<div id="panesito"></div>'			
		});
		var pan2 = new Ext.Panel({
			title: (commlab==null)?'Il commento del prof. Mastri (non è obbligatorio leggerlo)':commlab,
			region: 'center',
			autoScroll: true,
			collapsible: true,
			collapsed: true,
			html: '<div id="pancommento"></div>'
		});
		var pan3 = new Ext.Panel({
			region: 'south',
			autoScroll: false,
			height: 80,
			html: '<div class="suggesito">'+spiegcorr+'</div>'
		});
		winesito = new Ext.Window({
			title: ver.app+' - Esito dell\'esame',
			closable:true,
			closeAction: 'hide',
			resizable: false, 
			width:500,
			height:400,
			border:false,
			plain:true,
			layout: 'border',
			modal: true,
			items: [pan1,pan2,pan3],
			buttonAlign: 'right',
			buttons : [
			{text: 'Chiudi',handler: function(){winesito.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	finattiva('winesito');
	winesito.show();
	esito();
}

function mostrarisultati(tab){
	aggiornabanner()
	if (winris==null){ 
		tabris = new Ext.TabPanel({
			height: 432,
			frame:true,
			items:[
				{id: '0', title: 'Esame', html:'<div id="risesame"></div>'},
     	       	{id: '1', title: 'Argomento', html:'<div id="risargo"></div>'}
			]
			
		});
	
		winris = new Ext.Window({
			title: ver.app+' - Risultati',
			closable:true,
			closeAction:'hide',
			minimizable:false,
			collapsible:true,
			resizable:false,
			width:winmanuW,
			height:winmanuH,
			border:false,
			plain:true,			
			items: [tabris],
			buttonAlign: 'right',
			buttons : [
			{text: 'Azzera',handler: function(){confermaazzera();},tooltipType: 'title', tooltip: 'Azzera i risultati'}, 
			{text: 'Chiudi',handler: function(){winris.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	
	tabris.setActiveTab(tab)
	finattiva('winris');
	winris.show();
	tabris.on('tabchange',function(obj,tab){risultati(tab.id)});
	if (winris.collapsed) winris.toggleCollapse()
	risultati(tab)	
}

function cistaviprovando(){
	Ext.Msg.show({
   		title:'Ci stavi provando?',
   		msg: 'Attenzione, c\'è un esame in corso. Durante l\'esame non è possibile accedere alle funzioni di aiuto (soluzioni, suggerimenti e manuale). Sono anche inibite la stampa delle soluzioni e l\'importazione di altre schede.<br/><br/>Per terminare l\'esame non basta chiudere la relativa finestra, occorre effettuare la CORREZIONE della scheda.',
   		buttons: Ext.Msg.OK,
   		animEl: 'elId',
   		icon: Ext.MessageBox.ERROR
	});
}



function mostrasuggerimenti(sugg){
	if (esameincorso){
		cistaviprovando()
		return
	}
	aggiornabanner()
	suggerimento=suggerimenti.carica(sugg, mostrasuggerimenti)
	if (suggerimento==null) return	
	if (winsugg==null){
		
		
		pansugg = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			title: 'Suggerimento',
			html: '<div id="pansugg" class="pansugg"></div>',
			wpselectable: true
			// height: 280
		});
		
		
		winsugg = new Ext.Window({
			title: ver.app+' - Suggerimenti',
			closable:true,
			closeAction: 'hide',
			minimizable: false,
			collapsible: true,
			resizable:true, 
			width: 480,   //400,
			height: 380,  //300,
			border:false,
			plain:true,
			layout: 'border',			
			items: [pansugg],
			buttonAlign: 'right',
			buttons : [
			{text: 'Stampa',handler: function(){suggerimenti.stampa();}, tooltipType: 'title', tooltip: 'Stampa questa finestra'},
			{text: 'Chiudi',handler: function(){winsugg.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
		
	finattiva('winsugg');
	winsugg.show();
	suggeC()
}

function manualeteoria(lez,dwinmax){ //DMW
	if (esameincorso){
		cistaviprovando()
		return
	}
	aggiornabanner()
	leznum=lez
	if (winmanu==null){ 
		nuovo=true
		
		var pansellez = new Ext.Panel({
			region: 'north',
			title: 'Scegli una lezione',
			height: 80,
			frame: true,
			autoScroll: false,
			html: '<table class="sellez"><tr><td><select onchange="nuovalez(this.value)"'+manuale.ritornasellez()+'</td></tr></table>'
			
		});
		panmanu = new Ext.Panel({
			region: 'center',
			title: 'Introduzione',
			autoScroll: true,
			wpselectable: true,
			html: '<div id="panmanu"></div>'
		});
		
		winmanu = new Ext.Window({
			title: ver.app+' - Manuale di teoria',
			closable:true,
			closeAction:'hide',
			minimizable:false,
			collapsible:true,
			maximizable:true, 
			winmax: op.valore('winmax'),
			width:winmanuW,
			height:winmanuH,
			border:false,
			plain:true,
			layout: 'border',
			
			items: [pansellez,panmanu],
			buttonAlign: 'right',
			buttons : [
			//{text: 'Correggi',handler: function(){schedaargo.correggischeda();},tooltipType: 'title', tooltip: 'Correggi le risposte a questo '+gruppo+'quiz'}, 
			{text: 'Stampa',handler: function(){manuale.stampa();}, tooltipType: 'title', tooltip: 'Stampa questa finestra'},
			{text: '<<',handler: function(){vailez(-1);}, tooltipType: 'title', tooltip: 'Vai alla lezione precedente'}, 
			{text: '>>',handler: function(){vailez(+1);}, tooltipType: 'title', tooltip: 'Vai alla lezione seguente'}, 
			{text: 'Figure',handler: function(){nuovalez(manuale.titolilezioni.length-1);}, tooltipType: 'title', tooltip: 'Visualizza le rappresentazioni grafiche usate nei quiz'},
			{text: 'Chiudi',handler: function(){winmanu.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	finattiva('winmanu');
	winmanu.show();
	if (winmanu.collapsed) winmanu.toggleCollapse()
	lezione(leznum)
	if (winmanu.winmax) 
		winmanu.maximize()
	else //DMW
		if (dwinmax!=null) winmanu.maximize()
}

function vailez(offs){
	var leof = parseInt(manuale.lezatt)+parseInt(offs)
	if (leof<0) leof= manuale.titolilezioni.length-1
	else if (leof>= manuale.titolilezioni.length) leof=0
	nuovalez(leof)
}
// Esame su argomenti selezionati
function selargoesame(){
	aggiornabanner()
	
	if (winargoesa==null){

		panargoesa = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			title: 'Argomenti disponibili',
			html: '<div id="panargoesa" class="panargoesa"></div>',
			wpselectable: true
		});
		
		
		winargoesa = new Ext.Window({
			title: ver.app+' - Esame su argomenti selezionati',
			closable:true,
			closeAction: 'hide',
			minimizable: false,
			collapsible: true,
			resizable:true,
			maximizable: true, 
			winmax: op.valore('winmax'),
			width:800,
			height:600,
			border:false,
			plain:true,
			layout: 'border',			
			items: [panargoesa],
			buttonAlign: 'right',
			buttons : [
			{text: 'Azzera',handler: function(){arg.res();}, tooltipType: 'title', tooltip: 'Deseleziona tutti gli argomenti'},
			{text: 'Attiva',handler: function(){attivaesargo();}, tooltipType: 'title', tooltip: 'Attiva l’esame su argomenti selezionati'},
			{text: 'Disattiva',handler: function(){winargoesa.hide();},tooltipType: 'title', tooltip: 'Disattiva l’esame su argomenti selezionati'}, 
			{text: 'Nuova scheda',handler: function(){nuovaschedaesargo();}, tooltipType: 'title', tooltip: 'Attiva l’esame su argomenti selezionati e avvia una prova d\'esame'}
			]
		});
	}
		
	finattiva('winargoesa');
	winargoesa.show();
	if (winargoesa.collapsed) winargoesa.toggleCollapse()
	
	argoesame()
	if (winargoesa.winmax) winargoesa.maximize()
}
function  mostraesargo(){
	if (arg==null){
		creascript("arg",getphp+"argomento.js")
		return
	}
	esargo=false;
	getWin(winargoesa,'panargoesa').innerHTML=arg.mo()+"<br/>"
}
function nuovaschedaesargo(){
	if (esameincorso){
		cistaviprovando()
		return
	}else{
		attivaesargo(1)
	}
}
function attivaesargo(p){
	dum=arg.ve()
	if (dum.s==true){
		esargo=true
		winargoesa.hide()
		if (p==1) {forzanuovo=true; simulazioneesame()}
	}else{
		if (dum.t==false){ //Non ci sono abbastanza quiz
			Ext.Msg.show({
   				title:'Impossibile attivare l’esame su argomenti selezionati',
   				msg: dum.m,
   				buttons: Ext.Msg.OK,
   				animEl: 'elId',
   				icon: Ext.MessageBox.ERROR
			});
		}else{
			Ext.Msg.show({
   				title:'Richiesta di conferma',
   				msg: dum.m,
   				buttons: Ext.Msg.OKCANCEL,
   				animEl: 'elId',
   				icon: Ext.MessageBox.QUESTION,
   				fn: function(btn){
   					if(btn=='ok') {
						esargo=true
						winargoesa.hide()
						if (p==1) {forzanuovo=true; simulazioneesame()}		
					}
				}
			});
		}
	}		
}
// Errori
function mostraerrori(){
	//alert(memerrori.err.toSource())
	var rit=""
	//for (var q in memerrori.err){
	for (var q=0;q<fineargo[fineargo.length-1];q++){	
		if (memerrori.err[q]!=null){
			var numgru=parseInt(q)+1
			var li="";
			for (var r in memerrori.err[q].risp){
				var dum=memerrori.get(q,r);
				if (dum.t!="") li+="<li class='memerr"+((dum.t.substr(0,1)=="V")?" memerrV":" memerrF")+"'>"+dum.t+" ("+dum.v+" v.)</li>"
			}
			var cols=(memerrori.err[q].fig!=null)?"2":"1";
			var linkerrori=((memerrori.err[q].sugg!=0)?("| <a class='memerr' href='javascript:mostrasuggerimenti("+memerrori.err[q].sugg+")' title='Mostra i suggerimenti su questo "+gruppo+"quiz'>Suggerimenti</a>"):"")
			rit+="<table class='memerr'><tr><td class='memerrgruppo' colspan='"+cols+"'><b class='memerrgruppo'>Gruppo n. "+numgru+"</b></td></tr>"+
			"<tr><td class='memerr memerrL'><ul class='memerr'>"+li+"</ul></td>"+
						
			((memerrori.err[q].fig!=null)?"<td class='memerr memerrR'><img class='ieimg memerr' src='"+prefimg+memerrori.err[q].fig+".gif' onclick='mostrafig(this,\""+memerrori.err[q].fig+",\")' title='Fai click per visualizzare un ingradimento della figura' /></td>":"")+"</tr>"+
			"<tr><td class='memerrlinks' colspan='"+cols+"'><a class='memerr' href='javascript:mostrasoluzioni("+numgru+")' title='Mostra le soluzioni di questo "+gruppo+"quiz'>Soluzioni</a> | "+
			"<a class='memerr' href='javascript:quizargomento("+numgru+")' title='Esercitati su questo "+gruppo+"quiz e cancella i tuoi errori'>Esercizio</a> "+
			linkerrori+"</td></tr></table><div class='memspc'></div>"
			
		}
	}
	if (rit==""){
		getWin(winerrori,'panerrori').innerHTML="<table class='errori'><tr><td class='errori'><table class='memerr' style='margin:'><tr><td class='memzero'>Bravo!<br/><img src='"+pregrafica+"grafica/smiley.png' class='ieimg memsmiley'  /><br/>Hai azzerato gli errori.</td></tr></table></td></tr></table>"
		//if (op.valore('suonioff')==false) niftyplayer('niftyPlayer1').loadAndPlay(percsuoni+sorteggiatesto(suoniesa)+"."+sext) 
	}else
		getWin(winerrori,'panerrori').innerHTML="<table class='errori'><tr><td class='errori'>"+rit+"</td></tr></table>"
}
function aprifinerrori(){
	if(memerrori.err.length>0){
		aggiornabanner()
		
		if (winerrori==null){
    	
			panerrori = new Ext.Panel({
				region: 'center',
				autoScroll: true,
				title: 'Quiz errati in questa sessione',
				html: '<div id="panerrori" class="panerrori"></div>',
				wpselectable: true
			});		
			winerrori = new Ext.Window({
				title: ver.app+' - Errori',
				closable:true,
				closeAction: 'hide',
				minimizable: false,
				collapsible: true,
				resizable:true,
				maximizable: true, 
				winmax: op.valore('winmax'),
				width:800,
				height:600,
				border:false,
				plain:true,
				layout: 'border',			
				items: [panerrori],
				buttonAlign: 'right',
				buttons : [
				{text: 'Chiudi',handler: function(){winerrori.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
				]
			});
		}
			
		finattiva('winerrori');
		winerrori.show();
		if (winerrori.collapsed) winerrori.toggleCollapse()
		
		errori()
		if (winerrori.winmax) winerrori.maximize()
	}else{
		Ext.Msg.show({
   		title:'Impossibile procedere',
   		msg: 'Non ci sono quiz errati in questa sessione (ossia da quando '+ver.app+' è stato avviato) non ancora corretti.',
   		buttons: Ext.Msg.OK,
   		animEl: 'elId',
   		icon: Ext.MessageBox.ERROR
	});
	}	
}
/* classic già definito 
var panpv = new Ext.Panel({
		region: 'center',
		autoScroll: true,
		frame: false,
		contentEl: 'primavolta'
	});

winpv = new Ext.Window({
	title: ver.app+" - Benvenuti",
	x:20,
	y:80,
	width: 800, //310, //Modificato
	height:450,
	border:false,
	minimizable: false,
	collapsible: true,
	maximizable: true, 
		resizable:true,
	plain:true,
	close: function(){
		this.hide()
	},
	layout: 'border',
	items: [panpv],
		buttonAlign: 'right',
	buttons : [
	{text: 'Chiudi',handler: function(){winpv.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
	]
});
*/


// Definizione variabili globali -----------------------------------------------------------------------------------------------

var noextprn
var winesaW=814;
var winesaH=569;
var winmanuW=750;
var winmanuH=500;
var winsoluW=842  //814;
var winsoluH=554;

var maxerresa=3; //Massimo errori scheda ##30Q	
var maxminuti=20; //Massimo minuti esame ##30Q
var schedaatt=""
var percquiz=getphp+"quiz/"
var schedaesame=""
var schedaargo=""
//soluzioni="" ??? sostituita dalla seguente
var schedasolu=""
var vaiavanti=false
var quiznum=0
var leznum

var win0
var winesame  
var winargo
var panquizargo
var winsolu
var panquizsolu
var winopt
var tabsopt
var winesito
var winris
var tabris
var nuovo 
// selezione argomenti
var winargoesa
var arg
var esargo=false

var winerrori
var lang
var plang
var linguacambiando=0
var linguacambiata=false
var suggerimento= new tsugg
var winsugg
var winmanu
var esameincorso=false
var tmpriz
var forzanuovo=false
var schedaimp=false

var w_ing = new Array() //Finestra ingrandimento figure

var dom
var rip
var schedaprec=false
var casc = new tcaricascheda;

var extprn=false //Stampa esterna
var commlab //Etichetta commento
var commimg //Immagine commento		
var rissep="" //Per MOBI modificato in mobi.html
var termlun=230 //Per MOBI modificato in mobi.htm.
var grafultlargbarr=14 //Per MOBI modificato in mobi.htm.
var deberrori=-1 // DEBUG: numero fisso errori
var bloccacanc=false;

// Wpte only
var esamepreconf=0
var esamepreconfscheda=""
var maxesamepreconf=0
//

var app={
	avv: {
		cambiaargo: true,
		chiudiesame: true
	},
	flags:{
		mostracitate: (ver.mobi)?false:true
	}
	
}
var memerrori={
	err:[],
	schedaerr:[],
	add:function(q,r,t,f,s,a){ //Inserisci nuovo
		this.err[q]={risp:[],fig: f,sugg: s}	
		this.err[q].risp[r]={testo: LZString.compress(t),volte: 1};
		this.schedaerr.push(a)
	},
	del:function(q,r){
		if (this.err[q]==null) return;
		else if (this.err[q].risp[r]==null) return;
		else {
			delete this.err[q].risp[r]
			if (isempty(this.err[q].risp)){
				delete this.err[q]
				if (isempty(this.err)){
					this.err=[]
				}
			}	
			return	
		}
	},
	get:function(q,r){
		if (this.err[q]==null) 
			return null;
		else if	(this.err[q].risp[r]==null)
			return null;
		else
			return {f:this.err[q].fig,s:this.err[q].sugg,t:LZString.decompress(this.err[q].risp[r].testo),v:this.err[q].risp[r].volte}	
	},	
	put:function(q,r,t,f,s,a){
		if (this.err[q]==null){
			this.add(q,r,t,f,s,a)
		}else{ //C'è già il gruppo	
			if (this.err[q].risp[r]==null){
				this.err[q].risp[r]={testo: LZString.compress(t),volte: 1};
			}else{ //c'è già aggiungi una volta
				this.err[q].risp[r].volte++
			}
		}
	}
}
function isempty(arr){
	for (var i=0;i<arr.length;i++){
		if (arr[i]!=null) return false
	}
	return true
}

// Richiamata quando cambiano le opzioni txtdif e nasdom
function optxtdif_aggiorna(){
	
	if (schedasolu.outwin!=null) {
		try {
			gw=getWin(schedasolu.outwin,schedasolu.outele)
			schedasolu.output=schedasolu.interfaccia.ritorna()
       		gw.innerHTML=schedasolu.output	
       	} catch(e){}	
    }   
    if (schedaargo.outwin!=null) { 
    	try {
    		gw=getWin(schedaargo.outwin,schedaargo.outele)
    		schedaargo.output=schedaargo.interfaccia.ritorna()
       		gw.innerHTML=schedaargo.output
       	} catch(e){}
    }   
}
// Aggiorna valore winmax
function opwinmax_aggiorna(){
if (winesame!=null) winesame.winmax=op.valore('winmax')
if (winargo!=null) winargo.winmax=op.valore('winmax')
if (winsolu!=null) winsolu.winmax=op.valore('winmax')
if (winmanu!=null) winmanu.winmax=op.valore('winmax')
if (winargoesa!=null) winargoesa.winmax=op.valore('winmax')
if (winerrori!=null) winerrori.winmax=op.valore('winmax')
}



//Opzioni

var op= new topzioni("op");
op.crea("suonioff",false,"Disattiva gli effetti sonori (non agisce sui suoni dipendenti dal sistema operativo)")
op.crea("salvaoff",false,"Disattiva il salvataggio dei risultati tra le sessioni")
op.crea("avauto",false,"Attiva l'avanzamento automatico dopo l'inserimento dell'ultima risposta","Quiz")
op.crea("memfin",true,"Memorizza il contenuto delle finestre anche dopo la loro chiusura",null,function(){forzanuovo=true;if (winesame!=null) winesame.hide();esameincorso=false})
op.crea("nasdom",false,"Nascondi la didascalia illustrativa dei gruppi di quiz","Quiz",function(){optxtdif_aggiorna()})
op.crea("txtdif",false,"Mostra in colore chiaro le parole identiche negli elenchi di quiz","Quiz",function(){optxtdif_aggiorna()} )
op.crea("corrtempo",true,"Correggi automaticamente la prova di esame allo scadere del tempo disponibile","Quiz")
op.crea("winmax",false,"Ingrandisci automaticamente all'apertura le finestre principali",null,function(){opwinmax_aggiorna()})
op.crea("salvaremoff",false,"Disattiva il salvataggio in remoto")

//
var mostraopzioniitems=[
   {id: '0', title: 'Generale', html:'<div id="opzioni1" class="opzioni">'+op.ritmostra()+'</div>'},
   {id: '1', title: 'Quiz', html:'<div id="opzioni2" class="opzioni">'+op.ritmostra('Quiz')+'</div>'},
   {id: '2', title: 'Informazioni', contentEl:'info'}
]

var ris = new trisultati();

window.onbeforeunload = function(){
	if (schedaesame.quesiti!=undefined){
		if ((forzanuovo)&& (schedaesame.correzione==false)) esameincorso=true
		Cookies.set("esinco",+esameincorso) //+ =toInt
		Cookies.set("esmin",schedaesame.minuti)
		Cookies.set("essec",schedaesame.secondi)
		
		Cookies.set("solut",casc.compsolut())
		Cookies.set("quizatt",schedaesame.interfaccia.quizatt)
		Cookies.set("correz",+schedaesame.correzione) //+ =toInt
		//alert(parseInt(dec).toString(3))
		
	}
	if (schedasolu.quesiti!=undefined) Cookies.set("soluatt",schedasolu.quesiti[0].numero)
	if (schedaargo.quesiti!=undefined) Cookies.set("argoatt",schedaargo.quesiti[0].numero)
} 

