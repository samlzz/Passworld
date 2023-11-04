import http from 'http';
import app from './app.js';

// Utilisez le type number | string | boolean pour le retour de la fonction normPort
const normPort = (val: string): number | string | boolean => {
    const port: number = parseInt(val, 10);

    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Port peut être de type number | string | boolean
const port: number | string | boolean = normPort(process.env.PORT || '3000');
app.set('port', port);

const serveur = http.createServer(app);

const gestErreur = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = serveur.address();
    const bind: string =
        typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(
                `${bind} necessite une autorisation plus importante.`
            );
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} est déja utilisé.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

serveur.on('error', gestErreur);
serveur.on('listening', () => {
    const address = serveur.address();
    const bind: string = typeof address === 'string' ? `${address}` : `${port}`;
    console.log(`Adresse serveur : http://localhost:${bind}`);
});

serveur.listen(port);
