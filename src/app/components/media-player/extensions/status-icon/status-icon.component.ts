import { Component, OnInit } from '@angular/core';
import { MediaPlayerBaseExtensionDirective } from '../base-extension.directive';

@Component({
    selector: 'ux-media-player-status-icon',
    templateUrl: './status-icon.component.html',
    styleUrls: ['./status-icon.component.less'],
    host: {
        '[style.height.px]': 'mediaPlayerComponent.mediaPlayerHeight'
    }
})
export class MediaPlayerStatusIconExtensionComponent extends MediaPlayerBaseExtensionDirective implements OnInit {

    playerState = PlayerState;
    state: PlayerState = PlayerState.Initial;
    height: number = 0;

    ngOnInit(): void {

        // subscribe the the video clicked event
        this.mediaPlayerComponent.mediaClickEvent.subscribe(() => {

            if (this.mediaPlayerComponent.paused) {
                this.mediaPlayerComponent.play();
                this.state = PlayerState.Playing;
            } else {
                this.mediaPlayerComponent.pause();
                this.state = PlayerState.Paused;
            }
        });
    }
}

enum PlayerState {
    Initial,
    Playing,
    Paused,
    Rewind,
    Forward
}