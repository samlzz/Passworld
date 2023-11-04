import http from 'http';
import app from './app.js';
// Utilisez le type number | string | boolean pour le retour de la fonction normPort
var normPort = function (val) {
    var port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
// Port peut être de type number | string | boolean
var port = normPort(process.env.PORT || '3000');
app.set('port', port);
var serveur = http.createServer(app);
var gestErreur = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var address = serveur.address();
    var bind = typeof address === 'string' ? "pipe ".concat(address) : "port: ".concat(port);
    switch (error.code) {
        case 'EACCES':
            console.error("".concat(bind, " necessite une autorisation plus importante."));
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error("".concat(bind, " est d\u00E9ja utilis\u00E9."));
            process.exit(1);
            break;
        default:
            throw error;
    }
};
serveur.on('error', gestErreur);
serveur.on('listening', function () {
    var address = serveur.address();
    var bind = typeof address === 'string' ? "".concat(address) : "".concat(port);
    console.log("Adresse serveur : http://localhost:".concat(bind));
});
serveur.listen(port);
