import { Component, OnInit } from '@angular/core';
import Peer from 'skyway-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SkyWayAngularVideoChat';
  myIDElm: any;
  videoElm: any;
  theirIDElm: any;
  startBtnElm: any;
  shareBtnElm: any;
  stopBtnElm: any;
  
  localStream: any;
  startedMedia = false;
  
  peer: any;
  
  ngOnInit(): void {
  this.initPeer();
  this.initDomElement();
  this.onChangeEvent(null);
  this.captureLocalStream();
  }
  
  onChangeEvent(event: any){
  //alert(this.myIDElm.textContent + ' ' + this.theirIDElm.value + ' ' + this.theirIDElm.value.length)
  if (this.myIDElm.textContent === this.theirIDElm.value || this.theirIDElm.value.length <= 15) {
  this.startBtnElm.disabled = true;
    this.shareBtnElm.disabled = true;
    this.stopBtnElm.disabled = true;
  } else {
  this.startBtnElm.disabled = false;
    this.shareBtnElm.disabled = false;
    this.stopBtnElm.disabled = true;
  }

  }

  initPeer() {
  this.peer = new Peer({
    key: '40382ddc-a5db-4848-82ec-9da09135b90a',
    debug: 3,
  });
  
  //PeerID取得
  this.peer.on('open', () => {
    this.myIDElm.textContent = this.peer.id;
    });
  
  this.peer.on('error', err => {
  alert(err.message);
  });
  
  this.peer.on('error', err => {
    alert(err.message);
    });
  }
  
  
  initDomElement() {
  this.myIDElm = document.getElementById('my-id');
  this.videoElm = document.getElementById('my-video');
  this.theirIDElm = document.getElementById('their-id');
  this.startBtnElm = document.getElementById('start-vid');
  this.shareBtnElm = document.getElementById('share-scr');
  this.stopBtnElm = document.getElementById('stop-vid');
  }
  
  
  async captureLocalStream() {
    // Inbound processing
  this.peer.on('call', mediaConnection => {
  // camera image acquisition
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( stream => {
    this.videoElm.srcObject = stream;
    this.videoElm.playsInline = true;
    this.videoElm.play();
    // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
    this.localStream = stream;
    
    this.startBtnElm.disabled = true;
    this.shareBtnElm.disabled = true;
    this.stopBtnElm.disabled = false;
    
    mediaConnection.answer(this.localStream);
    setEventListener(mediaConnection);
    }).catch( error => {
      // Outputs error log in case of failure.
     console.error('mediaDevice.getUserMedia() error:', error);
     return;
     });
  });
    
  document.getElementById('start-vid').onclick = () => {
  // camera image acquisition
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( stream => {
    this.videoElm.srcObject = stream;
    this.videoElm.play();
    // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
    this.localStream = stream;
    
    this.startBtnElm.disabled = true;
    this.shareBtnElm.disabled = false;
    this.stopBtnElm.disabled = false;
    
    let theirID = this.theirIDElm.value;
    let mediaConnection = this.peer.call(theirID, this.localStream);
    setEventListener(mediaConnection);
    
    }).catch( error => {
      // Outputs error log in case of failure.
     console.error('mediaDevice.getUserMedia() error:', error);
     return;
     });
    }

    document.getElementById('share-scr').onclick = async () => {
      var displayMediaOptions = {
        video: {
          cursor: "always"
          },
          audio: false
          };

      try {
    this.localStream = await (navigator.mediaDevices as any).getDisplayMedia(displayMediaOptions);
    this.videoElm.srcObject = this.localStream;
    this.videoElm.playsInline = true;
    
    this.startBtnElm.disabled = false;
    this.shareBtnElm.disabled = true;
    this.stopBtnElm.disabled = false;
    
    let theirID = this.theirIDElm.value;
  let mediaConnection = this.peer.call(theirID, this.localStream);
    setEventListener(mediaConnection);
  } catch(err) {
    console.error("Error: " + err);
  }
}

    document.getElementById('stop-vid').onclick = () => {
      let tracks = this.videoElm.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElm.srcObject = null;
      this.localStream = null;
      
      this.startBtnElm.disabled = false;
    this.shareBtnElm.disabled = false;
    this.stopBtnElm.disabled = true;
    }
    
    // Function to set an event listener
    const setEventListener = mediaConnection => {
    let videoElmT: any = document.getElementById('their-video')
    mediaConnection.on('stream', stream => {
     // Set a camera image to the video element and play it
     
     videoElmT.srcObject = stream;
     videoElmT.play();
  });
  
  mediaConnection.once('close', () => {
      videoElmT.srcObject.getTracks().forEach(track => track.stop());
      videoElmT.srcObject = null;
      
      let tracks = this.videoElm.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElm.srcObject = null;
      this.localStream = null;
      
      this.onChangeEvent(null);
    });
    
    document.getElementById('stop-vid').onclick = () => {
    if (!mediaConnection.open) {
    this.onChangeEvent(null);
    
    let tracks = this.videoElm.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElm.srcObject = null;
      this.localStream = null;
    }
    
    mediaConnection.close(true)
     }
    }
  }
}
