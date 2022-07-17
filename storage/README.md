# Hack FS 2022 Node Backend

A test backend written in NodeJS to save data from an dapplet.

## Installation

Installing package on Node.js:

```
npm install key-file-storage
```

## Quick Overview

```
npm i
npm run dev
```

## Development

### `npm run dev` or `yarn dev`

Run nodemom to recompile the application when changing

### `npm run build` or `yarn build`

Builds the app for production to the **build** folder.

### `npm run start` or `yarn start`

Launches the assembled application.
Used after `npm run build` or `yarn build`

## API

Base URL for sending requests: http://localhost:8000/storage

### POST

To record, send a `POST` request with _JSON_, **key** and **value** contents

```
CURL POST http://localhost:8000/

JSON: {
  "key": "4",
  "value": "444444444444"
  }
```

### GET

To `GET` the value by sending _JSON_, where **key** is the key for the value

```
CURL GET http://localhost:8000/

JSON: {
  "key": "4"
  }
```
