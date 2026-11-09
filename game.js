/* Logica condivisa dal browser e dai test, senza dipendenze. */
(function (root) {
    'use strict';
    var DICE = [
        ['D','A','M','E','P','C'], ['O','E','L','R','U','I'],
        ['S','A','G','P','C','V'], ['N','O','D','E','T','S'],
        ['I','T','E','V','N','G'], ['E','F','I','H','S','E'],
        ['M','A','R','O','S','I'], ['L','O','C','I','M','R'],
        ['E','O','N','U','T','C'], ['B','C','I','M','A','O'],
        ['S','E','C','A','R','L'], ['F','Qu','A','B','Z','S'],
        ['O','E','A','T','I','A'], ['L','M','C','D','O','I'],
        ['O','F','I','R','C','O'], ['E','N','U','L','G','O'],
        ['I','G','F','A','P','R'], ['D','I','O','T','V','M'],
        ['R','S','N','H','E','I'], ['T','B','R','L','A','I'],
        ['D','A','N','E','V','Z'], ['U','L','E','P','S','T'],
        ['T','A','C','G','P','I'], ['M','A','Qu','O','B','O'],
        ['N','O','E','F','L','B']
    ];

    function Game(duration, clock, random) {
        this.duration = duration || 180000;
        this.clock = clock || function () { return Date.now(); };
        this.random = random || Math.random;
        this.state = 'STOPPED';
        this.board = [];
        this.remaining = this.duration;
        this.deadline = null;
    }

    Game.prototype.start = function () {
        if (this.state !== 'STOPPED') { return; }
        var indices = [], i, j, temp;
        for (i = 0; i < DICE.length; i++) { indices.push(i); }
        // Fisher-Yates: ogni dado compare una sola volta.
        for (i = indices.length - 1; i > 0; i--) {
            j = Math.floor(this.random() * (i + 1));
            temp = indices[i]; indices[i] = indices[j]; indices[j] = temp;
        }
        this.board = [];
        for (i = 0; i < indices.length; i++) {
            j = Math.floor(this.random() * 6);
            this.board.push({ die: indices[i], face: j, letter: DICE[indices[i]][j] });
        }
        this.remaining = this.duration;
        this.deadline = this.clock() + this.remaining;
        this.state = 'STARTED';
    };

    Game.prototype.tick = function () {
        if (this.state === 'STARTED') {
            this.remaining = Math.max(0, this.deadline - this.clock());
            if (this.remaining === 0) {
                this.state = 'ENDED';
                this.deadline = null;
            }
        }
        return this.remaining;
    };

    Game.prototype.toggle = function () {
        var previous = this.state;
        this.tick();
        // Un click su Pausa arrivato dopo la scadenza non deve rivelare le lettere.
        if (previous === 'STARTED' && this.state === 'ENDED') { return; }
        if (this.state === 'STARTED') {
            this.state = 'PAUSED';
            this.deadline = null;
        } else if (this.state === 'PAUSED') {
            this.deadline = this.clock() + this.remaining;
            this.state = 'STARTED';
        } else if (this.state === 'ENDED') {
            this.state = 'STOPPED';
        }
    };

    var api = { Game: Game, dice: DICE };
    if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
    else { root.MaxiP = api; }
}(this));
