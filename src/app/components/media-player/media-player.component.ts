import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ExtractedFrame, FrameExtractionService } from '../../services/frame-extraction/frame-extraction.service';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import { AudioService, AudioMetadata } from '../../services/audio/index';

@Component({
    selector: 'ux-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.less'],
    host: {
        '[class.fullscreen]': 'fullscreen',
        '[class.quiet]': 'quietMode || fullscreen',
        '(document:webkitfullscreenchange)': 'fullscreenChange($event)',
        '(document:mozfullscreenchange)': 'fullscreenChange($event)',
        '(document:MSFullscreenChange)': 'fullscreenChange($event)'
    }
})
export class MediaPlayerComponent implements AfterViewInit {

    @Input('src') source: string;
    @Input('autoplay') autoPlay: boolean;
    @Input('muted') mute: boolean;
    @Input() type: MediaPlayerType = 'video';

    @ViewChild('player') private _playerRef: ElementRef;
    @ViewChild('trackBar') private _trackBarRef: ElementRef;

    audioMetadata: Observable<AudioMetadata>;
    playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /*
        Create observables for media player events
    */
    initEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    abortEvent: Subject<void> = new Subject<void>();
    canPlayEvent: Subject<void> = new Subject<void>();
    canPlayThroughEvent: Subject<void> = new Subject<void>();
    durationChangeEvent: Subject<number> = new Subject<number>();
    endedEvent: Subject<void> = new Subject<void>();
    errorEvent: Subject<any> = new Subject<any>();
    loadedDataEvent: Subject<any> = new Subject<any>();
    loadedMetadataEvent: Subject<any> = new Subject<any>();
    loadStartEvent: Subject<void> = new Subject<void>();
    pauseEvent: Subject<void> = new Subject<void>();
    playEvent: Subject<void> = new Subject<void>();
    playingEvent: Subject<boolean> = new Subject<boolean>();
    rateChangeEvent: Subject<number> = new Subject<number>();
    seekedEvent: Subject<number> = new Subject<number>();
    seekingEvent: Subject<number> = new Subject<number>();
    stalledEvent: Subject<void> = new Subject<void>();
    suspendEvent: Subject<void> = new Subject<void>();
    timeUpdateEvent: Subject<number> = new Subject<number>();
    volumeChangeEvent: Subject<number> = new Subject<number>();
    waitingEvent: Subject<void> = new Subject<void>();
    mediaClickEvent: Subject<MouseEvent> = new Subject<MouseEvent>();
    fullscreenEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    quietModeEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    progressEvent: Observable<TimeRanges> = Observable.create((observer: Observer<TimeRanges>) => {

        // repeat until the whole video has fully loaded
        let interval = setInterval(() => {

            let buffered = this._playerRef.nativeElement.buffered as TimeRanges;
            observer.next(buffered);

            if (buffered.length === 1 && buffered.start(0) === 0 && buffered.end(0) === this.duration) {
                observer.complete();
                clearInterval(interval);
            }
        }, 1000);
    });

    private _mediaPlayer: HTMLMediaElement;
    private _fullscreen: boolean = false;
    private _quietMode: boolean = false;

    get quietMode(): boolean {
        return this._quietMode;
    }

    @Input()
    set quietMode(value: boolean) {

        // quiet mode cannot be enabled on audio player
        if (this.type === 'audio') {
            value = false;
        }

        this._quietMode = value;
        this.quietModeEvent.next(value);
    }

    /*
        Create all the getters and setters the can be used by media player extensions 
    */
    get mediaPlayer(): HTMLMediaElement {
        return this._mediaPlayer;
    }

    get mediaPlayerWidth(): number {
        return this._mediaPlayer ? this._mediaPlayer.offsetWidth : 0;
    }

    get mediaPlayerHeight(): number {
        return this._mediaPlayer ? this._mediaPlayer.offsetHeight : 0;
    }

    get audioTracks(): AudioTrackList {
        return this._mediaPlayer ? this._mediaPlayer.audioTracks : null;
    }

    get autoplay(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.autoplay : false;
    }
    set autoplay(value: boolean) {
        this._mediaPlayer.autoplay = value;
    }

    get buffered(): TimeRanges {
        return this._mediaPlayer ? this._mediaPlayer.buffered : new TimeRanges();
    }

    get crossOrigin(): string {
        return this._mediaPlayer ? this._mediaPlayer.crossOrigin : null;
    }
    set crossOrigin(value: string) {
        this._mediaPlayer.crossOrigin = value;
    }

    get currentSrc(): string {
        return this._mediaPlayer ? this._mediaPlayer.currentSrc : null;
    }

    get currentTime(): number {
        return this._mediaPlayer ? this._mediaPlayer.currentTime : 0;
    }
    set currentTime(value: number) {
        this._mediaPlayer.currentTime = value;
    }

    get defaultMuted(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.defaultMuted : false;
    }
    set defaultMuted(value: boolean) {
        this._mediaPlayer.defaultMuted = value;
    }

    get defaultPlaybackRate(): number {
        return this._mediaPlayer ? this._mediaPlayer.defaultPlaybackRate : 1;
    }
    set defaultPlaybackRate(value: number) {
        this._mediaPlayer.defaultPlaybackRate = value;
    }

    get duration(): number {
        return this._mediaPlayer ? this._mediaPlayer.duration : 0;
    }

    get ended(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.ended : false;
    }

