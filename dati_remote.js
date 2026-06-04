ver.verquiz="AB-06-30"

var finecap =[0,58,129,182,224,246,293,321,384,403,474,505,522,606,655,681,710,761,786,799,819,836,857,873,889,923]
var fineargo=[0,58,129,182,224,246,293,321,384,403,474,505,522,606,655,681,710,761,786,799,819,836,857,873,889,923]
var argomenti = ["Definizioni stradali; classificazione dei veicoli; doveri del conducente nell’uso della strada","Segnali di pericolo","Segnali di divieto","Segnali di obbligo","Segnali di precedenza","Segnaletica orizzontale","Segnalazioni semaforiche; segnalazioni degli agenti del traffico; obblighi verso gli agenti","Segnali di indicazione","Segnali complementari; segnali temporanei di cantiere","Pannelli integrativi dei segnali","Pericoli nella circolazione. Velocità: regolazione e limiti","Distanza di sicurezza","Posizione dei veicoli sulla carreggiata. Cambio di corsia e di direzione. Precedenza. Uso corretto della strada. Specchi retrovisori","Esempi di precedenza (ordine di precedenza agli incroci)","Sorpasso","Fermata, sosta, arresto e partenza","Circolazione in autostrada e strade extraurbane principali. Ingombro della carreggiata. Uso del triangolo. Carico. Pannelli. Traino. Rischi","Uso delle luci; spie e simboli","Cinture di sicurezza. Airbag. Sistemi di ritenuta per bambini. Poggiatesta. Casco protettivo. Abbigliamento di sicurezza","Documenti di circolazione. Targa. Patenti: categorie; sanzioni (ritiro, revisione, revoca, sospensione, punti); validità","Comportamenti per prevenire incidenti. Eventi atmosferici. Comportamento in caso di incidente. Cautele alla guida di motocicli","Guida in relazione alle qualità e condizioni fisiche e psichiche. Alcool, droga e farmaci. Primo soccorso","Responsabilità civile, penale e amministrativa. Assicurazione R.C.A. Autovalutazione del conducente e percezione del rischio. Attenzione durante la guida","Limitazione dei consumi. Rispetto dell’ambiente; inquinamento: atmosferico, acustico, da cattivo smaltimento dei rifiuti","Uso e manutenzione di: pneumatici; freni; sospensioni; ammortizzatori; sterzo; scarico. Controlli e cautele. Aderenza e stabilità del veicolo"];
var capmin= [];
var cappeso=[0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,0,0];
var titolilezioni=["Introduzione","1. Definizioni Stradali e di Traffico","2. Definizione e classificazione dei veicoli","3. Doveri del conducente nell'uso della strada – Convivenza civile e uso responsabile della strada","4. Riguardo verso gli utenti deboli della strada (diversamente abili, anziani, bambini, pedoni, ciclisti)","5. Segnali di pericolo ","6. Segnali di precedenza ","7. Segnali di divieto ","8. Segnali di obbligo ","9. Segnali di indicazione ","10. Pannelli integrativi dei segnali ","11. Segnali temporanei di cantiere ","12. Segnali complementari ","13. Segnalazioni semaforiche (semafori) ","14. Segnalazioni degli agenti del traffico (vigile) ","15. Segnaletica orizzontale ","16. Pericolo e intralcio alla circolazione ","17. Regolazione della velocità – Limiti di velocità ","18. Distanza di sicurezza ","19. Posizione dei veicoli sulla carreggiata ","20. Cambio di direzione o di corsia (svolta, inversione di marcia) ","21. Comportamento agli incroci e norme sulla precedenza ","22. Ordine di precedenza negli incroci ","23. Norme sul sorpasso ","24. Fermata, sosta, arresto e partenza ","25. Ingombro della carreggiata. Segnalazione di veicolo fermo (triangolo mobile di pericolo, giubbotto rifrangente) ","26. Trasporto di persone – Carico dei veicoli – Pannelli sui veicoli – Traino di veicoli in avaria e rimorchi ","27. Norme di circolazione sulle autostrade e strade extraurbane principali ","28. Uso delle luci – Spie e simboli – Uso degli specchi retrovisori","29. Cinture di sicurezza – Airbag – Sistemi di ritenuta per bambini – Poggiatesta – Casco – Abbigliamento di sicurezza ","30. Documenti di circolazione del veicolo – Categorie di Patenti – Uso di lenti – Sanzioni ","31. Obbligo verso funzionari ed agenti ","32. Conoscenza dei rischi della circolazione - Comportamenti per prevenire incidenti ","33. Cause degli incidenti -  Eventi atmosferici (pioggia, neve, ghiaccio, nebbia) – Incendi – Comportamento in caso di incidente ","34. Guida in relazione alle qualità e condizioni fisiche e psichiche – Percezione del Rischio e attenzione durante la guida. Effetti di alcool, droga e farmaci ","35. Primo soccorso ","36. Responsabilità civile, penale, amministrativa ","37. Assicurazione RCA – Altre forme assicurative legate al veicolo ","38. Limitazione dei consumi – Rispetto dell’ambiente – Inquinamento: atmosferico, acustico, da cattivo smaltimento dei rifiuti ","39. Elementi costitutivi del veicolo importanti per la sicurezza, manutenzione ed uso ","40. Stabilità e tenuta di strada del veicolo","Rappresentazioni grafiche usate nei quiz"];
// gruppi nascosti
var quiznasc = "|812|"; 
//## rispnasc
var rispnascquiz="|730|800|804|805|808|871|26|38|263|484|681|721|718|728|771|791|796|817|835|900|910|581|792|"; //gruppi con risposte nascoste
var rispnasc =[];
rispnasc[730]="|0|";
rispnasc[800]="|2|";
rispnasc[804]="|5|12|"; 
rispnasc[805]="|4|";
rispnasc[808]="|1|2|";  
rispnasc[871]="|0|2|"; 

