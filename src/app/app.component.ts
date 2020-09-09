import { Component, OnInit } from '@angular/core';
import Peer from 'skyway-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //Html Element
  myIDElm: any;
  myVideoElm: any;
  theirIDElm: any;
  startBtnElm: any;
  shareBtnElm: any;
  stopBtnElm: any;

  tempTrack: any = [];

  // Peer作成
  peer: any = null;
  localStream: any = null;

  constructor() {}

  ngOnInit(): void {
    this.initPeer();
    this.initDomElement();
    this.onChangeEvent(null);
    this.captureLocalStream();
  }

  // ngAfterViewInit(): void {
  // }

  onChangeEvent(event: any) {
    if (
      this.myIDElm.textContent === this.theirIDElm.value ||
      this.theirIDElm.value.length !== 16
    ) {
      this.startBtnElm.disabled = true;
      this.shareBtnElm.disabled = true;
      this.stopBtnElm.disabled = true;
    } else {
      this.startBtnElm.disabled = false;
      this.shareBtnElm.disabled = false;
      this.stopBtnElm.disabled = true;
    }
    this.theirIDElm.disabled = false;
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

    this.peer.on('error', (err) => {
      alert(err.message);
    });

    this.peer.on('error', (err) => {
      alert(err.message);
    });
  }

  initDomElement() {
    this.myIDElm = document.getElementById('my-id');

    this.myVideoElm = document.getElementById('my-video');

    this.theirIDElm = document.getElementById('their-id');

    this.startBtnElm = document.getElementById('start-vid');

    this.shareBtnElm = document.getElementById('share-scr');

    this.stopBtnElm = document.getElementById('stop-vid');
  }

  async captureLocalStream() {
    // Inbound processing

    this.peer.on('call', (mediaConnection) => {
      if (this.localStream != null) {
        let tracks = this.myVideoElm.srcObject.getTracks();
        tracks.forEach((track) => this.tempTrack.push(track));
      }

      // camera image acquisition
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })

        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.playsInline = true;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;
          this.stopBtnElm.disabled = false;
        })
        .catch((error) => {
          // Outputs error log in case of failure.
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
        })
        .finally(() => {
          this.theirIDElm.value = '';
          this.theirIDElm.disabled = true;
          this.startBtnElm.disabled = true;
          this.shareBtnElm.disabled = true;

          mediaConnection.answer(this.localStream);
          setEventListener(mediaConnection);
        });
    });

    document.getElementById('start-vid').onclick = () => {
      if (this.localStream != null) {
        let tracks = this.myVideoElm.srcObject.getTracks();
        tracks.forEach((track) => this.tempTrack.push(track));
      }

      // camera image acquisition
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;

          this.startBtnElm.disabled = true;
          this.shareBtnElm.disabled = false;
          this.stopBtnElm.disabled = false;

          let theirID = this.theirIDElm.value;
          let mediaConnection = this.peer.call(theirID, this.localStream);
          setEventListener(mediaConnection);
        })
        .catch((error) => {
          // Outputs error log in case of failure.
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
        });
    };

    document.getElementById('share-scr').onclick = async () => {
      if (this.localStream != null) {
        let tracks = this.myVideoElm.srcObject.getTracks();
        tracks.forEach((track) => this.tempTrack.push(track));
      }

      var displayMediaOptions = {
        video: { cursor: 'always' },
        audio: false,
      };

      try {
        this.localStream = await (navigator.mediaDevices as any).getDisplayMedia(
          displayMediaOptions
        );
        this.myVideoElm.srcObject = this.localStream;
        this.myVideoElm.playsInline = true;

        this.startBtnElm.disabled = false;
        this.shareBtnElm.disabled = true;
        this.stopBtnElm.disabled = false;

        let theirID = this.theirIDElm.value;
        let mediaConnection = this.peer.call(theirID, this.localStream);
        setEventListener(mediaConnection);
      } catch (err) {
        console.error('Error: ' + err);
      }
    };

    // Function to set an event listener
    const setEventListener = (mediaConnection) => {
      let videoElmT: any = document.getElementById('their-video');

      mediaConnection.on('stream', (stream) => {
        // Set a camera image to the video element and play it
        videoElmT.srcObject = stream;
        videoElmT.play();
      });

      mediaConnection.once('close', () => {
        this.onChangeEvent(null);
        this.theirIDElm.disabled = false;

        videoElmT.srcObject?.getTracks().forEach((track) => track.stop());
        videoElmT.srcObject = null;

        // alert('I am called for meadiaConnection close');
        let tracks = this.myVideoElm.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
        this.myVideoElm.srcObject = null;

        this.tempTrack?.forEach((track) => track.stop());

        this.localStream = null;
      });

      document.getElementById('stop-vid').onclick = () => {
        if (!mediaConnection.open) {
          this.onChangeEvent(null);
          let tracks = this.myVideoElm.srcObject?.getTracks();
          tracks?.forEach((track) => this.tempTrack.push(track));

          this.tempTrack?.forEach((track) => track.stop());

          this.myVideoElm.srcObject = null;
          this.localStream = null;
        } else {
          mediaConnection.close(true);
        }
      };
    };
  }
}

  