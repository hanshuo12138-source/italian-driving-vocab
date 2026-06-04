// Variabili per la versione JavaScript

var sext = "mp3"             //Estensione effetti sonori
var percsuoni=presuoni+"suonimp3/"	  //Percorso della cartella degli effetti sonori  (suoni/ per versione xul)

var prefimg=pregrafica+"../immagini/s";  //Percorso delle figure
//var prefimg="immagini/s"

var perpers=""                //Non usato nella versione js

var percaudio=presuoni+ "../audio/"
var audioloc = new Array(); // Non usato nella versione js ma va definito

// ----------------------------------------------------

function finattiva(fin){
	//Questa funzione non fa nulla nella versione js
}

// Wrappers delle funzioni per la versione JS
function esame(){
	nuovoesame()
}
function argo(numquiz){
	nuovoargo(numquiz)
}
function soluzioni(numquiz){
	nuovasolu(numquiz)
}
function risultati(tab){
	mostraris(tab)
}
/*
function opzioni(div,gruppo){
	//op.mostra('opzioni1')
	mostraopz(div,gruppo)
}
*/
function opzioni(tab){
	mostraopz(tab)
}	
function esito(){
	schedaesame.esito()	
}
function sugge(){
	getWin(winsugg,'pansugg').innerHTML=suggerimento.testo+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function suggeC(){
	getWin(winsugg,'pansugg').innerHTML=LZString.decompress(suggerimento.testo)+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function lezione(numlez){
	nuovalez(numlez)
}
function argoesame(){
	mostraesargo()
}
function errori(){
	mostraerrori()
}

function getWin(win,id){
	// Ignora win perchè la finestra è unica
	return document.getElementById(id)
}

function rimuoviscript(sid){
	oldjs=document.getElementById(sid)
 	if (oldjs!=null) {
 		document.body.removeChild (oldjs);
 	}
} 

function creascript(sid,ssrc){
  	sh = document.createElement('SCRIPT');
  	sh.setAttribute("type","text/javascript");
  	sh.setAttribute("id",sid);
  	sh.setAttribute("src",ssrc);
  	document.body.appendChild(sh) 
  	return sh;  	
}	
function creacss (cid, chref){
  	var c = document.createElement('LINK');
	c.setAttribute("type","text/css");
	c.setAttribute("id",cid);
	c.setAttribute("rel","stylesheet");
	c.setAttribute("href",chref)
	document.getElementsByTagName("head")[0].appendChild(c)
  	return c;  	
}
function rimuovicss(cid){
	oldc=document.getElementById(cid)
 	if (oldc!=null) {
 		document.getElementsByTagName("head")[0].removeChild (oldc);
 	}
} 

function openbrowser(urltogo){
	open(urltogo)
}

function commuta(p,s){
	return eval(p+".commuta('"+s+"')")
}

function aggiornabanner(){
	document.getElementById('banspa').src=ban
}

function finaiuto(){
	winpv.show()
}

function setTooltip(win,id,t){
	dum=getWin(win,id)
	if (dum!=null) dum.setAttribute("title",t) //imposta l'attributo via dom
}


function salva(wp4url,filfor){
	//filfor= estensione del file 1=wpe/0=html
	var burl=document.location.toString()
	var interr=burl.indexOf("?")
	if (interr!=-1)
		burl=burl.substr(0,interr)
	document.location="http://www.rmastri.it/42/webpatente/espurl.php?wp4url="+wp4url+"&burl="+burl+"&epc="+esamepreconf+"&wpe="+filfor+"&ext="+ver.ext
}
function consolemsg(str){
	console.log(str)
}