let usuario = null;
let socket = null;

// Referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

// Validar token de localstorage
const validarJWT = async () => {
  const token = localStorage.getItem('token') || '';
  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }

  const resp = await fetch('http://localhost:8080/api/auth/', {
    headers: { 'x-token': token },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  usuario = userDB;
  document.title = userDB.nombre;
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token'),
    },
  });

  socket.on('connect', () => {
    console.log('Sockets online');
    console.log("El usuario se conectó")
  });

  socket.on('disconnect', () => {
    console.log('Sockets offline');
  });

  socket.on('recibir-mensajes', dibujarMensajes);

  socket.on('usuarios-activos', (payload) => {
    dibujarUsuarios(payload);
  });

  socket.on('mensaje-privado', (payload) => {
    console.log("Privado: ", payload)
  });
};

// Mostrar los usuarios en html
const dibujarUsuarios = (usuarios = []) => {
  let usersHTML = '';
  usuarios.forEach(({ nombre, uid }) => {
    usersHTML += `
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
    `;
  });

  ulUsuarios.innerHTML = usersHTML;
};


// Mostrar los mensajes con html
const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = '';
  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHTML += `
        <p>
          <span class="text-primary"><b>${nombre}</b></span>
          <span>${mensaje}</span>
        </p>
    `;
  });

  ulMensajes.innerHTML = mensajesHTML;
};

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;

  if (keyCode !== 13) {
    return;
  }
  if (mensaje.length === 0) {
    return;
  }

  socket.emit('enviar-mensaje', { uid, mensaje });
  txtMensaje.value = '';
});

const main = async () => {
  await validarJWT();
};

main();


