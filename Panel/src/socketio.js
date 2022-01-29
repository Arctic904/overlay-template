import socketIOClient from 'socket.io-client';

let socket;
export const createPanelConnection = () => {
  socket = socketIOClient('localhost:6969', {
      withCredentials: true,
    });
  socket.on("connect", () => {
    socket.emit("Control Panel Connected");
  });
}
export const updateScreen = () => {
  let data = {
      data:{
          event:"ctrl_update",
          contents:{
              seriesLength:document.getElementById("series-length").value,
              currentRound:document.getElementById("round").value,
              blueScore:document.getElementById("blueWins").value,
              orngScore:document.getElementById("orngWins").value,
              orngColor:document.getElementById("orng-color").value,
              blueColor:document.getElementById("blue-color").value,
	            orngName:document.getElementById("orng-name").value,
	            blueName:document.getElementById("blue-name").value,
          },
      },
  };
  //data = JSON.parse(data);
  //console.log(data);
  socket.emit("payload", data);
}

export const reset = () => {
  let data = {
    data:{
      event:"reset-queue"
    }
  }
  console.log("reset")
  socket.emit("payload", data);
}