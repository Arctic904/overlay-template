import socketIOClient from 'socket.io-client';
import { writable } from 'svelte/store';
export const data = writable(null);
let defaultPanelData = {
  series: "Best of",
  round: "Winners Round 1",
  orngColor: "ee8723",
  blueColor: "52acfe",
  orngName: "Orange",
  blueName: "Blue",
}
export const isReplay = writable(false);
export const isInGame = writable(false);
export let goalData = writable(null);
export const panelData = writable(defaultPanelData);
export var reset = false;

export const createSocketConnection = () => {
  let isHudVisible = true;
    // instantiate socketIOClient connection to localhost
    const socket = socketIOClient('localhost:6969', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      // emit join message to socket with client ID
      socket.emit('join', 'FRONTEND');
      /* emit watchGame message to socket, required for backend server to
      create and destroy stream on per client ID basis */
      socket.emit('watchGame');
    });

    socket.on('payload', (payload) => {
      //panel data
      if(payload.data.event === "ctrl_update"){
        let series = payload.data.contents.seriesLength;
        let blueScore = payload.data.contents.blueScore;
        let orngScore = payload.data.contents.orngScore;
        let round = payload.data.contents.currentRound;
        let orngColor = payload.data.contents.orngColor;
        let blueColor = payload.data.contents.blueColor;
	      let orngName = payload.data.contents.orngName;
        let blueName = payload.data.contents.blueName;

        let panelSendData = {
          series: series,
          blueScore: blueScore,
          orngScore: orngScore,
          round: round,
          orngColor: orngColor,
          blueColor: blueColor,
	        orngName: orngName,
          blueName: blueName,
        }

        console.log(panelSendData)

        panelData.set(panelSendData)
      }
      if(payload.data.event === "reset-queue"){
        reset=true;
      }
      if(payload.data.event === "swap-cards"){
        console.log(pcOpacity)
        pcOpacity = (pcOpacity == 1) ? 0 : 1;
        console.log(pcOpacity)
        let data = {
          data:{
            event:"player-card-state",
            contents:{
              currentOpacity: pcOpacity,
            },
          }
        }
        socket.emit("payload", data);
      }
    });

    function rconSend(command) {
      socket.emit('RCON', {
        data: {
          command: command,
        },
      });
    }
    
    // on socket message 'update', run logic on that data
    socket.on('update', (update) => {
      console.log(update)
      // run socket logic here, e.g:
      if (update.event === 'game:update_state') {
        
        // do stuff with update
        

        let players = update.data.players;
        let orangePlayers = [];
        let bluePlayers = [];

        Object.keys(players).map(id => {
          if(players[id].team === 1){
            orangePlayers.push(players[id]);
          } else if(players[id].team === 0){
            bluePlayers.push(players[id]);
          }
        })
        for(var x in orangePlayers){
          if(orangePlayers[x].name.length > 16){
            let shorten = orangePlayers[x].name.split("").slice(0,15)
            shorten.push("...")
            
            orangePlayers[x].name = shorten.join('')
          }
        }
        for(var x in bluePlayers){
          if(bluePlayers[x].name.length > 16){
            let shorten = bluePlayers[x].name.split("").slice(0,15)
            shorten.push("...")

            bluePlayers[x].name = shorten.join('')
          }
        }

        let targetData;
        if (update.data.game.target) {
          let target = update.data.game.target;

          targetData = dataCheck(target);
          function dataCheck(target) {
              for (var x = 0; x <= 3; x++) {
                  let z =
                      bluePlayers[x].id == target //If blue player x is target z = blue player x's data
                          ? bluePlayers[x]
                          : orangePlayers[x].id == target //If orange player x is target z = orange player x's data
                          ? orangePlayers[x]
                          : null; //else z is null
                  if (z != null) {
                      return z; // if z is not null return z
                  }
              }
          }
        }

        

        let playerData = {
          orangeTeam: orangePlayers,
          blueTeam: bluePlayers
        };
        let sendData = {
          playerData: playerData,
          teamData: update.data.game.teams,
          gameData: update.data.game,
          fullData: update.data,
          targetData: targetData
        };
        // console.log(sendData)
        data.set(sendData)
        //etc
        setTimeout(() => {
          reset = false;
        })
    }
    if (update.event === 'game:match_ended') {
        isHudVisible = true;
        isInGame.set(false)
    }
    
    if (update.event === 'game:post_countdown_begin') {
      //console.log("Hud Visibility = " + isHudVisible)
      isReplay.set(false);
      
        rconSend('rcon_refresh_allowed');
        rconSend('replay_gui hud 1');
        rconSend('replay_gui matchinfo 1');
        isInGame.set(true)
        setTimeout(() => {
          //console.log("Hud Visibility = " + isHudVisible)
          rconSend('replay_gui hud 0');
          rconSend('replay_gui matchinfo 0');
          isHudVisible = false;
          console.log("Hud Visibility = " + isHudVisible)
       }, 500);
       setTimeout(() => {
        goalData.set(null)
       }, 1000)
    }
    if (update.event === 'game:replay_start') {
        isReplay.set(true);
    }
    if (update.event === 'game:goal_scored'){
      let scorer = update.data.scorer.name;
      let assister = update.data.assister.name;
      let teamnum = update.data.scorer.teamnum;
      let speed = `${Math.round(update.data.goalspeed)} KPH`

      let sendData = {
        scorer: scorer,
        assister: assister,
        team: teamnum,
        speed: speed
      }
      console.log(`goal_scored` + sendData)
      goalData.set(sendData)
    }
});
}