rispnasc[26]="|1|2|9|";
rispnasc[38]="|0|"
rispnasc[263]="|3|"
rispnasc[484]="|17|"
rispnasc[681]="|4|"
rispnasc[721]="|0|"
rispnasc[718]="|5|"
rispnasc[728]="|2|"
rispnasc[771]="|7|"
rispnasc[791]="|2|"
rispnasc[796]="|14|"
rispnasc[817]="|7|"
rispnasc[835]="|2|"
rispnasc[900]="|1|"
rispnasc[910]="|0|"

rispnasc[581]="|8|"
rispnasc[792]="|2|"
//##
var quizagg=[]   
quizagg[23]=[924,925,926]
    
var diraut="<div class='diraut'><b>Manuale di teoria per le patenti A e B - Versione 4.2 © 2002-2017 Roberto Mastri.</b> Testi e immagini, anche se messi a disposizione gratuitamente, sono soggetti alla normativa vigente sul diritto d'autore. Ne sono ammessi la stampa e la riproduzione solo per l'uso personale. Ogni altra forma di riproduzione, anche parziale, o di distribuzione (attraverso pubblicazioni a stampa, CD-ROM, siti internet, ecc.), non debitamente autorizzata, sarà perseguita a termine di legge. <b>Non si assumono responsabilità; per eventuali inesattezze.</b></div>";
var testipla="<div class='suggcopy'>© 2011-2017 - www.rmastri.it</div>"
var aiuto="<div class='altroaiuto'><b>Serve altro aiuto?</b> Scrivi ai nostri esperti per chiarirti i dubbi e per avere ulteriori informazioni. Trovi il modulo di richiesta (gratuita) in <a href='javascript:openbrowser(\"http://www.rmastri.it/chiediagliesperti.html\")'><b>questa pagina</b></a>."
var vuoistampare=""; //"<br/><b>Vuoi stampare questo manuale?</b> Scarica subito la <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.20\")'><b>versione PDF delle lezioni</b></a> e <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.21\")'><b>delle figure</b></a>."
var altroaiuto=aiuto+vuoistampare+"</div>"
var catfig=[{def:'Segnali di Pericolo', lez:[5], fig:[01,02,03,04,05,06,07,08,09,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,-275,-297]},
{def:'Segnali di Precedenza', lez:[6], fig:[40,41,-42,-43,44,45,46,47,48,49,50,51,52,53]},
{def:'Segnali di Divieto', lez:[7], fig:[54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,-89,90,91,92,148,151]},
{def:'Segnali di Obbligo', lez:[8], fig:[93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,150,163,-164,-284]},
{def:'Pannelli Integrativi', lez:[10], fig:[121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,-148,-150,-151]},
{def:'Segnalazioni Semaforiche', lez:[13], fig:[154,155,156,157,158,159,160,161,162]},
{def:'Segnali di Indicazione', lez:[9], fig:[-86,-89,152,153,-163,-164,166,167,168,169,170,171,172,173,174,182,183,184,186,187,189,193,194,197,199,200,201,203,206,207,210,214,216,217,218,219,220,224,225,226,228,230,231,236,238,239,240,242,243,245,247,248,250,-251,252,253,254,255,256,260,265,270,272,273,274,334,335]},
{def:'Segnali Temporanei e Complementari', lez:[11,12], fig:[251,275,276,278,279,280,282,283,284,285,288,289,290,291,292,293,294,295,297,299]},
{def:'Pannelli sui Veicoli', lez:[26], fig:[-279,-280,301,302,303,304,305]},
{def:'Segnali dei Vigili', lez:[14], fig:[383,384,385,386]},
{def:'Segnali Orizzontali', lez:[15], fig:[445,501,502,505,506,509,511,512,513,515,517,528,531,534,535,536,537,543,545,546,547,550,552,553,554,558,559,562,563,564,565,566,567,568,570,572, 574,595,596,670,676]},
{def:'Incroci', lez:[22], fig:[599,601,602,604,606,607,608,610,613,614,615,616,617,618,620,631,632,633,634,636,637,638,639,640,642,643,644,646,647,648,650,651,652,654,655,657,659,660,661,662,663,664,665,667,668,669]},
{def:'Spie e Simboli', lez:[28], fig:[695,696,697,698,699]},
{def:'Segnali compositi', lez:[5,6,7,8,9,10], fig:[42,43,89,164,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972]}]
//printme(\"winmanu\",\"panmanu\",manuale.titolilezioni[manuale.lezatt])