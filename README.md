# ws-events-and-middlewares

Esta libreria esta concebida como un wrapper del modulo ws de node. Seguro que muchos de vosotros cuando usásteis la tecnología de websocket por primera vez lo hicísteis a traves de la maravillosa libreria de Socket.io

El problema de esta libreria es la integración con React Native y Socket.io-client (version portable del cliente de Socket.io) ya que Socket.io no ha dado soporte propio para React Native.

Cuando te planteas migrar todo el código hecho en Socket.io a la libreria ws 'nativa' te encuentras con el dilema de la gestión del eventos y la escasa versatilidad que te ofrece tener un único evento 'message' para comunicarte con tus cliente.

Veamos un ejemplo del uso de ws sin la libreria de este repositorio:

## Construyendo un servidor websockets con ws

```js
// Importamos la libreria de ws
const WebSocket = require('ws')

// Iniciamos un servidor websocket en el puerto 3000
const wss = new WebSocket.Server({ port: 3000 })

// Escuchamos el evento connection para detectar cuando se conecta un cliente
wss.on('connection', function connection(ws) {

  // Escuchamos el evento message para detectar cuando nos envian un mensaje (no podemos cambiar el nombre del evento)
  ws.on('message', function (message) {
    console.log('Mensaje recibido: %s', message)
  })
 
  // Enviamos un mensaje de Ready para indicar al cliente que estamos listos para comunicarnos con el
  ws.send('ready')
})
```

## Contruyendo la conexión desde el cliente

```js

// Importamos la libreria de ws
const WebSocket = require('ws');
 
// Nos conectamos a nuestro servidor websocket en el puerto 3000
const ws = new WebSocket('ws://www.host.com:3000/path');

// Cuando la conexión este lista y abierta
ws.on('open', function open() {
  ws.send('Hola servidor!') // Enviamos un mensaje al servidor
})

// Cuando recibamos un mensaje del servidor
ws.on('message', function incoming(data) {
  console.log(data) // Imprimimos lo que el servidor nos este enviando
})
```

El problema que se nos presenta aquí en oposición a la libreria de Socket.io es que no tenemos forma de modificar el 'tipo' de mensaje que enviamos y estamos obligados a tomar medidas del tipo:

```js
{
  type: 'GET_CONNECTED_USERS', // Tipo de mensaje que enviamos
  payload: {
    bar: 'foo'
  }
}
```

Por otra parte tampoco tenemos gestión de callbacks y nos vemos obligado a esperar recibir un mensaje de respuesta. Como tampoco tenemos gestión para middleware.

Para solucionar estos problemas podemos implementar la libreria ligera de este repositorio:

## Instalando ws-events-and-middlewares

```js
  npm install ws-events-and-middlewares --save
```

o

```js
  yarn install ws-events-and-middlewares --save
```

## Construyendo el servidor con eventos

## Construyendo el cliente

## Construyendo el servidor con eventos y middlewares


### TODO list

1. Manage all socket clients and set unique identifier for each of them.
2. Rooms feature
