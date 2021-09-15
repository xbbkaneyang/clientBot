/**
 * Created by William on 17/02/2017.
 */

var PomeloClient = require('./pomelo-client-multiple');
var pomelo = new PomeloClient();

var handshakeCallback = function( data ) {
    console.log( data );
};
pomelo.init({
    host: "127.0.0.1",
    port: "3015",
    log: true,
    handshakeCallback : handshakeCallback
} , function() {
    console.log( "connected" );
    var route = 'gate.gateHandler.queryEntry';
    console.log( 'gateConnected' );
    // Request Connector
    pomelo.request(route, {
        token: "13"
    } , function(data) {
        console.info( data );
        pomelo.init({
            host: data.host,
            port: data.port,
            log: true
        } , function( data ) {
            route = 'connector.entryHandler.enter';
            console.log('connector connected');
            pomelo.request(route, {
                a: 'a',
                p: 'a'
            } , function( data ) {
                route = 'connector.entryHandler.enterGame';
                console.info( data );
                pomelo.request(route, {
                    gs: [101]
                } , function( data ) {

                });
            });
        });
    });
});

// var ePomelo = require('./pomelo-client.js');
// var pomelo  = new ePomelo();
// pomelo._debug = true;
var CYPomeloClient = function() {
    var name = "ss";

    this.getName = function() {
        return name;
    };
};
module.exports = CYPomeloClient;
return;
var cyPomeloClient = CYPomeloClient.prototype;

cyPomeloClient.init = function( _host , _port , account , password , token , _cb ){
    console.log( 'CYPomeloClient.prototype.init' );

    pomelo.init({
        host: _host,
        port: _port,
        log: true
    } , function() {
        var route = 'gate.gateHandler.queryEntry';
        console.log( 'gateConnected' );
        // Request Connector
        pomelo.request(route, {
            token: token
        } , function(data) {
            pomelo.disconnect();
            if( data.code === 500 ) {
                console.log('LOGIN_ERROR');
                return;
            }
            var serverInfo = {
                host: data.host,
                port: data.port
            };

            // Connect To Connector
            connectToConnector(data.host, data.port, account, password,function( data ) {

                _cb( data );
            });

            console.log('serverInfo: ' + JSON.stringify(serverInfo));
        });
    });
};

cyPomeloClient.sendLog = function( _uid , _log ) {
    var route = "log.logHandler.log";
    pomelo.request(route, {
        log: _log,
        uid: _uid
    } , function(data) {
        console.log('sendLog() RES: ' + data);
    });
};

cyPomeloClient.joinGame = function( uid , _gameType ) {
    var route = "log.logHandler.join";
    pomelo.request(route, {
        gameType: _gameType,
        uid: uid
    }, function(data) {
        console.log('join() RES: ' + data);
    });
};

cyPomeloClient.leaveGame = function( _uid ) {
    var route = "log.logHandler.leave";
    pomelo.request(route, {
        uid: _uid
    } , function(data) {
        console.log('leaveRoom() RES: ' + data);
    });
};

cyPomeloClient.testLog = function( _uid ) {
    var route = "log.logHandler.test";
    pomelo.request(route, {
        uid: _uid
    } , function(data) {
        console.log('leaveRoom() RES: ' + data);
    });
};

cyPomeloClient.test = function( _uid ) {
    var route = "fishbattle.fishbattleHandler.test";
    pomelo.request(route, {
        uid: _uid
    } , function( data ) {
        console.log('fishbattle.fishbattleHandler.test() RES: ' + data);
        console.info();
    });
};

cyPomeloClient.testDBA = function( _uid ) {
    var route = "fbroom.fbroomHandler.test";
    pomelo.request(route, {
        uid: _uid
    } , function(data) {
        console.log('dbaHandle() RES: ' + data);
    });
};

cyPomeloClient.enterGame = function( gametypes ) {
    var route = "connector.entryHandler.enterGame";
    pomelo.request(route, {
        gs: gametypes
    } , function(data) {
        console.log('enterGame() RES: ' + data);
    });
};

cyPomeloClient.setEventListener = function( _cb ) {

    pomelo.on('onConnectFishBattle', function(data) {
        // console.log('onMsg: ' + JSON.stringify(data));
        _cb('onConnectFishBattle: ' + JSON.stringify(data));
    });
    //wait message from the server.
    pomelo.on('onMsg', function(data) {
        // console.log('onMsg: ' + JSON.stringify(data));
        _cb('onMsg: ' + JSON.stringify(data));
    });

    //update user list
    pomelo.on('onAdd', function(data) {
        // console.log('onAdd: ' + JSON.stringify(data));
        _cb('onAdd: ' + JSON.stringify(data));
    });

    //update user list
    pomelo.on('onLeave', function(data) {
        // console.log('onLeave: ' + JSON.stringify(data));
        _cb('onLeave: ' + JSON.stringify( data ));
    });

    //handle disconect message, occours when the client is disconnect with servers
    // pomelo.on( 'disconnect' , function( reason ) {
    //     // console.log('disconnect: ' + reason);
    //     _cb( 'disconnect: ' + reason );
    // });

    pomelo._socket.on('disconnect', function(reason) {
        // console.log('disconnect: ' + reason);
        _cb('disconnect: ' + reason);
    });
};

var connectToConnector = function( _host , _port , account , password , _cb ) {
    pomelo.init({
        host: _host,
        port: _port,
        log: true
    } , function() {
        var route = "connector.entryHandler.enter";
        pomelo.request(route, {
            a: account,
            p: password,
            g: 'fishbattle'
        } , function(data) {
            if(data.error) {
                switch( data.code ) {
                    case 101:
                        console.log( 'Login is Error !!' );
                        break;
                    default :
                        console.log( 'connector is onDisconnected!!' );
                        break;
                }
                return;
            }
            console.log('[connector.entryHandler.enter] RES/> ' + JSON.stringify(data));
            _cb(data);
        });
    });
    cyPomeloClient.setEventListener(function (data) {
        console.log('setEventListener: ' + data);
    });
};

module.exports = CYPomeloClient;