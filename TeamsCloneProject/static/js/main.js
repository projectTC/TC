console.log('in main.js')

var mapPeers = {};
var mapScreenPeers = [];
var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');
var shareButton = document.getElementById('btn-share-screen');
var username;
var webSocket;

function webSocketOnMessage(event)
{
    var parsedData = JSON.parse(event.data);
    var peerUsername = parsedData['peer'];
    var action = parsedData['action'];

    if(username == peerUsername)
    {
        return;
    }
    var receiver_channel_name = parsedData['message']['receiver_channel_name'];

    if(action == 'new-peer'){
        createOfferer(peerUsername, receiver_channel_name);
        return;
    }

    if(action == 'new-offer'){
        var offer = parsedData['message']['sdp'];

        createAnswerer(offer, peerUsername, receiver_channel_name);
        return;
    }

    if(action == 'new-answer'){
        var answer = parsedData['message']['sdp'];

        var peer = mapPeers[peerUsername][0];

        peer.setRemoteDescription(answer);

        return;
    }

}

btnJoin.addEventListener('click', () =>{
    username= usernameInput.value;

    console.log(username);

    if(username =='')
    {
        return;
    }
    usernameInput.value='';
    usernameInput.disabled=true;
    usernameInput.style.visibility = 'hidden';

    btnJoin.disabled=true;
    btnJoin.style.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:')
    {
        wsStart = 'wss://';
    }

    var endpoint = wsStart + loc.host + loc.pathname;

    console.log(endpoint);

    webSocket = new WebSocket(endpoint);

    webSocket.addEventListener('open', (e) =>{
        console.log('Connection opened');

       sendSignal('new-peer',{});
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('close', (e) =>{
        console.log('Connection closed');
    });
    webSocket.addEventListener('error', (e) =>{
        console.log('Error occurred');
    });
});
});


var localStream = new MediaStream();

const constraints = {
    'video':true,
    'audio':true
}

const localVideo =  document.querySelector('#local-video');
const btnToggleAudio =  document.querySelector('#btn-toggle-audio');
const btnToggleVideo=  document.querySelector('#btn-toggle-video');

var userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
        localVideo.muted = true;

        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        audioTracks[0].enabled = true;
        videoTracks[0].enabled = true;

        btnToggleAudio.addEventListener('click', () =>{
            audioTracks[0].enabled = !audioTracks[0].enabled;

            if(audioTracks[0].enabled){
                btnToggleAudio.innerHTML = '<i class="fas fa-microphone" style="font-size:20px;"></i>';
                return;
            }
            btnToggleAudio.innerHTML = '<i class="fas fa-microphone-slash" style="font-size:20px;"></i>';
        });
        btnToggleVideo.addEventListener('click', () =>{
            videoTracks[0].enabled = !videoTracks[0].enabled;

            if(videoTracks[0].enabled){
                btnToggleVideo.innerHTML = '<i class="fas fa-video" style="font-size:20px;"></i>';
                return;
            }
            btnToggleVideo.innerHTML = '<i class="fas fa-video-slash" style="font-size:20px;"></i>';
        });


    })
    .catch(error =>{
        console.log('Error accessing media devices!', error);
    });
    var btnSendMsg = document.querySelector('#btn-send-msg');
    var messageList = document.querySelector('#message-list');
    var messageInput = document.querySelector('#msg');
    btnSendMsg.addEventListener('click', sendMsgOnClick);

function sendMsgOnClick(){

    var message = messageInput.value;
    var li = document.createElement('li');
    li.style.position = "inline";
    li.style.marginLeft = "100px";
    li.style.top = "30px";
    li.style.bottom = "50px";
    li.style.zIndex = "1";
    li.style.display = "block";
    li.style.width = "135px";
    li.style.padding = "10px 10px 10px 12px";
    li.style.marginBottom = "5px";
    li.style.overflow = "hidden";
    li.style.marginRight = "4px";
    li.style.background = "gray";
    li.style.boxShadow = "0 3px 6px rgba(1,1,1,0.3), 0 3px 6px rgba(1,1,1,0.3)";
    li.style.borderRadius = "none";
    li.appendChild(document.createTextNode('Me: '+ message));
    messageList.append(li);

    var dataChannels = getDataChannels();

    message = username + ': ' + message;

    for(index in dataChannels){
        dataChannels[index].send(message);
    }
    messageInput.value = '';
}

function sendSignal(action, message)
{

     var jsonStr = JSON.stringify({
           'peer': username,
           'action': action,
           'message': message,
         });
     webSocket.send(jsonStr);
}

