/// <reference types="node" />
import http from 'http';
declare const serveur: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default serveur;
