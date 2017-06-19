import { Component, OnInit, Host, Input, ElementRef, ViewChild } from '@angular/core';
import { WaveformPoint, AudioService } from '../../services/audio/index';
import { select, selectAll } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

@Component({
    selector: 'ux-waveform',
    templateUrl: './waveform.component.html',
    styleUrls: ['./waveform.component.less']
})
export class WaveformComponent implements OnInit {

    @Input() src: string;
    @Input() datapoints: number = 1000;
    @ViewChild('container') svgRef: ElementRef;

    private _channels: Float32Array[] = [];

    constructor(private _waveformService: AudioService) {

    }

    ngOnInit(): void {

        // get the waveform from the source url
        this._waveformService.getWaveformFromUrl(this.src).subscribe(waveform => {
            this._channels = waveform;
            this.render();
        });

    }

    render(): void {

        let waveform = this._waveformService.getWaveformPoints(this._channels, 3000);

        let container = this.svgRef.nativeElement as SVGSVGElement;
        let bounds = container.getBoundingClientRect();
        let max = waveform.reduce((previous, current) => previous > current.max - current.min ? previous : current.max - current.min, 0);

        let x = scaleLinear()
            .domain([0, this.datapoints])
            .range([0, bounds.width]);

        let height = (data: WaveformPoint) => {
            return ((data.max - data.min) / max) * bounds.height;
        };

        select(this.svgRef.nativeElement)
            .selectAll('rect')
            .data(waveform)
            .enter()
            .append('rect')
            .attr('x', (data, index) => {
                return x(index);
            })
            .attr('y', data => {
                let pointHeight = height(data);
                let difference = bounds.height - pointHeight;
                return difference / 2;
            })
            .attr('width', bounds.width / this.datapoints)
            .attr('height', data => height(data))
            .attr('fill', '#03B388');

    }
}