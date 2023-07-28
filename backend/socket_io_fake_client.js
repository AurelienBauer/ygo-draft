const { io } =  require('socket.io-client');

class NewPlayer {
  constructor(name, roomTitle, roomId = null) {
    this.socket = io("http://localhost:3000");
    this.name = name
    this.roomId;
    this.playerId;

    this.socket.on("connect", () => {
      console.log(this.socket.connected); // true
    });
      
    this.socket.on("disconnect", () => {
      console.log(this.socket.connected); // false
    });

    if (roomId) {
      this.socket.emit("room:join", {
        roomId,
        player: name,
      }, (res) => {
        this.roomId = res.data.roomId;
        this.playerId = res.data.playerId;
        console.log(res);
      });
    } else {
      this.socket.emit("room:create", {
        title: roomTitle,
        createdBy: name,
      }, (res) => {
        this.roomId = res.data.roomId;
        this.playerId = res.data.playerId;
        console.log(res);
      });
    }
  }

  listRooms() {
    this.socket.emit("room:list", (res) => {
      if (res && res.length) {
        res.data.map(room=> {
          console.dir(room)
          console.dir(room.players.map(p => p))
        });
      } else {
        console.log(res);
      }
    });
  }

  leaveRoom() {
    this.socket.emit("room:leave", {
      roomId: this.roomId,
      playerId: this.playerId,
    }, (res) => {
      console.log(res);
    });
  }

}

function main() {
  const player1 = new NewPlayer("Player 1", "MySuperRoom");
  setTimeout(() =>  {
    console.dir("After 1 second");
    console.dir(player1.roomId);
    const player2 = new NewPlayer("Player 2", "", player1.roomId);
    setTimeout(() =>  player1.listRooms(), 1000);
    setTimeout(() =>  {
      player1.leaveRoom();
      player2.leaveRoom();
      setTimeout(() =>  player1.listRooms(), 1000);
    }, 1000);
  }, 1000);
  
}

main();