import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './popover-selector.component.html',
    styleUrls: ['./popover-selector.component.scss']
})

export class PopoverSelectorComponent {
    @Input() items: { label: string, data: any}[];
    @Input() onItemSelected: (item: { label: string, data: any}) => void;

    itemSelectedAction(item: { label: string, data: any}) {
        this.onItemSelected(item);
    }
}
