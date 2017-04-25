/*global document, creaSistema, window, back */
/*jslint es6: true */
/*jslint browser: true */
//prueba ut4
var back;
var front = {};
front.CORRECT = "Usuario creado correctamente";
front.MOVIDO_CORRECTAMENTE = "Usuario creado en el servidor:  ";
front.ERROR_SIN_USUARIO = "No hay usuarios en el sistema";
front.ERROR_CUENTA = "Nombre cuenta invalido";
front.ERROR_USUARIO = "Nombre usuario invalido";
front.ERROR_SALDO = "Saldo invalido";
front.ERROR_FECHA = "Fecha invalida";
front.ERROR_REPETIDA = "La cuenta ya existe";
front.ERROR_PUNTOS = "Puntos invalidos";
front.ERROR_TIEMPO = "Tiempo invalido";
var sistema = back.creaSistema();
function $(id) {
    "use strict";
    return document.getElementById(id);
}

front.generateDate = function () {
    "use strict";
    $("fecha").value = back.getDate();
};
front.encuentraIndex = function (borrados, index) {
    "use strict";
    return back.usuariosBorrados.findIndex((value) => value.nombreCuenta === borrados[index]);
};
front.encuentraServidor = function (server) {
    "use strict";
    return sistema.sistema.findIndex((value) => value.nombreServidor === server);
};
front.validaUsuario = function () {
    "use strict";
    try {
        var nombreCuenta = $("nombreCuenta").value;
        var nombreUsuario = $("nombreUsuario").value;
        var tipoCuenta = $("tipoCuenta").value;
        var saldo = $("saldo").value;
        var fecha = $("fecha").value;
        var puntos = $("puntos").value;
        var tiempo = $("tiempo").value;
        var server = $("selectedServer").value;

        back.nombreCuentaCorrecto(nombreCuenta);
        sistema.nombreUnico(nombreCuenta);
        back.nombreUsuarioCorrecto(nombreUsuario);
        back.saldoCorrecto(saldo);
        puntos = back.puntosCorrectos(puntos, tipoCuenta);
        if (tiempo) {
            tiempo = (back.tiempoVacio(back.tiempoCorrecto(tiempo)));
        } else {
            tiempo = "0:00";
        }
        back.esFechaCorrecta(fecha);
        front.creaUsuario(
            nombreUsuario,
            nombreCuenta,
            tipoCuenta,
            saldo,
            puntos,
            fecha,
            tiempo,
            server
        );
        if (server === $("filtroServidor").value) {
            front.fillData();
            $("mensaje").innerHTML = front.CORRECT;
        } else {
            $("mensaje").innerHTML = front.MOVIDO_CORRECTAMENTE + server;
        }
    } catch (e) {
        $("mensaje").innerHTML = e.message;
    }
};
front.creaUsuario = function (nombreUsuario, nombreCuenta, tipoCuenta, saldo, fecha, puntos, tiempo, server) {
    "use strict";
    var targetServer = sistema.datosServidor($("selectedServer").value)[0];
    var user = new back.Usuario(nombreUsuario, nombreCuenta, tipoCuenta, saldo, puntos, fecha, tiempo, server);
    back.Server.prototype.aniadirUsuarioServidor(targetServer, user);
};
front.filtraServidor = function () {
    "use strict";
    var name = sistema.datosServidor($("filtroServidor").value)[0].nombreServidor;
    var ip = sistema.datosServidor($("filtroServidor").value)[0].ip;
    var os = sistema.datosServidor($("filtroServidor").value)[0].os;
    var date = sistema.datosServidor($("filtroServidor").value)[0].fechaAlta;
    $("nombreServidor").innerHTML = "Nombre Servidor: " + name;
    $("serverIP").innerHTML = "IP: " + ip;
    $("serverOS").innerHTML = "OS: " + os;
    $("fechaAlta").innerHTML = "Fecha Alta: " + date;
};
front.cuentasCreadas = function (table, value) {
    "use strict";
    var row = table.insertRow(1);
    var server = $("filtroServidor").value;
    var arrayServers = [
        "",
        "Amnexis",
        "Asterix",
        "Asuracenturix",
        "Obelix",
        "Panoramix",
        "Abraracurcix",
        "Canarix"
    ];
    var pos = arrayServers.findIndex((value) => value === server);
    var sel = document.createElement("select");
    sel.setAttribute("onchange", "front.moverAlServidor()");
    arrayServers.splice(pos, 1);
    row.setAttribute("id", "cuentasCreadas");
    row.insertCell(0).innerHTML = value.nombreCuenta;
    row.insertCell(1).innerHTML = value.nombreUsuario;
    row.insertCell(2).innerHTML = value.fecha;
    row.insertCell(3).innerHTML = value.saldo;
    row.insertCell(4).innerHTML = value.puntos;
    row.insertCell(5).innerHTML = value.tiempo;
    row.insertCell(6).innerHTML = value.tipoCuenta;
    arrayServers.map(function (value) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.innerHTML = value;
        sel.appendChild(opt);
    });
    row.insertCell(7).appendChild(sel);
    row.insertCell(8).innerHTML = "<input type='checkbox'" +
            "id='delete1' class='delete1' value='" +
            value.nombreCuenta + "'/>";
};
front.moverAlServidor = function () {
    "use strict";
    var parent = document.activeElement.parentElement.parentElement;
    var nombreCuenta = parent.firstChild.innerHTML;
    var actualServer = $("filtroServidor").value;
    var targetServer = document.activeElement.value;
    var posActualServer = front.encuentraServidor(actualServer);
    var posTargetServer = front.encuentraServidor(targetServer);
    var arrayUser = sistema.sistema[posActualServer].usuarios.filter(function (value) {
        return value.nombreCuenta === nombreCuenta;
    });
    var user = arrayUser[0];
    user.server = targetServer;
    sistema.sistema[posTargetServer].usuarios.push(user);
    actualServer = sistema.sistema[posActualServer];
    var arr = actualServer.usuarios.map(function (value) {
        return value.nombreCuenta;
    });
    var pos = arr.indexOf(nombreCuenta);
    actualServer.usuarios.splice(pos, 1);
    front.fillData();
};
front.cuentasBorradas = function (table, value) {
    "use strict";
    var row = table.insertRow(1);
    row.setAttribute("id", "camposBorradas");
    row.insertCell(0).innerHTML = value.nombreCuenta;
    row.insertCell(1).innerHTML = value.nombreUsuario;
    row.insertCell(2).innerHTML = value.fecha;
    row.insertCell(3).innerHTML = value.saldo;
    row.insertCell(4).innerHTML = value.puntos;
    row.insertCell(5).innerHTML = value.tiempo;
    row.insertCell(6).innerHTML = value.tipoCuenta;
    row.insertCell(7).innerHTML = value.server;
    row.insertCell(8).innerHTML = "<input type='checkbox'" +
            "id='selectorBorradas' class='selectorBorradas' value='" +
            value.nombreCuenta + "'/>";
};
front.recuperaCuentas = function () {
    "use strict";
    var id = "selectorBorradas";
    var borrados = front.compruebaCheck(id);
    var posicion;
    var index;
    var server;
    var posServer;
    while (borrados.length > 0) {
        index = borrados.length - 1;
        posicion = front.encuentraIndex(borrados, index);
        server = back.usuariosBorrados[posicion].server;
        posServer = front.encuentraServidor(server);
        sistema.sistema[posServer].usuarios.push(back.usuariosBorrados[posicion]);
        back.usuariosBorrados.splice(posicion, 1);
        borrados.pop();
    }
    front.fillData();
};

