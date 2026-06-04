// Layout - riproduce l'interfaccia dei quiz al computer
// ver. 2.00 - agosto 2010
// var prefimg="../immagini/s";
// var lang="it"
if (nosegnale==undefined){
	var nosegnale="<div style='height:100%;cursor:default;'></div>"
}

var audioa = new Image().src = pregrafica+"grafica/n2011/spka.png";
// var ordinale=["nessun","prim","second","terz","quart","quint","sest","settim","ottav","non","decim"]
function rettitle(str){
	if (str!=null) return str.replace( /'/gi,"’")
}		
function zerofit(str,fit){
	if (str==null) return ""
	str=str.toString()
	var ret=""
	for (var x=0; x<(fit-str.length);x++){
		ret+="0"
	}
	return ret+str
}

function separauguale(questo,quello){
	if (op.valore('txtdif')){
		if (quello==undefined) return questo
		var pquesto=questo.split(" ")
		var pquello=quello.split(" ")
		
		var ret="", lung=0
		for (var x=0;x<pquesto.length;x++){
			if (pquesto[x]!=pquello[x]){
				return  "<span class='uguale'>"+questo.substr(0,lung)+"</span><span class='diverso'>"+questo.substr(lung)+"</span>"
			}else{
				lung+=pquesto[x].length+1
			}	
		}
		return "<span class='uguale'>"+questo+"</span>"
	}else{
		return "<span class='diverso'>"+questo+"</span>"
	}	
}
var bakpuls=""
function pulsover(p){
	p.style.borderColor="#B8CFE5"
}
function pulsout(p){
	p.style.backgroundImage=bakpuls
	p.style.borderColor="#7A8A99"
}
function pulsdown(p){
	p.style.borderColor="#7A8A99"
	p.style.backgroundImage="url('"+pregrafica+"grafica/n2011/bakpulsdw.png')"
}
function pulsup(p){
	p.style.backgroundImage=bakpuls
}
var interfaccia= function(scheda, name, ridotta, minima,ih,iw){
	this.name=name
	this.riepilogo= false;
	this.correzione= false;
	this.ridotta=ridotta;
	this.minima=minima;
	this.h=ih;
	this.w=iw;
	this.confermacorr=true;
	this.scheda= scheda;
	this.scroll= -1;
	this.memscroll=0;
	this.perschermo=4; // Numero quiz mostrati per schermata (nel riepilogo)
	this.quizatt=0;
	this.decini=1; // primo valore della toolbar2
	this.schedanum="39"    // valore mostrato nella casella id =this.scheda.name+"_num"
	this.nomecand="MANTO CARMELO" // valore mostrato nella casella id =this.scheda.name+"_cand"
	this.rispdate= new Array();
	this.ritorna= function(h,w){
		this.redim(h,w)
		return this.tabnint(this.ritornacont())
	}
	this.ritornacont= function(){
		if(isNaN(this.quizatt)) this.quizatt=0;
		if (this.ridotta==false){
			if (this.riepilogo==false)
				return this.tabprinc(this.corpo(this.toolbar()+this.areaquiz()+this.sottoquiz()+this.piede(this.piedescheda())))
			else
				return this.tabprinc(this.corpo(this.tabriep()+this.bottriep()+this.piede(this.piederiep())))
		}else{
			if (this.minima==false){ //ridotta
				if (this.riepilogo==false){
					return this.tabridot(this.corpo(this.toolbar()+this.areaquiz()+this.piederidot()))
				}else{					
					return this.tabridot(this.corpo(this.testaridot()+this.tabriep()+this.bottriep()))
				}	
			}else{ //minima
				return "<table class='tabprinc' style='width:"+this.dim.tabprincW+"px; sheight:"+this.dim.tabminimaH+"px'><tr><td style='height:"+this.dim.minbordoH+"px'></td></tr>"+this.areaquiz()+"<tr><td style='height:"+this.dim.minbordoH+"px'></td></tr></table>"
				
			}	
		}							
	}
	this.tabnint= function(cont){
		return "<table class='nint'><tr><td class='nint' id='"+this.scheda.name+"_nint'>"+cont+"</td></tr></table>"
	}
	this.tabprinc= function(cont){
		return "<table class='tabprinc' style='width:"+this.dim.tabprincW+"px; height:"+this.dim.tabprincH+"px'>"+this.testa()+"<tr>"+cont+"</tr></table>"
	}
	this.tabridot= function(cont){
		return "<table class='tabprinc' style='width:"+this.dim.tabprincW+"px; height:"+this.dim.tabridotH+"px'><tr>"+cont+"</tr></table>"
	}
	this.testa= function(){
		return "<tr><td class='testa' ><img class='ieimg' id='"+this.scheda.name+"_testafig' style='height:"+this.dim.testafigH+"px' src='"+pregrafica+"grafica/n2011/testafig.png'></td></tr>"
	}
	this.corpo= function(cont){
		return "<td class='corpo'"+((this.riepilogo==true)?" style='background-color: #fbc8d9'":"")+"><table class='tabcorpo'>"+cont+"</table></td>"
	}
	this.toolbar2=function(){
		// Barra 2 (scelta unità)
		var x, x10=0, ret2="" 
		this.decini=(Math.floor(this.quizatt/10)*10)+1	
		for (x=this.decini;x<this.decini+10;x++){
			// x10++ //vale sempre da 1 a 10
			ret2+="<td id='"+this.scheda.name+"tbb2_"+x+"' class='toolbarbut' style='width: 10%;border-width:"+this.dim.bordogr+"px;"+((x==(this.quizatt+1))?"color: #d00000;":"")+"' onclick='"+this.name+".mostraquiz("+(x-1)+")' title='Vai alla domanda "+x+"'>"+x+"</td>"
		}
		return "<table cellspacing='0' class='toolbar1' style='width:"+this.dim.toolbar1W+"px;height:"+this.dim.toolbarbut1H+"px;font-family: Helvetica,arial;font-size:"+this.dim.H24+"px;'><tr>"+ret2+"</tr></table>"
	}
	this.toolbar= function(){
		var x,ret1="",ret3=""
		var sez= parseInt(this.scheda.maxquiz/10)
		// Barra 1 (scelta decine)
		for (x=1;x<=sez;x++){
			da=(x-1)*10+1
			//ret1+="<td class='toolbarbut' style='width:"+100/sez+"%;border-width:"+this.dim.bordogr+"px;' onclick='"+this.name+".mostraquiz("+(da-1)+")'><div class='tb1_dom' style='font-size:"+this.dim.H16+"px'>Domande</div><div style='font-size:"+this.dim.H24+"px;height:"+this.dim.tb1daaH+"px' title='Vai alla domanda "+da+"' ><span class='tb1_daa' style='font-size:"+this.dim.H16+"px'>&#160;&#160;&#160;da&#160;</span>&#160;"+da+"&#160;<span class='tb1_daa' style='font-size:"+this.dim.H16+"px'>&#160;a&#160;</span>&#160;"+(da+9)+"&#160;</div></td>"
			ret1+="<td id='"+this.scheda.name+"tbb1_"+(x-1)+"' class='toolbarbut' style='width:"+100/sez+"%;border-width:"+this.dim.bordogr+"px;"+(((x-1)==(Math.floor(this.quizatt/10)))?"color: #d00000;":"")+"' onclick='"+this.name+".mostraquiz("+(da-1)+")'><div class='tb1_dom' style='font-size:"+this.dim.H16+"px' title='Vai alla domanda "+da+"'>Domande&#160;&#160;da&#160;"+da+"&#160;a&#160;"+(da+9)+"</div></td>"
		}
		
		// Barra 3 (tutti)
		for (x=1;x<=this.scheda.maxquiz;x++){
			if (this.correzione!=true){
				ret3+="<td id='"+this.scheda.name+"tbb"+x+"' class='toolbarbut' style='width:"+this.dim.H23+"px;font-size:"+this.dim.H14+"px; cursor:default;"+((this.rispdate[x-1]==this.scheda.maxris)?"background-color:#d1e6d7;":"")+((x==(this.quizatt+1))?"color: #d00000;":"")+" border-width:"+this.dim.bordogr+"px;'>"+x+"</td>"
			}else{
				ret3+="<td id='"+this.scheda.name+"tbb"+x+"' class='toolbarbut' style='width:"+this.dim.H22+"px;font-size:"+this.dim.H14+"px; cursor:default;"
				if (this.scheda.quesiti[x-1].soluzioni.charAt(this.scheda.quesiti[x-1].ordine[0])!=this.scheda.quesiti[x-1].soluzioniutente[0])
					ret3+="background-color:#ff6161;color:#fff;"+((x==(this.quizatt+1))?"color: #200000;":"#d00000;")
				else
					ret3+="background-color:#d1e6d7;"+((x==(this.quizatt+1))?"color: #d00000;":"")
				ret3+="border-width:"+this.dim.bordogr+"px;cursor:pointer' onclick='"+this.name+".mostraquiz("+(x-1)+")'>"+x+"</td>"
			}		
		}
		return "<tr><td class='tabcorpo_toolbar' style='height:"+this.dim.toolbarH+"px;'>"+
		"<table class='toolbars'><tr><td class='toolbars' style='height: 38%'> <table cellspacing='0' class='toolbar1' style='width:"+this.dim.toolbar1W+"px;height:"+this.dim.toolbarbut1H+"px;font-family: Helvetica,arial;margin-bottom:"+this.dim.H3+";margin-top:"+this.dim.H6+"px'><tr>"+ret1+"</tr></table></td></tr>"+
		"<tr><td class='toolbars' style='height: 40%; spadding-bottom:"+this.dim.H10+"px'><div id='"+this.scheda.name+"toolbar2'>"+this.toolbar2()+"</div></td></tr>"+
		"<tr><td class='toolbars' style='height: 22%'><table class='toolbar3' style='swidth:"+this.dim.toolbar3W+"px;height:"+this.dim.toolbarbut3H+"px;'><tr>"+ret3+"</tr></table> </td></tr></table> </td></tr>"
		
	}
	this.areaquiz= function(){
		var ret=""
		ret+= "<tr><td class='tabcorpo_areaquiz' style='height:"+this.dim.areaquizH+"px;'><table class='areaquiz' ><tr>";
		ret+= "<td class='areaquizspzl' style='height:"+this.dim.areaquizH+"px;width:"+this.dim.spz1W+"px;'></td>"
		ret+= "<td class='areaquizdom' id='"+this.scheda.name+"dom'>"+this.domanda()+"</td>"
		ret+= "<td class='areaquizspzc'></td>"
		ret+= "<td class='areaquizris' id='"+this.scheda.name+"ris'>"+this.risposte()+"</td>"
		ret+= "<td class='areaquizspzl'></td>"
		return ret+="</tr></table></td></tr>"
	}
	this.odomanda= function(){
		var ret="<table class='domanda' border=1>"
		ret+="<tr style='height:"+this.dim.dommargH+"px;'><td colspan='5' class='dommargsup'></td></tr>"		
		ret+="<tr><td rowspan='1' style='width: 2%;'></td><td rowspan='1' class='domnum' style='font-size:"+this.dim.txttb+"px; height:"+this.dim.domnumH+"px; border-width:"+this.dim.bordogr+"px'>"+((this.minima!=true)?(this.quizatt+1):this.scheda.quesiti[this.quizatt].numero)+"</td>"
		ret+="<td rowspan='1' style='width: 2%'></td>"
		ret+="<td rowspan='2' class='domdom' style='font-size:"+this.dim.txtdomg+"px; height:"+this.dim.domdomH+"px;border-width:"+this.dim.bordost+"px'><div class='direc' dir='"+((lang=="ma")?"rtl":"ltr")+"'>"+this.scheda.quesiti[this.quizatt].domanda+"</div></td>"
		ret+="<td rowspan='2' style='width: 3%;'></td></tr> <tr><td rowspan='1'></td><td  rowspan='1' class='domaudio' style='height:"+(this.dim.domdomH-this.dim.domnumH)+"px'><img class='audio ieimg' style='height:"+this.dim.audioH+"px' src='"+pregrafica+"grafica/nint/audio.jpg' onclick='"+this.name+".audio(this,"+this.quizatt+")' title='Ascolta il testo della domanda' /></td><td rowspan='1'></td></tr>";
		ret+="<tr style='height:"+this.dim.domdomtH+"px'><td></td><td></td><td></td><td class='domdomt' style='font-size:"+this.dim.txttrad+"px;'>"+((lang!="it")?this.scheda.quesiti[this.quizatt].domandat:"")+"</td><td></td></tr>"
		ret+="<tr astyle='height:"+this.dim.domfigH+"px'><td colspan='5' class='domfig'>"+((this.scheda.quesiti[this.quizatt].segnale!=null)? "<img class='ieimg' style='height:"+this.dim.domfigH+"px' src='"+prefimg+this.scheda.quesiti[this.quizatt].segnale+".gif' onclick='ingrandisci("+this.scheda.quesiti[this.quizatt].segnale+")' title='Fai click per visualizzare un ingradimento della figura' />":"")+"</td></tr></table>"		
		dum=getWin(this.scheda.outwin,this.scheda.name+"tbb"+(this.quizatt+1))
		return ret
	}
	this.domanda= function(){
		var ret="<table class='domanda'>"
		var dum;
		ret+="<tr><td class='domfig' style='width:"+this.dim.domW+"px'>"+((this.scheda.quesiti[this.quizatt].segnale!=null)? "<img class='ieimg' style='height:"+parseInt(this.dim.domfigH)+"px' src='"+prefimg+this.scheda.quesiti[this.quizatt].segnale+".gif' onclick='ingrandisci("+this.scheda.quesiti[this.quizatt].segnale+",null,null,400)' title='Fai click per visualizzare un ingradimento della figura' />":nosegnale)
		ret+="</td></tr></table>"
		return ret
	}
	this.verofalso= function(x, hv, hf, sep){
		// x è il numero della risposta
		var ret="", vx="", fx="", titlev="", titlef=""
		if (this.correzione==false){	
			ret+="<td class='tabvf'><img class='vf ieimg' id='"+this.scheda.name+this.quizatt+x+"V'  style='height:"+hv+"px' title='Fai click se la risposta che intendi dare è VERO' src='"+pregrafica+"grafica/n2011/V"+((this.scheda.quesiti[this.quizatt].soluzioniutente[x]=="V")?"X":"")+".jpg' onclick='"+this.name+".rispondi(this,\"V\","+this.quizatt+","+x+")' /></td>"
			if (sep==true)ret+="<td class='tabvf'></td>"
			ret+="<td class='tabvf'><img  class='vf ieimg'  id='"+this.scheda.name+this.quizatt+x+"F'  style='height:"+hf+"px' title='Fai click se la risposta che intendi dare è FALSO' src='"+pregrafica+"grafica/n2011/F"+((this.scheda.quesiti[this.quizatt].soluzioniutente[x]=="F")?"X":"")+".jpg' onclick='"+this.name+".rispondi(this,\"F\","+this.quizatt+","+x+")' /></td>"
		}else{
			sol=this.scheda.quesiti[this.quizatt].soluzioni.charAt(this.scheda.quesiti[this.quizatt].ordine[x])
			solut=this.scheda.quesiti[this.quizatt].soluzioniutente[x]
			
			if (solut!=null){
				if (solut==sol){
					if (solut=="V") {vx="XES"; fx=""; titlev="Soluzione esatta: VERO"; titlef=titlev}else{vx=""; fx="XES"; titlef="Soluzione esatta: FALSO"; titlev=titlef}
				}else{
					if (solut=="V") {vx="XER"; fx=""; titlev="Si è risposto VERO ma la soluzione esatta è FALSO"; titlef=titlev}else{vx=""; fx="XER"; titlef="Si è risposto FALSO ma la soluzione esatta è VER0"; titlev=titlef}
				}	
			}else{
				if (this.scheda.name=="schedasolu")
					if (sol=="V") {vx="X"; fx=""; titlev="La soluzione esatta è: VERO"; titlef=titlev} else {vx=""; fx="X"; titlev="La soluzione esatta è: FALSO"; titlef=titlev} 
				else
					if (sol=="V") {vx="X"; fx=""; titlev="Non si è risposto; la soluzione esatta è: VERO"; titlef=titlev} else {vx=""; fx="X"; titlef="Non si è risposto; la soluzione esatta è: FALSO"; titlev=titlef}
				solut=''
			}
			
			ret+="<td class='tabvf'><img class='vf ieimg' id='"+this.scheda.name+this.quizatt+x+"V'  style='height:"+hv+"px' title='"+titlev+"' src='"+pregrafica+"grafica/n2011/V"+vx+".jpg' onclick='"+this.name+".rispinfo(\""+solut+"\",\""+sol+"\")' /></td>"
			if (sep==true) ret+="<td class='tabvf'></td>"
			ret+="<td class='tabvf'><img  class='vf ieimg'  id='"+this.scheda.name+this.quizatt+x+"F'  style='height:"+hf+"px' title='"+titlef+"' src='"+pregrafica+"grafica/n2011/F"+fx+".jpg' onclick='"+this.name+".rispinfo(\""+solut+"\",\""+sol+"\")' /></td>"
		}
		return ret
	}
	
	
	this.risposte= function(){
		
		var ret="<table class='risposte' style='width:"+this.dim.risW+"px'>"
		var maxris=this.scheda.maxris
		if (maxris!=0){ // Scheda di esame
			var didas=(this.correzione)?" title='Quesito n. "+this.scheda.quesiti[this.quizatt].rispass[this.scheda.quesiti[this.quizatt].ordine[0]]+"'":""
			// Domanda nr.
			ret+="<tr><td class='ris_alto'><div style='padding: "+this.dim.risaltoP+"px;padding-bottom:0px;'><div  style='overflow:visible;height:"+this.dim.risaltoH+"px;'>"
			ret+="<table class='ris_alto_testa' style='margin-bottom:"+(this.dim.risaltoP*2)+"px;'><tr><td style='text-align: right; font-size:"+this.dim.H22+"px'>Domanda numero&#160;&#160;</td><td class='domnum' style='font-size:"+this.dim.txttb+"px; height:"+this.dim.domnumH+"px; width:"+this.dim.domnumH+"px; border-width:"+this.dim.bordogr+"px'>"+((this.minima!=true)?(this.quizatt+1):this.scheda.quesiti[this.quizatt].numero)+"</td></tr></table>"
			// Testo quesito
			if (lang=='it'){
				var audiotmp=" onclick='"+this.name+".audio(getWin(\""+this.scheda.outwin+"\",\"au_0\"),"+this.quizatt+","+this.scheda.quesiti[this.quizatt].ordine[0]+")' title='Ascolta il testo del quesito'" 
				ret+="<div class='ris_testo' style='height:"+this.dim.ristestoH+"px;font-size:"+this.dim.H16+"px;line-height:"+this.dim.H25+"px'"+didas+"><div style='padding-top:"+this.dim.H8+"px;padding-bottom:"+this.dim.H8+"px;padding-left:"+this.dim.H8+"px;padding-right:"+this.dim.H8+"px'><span"+audiotmp+">"+this.scheda.quesiti[this.quizatt].risposte[this.scheda.quesiti[this.quizatt].ordine[0]]+"</span> <img id='au_0' class='audio ieimg' style='height:"+parseInt(this.dim.H18)+"px' src='"+pregrafica+"grafica/n2011/spk.png'"+audiotmp+" /></div></div>"
			}else{
				var audiotmp=" onclick='"+this.name+".audio(getWin(\""+this.scheda.outwin+"\",\"au_0\"),"+this.quizatt+","+this.scheda.quesiti[this.quizatt].ordine[0]+")' title='Ascolta il testo del quesito'"			
				ret+="<div><div class='ris_testo' style='height:"+this.dim.ristestoH/1.65+"px;font-size:"+((lang=='de')?this.dim.H13:this.dim.H14)+"px;line-height:"+this.dim.H24+"px'"+didas+"><div style='padding-top:"+this.dim.H8+"px;padding-bottom:"+this.dim.H8+"px;padding-left:"+this.dim.H8+"px;padding-right:"+this.dim.H8+"px'><span"+audiotmp+">"+this.scheda.quesiti[this.quizatt].risposte[this.scheda.quesiti[this.quizatt].ordine[0]]+"</span> <img id='au_0' class='audio ieimg' style='height:"+parseInt(this.dim.H18)+"px' src='"+pregrafica+"grafica/n2011/spk.png'"+audiotmp+" /></div></div>"
				ret+="<div style='text-align:left;font-size:"+this.dim.H14+"px;'>"+this.scheda.quesiti[this.quizatt].rispostet[this.scheda.quesiti[this.quizatt].ordine[0]]+"</div></div>"
			}
			
			ret+="</div></div></td></tr>";
			// Separatore
			ret+="<tr><td style='height:"+this.dim.H10+"px'> </td></tr>";
			ret+="<tr><td class='ris_basso' style='height:"+this.dim.risbassoH+"px'>"
			
			ret+="<table class='tabvf' style='font-size:"+this.dim.H12+"px;margin-top:"+this.dim.H18+"px'><tr><td class='tabvf' style='height:"+this.dim.H22+"px'>Vero</td><td class='tabvf' style='width:"+this.dim.spzvfW+"px'></td><td class='tabvf'>Falso</td></tr>"
			ret+="<tr>"+this.verofalso(0,this.dim.risvfH,this.dim.risvfH,true)
			ret+="</tr></table>"
		
		}else{ // maxris=0: mosra tutti quesiti del blocco
			if (maxris==0) maxris=this.scheda.quesiti[this.quizatt].risposte.length
			maxris-=this.scheda.quesiti[this.quizatt].oscurate //## Togli le oscurate (che sono in fondo così non vengono mostrate)
			
			ret+="<tr><td style='padding: "+this.dim.risaltoP+"px;height:100%;background-color:#fff; vertical-align: top'><table class='ris_alto_testa'><tr>"
			if (op.valore('nasdom'))
				ret+="<td style='text-align: right; font-size:"+this.dim.H16+"px'>Gruppo numero&#160;&#160;"
			else	
				ret+="<td style='font-size:"+this.dim.H16+"px;text-align:left;'><b>"+this.scheda.quesiti[this.quizatt].domanda+"</b> <span style='font-size: 0.7em'>["+this.scheda.quesiti[this.quizatt].nummin+"]</span>";	
			ret+="</td><td class='domnum' style='font-size:"+this.dim.txttb+"px; height:"+this.dim.domnumH+"px; width:"+this.dim.domnumH+"px; border-width:"+this.dim.bordogr+"px'>"+((this.minima!=true)?(this.quizatt+1):this.scheda.quesiti[this.quizatt].numero)+"</td></tr></table>";
				ret+="<div class='ris_tutte' style='overflow:auto; padding:0px;margin-top:"+this.dim.H9+"px; height:"+this.dim.risargoscrolH+"px; background-color: #fff;'>"
				
				ret+="<table class='ris_argo' style='font-size:"+this.dim.H14+"px;'>"//ERA H13
				var bkr=""//##
				var tmpbkr=" style='text-decoration:line-through;' title='Quiz cancellato e non più proposto negli esami' "; //##
				var tmpqn=(quiznasc.indexOf("|"+this.scheda.quesiti[this.quizatt].numero+"|")!=-1)?true:false //## Determina se tutto il quiz è oscurato
				
				for (var x=0;x<maxris;x++){
					if (this.scheda.name=="schedasolu"){//##
						if (tmpqn || nascosta(this.scheda.quesiti[this.quizatt].numero,x)) bkr=tmpbkr; else bkr=""; //## Se il quiz o la singola risposta è oscurata
					}//##
					var rn=(this.quizatt*maxris)+x
					var questo=this.scheda.quesiti[this.quizatt].risposte[this.scheda.quesiti[this.quizatt].ordine[x]]
					var quello=this.scheda.quesiti[this.quizatt].risposte[this.scheda.quesiti[this.quizatt].ordine[x-1]]
					if (lang!='it')
						var didas=" title='"+rettitle(this.scheda.quesiti[this.quizatt].rispostet[this.scheda.quesiti[this.quizatt].ordine[x]])+((this.correzione)?" - Quesito n. "+this.scheda.quesiti[this.quizatt].rispass[this.scheda.quesiti[this.quizatt].ordine[x]]+"'":"'")
					else
						var didas=(this.correzione)?" title='Quesito n. "+this.scheda.quesiti[this.quizatt].rispass[this.scheda.quesiti[this.quizatt].ordine[x]]+"'":""
					var audiotmp="onclick='"+this.name+".audio(getWin(\""+this.scheda.outwin+"\",\"au_"+x+"\"),"+this.quizatt+","+this.scheda.quesiti[this.quizatt].ordine[x]+")'"
					var audiotmp2=" title='Ascolta il testo del quesito'";
					ret+="<tr><td class='risris' style='border-width:"+this.dim.bordost+"px'"+didas+"><span "+audiotmp+((bkr=='')?audiotmp2:bkr)+">"+separauguale(questo,quello)+"</span>" //##+bkr
					ret+=" <img id='au_"+x+"' class='audio ieimg' style='height:"+this.dim.H10+"px' src='"+pregrafica+"grafica/n2011/spk.png' "+audiotmp+audiotmp2+" /></td>" 
					ret+=this.verofalso(x,this.dim.risargovfH,this.dim.risargovfH,false)+"</tr>"
				}
				ret+="</table>"
			ret+="</div>"
		}
		ret+="</td></tr></table>"
		return ret
	}
	
	this.orisposte= function(){
		var maxris=this.scheda.maxris
		if (maxris==0) maxris=this.scheda.quesiti[this.quizatt].risposte.length
		var x, ret="<div class='risposte' style='height:"+this.dim.areaquizH+"px;overflow:"+((maxris==3)?"hidden":"auto")+"'>"
		ret+="<table class='risposte'>"
		ret+="<tr><td colspan='7' style='height:"+this.dim.rismargH+"px;'></td></tr>"	
		for (x=0;x<maxris;x++){
		var rn=(this.quizatt*maxris)+x
		ret+="<tr><td class='risaudio' style='height:"+this.dim.risrisH+"px;'><img class='audio ieimg' style='height:"+this.dim.audioH+"px' src='"+pregrafica+"grafica/nint/audio.jpg' onclick='"+this.name+".audio(this,"+this.quizatt+","+x+")' title='Ascolta il testo della risposta' /></td><td class='risris' style='font-size:"+this.dim.txtrisg+"px;border-width:"+this.dim.bordost+"px'><div class='direc' dir='"+((lang=="ma")?"rtl":"ltr")+"'>"+this.scheda.quesiti[this.quizatt].risposte[this.scheda.quesiti[this.quizatt].ordine[x]]+"</div></td>"
			if (this.correzione==false){
				ret+="<td style='width: 3%; border-top: 1px solid #fff; border-bottom: 1px solid #fff'></td><td class='vf'><img class='vf ieimg' id='"+this.scheda.name+this.quizatt+x+"V' style='height:"+this.dim.risvfH+"px' src='"+pregrafica+"grafica/nint/V"+((this.scheda.quesiti[this.quizatt].soluzioniutente[x]=="V")?"X":"")+".jpg' onclick='"+this.name+".rispondi(this,\"V\","+this.quizatt+","+x+")' alt='ciao' title='Fai click se la risposta che intendi dare è vero' /></td>"
				ret+="<td style='width: 3%'></td><td class='vf' style='width: 10%; padding: 0px; vertical-align: middle;'><img class='vf ieimg' id='"+this.scheda.name+this.quizatt+x+"F' style='height:"+this.dim.risvfH+"px'  src='"+pregrafica+"grafica/nint/F"+((this.scheda.quesiti[this.quizatt].soluzioniutente[x]=="F")?"X":"")+".jpg' onclick='"+this.name+".rispondi(this,\"F\","+this.quizatt+","+x+")' alt='ciao' title='Fai click se la risposta che intendi dare è falso' /></td><td style='width: 3%'></td></tr>"
			}else{
				sol=this.scheda.quesiti[this.quizatt].soluzioni.charAt(this.scheda.quesiti[this.quizatt].ordine[x])
				solut=this.scheda.quesiti[this.quizatt].soluzioniutente[x]
				
				if (solut!=null){
					if (solut==sol){
						if (solut=="V") {vx="XES"; fx=""; titlev="Soluzione esatta: VERO"; titlef=titlev}else{vx=""; fx="XES"; titlef="Soluzione esatta: FALSO"; titlev=titlef}
					}else{
						if (solut=="V") {vx="XER"; fx=""; titlev="Si è risposto VERO ma la soluzione esatta è FALSO"; titlef=titlev}else{vx=""; fx="XER"; titlef="Si è risposto FALSO ma la soluzione esatta è VER0"; titlev=titlef}
					}	
				}else{
					if (sol=="V") {vx="X"; fx=""; titlev="Non si è risposto; la soluzione esatta è: VERO"; titlef=titlev} else {vx=""; fx="X"; titlef="Non si è risposto; la soluzione esatta è: FALSO"; titlev=titlef}
					solut=''
				}		
					
				ret+="<td style='width: 3%'></td><td style='width: 10%; padding: 0px; vertical-align: middle;'><img class='vf ieimg' title='"+titlev+"' id='"+this.scheda.name+this.quizatt+x+"V' style='height:"+this.dim.risvfH+"px' src='"+pregrafica+"grafica/nint/V"+vx+".jpg' onclick='"+this.name+".rispinfo(\""+solut+"\",\""+sol+"\")' /></td>"
				ret+="<td style='width: 3%'></td><td style='width: 10%; padding: 0px; vertical-align: middle;'><img class='vf ieimg' title='"+titlef+"' id='"+this.scheda.name+this.quizatt+x+"F' style='height:"+this.dim.risvfH+"px' src='"+pregrafica+"grafica/nint/F"+fx+".jpg' onclick='"+this.name+".rispinfo(\""+solut+"\",\""+sol+"\")'/></td><td style='width: 3%'></td></tr>"
			}	
			ret+="<tr><td></td><td colspan='3' class='risrist' style='height:"+this.dim.risristH+"px; font-size:"+this.dim.txttrad+"px'>"+((lang!="it")?this.scheda.quesiti[this.quizatt].rispostet[this.scheda.quesiti[this.quizatt].ordine[x]]:"")+"</td><td colspan='3'></td></tr>"
		}	
		ret+="</table></div>" 
		return ret
	}
	this.sottoquiz=function(){
		return "<tr><td class='tabcorpo_sottoquiz' style='height:"+this.dim.sottoquizH+"px;'></td></tr>"
	}
	this.piederidot=function(){
		var ret= "<tr><td class='tabcorpo_sottoquiz' style='height:"+this.dim.piederidotH+"px;'><table class='piede' style='height: "+this.dim.piederidotH+"px;'><tr>"
		ret+="<td style='width:70%;vertical-align:middle'>"+this.tempo()+"</td><td><img class='ieimg but' src='"+pregrafica+"grafica/n2011/riep.jpg' onclick='"+this.name+".mostnascriep()' title='Visualizza il quadro di riepilogo delle domande, comprensivo anche delle risposte date' style='height:"+this.dim.botriepH+"px' /></td>"
		ret+="<td class='piede_prec'><img class='piede_prec ieimg' style='width:"+parseInt(this.dim.botprecsuccH)+"px;height:"+parseInt(this.dim.botprecsuccH)+"px' src='"+pregrafica+"grafica/n2011/indietro.jpg' onclick='"+this.name+".precsucc(-1)' title='Vai alla domanda precedente' /></td>"
		ret+="<td class='piede_succ'><img class='piede_succ ieimg' style='width:"+parseInt(this.dim.botprecsuccH)+"px;height:"+parseInt(this.dim.botprecsuccH)+"px' src='"+pregrafica+"grafica/n2011/avanti.jpg' onclick='"+this.name+".precsucc(+1)' title='Vai alla domanda successiva' /></td>"
		ret+="</tr></table></td></tr>"
		return ret
	}
	this.testaridot=function(){
		return "<tr><td style='height:"+this.dim.testaridotH+"px;'></td></tr>"
	}
	
	this.tabriepscheda= function(){
		var x, y, ret="<table class='tabriep' id='"+this.scheda.name+"_tabriep-tutto'>"
		if (this.scroll==-1){
			var limiteinf=0
			var limitesup=this.scheda.maxquiz
		}else{
			var limiteinf=this.scroll
			var limitesup=this.scroll+this.perschermo
		}
		ck="<img class='ieimg' src='"+pregrafica+"grafica/n2011/ck.png' style='width:"+parseInt(this.dim.H26)+"px;' />"
		cker="<img class='ieimg' src='"+pregrafica+"grafica/n2011/cker.png' style='width:"+parseInt(this.dim.H26)+"px;' />"
		ckes="<img class='ieimg' src='"+pregrafica+"grafica/n2011/ckes.png' style='width:"+parseInt(this.dim.H26)+"px;' />"
		
		for (x=limiteinf;x<limitesup;x++){
			var maxris=this.scheda.maxris
			if (maxris==0) maxris=this.scheda.quesiti[x].risposte.length
			var rowspan=maxris +1
			
			var fig=+this.scheda.quesiti[x].segnale
			ret+="<tr><td onclick='"+this.name+".mostnascriep("+x+")' rowspan='"+rowspan+"' class='tabriep tabriepnum' style='height:"+this.dim.rigariepH+"px;width:"+this.dim.riepnumW+"px;border-width:"+this.dim.bordogr+"px;padding-top:"+this.dim.H24+"px;font-size:"+this.dim.H22+"px' title='Fai click per "+((this.correzione)?"visualizzare la":"modificare la risposta alla")+" domanda "+(x+1)+"'>"+(x+1)+"</td>"
			ret+="<td onclick='"+this.name+".mostnascriep("+x+")' rowspan='"+rowspan+"' class='tabriep tabriepfig' style='width:"+this.dim.riepfigW+"px;border-width:"+this.dim.bordogr+"px;' title='Fai click per "+((this.correzione)?"visualizzare la":"modificare la risposta alla")+" domanda "+(x+1)+"'>"+((fig>0)?"<img class='tabriepfig ieimg' style='height:"+this.dim.riepfigH+"px' src='"+prefimg+fig+".gif' alt=''/>":"")+"</td>"
			
		//ret+="<td class='tabriep tabriepdom' title='"+((lang!="it")?rettitle(this.scheda.quesiti[x].domandat):"")+"' style='width:"+this.dim.riepdomW+"px;height:"+this.dim.riepdomH+"px;border-width:"+this.dim.bordogr+"px;font-size:"+this.dim.txtdom+"px; line-height:"+this.dim.txtdom+"px'><div class='direc' dir='"+((lang=="ma")?"rtl":"ltr")+"'>"+((this.correzione)? "<a href='javascript:"+this.name+".mostrasolu("+x+")' title='Mostra le soluzioni di questo "+gruppo+"quiz'><b>Gruppo "+this.scheda.quesiti[x].numero+" ["+this.scheda.quesiti[x].nummin+"]</b></a> - "+this.scheda.quesiti[x].domanda+" <a href='javascript:"+this.name+".mostrasugg("+x+")' title='Mostra suggerimenti su questo gruppo di quiz'>[H]</a>":"Testo della domanda")+"</div></td>"
		ret+="<td class='tabriep tabriepdom' style='width:"+this.dim.riepdomW+"px;height:"+this.dim.riepdomH+"px;border-width:"+this.dim.bordogr+"px;font-size:"+this.dim.txtdom+"px; line-height:"+this.dim.txtdom+"px'><div class='direc' dir='"+((lang=="ma")?"rtl":"ltr")+"'>"+((this.correzione)? "<a href='javascript:"+this.name+".mostrasolu("+x+")' title='Mostra le soluzioni di questo "+gruppo+"quiz'><b>Gruppo "+this.scheda.quesiti[x].numero+" ["+this.scheda.quesiti[x].nummin+"]</b></a> - "+this.scheda.quesiti[x].domanda+" <a href='javascript:"+this.name+".mostrasugg("+x+")' title='Mostra suggerimenti su questo gruppo di quiz'>[H]</a>":"Testo della domanda")+"</div></td>"	
			ret+="<td class='tabriep tabriepvf' style='width:"+this.dim.riepvfW+"px;border-width:"+this.dim.bordogr+"px;font-size:"+this.dim.txtpuls+"px'>V</td><td class='tabriep tabriepvf' style='width:"+this.dim.riepvfW+"px;border-width:"+this.dim.bordogr+"px;font-size:"+this.dim.txtpuls+"px'>F</td></tr>"
			
			for (y=0;y<maxris;y++){
				var rn=(x*maxris)+y
				solut=this.scheda.quesiti[x].soluzioniutente[y]
				//var didas=(this.correzione)?" Quesito n. "+this.scheda.quesiti[this.quizatt].rispass[this.scheda.quesiti[this.quizatt].ordine[x]]+"":""
				var didas=(this.correzione)?(((lang!='it')?" - ":"")+"Quesito n. "+this.scheda.quesiti[x].rispass[this.scheda.quesiti[x].ordine[y]]):""
				if (this.correzione==true){
					sol=this.scheda.quesiti[x].soluzioni.charAt(this.scheda.quesiti[x].ordine[y])	
					if (solut!=null){
						if (solut==sol){
							var titris="Soluzione esatta: "+((solut=="V")?"VERO":"FALSO")
							if (solut=="V") {vimg=ckes;fimg=""; vcol="background-color: green;"; fcol="";}else{vimg="";fimg=ckes;vcol=""; fcol="background-color: green;"}
						}else{
							var titris="Si è risposto: "+((solut=="V")?"VERO":"FALSO")+ " ma la soluzione esatta è: "+((sol=="V")?"VERO":"FALSO")
							if (solut=="V") {vimg=cker;fimg="";vcol="background-color: #e00000;"; fcol=""}else{vimg="";fimg=cker;vcol=""; fcol="background-color: #e00000;"}
						}
					}else{
						var titris="Non si è risposto; la soluzione esatta è: "+((sol=="V")?"VERO":"FALSO")
						//if (sol=="V") {vcol="background-color: navy;"; fcol=""}else{vcol=""; fcol="background-color: navy;"}
						vcol=""; fcol="";
						if (sol=="V") {vimg=ck; fimg=""} else{vimg=""; fimg=ck}
					}	
				}else{ //Correzione non effettuata
					if (solut!=null){
						//if (solut=="V") {vcol="background-color: navy;"; fcol=""}else{vcol=""; fcol="background-color: navy;"}
						if (solut=="V") {vimg=ck; fimg=""} else{vimg=""; fimg=ck}
						vcol=""; fcol="";	
					}else{vcol=""; fcol=""; vimg="";fimg=""}
				}
				//RM
				ret+=((y==0)?"<tr>":"<tr>")+"<td class='tabriep tabriepris' style='height:"+(this.dim.rigariepH-this.dim.riepdomH)/maxris+"px;border-width:"+this.dim.bordogr+"px;font-size:"+this.dim.H13+"px; line-height:"+this.dim.H18+"px' title='"+((lang!="it")?rettitle(this.scheda.quesiti[x].rispostet[this.scheda.quesiti[x].ordine[y]]):"")+didas+"'><div class='direc' dir='"+((lang=="ma")?"rtl":"ltr")+"'>"+this.scheda.quesiti[x].risposte[this.scheda.quesiti[x].ordine[y]]+"</div></td>"
				
				ret+="<td class='tabriep tabriepvf' style='width:"+this.dim.riepvfW+"px;"+vcol+"border-width:"+this.dim.bordogr+"px;' title='"+titris+"'>"+vimg+"</td>"
				ret+="<td class='tabriep tabriepvf' style='width:"+this.dim.riepvfW+"px;"+fcol+"border-width:"+this.dim.bordogr+"px;' title='"+titris+"'>"+fimg+"</td></tr>"
			}
		}
		return ret+"</table>"
	}	
	this.tabriep= function(){
		var scroll=""
		//if (this.scroll!=-1){
			scroll="<table class='riepscroll' style='height:"+this.dim.riepscrollH+"px; margin-top:"+this.dim.riepscrollmargH+"px'><tr><td style='vertical-align: top'><img class='sugiu ieimg' onclick='"+this.name+".sugiu(-1)' src='"+pregrafica+"grafica/n2011/su.gif' style='height:"+this.dim.botprecsuccH+"px' title='Scorri la pagina per visualizare i quesiti precedenti'/></td>"
			scroll+="</tr><tr><td style='vertical-align: bottom'><img class='sugiu ieimg' onclick='"+this.name+".sugiu(1)' src='"+pregrafica+"grafica/n2011/giu.gif' style='height:"+this.dim.botprecsuccH+"px' title='Scorri la pagina per visualizare i quesiti successivi' /></td></tr></table>"
		//}		
		
		return "<tr><td class='tabcorpo_tabriep' style='height: "+this.dim.tabriepH+"px;'><div class='corpo_tabriep' style='height: "+this.dim.tabriepH+"px' id='"+this.scheda.name+"_tabriep'>"+this.tabriepscheda()+"</div></td><td class='tabcorpo_tabriepscroll' style='width:"+((this.scroll==-1)?"6%":this.dim.riepscrollW+"px")+"'>"+scroll+"</td></tr>"
	}
	this.bottriep= function(){
		return "<tr><td class='corpo_bottriep' style='height:"+((this.ridotta)?this.dim.botriepridH:this.dim.botriepH)+"px' colspan='2'><table class='allineapulsanti' style='width:100%'><tr>"+((this.ridotta)?"<td style='vertical-align: bottom'>"+this.tempo()+"</td>":"")+"<td class='allineapulsanti'>"+this.pulsante(((this.correzione!=true)?"Ritorna alle Domande":"Ritorna alle Domande"),this.name+'.mostnascriep(0)',((this.correzione!=true)?"Modifica":"Rivedi")+' le risposte')+"</td><td  class='allineapulsanti'> "+this.pulsante(((this.correzione!=true)?"Chiudi Esame":"Nuova Scheda"),this.name+'.correggi()',((this.correzione!=true)?"Conferma le risposte e attiva la correzione":"Avvia una nuova simulazione di esame"))+"</td></tr></table></td></tr>"
	}
	this.piede=function(cont){
		var ret="<tr><td class='corpo_piede' style='height: "+this.dim.piedeH+"px' colspan='2'><table class='piede' style='height: "+this.dim.piedeH+"px'><tr><td rowspan='3' class='piede_tempo'>"+this.tempo()+"</td>"
		ret+="<td class='piede_candidato labcand' style='width:"+this.dim.piedecandidatoW+"px;font-size:"+this.dim.txtlabpiede+"px; line-height:"+this.dim.H8+"px; height:"+this.dim.H11+"px'>Scheda Esame N</td>"+cont+"</tr>"
		ret+="<tr><td class='piede_candidato'><div id='"+this.scheda.name+"_num' class='riqtesto' style='font-weight: bold; height:"+this.dim.riqnumH+"px; line-height:"+this.dim.riqnumH+"px;font-size:"+this.dim.txtriqpiede+"px;border-width:"+this.dim.bordost+"px'>"+this.schedanum+"</div>"
		ret+="<div class='labcand' style='font-size:"+this.dim.txtlabpiede+"px; height:"+this.dim.H15+"px'><span style='line-height:12px'>Cognome e Nome del Candidato</span></div>"
		ret+="<div  id='"+this.scheda.name+"_cand' class='riqtesto' style='height:"+this.dim.riqcandH+"px; line-height:"+this.dim.riqcandH+"px; font-size:"+this.dim.txtriqpiede+"px;border-width:"+this.dim.bordost+"px'>"+this.nomecand+"</div></td>"
		ret+="<tr><td colspan='4' style='sheight:"+this.dim.piedemargH+"px;'></td></tr></table></td></tr>"
		return ret
	}
	this.tempo=function(){
		if (this.ridotta){
			this.dim.tempoH=this.dim.temporidotH
			this.dim.tempoW=this.dim.temporidotW
			this.dim.txttempo=this.dim.H25
			var padtop=this.dim.H5
		}else{
			var padtop=this.dim.H6
		}	
	
		var tempo=zerofit(this.scheda.minuti,2)+" : "+zerofit(this.scheda.secondi,2)
		var bd=parseInt(this.dim.bordost)+"px"
		return "<table  style='height:"+this.dim.tempoH+"px;width:"+this.dim.tempoW+"px;margin-left:"+this.dim.tempoL+"px;"+((this.riepilogo)?"margin-bottom:"+this.dim.tempadatta+"px":"")+"' class='tempo'><tr><td style='height:"+(this.dim.H4/2)+"px'></td><td class='tempohead' rowspan='2' style='font-size:"+this.dim.H4+"px'><img class='ieimg' src='"+pregrafica+"grafica/n2011/tempoh.png' style='height:"+this.dim.H5+"px;'/></td><td style='height:"+(this.dim.H4/2)+"px'></td></tr><tr><td style='width:1px;height:"+(this.dim.H4/2)+"px;border-left:"+bd+" solid #CCCCCC;'></td><td style='border-top:"+bd+" solid #CCCCCC;border-right:"+bd+" solid #CCCCCC;width:40%;height:"+(this.dim.H4/2)+"px'></td></tr><tr><td id='"+this.scheda.name+"_tempo' class='tempo' style='border-width:0 "+bd+" "+bd+" "+bd+";font-size:"+this.dim.txttempo+"px;' colspan='3' title='Tempo rimasto a disposizione per completare il quiz'>"+tempo+"</td></tr></table>"
		
		//old: return "<div class='tempo' id='"+this.scheda.name+"_tempo' style='height:"+this.dim.tempoH+"px; width:"+this.dim.tempoW+"px; margin-left:"+this.dim.tempoL+"px; line-height:"+this.dim.tempoH+"px; font-size:"+this.dim.txttempo+"px; padding-top:"+padtop+"px; position: absolute'>"+tempo+"</div><img class='ieimg' src='"+pregrafica+"grafica/n2011/tempo.png' style='height:"+this.dim.tempoH+"px; margin-left:"+this.dim.tempoL+"px;' title='Tempo rimasto a disposizione per completare il quiz' />"
	}
	
		
	this.opiedescheda= function(){
		var ret="<td class='piede_puls' id='"+this.scheda.name+"_puls'>"+((this.correzione==true)?this.pulsante('Suggerimenti','','pulsante2')+"<div style='height:"+this.dim.H6+"px; overflow:hidden'></div>"+this.pulsante('Soluzioni','','pulsante2'):"")+"</td>"
		ret+="<td class='piede_prec'><img class='piede_prec ieimg' style='height:"+parseInt(this.dim.botprecsuccH)+"px' src='"+pregrafica+"grafica/nint/indietro.jpg' onclick='"+this.name+".precsucc(-1)' title='Vai alla domanda precedente' /></td>"
		ret+="<td class='piede_succ'><img class='piede_succ ieimg' style='height:"+parseInt(this.dim.botprecsuccH)+"px' src='"+pregrafica+"grafica/nint/avanti.jpg' onclick='"+this.name+".precsucc(+1)' title='Vai alla domanda successiva' /></td></tr>"
		return ret
	}
	this.piedescheda= function(){
		var ret="<td class='piede_comandi' rowspan='2'><table class='piede_comandi' style='width:"+this.dim.piedecomandiW+"px;font-size:"+this.dim.H13+"px;line-height:"+this.dim.H15+"px;'>"
		ret+="<tr><td class='piede_cmdvari' style='width:"+this.dim.piedecmdvariW+"px; height:"+this.dim.piedecmdsopraH+"px'><br/>Riepilogo Scheda</td><td class='piede_precsucc'>Domanda<br/>Precedente</td><td rowspan='2'style='width:"+this.dim.H20+"px'> </td><td class='piede_precsucc'>Domanda<br/>Successiva</td></tr>"
		ret+="<tr><td class='piede_comandivari' style='padding-top:"+this.dim.H4+"px'><img class='ieimg but' src='"+pregrafica+"grafica/n2011/riep.jpg' onclick='"+this.name+".mostnascriep()' title='Visualizza il quadro di riepilogo delle domande, comprensivo anche delle risposte date' style='height:"+this.dim.botriepH+"px' /></td><td class='piede_precsucc' style='padding-top:"+this.dim.H4+"px'><img class='piede_prec ieimg' style='height:"+this.dim.botprecsuccH+"px' src='"+pregrafica+"grafica/n2011/indietro.jpg' onclick='"+this.name+".precsucc(-1)' title='Vai alla domanda precedente' /></td><td class='piede_precsucc' style='padding-top:"+this.dim.H4+"px'><img class='piede_succ ieimg' style='height:"+this.dim.botprecsuccH+"px' src='"+pregrafica+"grafica/n2011/avanti.jpg'onclick='"+this.name+".precsucc(+1)' title='Vai alla domanda successiva' /></td></tr>"
		ret+="</table></td></tr>"
		return ret
	}
	this.piederiep= function(){
		return "<td class='piede_puls' id='"+this.scheda.name+"_puls'> </td><td class='piede_prec'> </td><td class='piede_succ'> </td></tr>"
	}
	this.pulsante= function(label, handler, tip, pulclass){
		bakpuls="url(\""+pregrafica+"grafica/n2011/"+((this.dim.pulsH<30)?'bakpuls0.png':'bakpuls1.png')+"\")" //Globale
		return "<table class='"+((pulclass==null)?"pulsante":pulclass)+"'><tr><td class='pulsante' style='height:"+this.dim.pulsH+"px; width:"+this.dim.pulsW+"px;border-width:"+this.dim.bordost+"px;background-image:"+bakpuls+";' onmouseout='pulsout(this)'  onmouseup='pulsup(this)'  onclick='"+handler+"' title='"+tip+"'><table class='bdpul' onmouseover='pulsover(this.parentNode);this.style.border=\"1px solid #7A8A99\"' onmouseout='pulsout(this.parentNode);this.style.borderColor=\"transparent\"' onmousedown='pulsdown(this.parentNode);this.style.borderRight=\"transparent\";this.style.borderBottom=\"transparent\"' style='font-size:"+this.dim.txtpuls+"px;'><td><span>"+label+"</span></td></table></td></tr></table>"
		
	}
	
	this.mostnascriep= function(q){
		if (this.riepilogo==true){ 
			this.memscrollpos()
			this.riepilogo=false;
			if (q!=null) this.quizatt=q;
			if (this.scheda.onmuoviesame!=null) this.scheda.onmuoviesame(q)
		}else{ 
			this.riepilogo=true;
			if (this.scroll>=0) this.scroll=0
		}	
		getWin(this.scheda.outwin,this.scheda.name+"_nint").innerHTML=this.ritornacont()
		this.setscrollpos()
		// solo qui 
		if (document.getElementById("modello")!=null){if (this.riepilogo==true) document.getElementById("modello").src=pregrafica+"grafica/nint/riep640x800.jpg"; else document.getElementById("modello").src=pregrafica+"grafica/nint/scheda640x800.jpg";}
			
	}
	this.mostraquiz= function(q){
		if (this.scheda.onmuoviesame!=null) this.scheda.onmuoviesame(q)
		var vec3=getWin(this.scheda.outwin, this.scheda.name+"tbb"+(this.quizatt+1)).style
		if (this.correzione)
			vec3.color=(this.scheda.quesiti[this.quizatt].soluzioni.charAt(this.scheda.quesiti[this.quizatt].ordine[0])!=this.scheda.quesiti[this.quizatt].soluzioniutente[0])?"#ffffff":"#8FA398"
		else
			vec3.color ="#8FA398"
		var vec2=getWin(this.scheda.outwin, this.scheda.name+"tbb2_"+(this.quizatt+1)).style
		vec2.color ="#8FA398"

		this.quizatt=q // dopo prec
		getWin(this.scheda.outwin, this.scheda.name+"dom").innerHTML=this.domanda()
		getWin(this.scheda.outwin, this.scheda.name+"ris").innerHTML=this.risposte()
		var nuo3=getWin(this.scheda.outwin, this.scheda.name+"tbb"+(this.quizatt+1)).style
		if (this.correzione)
			nuo3.color =(this.scheda.quesiti[this.quizatt].soluzioni.charAt(this.scheda.quesiti[this.quizatt].ordine[0])!=this.scheda.quesiti[this.quizatt].soluzioniutente[0])?"#200000":"#d00000"
		else
			nuo3.color ="#d00000"
		
		if ((Math.floor(this.quizatt/10)*10)+1 != this.decini){
			var vdec=(Math.floor(this.decini/10))
			var ndec=(Math.floor(this.quizatt/10))
			var vec1= getWin(this.scheda.outwin, this.scheda.name+"tbb1_"+(vdec)).style
			vec1.color ="#8FA398"
			var nuo1= getWin(this.scheda.outwin, this.scheda.name+"tbb1_"+(ndec)).style
			nuo1.color ="#d00000"
			
			getWin(this.scheda.outwin, this.scheda.name+"toolbar2").innerHTML=this.toolbar2()
		}else{
			var nuo2=getWin(this.scheda.outwin, this.scheda.name+"tbb2_"+(this.quizatt+1)).style
			nuo2.color ="#d00000"
		}	
	}	
	this.mostraquizdadec= function(q){
		// q è un valore da 0 a 9 (decina attuale)
		this.mostraquiz((Math.floor(this.quizatt/10))*10+q)
	}	
	this.precsucc= function(offs){
		var q= this.quizatt+offs
		if (q<0) return;
		if (q>=this.scheda.maxquiz)
			this.mostnascriep()
		else	
			this.mostraquiz(q)
	}

	this.sugiu = function(offs){
		if (this.scroll!=-1){
			var q= this.scroll+offs
			if (q<0) return;
			if (q>(this.scheda.maxquiz-this.perschermo)) return;
			this.scroll=q
			getWin(this.scheda.outwin, this.scheda.name+"_tabriep").innerHTML=this.tabriepscheda()
		}else{
			var dum=getWin(this.scheda.outwin, this.scheda.name+"_tabriep")
			var sh=getWin(this.scheda.outwin, this.scheda.name+"_tabriep-tutto").offsetHeight/40
			var pos =(dum.scrollTop/sh)
			dum.scrollTop=Math.round(pos)*sh+(sh*offs)
			/*
			if ((offs<0) && (Ext.isIE==false))
				sh-=this.dim.bordost
			var toset=((dum.scrollTop)+(sh*offs))	
			if (toset<0)
				dum.scrollTop=0
			else
				dum.scrollTop=toset
			*/
		}	
	}
	this.rispondi= function(img,vf,qn,rn){
		
		// Sostituisce scheda.rispondi()
		img.src=pregrafica+"grafica/n2011/"+vf+"X.jpg"
		
		if(this.scheda.quesiti[qn].soluzioniutente[rn]==null){ 
			this.scheda.soluzionidate++
			if (this.rispdate[this.quizatt]== null) this.rispdate[this.quizatt]=0
			this.rispdate[this.quizatt]++
			maxris=(this.scheda.maxris==0)?this.scheda.quesiti[this.quizatt].risposte.length:this.scheda.maxris
			if (this.rispdate[this.quizatt]==maxris){
				// l'interfaccia minima non ha toolbar
				if (this.minima==false) getWin(this.scheda.outwin,this.scheda.name+"tbb"+(this.quizatt+1)).style.backgroundColor="#d1e6d7";
				if (op.valore('avauto')){ //<--- TODO! Ripristinare avanzamento
					if ((primavolta==true)&&(this.quizatt==0)&&(this.scheda.maxquiz>1)) Ext.Msg.alert("Attenzione","E' attivo l'avanzamento automatico, che ti porta immediatamente alla domanda successiva, una volta inserita l'ultima risposta. Se questa funzione non ti piace, la puoi disattivare nella finestra delle opzioni. Nell'esame vero dovrai comunque procedere manualmente.")
					primavolta=false
					this.scheda.quesiti[qn].soluzioniutente[rn]=vf; //Altrimenti non appare l'ultimo valore
					this.precsucc(1)
				}	
			}
		}else{ //Se esisteva già questa soluzione bisogna (se è il caso) cambiare l'immagine
			if (this.scheda.quesiti[qn].soluzioniutente[rn]!=vf){
				altra=(vf=="V")?"F":"V"
				getWin(this.scheda.outwin,this.scheda.name+qn+rn+altra).src=pregrafica+"grafica/n2011/"+altra+".jpg"
			}
		}	
		this.scheda.quesiti[qn].soluzioniutente[rn]=vf;
		
		if (this.scheda.onrispostadata!=null) this.scheda.onrispostadata(qn,rn,vf)
		// Correggi se si sono date tutte le risposte
		if((this.scheda.soluzionidate==this.scheda.maxsoluzioni) && op.valore('avauto')) this.correggi()
	}
	this.rispinfo= function(solut,sol){
		if(this.scheda.name=="schedasolu")
			Ext.example.msg('Per tua informazione','La soluzione corretta è '+((sol=='V')?'VERO':'FALSO')+'.');
		else
			Ext.example.msg('Per tua informazione', ((solut=='')?'Non hai dato alcuna risposta': ('Hai risposto '+((solut=='V')?'VERO':'FALSO')))+((sol==solut)?' e infatti ':', tuttavia ')+'la soluzione corretta era '+((sol=='V')?'VERO':'FALSO')+'.');
	
	}
	this.correggi= function(flag){
		if (this.correzione!=true){
			if (this.confermacorr==true){
				var obj=this
				if (flag){
					var titolo='Tempo scaduto!'
					var messaggio='Il tempo massimo previsto per la prova è trascorso. Si procederà alla correzione.'
					var bottoni=Ext.Msg.OK
					var icona=Ext.MessageBox.EXCLAMATION
				}else{
					var titolo='Richiesta di conferma'
					var messaggio="Sei sicuro di voler confermare tutte le risposte date? Con 'Conferma Chiudi Esame' non avrai più la possibilità di modificarle."
					var bottoni=Ext.Msg.OKCANCEL
					//var bottoni=Ext.Msg.YESNO
					// Cambia le etichette di default
					Ext.MessageBox.buttonText.ok = "Conferma Chiudi Esame";
					Ext.MessageBox.buttonText.cancel = "Ritorna alle Domande";
					var icona=Ext.MessageBox.QUESTION
				}
				Ext.Msg.show({
   					title:titolo,
   					msg: messaggio,
   					buttons: bottoni,
   					animEl: 'elId',
   					icon: icona,
   					fn: function(btn){
   						if(btn=='ok') {
   							obj.correzione= true;
							obj.riepilogo=true
 							getWin(obj.scheda.outwin,obj.scheda.name+"_nint").innerHTML=obj.ritornacont()		
							obj.scheda.correggischeda()
								
						}
						// Ripristina le etichette di default
						Ext.MessageBox.buttonText.ok = "Ok";
						Ext.MessageBox.buttonText.cancel = "Annulla";											
   					}
				});
							
			}else{
				this.correzione= true;
				this.riepilogo= true
				getWin(this.scheda.outwin,this.scheda.name+"_nint").innerHTML=this.ritornacont()
				this.scheda.correggischeda()
			}	
						
		}else{
			schedaprec=false
			nuovoesame() // sostituire con this.scheda.nuovo()
		}	
		
	}
	this.mostrasugg= function(q){
		if (q!=null)
			mostrasuggerimenti(this.scheda.quesiti[q].sugg)
		else	
			if (this.nonriep()==true) mostrasuggerimenti(this.scheda.quesiti[this.quizatt].sugg)
		
		
		
	}
	this.mostrasolu= function(q){
		if (q!=null)
			mostrasoluzioni(this.scheda.quesiti[q].numero)
		else
			if (this.nonriep()==true) mostrasoluzioni(this.scheda.quesiti[this.quizatt].numero)
			
	}
	this.nonriep= function(){
		if ((this.riepilogo!=true) && (this.minima!=true)){
			return true
		}else{	
			Ext.Msg.show({
   				title:'A quale quiz ci si riferisce?',
   				msg: 'Selezionare prima un quiz, facendo click su uno dei riquadri con i numeri a sinistra o sul pulsante \"'+((this.correzione==true)?'Ritorna alle Domande':'Ritorna alle Domande')+'\".',
   				buttons: Ext.Msg.OK,
   				animEl: 'elId',
   				icon: Ext.MessageBox.ERROR
			});
			return false	
		}
	}
	this.nascondi= function(valore){
		getWin(this.scheda.outwin,this.scheda.name+"_nint").style.display="none"  ((valore==true)?"none":"inline")
	}
	this.audio=function(img,qa,ra){
		qn=this.scheda.quesiti[qa].rispass[ra]
		var ausd=parseInt(qn/1000)
		//percaudio ha lo slash finale
		//sofi=percaudio+((lang!='it')?lang+"/":"")+ausd+"/"+qn.toString()+"."+sext
		var tmpaf= ausd+"/"+qn.toString()+"."+sext
		sofi=(audioloc[lang]==true)?("chrome://audio"+lang+"/content/"+tmpaf):(percaudio+((lang!='it')?lang+"/":"")+tmpaf)
		/*
		qn=this.scheda.quesiti[qa].quizass.toString()
				str="00000"
		qn=("00000".slice(0,-(qn.length)))+qn
		if (ra==null){
			sofi=percaudio+(lingue[lang].nome).toLowerCase()+"/"+lingue[lang].pref+"_"+qn+"."+sext
		}else{
			rn=(this.scheda.quesiti[qa].rispass[ this.scheda.quesiti[qa].ordine[ra]]).toString()
			rn=("00000".slice(0,-(rn.length)))+rn
			sofi=percaudio+(lingue[lang].nome).toLowerCase()+"/"+lingue[lang].pref+"_"+qn+"_"+rn+"."+sext
		}
		*/
		this.audioimg=img
		try{	
			niftyplayer('niftyPlayer1').registerEvent("onPlay", this.name+".audioonplay()")
			niftyplayer('niftyPlayer1').registerEvent("onSongOver", this.name+".audioonstop()")
			niftyplayer('niftyPlayer1').loadAndPlay(sofi)	
		}catch(e){
			// Errore suoni
		}
		
	}
	this.audioimgp=null
	this.audioimg=null
	this.audioonstop= function(){
		if (this.audioimgp!=null){
			this.audioimgp.src=pregrafica+"grafica/n2011/spk.png"
		}	
	}
	this.audioonplay= function(){	
		if (this.audioimgp!=null) this.audioimgp.src=pregrafica+"grafica/n2011/spk.png"
		this.audioimgp=this.audioimg
		if (this.audioimgp!=null) this.audioimgp.src=audioa
			
	}
	
	
	this.adattalingua= function(){
		if (lang=="ma"){
			this.dim.txtdomg*=1.2
			this.dim.txtrisg*=1.2   
			this.dim.txtdom*=1.2 
			this.dim.txtris*=1.2 
		}
	
	}
	this.memscrollpos=function(h){
	//Memorizza la posizione di scrolling	
		if ((this.scroll==-1) && (getWin(this.scheda.outwin, this.scheda.name+"_tabriep")!=null)){
			//var dum=document.getElementById("schedaesame_tabriep")
			var dum=getWin(this.scheda.outwin, this.scheda.name+"_tabriep")
			var sh=dum.style.height.substr(0,dum.style.height.length-2)
			this.memscroll=dum.scrollTop/sh
		}
	}
	this.setscrollpos=function(h){
	//Imposta la posizione di scrolling	
		if ((this.scroll==-1) && (getWin(this.scheda.outwin, this.scheda.name+"_tabriep")!=null)){
			//var dum=document.getElementById("schedaesame_tabriep")
			var dum=getWin(this.scheda.outwin, this.scheda.name+"_tabriep")
			var sh=dum.style.height.substr(0,dum.style.height.length-2)
			dum.scrollTop=this.memscroll*sh
		}
	}
	
	var baseW= 1024 //1024
	var baseH= 768  //768
	
	this.dim={
	tabprincW: baseW,
	tabprincH: baseH,
	tabridotH: 640, //500,
	tabminimaH: 0,
		
	H3:	 baseH*0.00390625,
	H4:  baseH*0.005208333,
	H5:  baseH*0.006510417,
	H6:  baseH*0.0078125,
	H7:  baseH*0.009114583,
	H8:  baseH*0.010416667,
	H9:  baseH*0.01171875,
	H10: baseH*0.013020833,
	H11: baseH*0.014322917,
	H12: baseH*0.015625,
	H13: baseH*0.016905072,
	H14: baseH*0.018205462,
	H15: baseH*0.019505852,
	H16: baseH*0.020833333,
	H18: baseH*0.0234375,
	H20: baseH*0.026041667,
	H22: baseH*0.028645833,
	H23: baseH*0.029947917,
	H24: baseH*0.03125,
	H25: baseH*0.032552083,
	H26: baseH*0.033854167,
		
	testafigH: baseH*0.109375,
		
	toolbarH: baseH*0.209635417,
	toolbarbut1H: baseH*0.0703125,  
	toolbar1W: baseW*0.849609375,
	tb1daaH: baseH*0.041666667,
	toolbarbut3H: baseH*0.029947917,
	toolbar3W: baseW*0.866210938,	
		
	areaquizH: baseH*0.520833333,
	spz1W: baseW*0.029296875,
	domW: baseW*0.3125,
	risW: baseW*0.618164063,
		dommargH: 6,
	domnumH: baseH*0.05859375,
		domdomH: 112,
		domdomtH: 62,
	domfigH: baseH*0.390625,
		audioH: 23,
	
	risaltoH: baseH*0.321614583,
	risaltoP: baseH*0.006510417,
	ristestoH: baseH*0.240885417,
	risbassoH: baseH*0.173177083,	
	spzvfW: baseW*0.048828125,
		rismargH: 640*0.040625,
		risrisH: 640*0.0859375,
		risristH: 640*0.0765625,
	risvfH: baseH*0.08984375,
	risargoscrolH: baseH*0.434895833,
	risargovfH: baseH*0.065104167,
		
	//tabriepH: baseH*0.669270833, //0.5234375,
	rigariepH: baseH*0.15625, //120,
	//tabriepH: (Ext.isIE)?parseInt(baseH*0.15625)*4:baseH*0.625,
	tabriepH: (Ext.isIE)?parseInt(baseH*0.15625)*4:baseH*0.15625*4+1,
	riepdomH: baseH*0.0390625,
	riepfigH: baseH*0.091145833,
	riepscrollH: baseH*0.239583333,
	riepscrollmargH: baseH*0.037760417,
		rieptuttoH: 0,
		tabrieptuttoH: 477,
		bottriepH: 75,
		
	riepnumW: baseW*0.029296875
,
	riepfigW: baseW*0.087890625,
	riepdomW: baseW*0.756835938,
	riepvfW: baseW*0.032226563,
	riepscrollW: baseW*0.08203125,
		
	sottoquizH: baseH*0.014322917,
		testaridotH: 23,
	piederidotH: baseH*0.100260417,
		minbordoH: 22,
		
	piedeH: baseH*0.145833333,
	riqnumH: baseH*0.036458333,
		riqcandH: 640*0.05,
		piedemargH: 20,
		
	tempoH: baseH*0.130208333,
	temporidotH: baseH*0.084635417,
	tempoL: baseW*0.03125,
		tempoW: 800*0.173875,
	tempadatta: (Ext.isIE)?0:baseH*0.005208333,
	temporidotW: baseW*0.120117188,	
	piedecandidatoW: baseW*0.37109375,	
	piedecomandiW: baseW*0.384765625,
	piedecmdsopraH: baseH*0.05078125,
	piedecmdvariW: baseW*0.206054688,
	botprecsuccH: baseH*0.07421875,
	botriepH: baseH*0.0703125,
	botriepridH: baseH*0.165364583
,
		pulsH: 640*0.046875,
	pulsW: baseW*0.236328125,
		
		txttb: 640*0.03046875,
		
		txtdom: 11, 
		txtris: 10,
		txttempo: 640*0.046875,
		txtpuls: 640*0.01875,
		txtriepnum: 640*0.025,
		txtlabpiede: 10,
		txtriqpiede: 640*0.025,
		txtdomg: 640*0.0203125,
		txtrisg: 11,
		txttrad: 10,
		
		bordost: 1,
		bordogr: 2
	}	
	this.redim= function(h,w){
		//alert("h: "+h+" w: "+w)
		this.memscrollpos()	

		var aratio=1.3333334
		with (this.dim){
			if (h!=null){
				if (this.ridotta==true){
					if (this.minima==true){
						tabprincH= h/0.633333333
						tabminimaH= h
					}else{
						// Se ridotta le misure vanno calcolate rispetto ad un'altezza maggiore
						tabprincH= h/0.833333333 
						tabridotH= h
					}	
				}else{
					tabprincH= h;
					tabridotH =tabprincH*0.833333333
					tabminimaH =tabprincH*0.633333333
				}			
				tabprincW= tabprincH*aratio
			}
			
			if (w!=null){
				if (w<tabprincW){
					tabprincW=w
					tabprincH=tabprincW/aratio
					tabridotH =tabprincH*0.833333333
					tabminimaH =tabprincH*0.59375
				}	
			}
			//alert(tabprincW+"x"+tabprincH)
			//if (tabprincH<640) bordogr=1; else bordogr=2
			bordost= tabprincH*0.0015625
			bordogr= tabprincH*0.0031250
			if (bordost<1) bordost=1
			
		H3=	 tabprincH*0.00390625
		H4=  tabprincH*0.005208333
		H5=  tabprincH*0.006510417
		H6=  tabprincH*0.0078125  
		H7=  tabprincH*0.009114583
		H8=  tabprincH*0.010416667
		H9=  tabprincH*0.01171875 
		H10= tabprincH*0.013020833
		H11= tabprincH*0.014322917
		H12= tabprincH*0.015625
		H13= tabprincH*0.016905072
		H14= tabprincH*0.018205462
		H15= tabprincH*0.019505852
		H16= tabprincH*0.020833333
		H18= tabprincH*0.0234375
		H20= tabprincH*0.026041667
		H22= tabprincH*0.028645833
		H23= tabprincH*0.029947917
		H24= tabprincH*0.03125
		H25= tabprincH*0.032552083
		H26= tabprincH*0.033854167

			testafigH= tabprincH*0.109375
			
		toolbarH= tabprincH*0.209635417
		toolbarbut1H= tabprincH*0.0703125
		tb1daaH= tabprincH*0.041666667
		toolbar1W= tabprincW*0.849609375
		toolbarbut3H= tabprincH*0.029947917
		toolbar3W= tabprincW*0.866210938
			
						
		areaquizH= tabprincH*0.520833333
		spz1W= tabprincW*0.029296875
		domW= tabprincW*0.3125
		risW= tabprincW*0.618164063
			
			dommargH= tabprincH*0.009375			
		domnumH= tabprincH*0.05859375
			domdomH= tabprincH*0.175
			domdomtH= tabprincH*0.096875
		domfigH= tabprincH*0.390625
			audioH= tabprincH*0.0359375
		
		risaltoH= tabprincH*0.321614583
		risaltoP= tabprincH*0.006510417
		ristestoH= tabprincH*0.240885417
		risbassoH= tabprincH*0.173177083
		spzvfW= tabprincW*0.048828125
			rismargH= tabprincH*0.040625
			risrisH= tabprincH*0.0859375
			risristH= tabprincH*0.0765625
		risvfH= tabprincH*0.08984375
		risargoscrolH=tabprincH*0.434895833	
		risargovfH= tabprincH*0.065104167
					
		//tabriepH=  tabprincH*0.669270833 //0.5234375
		
		rigariepH= tabprincH*0.15625
		//tabriepH= (Ext.isIE)?parseInt(this.dim.rigariepH)*4:tabprincH*0.625
		tabriepH= (Ext.isIE)?parseInt(this.dim.rigariepH)*4:this.dim.rigariepH*4+this.dim.bordost
		riepdomH= tabprincH*0.0390625
		riepfigH=  tabprincH*0.091145833
		riepscrollH= tabprincH*0.239583333
		riepscrollmargH= tabprincH*0.037760417
			rieptuttoH= tabprincH*0.7453125
			bottriepH= rieptuttoH-tabriepH
			
		riepnumW= tabprincW*0.029296875
		riepfigW= tabprincW*0.087890625
		riepdomW= tabprincW*0.756835938
		riepvfW= tabprincW*0.032226563
		riepscrollW= tabprincW*0.08203125
						
		sottoquizH= tabprincH*0.014322917 
			testaridotH= tabprincH*0.0359375	
		piederidotH= tabprincH*0.100260417
			minbordoH= tabprincH*0.0343750
	
		piedeH= tabprincH*0.145833333
		riqnumH= tabprincH*0.036458333	
			riqcandH= tabprincH*0.05
			piedemargH= tabprincH*0.03125
			
		tempoH= tabprincH*0.130208333
		temporidotH= tabprincH*0.084635417
		tempoL= tabprincW*0.03125
		tempoW= tabprincW*0.173875
		tempadatta= (Ext.isIE)?0:this.dim.H4
		temporidotW= tabprincW*0.120117188	
		piedecandidatoW= tabprincW*0.37109375
		piedecomandiW= tabprincW*0.384765625
		piedecmdsopraH= tabprincH*0.05078125
		piedecmdvariW= tabprincW*0.206054688
		botriepH= tabprincH*0.0703125
		botriepridH= tabprincH*0.165364583
		botprecsuccH= tabprincH*0.07421875
			
			pulsH= tabprincH*0.046875
		pulsW= tabprincW*0.236328125
			
			txttb= tabprincH*0.03046875
			
			txtdom= tabprincH*0.0171875
			txtris= tabprincH*0.015625
			txttempo= tabprincH*0.046875
			txtpuls= tabprincH*0.01875
			txtriepnum= tabprincH*0.025
			txtlabpiede=txtris
			txtriqpiede=tabprincH*0.025
			txtdomg= tabprincH*0.021875
			txtrisg= tabprincH*0.0171875
			txttrad= tabprincH*0.015625
			
			this.adattalingua()
		}
		if (ridotta==null) {this.ridotta=false; this.minima=false}
		if (minima==null) this.minima=false
		
		//getWin(this.scheda.outwin,this.scheda.name+"_nint").innerHTML=this.ritorna()
		
		// solo qui 
		// document.getElementById("modello").style.height=h+"px"
		
		
	}

	if ((this.h!=null) || (this.w!=null)) {
		this.redim(this.h,this.w)
	}

	this.aggiornaTempo=function(tempoval){
	}
}
