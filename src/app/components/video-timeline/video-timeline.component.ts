import { Component, Input } from '@angular/core';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { ExtractedFrame } from '../../services/frame-extraction/index';

@Component({
    selector: 'ux-video-timeline',
    templateUrl: './video-timeline.component.html',
    styleUrls: ['./video-timeline.component.less']
})
export class VideoTimelineComponent {

    @Input() player: MediaPlayerComponent;
    frames: ExtractedFrame[] = [];

    ngAfterViewInit() {

        // wait until player has loaded the information we need
        this.player.loadedMetadataEvent.subscribe(() => {

            // reset the frames
            this.frames = [];
            this.player.getFrames(160, 90, 10).subscribe(frame => this.frames.push(frame));
        });

    }
}