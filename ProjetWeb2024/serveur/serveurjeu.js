const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile('jeu.html', { root: __dirname });
});

let joueurs = [];
let spectateurs = [];
let nbMaxJoueurs = 2;
let jeton = -1; 
let historique = []; 

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté.');

    // Rejoindre la partie
    socket.on('entree', (nomJoueur) => {
        if (joueurs.length < nbMaxJoueurs) {
            if (joueurs.includes(nomJoueur)) {
                socket.emit('messageServeur', 'Ce nom est déjà utilisé.');
                return;
            }
            joueurs.push(nomJoueur);
            socket.emit('numJ', joueurs.length - 1); // Attribue un numéro au joueur
            io.emit('majliste', joueurs); // Met à jour la liste pour tout le monde
            console.log(`Joueur ajouté : ${nomJoueur}`);

            if (joueurs.length === nbMaxJoueurs) {
                jeton = 0; // Le premier joueur commence
                io.emit('changementJeton', { jeton });
            }
        } else {
            let spectateurId = `Spectateur ${spectateurs.length + 1}`;
            spectateurs.push({ id: socket.id, nom: spectateurId, historiqueIndex: historique.length });
            socket.emit('modeSpectateur', { message: `Mode spectateur activé. Vous êtes ${spectateurId}` });
            socket.emit('etatHistorique', historique); 
            console.log(`${spectateurId} ajouté.`);
        }
    });

    // Quitter la partie
    socket.on('sortie', (nomJoueur) => {
        const index = joueurs.indexOf(nomJoueur);
        if (index !== -1) {
            joueurs.splice(index, 1);
            jeton = -1; // Réinitialise le jeton
            io.emit('majliste', joueurs);
            console.log(`Joueur supprimé : ${nomJoueur}`);
        }
    });

    // Gestion des messages
    socket.on('message', (data) => {
        const spectateur = spectateurs.find(s => s.id === socket.id);
        const nom = spectateur ? spectateur.nom : joueurs[data.numJoueur];
        const message = `${nom}: ${data.texte}`;
        io.emit('message', message);
        console.log(message);
    });

    // Gestion des coups
    socket.on('selectionHexagone', ({ numJoueur, numHexagone }) => {
        if (numJoueur === jeton) {
            historique.push({ numJoueur, numHexagone });
            io.emit('colorierHexagone', { numJoueur, numHexagone });
            jeton = (jeton + 1) % nbMaxJoueurs;
            io.emit('changementJeton', { jeton });
        } else {
            socket.emit('messageServeur', 'Ce n\'est pas ton tour !');
        }
    });

    // Navigation dans l’historique
    socket.on('naviguerHistorique', (direction) => {
        const spectateur = spectateurs.find(s => s.id === socket.id);
        if (spectateur) {
            if (direction === 'back' && spectateur.historiqueIndex > 0) {
                spectateur.historiqueIndex--;
            } else if (direction === 'forward' && spectateur.historiqueIndex < historique.length) {
                spectateur.historiqueIndex++;
            }
            socket.emit('etatHistorique', historique.slice(0, spectateur.historiqueIndex));
        }
    });

    // Déconnexion
    socket.on('disconnect', () => {
        const indexJoueur = joueurs.indexOf(socket.id);
        const indexSpectateur = spectateurs.findIndex(s => s.id === socket.id);

        if (indexJoueur !== -1) {
            joueurs.splice(indexJoueur, 1);
            io.emit('majliste', joueurs);
        } else if (indexSpectateur !== -1) {
            spectateurs.splice(indexSpectateur, 1);
        }
        console.log('Un utilisateur s\'est déconnecté.');
    });
});

server.listen(8888, () => {
    console.log('Serveur lancé sur http://localhost:8888');
});
