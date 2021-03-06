import { MotherBoard } from './MotherBoard';
import { NotificationBody } from '../notifications/NotificationBody';
import { IAmComponent } from '../interfaces/IAmComponent';
export declare class Component implements IAmComponent {
    private _el;
    private _name;
    private _events;
    private _motherboard;
    private _addEventListener;
    private _removeEventListener;
    protected _notifications: ReadonlyArray<string>;
    constructor();
    /**
     * Bind your component in the system.
     * @param {HTMLElement} pEl Connected Node
     */
    bind(pEl: HTMLElement): void;
    onload(): void;
    onunload(): void;
    addListener(pType: string): void;
    removeListener(pType: string): void;
    notify(pType: string, pParams?: Record<string, any>): void;
    handleNotifications(pObject: NotificationBody): void;
    registerInlineListeners(): void;
    addEventListener(pEventName: string, pHandler: EventListenerOrEventListenerObject): void;
    removeEventListener(pEventName: string, pHandler: EventListenerOrEventListenerObject): void;
    /**
     * @param {Object} pData Data object to use
     * @param {function} pTemplate template function
     */
    render(pData: Record<string, any>, pTemplate?: Function): void;
    /**
     * @param {Object} pData
     * @returns {string}
     */
    getTemplate(pData?: Record<string, any>): string;
    get notifications(): ReadonlyArray<string>;
    get name(): string;
    get el(): HTMLElement;
    get motherboard(): MotherBoard;
    get events(): ReadonlyArray<Record<string, any>>;
    dump(): void;
    /**
     * Garbage collection ;)
     */
    destroy(): void;
}
