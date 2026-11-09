(function () {
    'use strict';
    var game = new MaxiP.Game();
    var board = document.getElementById('board');
    var status = document.getElementById('status');
    var time = document.getElementById('time');
    var progress = document.getElementById('progress');
    var shuffle = document.getElementById('shuffle');
    var pause = document.getElementById('pause');
    var fullscreen = document.getElementById('fullscreen');
    var notice = document.getElementById('notice');
    var cells = [], buttons = [shuffle, pause, fullscreen], previousState = '';
    var messages = {
        STOPPED: 'Premi Mescola per iniziare.',
        STARTED: 'Trova le parole! Il tempo scorre.',
        PAUSED: 'Partita in pausa: lettere nascoste.',
        ENDED: 'Tempo scaduto! Premi Mostra per verificare le parole.'
    };
    var i;
    for (i = 0; i < 25; i++) {
        var cell = document.createElement('span');
        cell.className = 'die';
        board.appendChild(cell);
        cells.push(cell);
    }

    function render() {
        game.tick();
        var seconds = Math.ceil(game.remaining / 1000);
        time.textContent = Math.floor(seconds / 60) + ':' + ('0' + seconds % 60).slice(-2);
        progress.value = game.duration - game.remaining;
        if (previousState === game.state) { return; }
        var hidden = game.state === 'PAUSED' || game.state === 'ENDED';
        board.className = 'board' + (hidden ? ' hidden' : '');
        for (var n = 0; n < cells.length; n++) {
            var letter = game.board.length ? game.board[n].letter : '·';
            cells[n].textContent = hidden ? '*' : letter;
            cells[n].className = 'die' + (!hidden && (letter === 'N' || letter === 'Z') ? ' ambiguous' : '');
        }
        status.textContent = game.state === 'STOPPED' && game.board.length ?
            'Verifica le parole. Premi Mescola per una nuova partita.' : messages[game.state];
        shuffle.disabled = game.state !== 'STOPPED';
        pause.disabled = game.state === 'STOPPED';
        pause.textContent = game.state === 'PAUSED' ? 'Riprendi' : (game.state === 'ENDED' ? 'Mostra' : 'Pausa');
        // Non lasciare mai il focus su un comando appena disabilitato.
        if (document.activeElement === shuffle && shuffle.disabled) { pause.focus(); }
        if (document.activeElement === pause && pause.disabled) { shuffle.focus(); }
        previousState = game.state;
    }

    shuffle.addEventListener('click', function () { game.start(); render(); });
    pause.addEventListener('click', function () { game.toggle(); render(); });

    var element = document.documentElement;
    var requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen;
    if (!requestFullscreen) {
        fullscreen.disabled = true;
        fullscreen.title = 'Schermo intero non disponibile in questo browser';
    }
    fullscreen.addEventListener('click', function () {
        notice.textContent = '';
        try {
            var result = requestFullscreen.call(element);
            if (result && result.catch) {
                result.catch(function () { notice.textContent = 'Schermo intero non consentito dal browser.'; });
            }
        } catch (error) {
            notice.textContent = 'Schermo intero non disponibile in questo browser.';
        }
    });

    document.addEventListener('keydown', function (event) {
        var key = event.keyCode || event.which;
        if (key >= 37 && key <= 40) {
            event.preventDefault();
            var enabled = buttons.filter(function (button) { return !button.disabled; });
            var index = enabled.indexOf(document.activeElement);
            var direction = key === 37 || key === 38 ? -1 : 1;
            enabled[index < 0 ? 0 : (index + direction + enabled.length) % enabled.length].focus();
        } else if (key === 13 && buttons.indexOf(document.activeElement) < 0) {
            event.preventDefault();
            (shuffle.disabled ? pause : shuffle).focus();
        }
        // Sui pulsanti HTML, Invio/OK e spazio usano il click nativo.
    });

    document.addEventListener('visibilitychange', render);
    window.addEventListener('pageshow', render);
    window.setInterval(render, 200);
    render();
    shuffle.focus();
}());
