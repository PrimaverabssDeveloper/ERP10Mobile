import { Injectable, EmbeddedViewRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';

/**
 * Provides methods to handle Html Dom operations.
 *
 * @export
 * @class CoreStorageService
 * @extends {StorageServiceBase}
 */
@Injectable({
    providedIn: 'root',
})
export class DomService {

    /**
     * Creates an instance of DomService.
     *
     * @param {ComponentFactoryResolver} componentFactoryResolver
     * @param {ApplicationRef} appRef
     * @param {Injector} injector
     * @memberof DomService
     */
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {
    }

    /**
     * Create an Component and returns it html.
     *
     * @param {*} component The component reference.
     * @param {*} [properties] An object with properties to the component.
     * @returns {HTMLElement} The html from the component.
     * @memberof DomService
     */
    createComponent(component: any, properties?: any): HTMLElement {

        // 1. Create a component reference from the component
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        // 2. Add properties to the component
        if (properties) {
            for (const key in properties) {
                if (properties[key]) {
                    componentRef.instance[key] = properties[key];
                }
            }
        }

        // 3. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // 4. Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        return domElem;
    }
}
