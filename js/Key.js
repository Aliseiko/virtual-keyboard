/* eslint-disable import/extensions */
import languages from './lang/languages.js';
import createElement from './utils/createElement.js';

const fnKeys = ['AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Delete', 'Enter', 'ShiftLeft', 'ShiftRight', 'Tab', 'MetaLeft', 'Space'];

export default class Key {
  constructor(langCode, code) {
    this.small = languages[langCode].find((el) => el.code === code).small;
    this.shift = languages[langCode].find((el) => el.code === code).shift;
    this.code = code;
    this.isFnKey = fnKeys.includes(code);
    this.keyHTML = createElement('div', 'key', 'code', this.code, this.small);
    if (this.isFnKey) {
      this.keyHTML.classList.add(this.code);
      this.keyHTML.dataset.isFnKey = 'true';
    }
  }
}