    get loop(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.loop : false;
    }
    set loop(value: boolean) {
        this._mediaPlayer.loop = value;
    }

    get muted(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.muted : false;
    }
    set muted(value: boolean) {
        this._mediaPlayer.muted = value;
    }

    get networkState(): number {
        return this._mediaPlayer.networkState;
    }

    get paused(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.paused : true;
    }

    get playbackRate(): number {
        return this._mediaPlayer ? this._mediaPlayer.playbackRate : 1;
    }
    set playbackRate(value: number) {
        this._mediaPlayer.playbackRate = value;
    }

    get played(): TimeRanges {
        return this._mediaPlayer ? this._mediaPlayer.played : new TimeRanges();
    }

    get preload(): string {
        return this._mediaPlayer ? this._mediaPlayer.preload : 'auto';
    }
    set preload(value: string) {
        this._mediaPlayer.preload = value;
    }

    get readyState(): number {
        return this._mediaPlayer ? this._mediaPlayer.readyState : 0;
    }

    get seekable(): TimeRanges {
        return this._mediaPlayer ? this._mediaPlayer.seekable : new TimeRanges();
    }

    get seeking(): boolean {
        return this._mediaPlayer ? this._mediaPlayer.seeking : false;
    }

    get src(): string {
        return this._mediaPlayer ? this._mediaPlayer.src : '';
    }
    set src(value: string) {
        this._mediaPlayer.src = value;
    }

    get textTracks(): TextTrackList {
        return this._mediaPlayer ? this._mediaPlayer.textTracks : new TextTrackList();
    }

    get videoTracks(): VideoTrackList {
        return this._mediaPlayer ? this._mediaPlayer.videoTracks : new VideoTrackList();
    }

    get volume(): number {
        return this._mediaPlayer ? this._mediaPlayer.volume : 1;
    }
    set volume(value: number) {
        this._mediaPlayer.volume = value;
    }

    get fullscreen(): boolean {
        return this._mediaPlayer ? this._fullscreen : false;
    }
    set fullscreen(value: boolean) {
        this._fullscreen = value;
        this.fullscreenEvent.next(value);
    }

    constructor(private _frameExtractionService: FrameExtractionService, private _audioService: AudioService, private _elementRef: ElementRef) { }

    ngAfterViewInit(): void {
        this._mediaPlayer = this._playerRef.nativeElement as HTMLMediaElement;

        this.audioMetadata = this._audioService.getAudioFileMetadata(this._mediaPlayer);
        this.playingEvent.subscribe(event => this.playing.next(true));
        this.pauseEvent.subscribe(event => this.playing.next(false));
        this.mediaClickEvent.subscribe(() => this.togglePlay());

        this.initEvent.next(true);
    }

    /**
     * Starts playing the audio/video
     */
    play(): void {
        this._mediaPlayer.play();
    }

    /**
     * Pauses the currently playing audio/video
     */
    pause(): void {
        this._mediaPlayer.pause();
    }

    /**
     * Toggle playing state
     */
    togglePlay(): void {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * Re-loads the audio/video element
     */
    load(): void {
        this._mediaPlayer.load();
    }

    /**
     * Checks if the browser can play the specified audio/video type
     */
    canPlayType(type: string): string {
        return this._mediaPlayer.canPlayType(type);
    }

    /**
     * Adds a new text track to the audio/video
     */
    addTextTrack(kind: string, label: string, language: string): TextTrack {
        return this._mediaPlayer.addTextTrack(kind, label, language);
    }

    /**
     * Attempt to display media in fullscreen mode
     */
    requestFullscreen(): void {

        if (this._elementRef.nativeElement.requestFullscreen) {
            this._elementRef.nativeElement.requestFullscreen();
        } else if (this._elementRef.nativeElement.webkitRequestFullscreen) {
            this._elementRef.nativeElement.webkitRequestFullscreen();
        } else if ((<any>this._elementRef.nativeElement).msRequestFullscreen) {
            (<any>this._elementRef.nativeElement).msRequestFullscreen();
        } else if ((<any>this._elementRef.nativeElement).mozRequestFullScreen) {
            (<any>this._elementRef.nativeElement).mozRequestFullScreen();
        }
    }

    /**
     * Exit full screen mode
     */
    exitFullscreen(): void {

        if (this._elementRef.nativeElement.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if ((<any>document).msExitFullscreen) {
            (<any>document).msExitFullscreen();
        } else if ((<any>document).mozCancelFullScreen) {
            (<any>document).mozCancelFullScreen();
        }
    }

    fullscreenChange(event: Event) {
        this.fullscreen = (<any>document).fullscreen || document.webkitIsFullScreen || (<any>document).mozFullScreen || (<any>document).msFullscreenElement !== null && (<any>document).msFullscreenElement !== undefined;
        this.fullscreenEvent.next(this.fullscreen);
    }

    /**
     * Toggle Fullscreen State
     */
    toggleFullscreen(): void {
        if (this.fullscreen) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen();
        }
    }

    /**
     * Extract the frames from the video
     */
    getFrames(width: number, height: number, skip: number): Observable<ExtractedFrame> {

        if (this.type === 'video') {
            return this._frameExtractionService.getFrameThumbnails(this.source, width, height, 0, this.duration, 10);
        }

        return Observable.from([]);
    }

}

export type MediaPlayerType = 'video' | 'audio';

export interface MediaPlayerBuffer {
    start: number;
    end: number;
}