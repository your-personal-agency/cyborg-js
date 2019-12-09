// @flow

import NotificationController from './notifications/NotificationController';
import EventNames from './events/EventNames';
import Modifier from './core/Modifier';

/**
 * Motherboard
 */
export default class MotherBoard {

  static #instance: MotherBoard;

  componentsMap: Object;
  modifiersMap: Object;
  #components: Array<Component>;
  #modifiers: Set;

  constructor() {
    if (MotherBoard.#instance) {
      throw new Error('Use MotherBoard.getInstance()');
    }
    MotherBoard.#instance = this;
    this.#components = [];
    this.#modifiers = new Set();
    this.init();
  }

  static getInstance(): MotherBoard {
    if (MotherBoard.#instance) {
      return MotherBoard.#instance;
    }
    return new MotherBoard();
  }

  /**
   * Init Application.
   */
  init(): void {
    const self: MotherBoard = this;
    window.onload = function() {
      self.onload();
    };

    window.onbeforeunload = function() {
      self.destroy();
    };

    document.addEventListener(EventNames.DOCUMENT_READY, () => {
      self.bind();
    }, false);
  }

  /**
   * Document ready handler
   */
  bind(): void {
    this.build(window.document);

    const html: HTMLHtmlElement | null = document.querySelector('html');
    if (html) {
      html.classList.remove('no-js');
      html.classList.add('js');
    }
  }

  /**
   * Window onload handler
   */
  onload(): void {
    this.#components.forEach((pComponent: any) => {
      pComponent.onload();
    });
  }

  build(pEl: HTMLElement): void {
    const components: NodeList<HTMLElement> = pEl.querySelectorAll('[data-component]');
    const references: NodeList<HTMLElement> = pEl.querySelectorAll('[data-ref]');
    const self: MotherBoard = this;
    if (components.length > 0) {
      components.forEach((el: HTMLElement) => {
        const componentsArray: Array<string> = el.dataset.component.split(' ').join('').split(',');
        componentsArray.forEach((componentString: string) => {
          const ComponentClass: Component = MotherBoard.getMappedObjectByName(self.componentsMap, componentString);
          if (ComponentClass) {
            let component: Component = new ComponentClass();

            if (el.dataset.notifications) {
              console.warn('registering notifications inline via data-notifications is deprecated');
              self.registerNotification({
                name: componentString,
                notifications: el.dataset.notifications,
                classRef: component
              });
            }

            component.bind(el);
            self.#components.push(component);

            let observer: MutationObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
              mutations.forEach((mutation: MutationRecord) => {
                mutation.removedNodes.forEach((removedNode: Node) => {
                  if (component && (removedNode === el)) {
                    component.destroy();
                    observer.disconnect();
                    observer = undefined;
                    component = undefined;
                    el = undefined;
                  }
                });
              });
            });

            observer.observe(document, {
              childList: true,
              subtree: true
            });
          }
        });
      });
    }
    if (references.length > 0) {

      references.forEach((el: HTMLElement) => {
        const modifierName: string = el.dataset.ref;
        if(modifierName) {
        const ModifierClass: Modifier = MotherBoard.getMappedObjectByName(self.modifiersMap, modifierName);
        if (ModifierClass) {

          let modifier: Modifier;
          let match: boolean = false;
          self.#modifiers.forEach((pObject: Object) => {
            if (match) {
              return;
            }
            if (pObject.name === modifierName) {
              match = true;
              modifier = pObject.modifier;
            }
          });

          if (!match) {
            modifier = new ModifierClass();
            console.log('self.#modifiers.has()', self.#modifiers.has({ name: modifierName, modifier: modifier }));
            modifier.bind(modifierName);
            modifier.add(el);
            self.#modifiers.add({ name: modifierName, modifier: modifier });

            let observer: MutationObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
              mutations.forEach((mutation: MutationRecord) => {
                mutation.removedNodes.forEach((removedNode: Node) => {
                  if (modifierName && (removedNode === el)) {
                    modifier.destroyRef(el);
                    if () {
                      observer.disconnect();
                    }
                    observer = undefined;
                    el = undefined;
                  }
                });
              });
            });

            observer.observe(document, {
              childList: true,
              subtree: true
            });
          }
        }
      });
    }
  }

  /**
   * Register Notifications.
   */
  registerNotification(pObject: Object): void {
    if (pObject.notifications) {
      const notifications: Array<string> = pObject.notifications.replace(' ', '').split(',');
      const classRef: Component = pObject.classRef;
      notifications.forEach((pNotification: string) => {
        NotificationController.getInstance().addListener(classRef, pNotification, classRef.handleNotifications);
      });
    }
  }

  /**
   * Get NotificationController access.
   * @returns {NotificationController}
   */
  get notifier(): NotificationController {
    return NotificationController.getInstance();
  }

  get components(): Array<any> {
    return this.#components;
  }

  /**
   */
  static getMappedObjectByName(pObject: Object, pName: string): any {
    return pObject[pName];
  }

  /**
   * destroy application
   */
  destroy(): void {
    const self = this;
    while (self.#components.length > 0) {
      const component: Component = self.#components[0];
      if (component) {
        component.el.remove();
      }
      self.#components.shift();
    }
  }
}
