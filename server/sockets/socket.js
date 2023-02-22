const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrar-chat', (data, callback) => {

        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        };

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('lista-persona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data?.sala).emit('crear-mensaje', crearMensaje('Administrador', `${data?.nombre} se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });


    client.on('crear-mensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crear-mensaje', mensaje);
     
        callback(mensaje);
                  
    });

    
    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada?.sala).emit('crear-mensaje', crearMensaje('Administrador', `${personaBorrada?.nombre} salió`));
        client.broadcast.to(personaBorrada?.sala).emit('lista-persona', usuarios.getPersonasPorSala(personaBorrada?.sala));
    });


    client.on('mensaje-privado', (data) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensaje-privado', crearMensaje(persona.nombre, data.mensaje));
    });

});