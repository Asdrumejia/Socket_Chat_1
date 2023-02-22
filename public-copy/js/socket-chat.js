var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
};

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrar-chat', usuario, function(resp){
        console.log('Usuarios conectados', resp);      
    });
    
});


// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crear-mensaje', {
//     nombre: 'Asdrúbal',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });


// Escuchar información
socket.on('crear-mensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});


//Escuchar cambios de usuarios
//Cuando un usuario entra o sale del chat
socket.on('lista-personas', function(personas) {
    console.log(personas);
});


//Mensajes privados
socket.on('mensaje-privado', function(personas) {
    console.log('Mensaje privado:', mensaje);
});