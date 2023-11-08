# Passworld

Passworld is a secure password management application, with a React-based frontend and an Express.js backend. This project is split into two main directories, one for the frontend (`passworld`) and one for the backend (`passworld_serv`).

## Backend - passworld_serv

The backend service for Passworld is built with Node.js and Express, using Mongoose to interact with MongoDB.

### Requirements

- Node.js
- MongoDB

### Installation

To get started with the backend, navigate to the backend directory and install the dependencies:

```bash
cd .\src\Backend\
npm install
```

### Compilation

To compile the TypeScript to JavaScript:
```bash
npm run build
```

### Exécution

To start the server:
```bash
npm start
```

For development, to watch for changes:
```bash
npm run dev
```

## Frontend - passworld

The frontend UI for Passworld is built using React and styled with MUI (Material UI).

### Requirements

- Node.js

### Installation

To get started with the backend, be at the root of the project and install the dependencies:

```bash
npm install
```

### Développement

To start the development server:

```bash
npm run dev
```

### Compilation

To build the static files for production:

```bash
npm run build
```

### Aperçu du build de production

To preview the production build:

```bash
npm run preview
```

### Linting

To lint the project files:

```bash
npm run lint
```

## Contribution

Contributions are welcome. Please feel free to submit pull requests or open issues to improve the project.

## License

This project is open-sourced software licensed under the ISC license.
