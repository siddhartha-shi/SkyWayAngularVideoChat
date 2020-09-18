import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Peer from 'skyway-js';

@Component({
  selector: 'app-pc-video-view',
  templateUrl: './pc-video-view.component.html',
  styleUrls: ['./pc-video-view.component.scss'],
})
export class PcVideoViewComponent implements OnInit {
  
  muteBtnImg: string[] = ['mic_black.png', 'mic_off_black.png'];
  muteBtnName: string = this.muteBtnImg[0];
  
  /*angular element*/
  myID: string = '';
  theirID: string = '';
  isTheirIDDisabled: boolean = false;
  
  isStartCallBtnDisable: boolean = false;
  isShareBtnDisable: boolean = false;
  isEndBtnHidden: boolean = false;
  isMuteBtnHidden: boolean = false;
  
  /* Html Element */
  myVideoElm: any;

  /* navigation service permission */
  tempTrack: any = [];

  /* Peer作成 */
  peer: any = new Peer(String(Math.floor((Math.random() * 100) + 1)), {
      key: '40382ddc-a5db-4848-82ec-9da09135b90a',
      debug: 3,
    });

  mediaConnection: any;

   /* local media stream */
  localStream: any = null;

  constructor(
    private cd: ChangeDetectorRef,
    ) {}

  ngOnInit(): void {
    this.initPeer();
    this.initDomElement();
    this.onChangeEvent(null);
    this.captureStream();
  }

   /* call on input change of partner's PeerID */
  onChangeEvent(event: any) {
    if (
      this.myID === this.theirID ||
      this.theirID.length >= 4 || this.theirID === '' || this.theirID === ' '
    ) {
      this.isStartCallBtnDisable = true;
      this.isShareBtnDisable = true;
      this.isEndBtnHidden = true;
      this.isMuteBtnHidden = true;
    } else {
      this.isStartCallBtnDisable = false;
      this.isShareBtnDisable = false;
      this.isEndBtnHidden = false;
    }
    this.isTheirIDDisabled = false;
    this.cd.detectChanges();
  }

  /* initialize of skyway peers */
  initPeer() {
     
    //PeerID取得
    this.peer.on('open', () => {
      this.myID = this.peer.id;
      this.cd.detectChanges();
    });

    this.peer.on('error', (err) => {
      alert(err.message);
      this.cd.detectChanges();
    });

    this.peer.on('error', (err) => {
      alert(err.message);
      this.cd.detectChanges();
    });
  }

  /* initialize of DOM elements */
  initDomElement() {
    this.myVideoElm = document.getElementById('my-video');
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
        .getUserMedia({ video: true, audio: true })

        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.playsInline = true;
          this.myVideoElm.muted = true;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;

          
          this.isMuteBtnHidden = false;
          this.cd.detectChanges();
        })
        .catch((error) => {
          // Outputs error log in case of failure.
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
        })
        .finally(() => {
          this.isEndBtnHidden = false;
          
          this.isTheirIDDisabled = true;
          this.isStartCallBtnDisable = true;
          this.isShareBtnDisable = true;

          mediaConnection.answer(this.localStream);
          this.setEventListener(mediaConnection);
          this.cd.detectChanges();
        });
    });
  }
  
  onBtnClickMakeCall(event: any) {
    
      if (this.localStream != null) {
        let tracks = this.myVideoElm.srcObject.getTracks();
        tracks.forEach((track) => this.tempTrack.push(track));
      }

      // camera image acquisition
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: {
      sampleSize: 16,
      echoCancellation: true
    } })
        .then((stream) => {
          this.myVideoElm.srcObject = stream;
          this.myVideoElm.muted = true;
          this.myVideoElm.playsInline = true;
          this.myVideoElm.play();

          // Save the camera image to a global variable so that it can be returned to the other party when a call comes in.
          this.localStream = stream;

          this.isStartCallBtnDisable = true;
          this.isShareBtnDisable = false;
          this.isEndBtnHidden = false;
          this.isMuteBtnHidden = false;

          let mediaConnection = this.peer.call(this.theirID, this.localStream);
          this.setEventListener(mediaConnection);
        })
        .catch((error) => {
          // Outputs error log in case of failure.
          console.error('mediaDevice.getUserMedia() error:', error);
          return;
        });
  }
  
  async onBtnClickShareScr (event: any) {
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
        
        
        let audioStream = await navigator.mediaDevices
        .getUserMedia({ video: false, audio: {
      sampleSize: 16,
      echoCancellation: true
    } })
    let audioTrack = audioStream.getAudioTracks()[0];
    // add audio tracks into screen stream
    this.localStream.addTrack( audioTrack );
    
        this.myVideoElm.srcObject = this.localStream;
        this.myVideoElm.muted = true;
        this.myVideoElm.playsInline = true;
        this.myVideoElm.play();

        this.isStartCallBtnDisable = false;
        this.isShareBtnDisable = true;
        this.isEndBtnHidden = false;
        this.isMuteBtnHidden = false;

        let mediaConnection = this.peer.call(this.theirID, this.localStream);
        this.setEventListener(mediaConnection);
      } catch (err) {
        console.error('Error: ' + err);
      }
  }
  
  onBtnClickEnd (event: any) {
    this.peer.listAllPeers((peers) => {
            console.log(peers);
            // => ["yNtQkNyjAojJNGrt", "EzAmgFhCKBQMzKw9"]
            });
    
    if (this.mediaConnection === undefined || !this.mediaConnection?.open) {
          this.muteBtnName = this.muteBtnImg[0];
          this.isMuteBtnHidden = true;
          this.onChangeEvent(null);
          let tracks = this.myVideoElm.srcObject?.getTracks();
          tracks?.forEach((track) => this.tempTrack.push(track));

          this.tempTrack?.forEach((track) => track.stop());

          this.myVideoElm.srcObject = null;
          this.localStream = null;
        } else {
          this.mediaConnection.close(true);
        }
  }
  
  muted (event: any) {
    // let target = event.target || event.srcElement || event.currentTarget;
    // let idAttr = target.attributes.id;
    let audioTrack = this.localStream?.getAudioTracks()[0];
    audioTrack.enabled = audioTrack?.enabled? false : true;
    this.muteBtnName = audioTrack?.enabled? this.muteBtnImg[0] : this.muteBtnImg[1];
    // videoElmT.requestFullscreen();
    this.cd.detectChanges();
  }
  
   // Function to set an event listener
    setEventListener = (mediaConnection) => {
      this.mediaConnection = mediaConnection;
      let videoElmT: any = document.getElementById('their-video');

      mediaConnection.on('stream', (stream) => {
        // Set a camera image to the video element and play it
        videoElmT.srcObject = stream;
        videoElmT.play();
        
        this.theirID = mediaConnection.remoteId;
        this.cd.detectChanges();
      });

      mediaConnection.once('close', () => {
        this.onChangeEvent(null);
        this.isTheirIDDisabled = false;
        
        this.muteBtnName = this.muteBtnImg[0];
        this.isMuteBtnHidden = true;

        videoElmT.srcObject?.getTracks().forEach((track) => track.stop());
        videoElmT.srcObject = null;

        let tracks = this.myVideoElm.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
        this.myVideoElm.srcObject = null;

        this.tempTrack?.forEach((track) => track.stop());

        this.localStream = null;
        this.cd.detectChanges();
      });
    };
}
