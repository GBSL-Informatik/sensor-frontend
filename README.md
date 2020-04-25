# Sensor frontend with socket.io

A javascript react project using sockets to send and receive sensor data to/from backend.

[![Check it out on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/GBSL-Informatik/sensor-socket-frontend)

This should be used in combination with the [sensor-server](https://github.com/GBSL-Informatik/sensor-server).

![demo](docs/sensor-socket-demo.gif)

Remark that both clients get updated at the same time.

## install

```sh
yarn install
```

## run
```sh
yarn start
```

## Codesandbox

1. Make sure to first start a [Sensor-Server Sandbox](https://codesandbox.io/s/GBSL-Informatik/sensor-server):
  
    [![Check it out on Code Sandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/GBSL-Informatik/sensor-server)

2. Copy the URL of the *Sensor-Server Sandbox* instance and replace the value of the variable `API_URL` in `App.js` with the wordcloud server url.