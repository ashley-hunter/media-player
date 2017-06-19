import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameExtractionModule } from '../../services/frame-extraction/index';
import { VideoTimelineComponent } from './video-timeline.component';

const DECLARATIONS = [
    VideoTimelineComponent
];

@NgModule({
    imports: [
        CommonModule,
        FrameExtractionModule
    ],
    exports: DECLARATIONS,
    declarations: DECLARATIONS
})
export class VideoTimelineModule { }
