const Emitter = require('component-emitter')
const uuidv4 = require('uuid/v4')

callbackCounter = 0

isFunction = function (obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

let callbacks = {}
let clients = {}

module.exports = function wsEvents (sock, middlewares = []) {
  var listeners = new Emitter()
  var onopenHandlers = []

  async function onmessage (event) {
    var json, args
    try {
      json = JSON.parse(event.data)

      // Comprobamos si es una callback de vuelta o un mensaje de ida
      if (json.callback) {
        const callback = callbacks[json.callback]
        callback.apply(this, json.a)
        return delete callbacks[json.callback]
      }

      // Procesamos todos los middlewares por ser un mensaje de ida
      try {
        for (let i = 0; i < middlewares.length; i++) {
          await middlewares[i].apply(this, [sock])
        }
      } catch (e) {
        console.error('Websocket middleware error:')
        console.error(e)
        return sock.terminate()
      }

      // Enviamos el mensaje
      args = [json.t].concat(json.a)
      if (json.c) {
        args = args.concat(function () {
          sock.send(JSON.stringify({ callback: json.c, a: Array.from(arguments) }))
        })
      }
    } catch (e) {
      onerror(e)
      return
    }
    listeners.emit.apply(listeners, args)
  }

  function onerror (err) {
    listeners.emit('error', err)
  }

  function onopen () {
    // Generamos un id aleatorio
    let found = false
    while(!found) {
      const id = uuidv4()
      // Si no existe ningun cliente con este id lo guardamos
      if (!clients[id]) {
        found = true
        sock.id = id
        clients[id] = sock // Guardamos el cliente en 'la base de datos'
      }
    }

    // Procesamos todos los eventos pendientes emitidos antes de estar realemnte conectados
    onopenHandlers.forEach(function (fn) {
      fn()
    })
    onopenHandlers = [] // Limpiamos los eventos pendientes
  }

  function whenOpen (fn) {
    // Comprobamos si estamos realmente conectados y ejecutamos la funcion dada
    if (sock.readyState === sock.constructor.OPEN) {
      fn()
    } else {
      // Si no estamos realmente conectados guardamos la funcion a ejecutar para lanzarla cuadno nos volvamos a conectar
      onopenHandlers.push(fn)
    }
  }

  function onclose (event) {
    // Eliminamos el cliente de 'la base de datos'
    delete clients[sock.id]
    listeners.emit('close', event)
  }

  sock.onmessage = onmessage
  sock.onerror = onerror
  sock.onopen = onopen
  sock.onclose = onclose

  function emit (type) {
    var args = Array.prototype.slice.call(arguments, 1)
    whenOpen(function () {
      // Comprobamos si este mensaje lleva callback de vuelta
      const callback = args.slice(-1)
      if (callback && callback.length && isFunction(callback[0])) {
        args.splice(-1)
        callbacks[callbackCounter + 1] = callback[0]
        sock.send(JSON.stringify({ t: type, a: args, c: callbackCounter + 1 }))
        callbackCounter = callbackCounter + 1
      } else {
        sock.send(JSON.stringify({ t: type, a: args }))
      }
    })
    return events
  }

  function on (type, cb) {
    listeners.on(type, cb)
    return events
  }

  function off (type, cb) {
    listeners.off(type, cb)
    return events
  }

  var events = Object.create(sock)
  events.socket = sock
  events.emit = emit
  events.on = on
  events.off = off
  events.listeners = listeners.listeners.bind(listeners)
  events.hasListeners = listeners.hasListeners.bind(listeners)

  return events
}

