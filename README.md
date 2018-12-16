# ws-events

Esta libreria esta concebida como un wrapper del modulo ws de node. Seguro que muchos de vosotros cuando usásteis la tecnología de websocket por primera vez lo hicísteis a traves de la maravillosa libreria de Socket.io

El problema de esta libreria es la integración con React Native y Socket.io-client (version portable del cliente de Socket.io) ya que Socket.io no ha dado soporte propio para React Native.

Cuando te planteas migrar todo el código hecho en Socket.io a la libreria ws 'nativa' te encuentras con el dilema de la gestión del eventos y la escasa versatilidad que te ofrece tener un único evento 'message' para comunicarte con tus cliente.

# Construyendo un servidor websockets con ws

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