front.filtraTablas = function (server) {
    "use strict";
    var filtroUsuarios = [];
    var borrados = $("cuentasCreadas");
    var table = $("tablaCuentas");
    var filtroServidor = $("filtroTipoCuenta").value;
    while ($("cuentasCreadas")) {
        borrados = $("cuentasCreadas");
        borrados.remove();
    }
    if (filtroServidor === "all") {
        server.usuarios.map(function (value) {
            front.cuentasCreadas(table, value);
        });
    } else {
        filtroUsuarios = server.usuarios.filter(function (value) {
            return value.tipoCuenta === filtroServidor;
        });
        filtroUsuarios.map(function (value) {
            front.cuentasCreadas(table, value);
        });
    }
};
front.filtraBorradas = function () {
    "use strict";
    var borrados = $("camposBorradas");
    var table = $("tablaBorradas");
    while ($("camposBorradas")) {
        borrados = $("camposBorradas");
        borrados.remove();
    }
    back.usuariosBorrados.map(function (value) {
        front.cuentasBorradas(table, value);
    });
};
front.fillData = function () {
    "use strict";
    var server = sistema.datosServidor($("filtroServidor").value)[0];
    front.filtraServidor();
    front.filtraTablas(server);
    front.filtraBorradas();
};
front.usuariosAborrar = function (id) {
    "use strict";
    var index = 0;
    var borrados = front.compruebaCheck(id);
    var server;
    var name;
    while (borrados.length > 0) {
        server = sistema.datosServidor($("filtroServidor").value)[0];
        index = borrados.length - 1;
        name = borrados[index];
        sistema.borraUsuario(name, server);
        borrados.pop();
    }
    front.fillData();
};
front.borraUsuario = function () {
    "use strict";
    var id = "delete1";
    front.usuariosAborrar(id);
};
front.compruebaCheck = function (id) {
    "use strict";
    var list = document.getElementsByClassName(id);
    var index = 0;
    var borrados = [];
    while (list[index]) {
        if (list[index].checked === true) {
            borrados.push(list[index].value);
            index += 1;
        } else {
            index += 1;
        }
    }
    return borrados;
};
front.borraCompletamente = function () {
    "use strict";
    var id = "selectorBorradas";
    var index = 0;
    var borrados = front.compruebaCheck(id);
    var pos;
    borrados.forEach(function (e, index, borrados){
        pos = front.encuentraIndex(borrados,index);
        index = borrados.length - 1;
        back.usuariosBorrados.splice(pos, 1);
        borrados.pop();
    })
    front.fillData();
};
front.generaSaldo = function () {
    "use strict";
    var saldo = sistema.totalSaldo();
    var usuarios = sistema.totalUsuarios();
    if (usuarios === 0) {
        $("mediaSado").value = front.ERROR_SIN_USUARIO;
    } else {
        $("mediaSado").value = Math.round(saldo / usuarios);
    }
};
front.estadisticas = function () {
    "use strict";
    var sections = sistema.separaSecciones();
    document.getElementById("tramo1").innerHTML = sections[0];
    document.getElementById("tramo2").innerHTML = sections[1];
    document.getElementById("tramo3").innerHTML = sections[2];
};
front.comparaCuentasDesc = function (a, b) {
    "use strict";
    if (a.tipoCuenta < b.tipoCuenta) {
        return -1;
    }
    else {
        return 1;
    }
    return 0;
};
front.comparaCuentasAscendente = function (a, b) {
    "use strict";
    if (a.tipoCuenta < b.tipoCuenta) {
        return 1;
    }
    else {
        return -1;
    }
    return 0;
};
front.ordenaDescendente = function () {
    "use strict";
    var server = sistema.datosServidor($("filtroServidor").value)[0];
    server.usuarios.sort(front.comparaCuentasDesc);
    front.filtraTablas(server);
};
front.ordenaAscendente = function () {
    "use strict";
    var server = sistema.datosServidor($("filtroServidor").value)[0];
    server.usuarios.sort(front.comparaCuentasAscendente);
    front.filtraTablas(server);
};
front.calculaTiempo = function () {
    "use strict";
    var usuarios = sistema.totalUsuarios();
    var server = sistema.datosServidor($("filtroServidor").value)[0];
    if (usuarios === 0) {
        $("tiempoTotal").value = front.ERROR_SIN_USUARIO;
    } else {
        $("tiempoTotal").value = sistema.tiempoTotal(server);
    }
};
