import {
    Component,
    HostListener,
    ElementRef,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {

    state: 'open' | 'close';

    @ViewChild('handler', {static: true}) handlerElem: ElementRef;

    constructor(private element: ElementRef) {
        this.state = 'open';
    }

    toogleStateAction() {
        this.state = this.state === 'open' ? 'close' : 'open';
    }

    @HostListener('document:touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {

        if (this.state === 'close' || e.touches.length === 0) {
            return;
        }

        let target = e.touches[0].target as any;

        while (target) {
            if (target === this.element.nativeElement) {
                // touched inside drawer. Do nothing.
                return;
            }

            target = target.parentElement;
        }

        this.state = 'close';
    }
}
