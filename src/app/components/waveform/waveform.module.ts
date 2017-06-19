import { NgModule } from '@angular/core';

import { WaveformComponent } from './waveform.component';
import { AudioServiceModule } from '../../services/audio/index';
import { ResizeModule } from '@ux-aspects/ux-aspects';

const DECLARATIONS = [
    WaveformComponent
];

@NgModule({
    imports: [
        ResizeModule,
        AudioServiceModule
    ],
    exports: DECLARATIONS,
    declarations: DECLARATIONS,
    providers: []
})
export class WaveformModule { }