var ICE_config = {
  'iceServers': [
    {
      'url': 'stun:stun.l.google.com:19302'
    },
    {
      'url': 'turn:192.158.29.39:3478?transport=udp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    },
    {
      'url': 'turn:192.158.29.39:3478?transport=tcp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    }
  ]
}

function createOfferer(peerUsername, receiver_channel_name)
{
    // Works only when devices are connected to same network; hence passing null into RTCPeerConnection
//    var peer = new RTCPeerConnection(null);
    var peer = new RTCPeerConnection(ICE_config);
    addLocalTracks(peer);

    var dc = peer.createDataChannel('channel');
    dc.addEventListener('open',() =>{
        console.log('Connection opened!');
    });
    dc.addEventListener('message', dcOnMessage);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    mapPeers[peerUsername] = [peer,dc];

    peer.addEventListener('iceconnectionstatechange', ()=>{
        var iceConnectionState = peer.iceConnectionState;
        if(iceConnectionState === 'failed'|| iceConnectionState === 'disconnected' || iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];
            var index = mapScreenPeers.findIndex(remoteVideo);
            mapScreenPeers.splice(index,1);
            if(iceConnectionState != 'closed')
            {
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });
    peer.addEventListener('icecandidate', (event)=>{
        if(event.candidate){
            console.log('New ice candidate', JSON.stringify(peer.localDescription));
            return;
        }
        sendSignal('new-offer',{
            'sdp' : peer.localDescription,
            'receiver_channel_name': receiver_channel_name

        });

    });
    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(() =>{
            console.log('Local description set successfully');
        });

}


function addLocalTracks(peer){
    localStream.getTracks().forEach(track => {
//        mapScreenPeers.push(peer.addTrack(track, localStream));
        peer.addTrack(track, localStream);
    });
    mapScreenPeers = peer.getSenders();
    return;
}


function dcOnMessage(event){
    var message = event.data;

    var li = document.createElement('li');
    li.style.position = "inline";
    li.style.marginRight = "100px";
    li.style.fontColor = "black";
    li.style.top = "30px";
    li.style.bottom = "50px";
    li.style.zIndex = "1";
    li.style.display = "block";
    li.style.width = "135px";
    li.style.padding = "10px 10px 10px 12px";
    li.style.marginBottom = "5px";
    li.style.overflow = "hidden";
    li.style.marginLeft = "8px";
    li.style.background = "#C0C0C0";
    li.style.boxShadow = "0 3px 6px rgba(1,1,1,0.3), 0 3px 6px rgba(1,1,1,0.3)";
    li.style.borderRadius = "none";
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

function createAnswerer(offer, peerUsername, receiver_channel_name)
{
//    var peer = new RTCPeerConnection(null);
    var peer = new RTCPeerConnection(ICE_config);
    addLocalTracks(peer);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    peer.addEventListener('datachannel', e => {
        peer.dc = e.channel;
        peer.dc.addEventListener('open',() => {
            console.log('Connection opened!');
        });
    peer.dc.addEventListener('message', dcOnMessage);
    mapPeers[peerUsername] = [peer,peer.dc];

    });


    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState;
        if(iceConnectionState === 'failed'|| iceConnectionState === 'disconnected' || iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];
            var index = mapScreenPeers.findIndex(remoteVideo);
            mapScreenPeers.splice(index,1);
            if(iceConnectionState != 'closed')
            {
                peer.close();
            }
            removeVideo(remoteVideo);
        }
    });
    peer.addEventListener('icecandidate', (event) => {
        if(event.candidate){
            console.log('New ice candidate', JSON.stringify(peer.localDescription));
            return;
        }
        sendSignal('new-answer',{
            'sdp' : peer.localDescription,
            'receiver_channel_name': receiver_channel_name

        });

    });
    peer.setRemoteDescription(offer)
        .then(() =>{
            console.log('Remote Description set successfully for %s.', peerUsername);

            return peer.createAnswer();
        })
        .then(a =>{
            console.log('Answer created!');
            peer.setLocalDescription(a);
        });
}

function createVideo(peerUsername){
    var videoContainer = document.querySelector('#video-container');
    var remoteVideo = document.createElement('video');
    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;

    var videoWrapper = document.createElement('div');
    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);
    return remoteVideo;
}

function setOnTrack(peer, remoteVideo){
    var remoteStream = new MediaStream();

    remoteVideo.srcObject = remoteStream;
    peer.addEventListener('track', async(event) =>{
        remoteStream.addTrack(event.track, remoteStream);
    });
}

function removeVideo(video){
    var videoWrapper = video.parentNode;
    videoWrapper.parentNode.removeChild(videoWrapper);
}

function getDataChannels(){
    var dataChannels =[];

    for(peerUsername in mapPeers){
        var dataChannel = mapPeers[peerUsername][1];

        dataChannels.push(dataChannel);
    }

    return dataChannels;
}

console.log(mapScreenPeers);

/* Screen share */

function handleSuccess(stream) {
  shareButton.disabled = true;
  var video = document.querySelector('video');
  const screenTrack = stream.getTracks()[0];
  video.srcObject = stream;
    mapScreenPeers.forEach(async s => {
    if(s.track && s.track.kind === 'video')
        await s.replaceTrack(screenTrack);
        s.track.kind = 'screen';
    });
  screenTrack.addEventListener('ended', () => {
    console.log('The user has ended sharing the screen');
    shareButton.disabled = false;
    video.srcObject = localStream;
//    mapScreenPeers[index].srcObject = localStream;
        mapScreenPeers.forEach(async s => {
        s.replaceTrack(localStream.getVideoTracks()[0]);
            s.track.kind = 'video';
        });
  });
}

function handleError(error) {
  console.log('error');
}


shareButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({video: true, cursor: true})
      .then(handleSuccess, handleError);
});

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
  shareButton.disabled = false;
} else {
  console.log('getDisplayMedia is not supported');
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginRight = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginRight= "0";
}

/*===========================================*/

