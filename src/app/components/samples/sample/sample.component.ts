import { Component } from '@angular/core';
import { MediaPlayerComponent } from '../../media-player/media-player.component';
import { ExtractedFrame } from '../../../services/frame-extraction/frame-extraction.service';

@Component({
    selector: 'my-sample',
    templateUrl: './sample.component.html'
})
export class SampleComponent {

    videoSource: string = require('../../../../assets/video/hpe.mp4');
    audioSource: string = require('../../../../assets/audio/hpe.mp3');

    frames: ExtractedFrame[] = [];
    quietMode: boolean = false;

    constructor() {

    }
}