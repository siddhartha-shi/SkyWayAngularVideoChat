import { Component, OnInit } from '@angular/core';
import Peer from 'skyway-js';

@Component({
  selector: 'app-mobile-video-view',
  templateUrl: './mobile-video-view.component.html',
  styleUrls: ['./mobile-video-view.component.scss']
})
export class MobileVideoViewComponent implements OnInit {

  muteBtnImg: string[] = ['mic_black.png', 'mic_off_black.png'];
  muteBtnName: string = this.muteBtnImg[0];
  /* Html Element */
  myIDElm: any;
  myVideoElm: any;
  theirIDElm: any;
  startBtnElm: any;
  shareBtnElm: any;
  stopBtnElm: any;
  mutedBtnElm: any;
  mutedImgElm: any;

  /* device identification flag */
  isMobileFlag: boolean = false;

  /* navigation service permission */
  tempTrack: any = [];

  /* Peer作成 */
  peer: any = null;

   /* local media stream */
  localStream: any = null;

  constructor() {}

  ngOnInit(): void {
    this.initPeer();
    this.initDomElement();
    this.onChangeEvent(null);
    this.captureStream();
  }

   /* call on input change of partner's PeerID */
  onChangeEvent(event: any) {
    if (
      this.myIDElm.textContent.slice(9) === this.theirIDElm.value ||
      this.theirIDElm.value.length >= 4 || this.theirIDElm.value === '' || this.theirIDElm.value === ' '
    ) {
      this.startBtnElm.disabled = true;
      this.startBtnElm.style.backgroundColor = 'gray';
      this.shareBtnElm.disabled = true;
      this.stopBtnElm.disabled = true;
      this.stopBtnElm.style.backgroundColor = 'gray';
      this.stopBtnElm.style.visibility = 'hidden';
      this.mutedBtnElm.style.visibility = 'hidden';
    } else {
      this.startBtnElm.disabled = false;
      this.startBtnElm.style.backgroundColor = 'green';
      this.shareBtnElm.disabled = false;
      this.stopBtnElm.disabled = true;
      this.stopBtnElm.style.backgroundColor = 'red';
      this.stopBtnElm.style.visibility = 'visible';
    }
    this.theirIDElm.disabled = false;
  }

  /* initialize of skyway peers */
  initPeer() {
    this.peer = new Peer(String(Math.floor((Math.random() * 100) + 1)), {
      key: '40382ddc-a5db-4848-82ec-9da09135b90a',
      debug: 3,
    });

    //PeerID取得
    this.peer.on('open', () => {
      this.myIDElm.textContent = 'Your ID: ' + this.peer.id;
    });

    this.peer.on('error', (err) => {
      alert(err.message);
    });

    this.peer.on('error', (err) => {
      alert(err.message);
    });
  }

  /* initialize of DOM elements */
  initDomElement() {
    this.isMobileFlag = false;
    let ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      // alert('Mobile: ' + ua);
      this.isMobileFlag = true;
    } if(/Chrome/i.test(ua)) {
      // alert('Chrome: ' + ua);
    } if(/Mozilla/i.test(ua)) {
      // alert('Mozilla: ' + ua);
    }  else {
      // alert('Others: ' + ua);
    }
    
    this.myIDElm = document.getElementById('my-id');
    this.myVideoElm = document.getElementById('my-video');
    this.theirIDElm = document.getElementById('their-id');
    this.startBtnElm = document.getElementById('start-vid');
    this.shareBtnElm = document.getElementById('share-scr');
    this.stopBtnElm = document.getElementById('stop-vid');
    this.mutedBtnElm = document.getElementById('muted');
    this.mutedImgElm =  document.getElementById('muted-img');
  }

 /* handle meada stream and events */
  async captureStream() {
    // Inbound processing
    this.peer.on('call', (mediaConnection) => {
      if (this.localStream != null) {
        let tracks = this.myVideoElm.srcObject.getTracks();
        tracks.forEach((track) => this.tempTrack.push(track));
      }

      // camera image acquisition
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: {
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true
        } })

        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.playsInline = true;
          this.myVideoElm.muted = true;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;

          this.stopBtnElm.disabled = false;
          this.stopBtnElm.style.backgroundColor = 'red';
          this.stopBtnElm.style.visibility = 'visible';
          this.mutedBtnElm.style.visibility = 'visible';
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
          this.startBtnElm.style.backgroundColor = 'gray';
          this.shareBtnElm.disabled = true;
          this.shareBtnElm.style.backgroundColor = 'gray';

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
        .getUserMedia({ video: true, audio: {
          sampleSize: 16,
          echoCancellation: true
        }  })
        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.muted = true;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;

          this.startBtnElm.disabled = true;
          this.startBtnElm.style.backgroundColor = 'gray';
          this.shareBtnElm.disabled = false;
          this.stopBtnElm.disabled = false;
          this.stopBtnElm.style.backgroundColor = 'red';
          this.mutedBtnElm.style.visibility = 'visible';

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

      let displayMediaOptions = {
        video: true,
        audio: {
          sampleSize: 16,
          echoCancellation: true
        } ,
      };

      try {
        this.localStream = await (navigator.mediaDevices as any).getDisplayMedia(
          displayMediaOptions
        );
        this.myVideoElm.srcObject = this.localStream;
        this.myVideoElm.muted = true;
        this.myVideoElm.playsInline = true;
        this.myVideoElm.play();

        this.startBtnElm.disabled = false;
        this.shareBtnElm.disabled = true;
        this.stopBtnElm.disabled = false;
        this.mutedBtnElm.style.visibility = 'hidden';

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
        this.mutedImgElm.src = '/assets/img/' + this.muteBtnName;
        this.mutedBtnElm.style.visibility = 'hidden';

        videoElmT.srcObject?.getTracks().forEach((track) => track.stop());
        videoElmT.srcObject = null;

        let tracks = this.myVideoElm.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
        this.myVideoElm.srcObject = null;

        this.tempTrack?.forEach((track) => track.stop());

        this.localStream = null;
      });

      document.getElementById('stop-vid').onclick = () => {
        if (!mediaConnection.open) {
          this.mutedBtnElm.style.visibility = 'hidden';
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

  muted (event: any) {
    // let target = event.target || event.srcElement || event.currentTarget;
    // let idAttr = target.attributes.id;
    // let value = target.style.backgroundColor;
    // target.style.backgroundColor  = 'green';
    let audioTrack = this.localStream?.getAudioTracks()[0];
    audioTrack.enabled = audioTrack?.enabled? false : true;
    let muteImgURL: string = '/assets/img/';
    muteImgURL += audioTrack?.enabled? this.muteBtnImg[0] : this.muteBtnImg[1];
    this.mutedImgElm.src = muteImgURL;
  }
}
