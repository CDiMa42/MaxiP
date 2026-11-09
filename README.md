# MaxiP — MaxiParoliere per browser e TV

Versione web ispirata a `../Glade.pl`: stessi 25 dadi, griglia 5×5, partite da 180 secondi, pausa con lettere nascoste e verifica finale. N e Z sono sottolineate; le lettere non vengono ruotate, come nella versione Perl attuale. Non verifica parole e non calcola punteggi.

HTML, CSS e JavaScript senza framework, dipendenze, servizi esterni o font scaricati. Nessun Python. La logica gira nel browser; il server Perl serve soltanto i file. Non sono previsti account, salvataggio della partita o controllo tramite smartphone. Ricaricare la pagina azzera la partita.

## Prova sul computer

Dalla cartella MaxiP eseguire:

    perl serve.pl

Aprire `http://127.0.0.1:8000/`. Terminare il server con Ctrl+C.
Richiede solo Perl con i moduli standard. In alternativa si può aprire direttamente `index.html` in un browser desktop: il gioco non utilizza richieste di rete.

## Prova sul Samsung

1. Collegare TV e computer alla stessa rete domestica.
2. Avviare il server con:

       perl serve.pl 0.0.0.0 8000

3. Individuare l'indirizzo IPv4 LAN del computer (`hostname -I` su Linux), ad esempio `192.168.1.20`.
4. Nel browser Internet della TV aprire `http://192.168.1.20:8000/`, sostituendo l'indirizzo con quello reale.
5. Salvare la pagina nei preferiti.

Il computer deve rimanere acceso durante queste prove. Se non si collega, controllare firewall, rete ospiti e isolamento Wi-Fi dei dispositivi. Non aprire porte sul router. `0.0.0.0` è un indirizzo di ascolto, non quello da inserire nel televisore.

Il server è minimale, a connessione singola e destinato solo a prove su reti fidate, non a Internet. Espone esclusivamente i quattro file dell'applicazione, non il repository o altri file del computer. Il bind predefinito è limitato al computer locale; `0.0.0.0` lo rende raggiungibile sulle interfacce di rete.

## Comandi

- **Mescola**: avvia una nuova partita; non è disponibile durante il gioco.
- **Pausa / Riprendi**: nasconde/ripristina le lettere e sospende/riprende il tempo.
- Alla scadenza le lettere sono nascoste. **Mostra** le rivela per la verifica e riabilita Mescola.
- **Schermo intero**: disponibile solo se il browser lo supporta; sul computer si esce con Esc.
- Telecomando: frecce per spostare il focus, OK per attivare il pulsante. Sono utilizzabili anche puntatore e click, se presenti sul telecomando.
- Tastiera: Tab/Shift+Tab o frecce, Invio/spazio per attivare.

La compatibilità dei tasti e dello schermo intero deve essere provata sul modello Samsung effettivo. Il timer usa una scadenza assoluta: se il browser rallenta o resta in background, al ritorno mostra il tempo corretto. Non è un cronometro con garanzie di precisione; cambi dell'orologio del dispositivo possono alterare il conteggio. La pagina usa JavaScript conservativo e Flexbox per agevolare i browser TV meno recenti.

## Verifiche

Con Node.js già installato (serve solo per i test, non per il gioco):

    node test/game.test.js
    node --check game.js
    node --check app.js
    perl -c serve.pl

Verifica manuale: avviare una partita, mettere in pausa e verificare che il tempo resti fermo e le lettere siano nascoste; riprendere e controllare che il tabellone sia lo stesso; attendere la scadenza, premere Mostra e avviare una nuova partita. Controllare anche navigazione da telecomando, leggibilità e adattamento allo schermo.

## Git e pubblicazione gratuita

Questa cartella contiene un repository Git locale indipendente. Nessun remoto viene configurato automaticamente e nessun file viene pubblicato.

Per un primo commit, dopo la revisione:

    git add .
    git commit -m "Versione web iniziale di MaxiP"

In seguito, per GitHub Pages, creare un repository pubblico e caricare i file. In Settings → Pages scegliere Deploy from a branch, ramo `main`, cartella `/ (root)`. I percorsi relativi sono già compatibili con un sito pubblicato sotto `/nome-repository/`. Su Pages il server Perl non viene eseguito e il computer locale non deve restare acceso. I file nel repository pubblico saranno visibili: non inserirvi dati riservati.
