/*jshint curly:true, indent:4, strict:true*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var config = require('./config');

var N = require('./vendor/nuve');
var Erizo = require('./vendor/erizofc');

var roomID, erizoRoom;


N.API.init(config.Nuve.serviceID, config.Nuve.serviceKey, config.Nuve.host);

var errorCallback = function (e) {
    "use strict";
    console.log(e);
};

var dataStream = Erizo.Stream({
    data: true,
    attributes: {role: 'server'},
});

var onCreateToken = function (token) {
    "use strict";

    console.log('Token created: ', token);
    erizoRoom = Erizo.Room({token: token});

    dataStream.init();
    erizoRoom.connect();

    erizoRoom.addEventListener('room-connected', function (roomEvent) {
        console.log("Connected to the room.");
        erizoRoom.publish(dataStream);

        console.log("Data stream published.");
        setInterval(function () {
            dataStream.sendData({action: 'update-heartbeat'});
            console.log("Heartbeat sent");
        }, 5000);
    }); 
};

var createToken = function (roomID) {
    "use strict";
    N.API.createToken(roomID, 'server', 'server', onCreateToken, errorCallback);
};

N.API.getRooms(function (rooms) {
    "use strict";
    var nuveRoom;

    for (var index in rooms) {
        if (rooms[index].name == config.Nuve.roomName) {
            nuveRoom = rooms[index];
        }
    }

    if (nuveRoom === undefined) {
        nuveRoom = N.API.createRoom(config.Nuve.roomName, function(room) {
            console.log('Room created with id: ', room._id);
            createToken(room._id);
        }, errorCallback);
    } else {
        createToken(nuveRoom._id);
    }
}, errorCallback);

