/*jslint es6: true */
/*jslint this: true */
var back = {};
back.usuariosBorrados = [];
back.Sistema = function () {
    "use strict";
    this.sistema = [back.abraracurcix, back.amnexis, back.asterix, back.asuracenturix,
        back.canarix, back.obelix, back.panoramix];
};
back.Usuario = function (nombreCuenta, nombreUsuario, tipoCuenta, saldo, fecha,puntos,  tiempo,
        server) {
    "use strict";
    this.nombreCuenta = nombreCuenta;
    this.nombreUsuario = nombreUsuario;
    this.tipoCuenta = tipoCuenta;
    this.saldo = saldo;
    this.fecha = fecha;
    this.puntos = puntos;
    this.tiempo = tiempo;
    this.server = server;
};
back.Server = function (nombreServidor, ip, os, fechaAlta) {
    "use strict";
    this.nombreServidor = nombreServidor;
    this.ip = ip;
    this.os = os;
    this.fechaAlta = fechaAlta;
    this.usuarios = [];
};
back.Server.prototype.aniadirUsuarioServidor = function (targetServer, user) {
    "use strict";
    targetServer.usuarios.push(user);
};
back.creaSistema = function () {
    "use strict";
    return new back.Sistema();
};
back.amnexis = new back.Server("Amnexis", "192.16.0.1", "Linux", "01/01/1990");
back.asterix = new back.Server("Asterix", "192.16.4.1", "Linux", "01/01/1990");
back.asuracenturix = new back.Server("Asuracenturix", "192.16.8.1", "Linux", "01/01/1990");
back.obelix = new back.Server("Obelix", "172.21.1.1", "Windows Server", "01/01/1990");
back.panoramix = new back.Server("Panoramix", "172.25.1.1", "Windows Server", "01/01/1990");
back.abraracurcix = new back.Server("Abraracurcix", "1.2.3.4", "NetBSD", "01/01/1990");
back.canarix = new back.Server("Canarix", "2.4.6.8", "OpenBSD", "08/03/2017");
back.Sistema.prototype.datosServidor = function (server) {
    "use strict";
    return this.sistema.filter(function (value) {
        return value.nombreServidor === server;
    });
};
//Prototype Server?
back.filtraTipoCuenta = function (type) {
    "use strict";
    return this.usuarios.filter(function (value) {
        return value.tipoCuenta === type;
    });
};
back.getDate = function () {
    "use strict";
    var myDate = new Date();
    var year = String(myDate.getFullYear()).substring(2, 4);
    var day = ("0" + myDate.getDate()).slice(-2);
    var todayDate = day + "/" + (myDate.getMonth()  + 1) + "/" + year;
    return todayDate;
};
back.nombreCuentaCorrecto = function (nombreCuenta) {
    "use strict";
    var regExp = new RegExp("^[a-z\\.\\_\\-]+$");
    nombreCuenta = nombreCuenta.trim();
    if (!regExp.test(nombreCuenta)) {
        throw new Error(front.ERROR_CUENTA);
    }
};
back.nombreUsuarioCorrecto = function (nombre) {
    "use strict";
    nombre = nombre.trim();
    if (nombre.split(" ").length !== 2) {
        throw new Error(front.ERROR_USUARIO);
    } else {

    }
};
back.saldoCorrecto = function (saldo) {
    "use strict";
    var index = 0;
    if (!Number.isNaN(saldo)  && saldo) {
        throw new Error(front.ERROR_SALDO);
    } else {
        saldo = saldo;
    }
};
back.Sistema.prototype.puntosServidor = function () {
    "use strict";
    return this.sistema.map(function (value) {
        return value.usuarios.map(function (user) {
            return user.puntos;
        });
    });
};
back.Sistema.prototype.secciones = function () {
    "use strict";
    var x = 0;
    var serverPtos;

    

    while (this.puntosServidor()[x]) {
        if (this.puntosServidor()[x].length !== 0) {
            serverPtos = this.puntosServidor(this.puntosServidor()[x]);
        } else {
            serverPtos = serverPtos;
        }
        x += 1;
    }
    return serverPtos;
};
back.Sistema.prototype.puntosTotales = function () {
    "use strict";
    var todosPuntos;
    var arrayPtos = [];
    todosPuntos = this.secciones();
    var x;
    var y;
    for (x = 0; x < todosPuntos.length; x += 1) {
        for (y = 0; y < todosPuntos[x].length; y += 1) {
            if (todosPuntos[x][y] !== undefined) {
                arrayPtos.push(todosPuntos[x][y]);
            } else {
                arrayPtos = arrayPtos;
            }
        }
    }
    return arrayPtos;
};
back.Sistema.prototype.separaSecciones = function () {
    "use strict";
    var menor = 0;
    var medio = 0;
    var contadorMenor = 0;
    var contadorMedio = 0;
    var contadorMayor = 0;
    var contador = [];
    var ptos;
    ptos = this.puntosTotales().sort(function (a, b) {
        return a - b;
    });
    menor = parseInt(ptos[ptos.length - 1] / 3);
    medio = parseInt(menor * 2);
    ptos.map(function (val) {
        if (val < menor) {
            contadorMenor = contadorMenor + 1;
        } else {
            if (val < medio) {
                contadorMedio = contadorMedio + 1;
            } else {
                contadorMayor = contadorMayor + 1;
            }
        }
    });
    contador = [contadorMenor, contadorMedio, contadorMayor];
    return contador;
};
back.puntosCorrectos = function (puntos, tipoCuenta) {
    "use strict";
    var index = 0;
    if (puntos !== "") {

        while (puntos[index]) {
            if (Number.isNaN(parseInt(puntos[index]))) {
                index = undefined;
                throw new Error(front.ERROR_PUNTOS);
            }
            index += 1;
        }
    } else {
        switch (tipoCuenta) {
        case "user":
            puntos = 50;
            break;
        case "premium":
            puntos = 100;
            break;
        default:
            puntos = 10;
        }
    }
    return puntos;
};
back.esFechaCorrecta = function (fecha) {
    "use strict";
    var isRight = true;
    var usaFormatDate = fecha.substr(3, 2) + "/" + fecha.substr(0, 2) + "/" +
            fecha.substr(6, 2);
    var lengthDate = usaFormatDate.split("/").join("");
    var currentYear = new Date();
    var day = new Date(usaFormatDate);
    var year = parseInt(fecha.substr(6, 2), 10);
    currentYear = parseInt(currentYear.getYear().toString().substr(1, 2), 10) + 2000;
    if (year < 0 || year > 16) {
        year = 1900 + year;
    } else {
        year = 2000 + year;
    }
    day = day.getDate();
    if (new Date(usaFormatDate).toString() === "Invalid Date" ||
            day !== parseInt(fecha.substr(0, 2), 10) || lengthDate.length !== 6) {
        throw new Error(front.ERROR_FECHA);
    }
    return isRight;
};
back.tiempoCorrecto = function (tiempo) {
    "use strict";
    var minutos = parseInt((tiempo.split(":"))[0]);
    var segundos = parseInt((tiempo.split(":"))[1]);
    var total = `${(minutos && segundos < 60 ? tiempo : "")}`;
    return total;
};
back.tiempoVacio = function (tiempo) {
    "use strict";
    var minutos;
    var segundos;
    var total;
    minutos = (tiempo.split(":"))[0];
    segundos = (tiempo.split(":"))[1];
    total = minutos + segundos;
    if (!tiempo || Number.isNaN(total) || segundos.length !== 2) {
        throw new Error(front.ERROR_TIEMPO);
    }
    return tiempo;
};
back.Sistema.prototype.nombreUnico = function (name) {
    "use strict";
    return this.sistema.some(function (value) {
        return value.usuarios.some(function (valor) {
            if (valor.nombreCuenta === name) {
                throw new Error(front.ERROR_REPETIDA);
            }
        });
    });
};
back.incluyeUsuariosBorrados = function (user) {
    "use strict";
    back.usuariosBorrados.push(user);
};
back.Sistema.prototype.borraUsuario = function (name, server) {
    "use strict";
    var borrado = [];
    var arr = server.usuarios.map(function (value) {
        return value.nombreCuenta;
    });
    var pos = arr.indexOf(name);
    borrado = server.usuarios.splice(pos, 1);
    borrado.forEach(back.incluyeUsuariosBorrados);
};
back.add = function (a, b) {
    "use strict";
    return a + b;
};
back.Sistema.prototype.totalSaldo = function () {
    "use strict";
    var saldoTotal = this.sistema.map(function (value) {
        return value.usuarios.map(function (valor) {
            var saldo;
            if (!Number.isNaN(parseInt(valor.saldo))) {
                saldo = parseInt(valor.saldo);
            } else {
                saldo = 0;
            }
            return saldo;
        });
    });
    saldoTotal = saldoTotal.map(function (value) {
        var saldo = value[0];
        if (saldo) {
            saldo = value.reduce(back.add);
        } else {
            saldo = 0;
        }
        return saldo;
    });
    return saldoTotal.reduce(back.add);
};
back.Sistema.prototype.totalUsuarios = function () {
    "use strict";
    var totalUsuarios = this.sistema.map(function (value) {
        return value.usuarios.length;
    });
    return totalUsuarios.reduce(back.add);
};
back.Sistema.prototype.minutosTotal = function (server) {
    "use strict";
    var totalMinutes = server.usuarios.map(function (value) {
            var minutes = parseInt((value.tiempo.split(":"))[0]);
            return (!Number.isNaN(minutes)) ? parseInt(minutes) : 0;
    });
    return totalMinutes.reduce(back.add);
};
back.Sistema.prototype.segundosTotal = function (server) {
    "use strict";
    var totalSeconds = server.usuarios.map(function (value) {
            var seconds = parseInt((value.tiempo.split(":"))[1]);
            return (!Number.isNaN(seconds)) ? parseInt(seconds) : 0;
    });
    return totalSeconds.reduce(back.add);
};
back.Sistema.prototype.tiempoTotal = function (server) {
    "use strict";
    var minutes = back.Sistema.prototype.minutosTotal(server);
    var seconds = back.Sistema.prototype.segundosTotal(server);
    minutes = minutes + Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds}`;
};
