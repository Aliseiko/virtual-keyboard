/* eslint-disable import/extensions */
import Key from './Key.js';
import createElement from './utils/createElement.js';

const keyMap = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
];

export default class Keyboard {
  constructor(langCode) {
    this.currentLang = langCode;
  }

  init() {
    const title = createElement('h1', 'title', null, null, 'Virtual keyboard');
    const keyboard = this.createKeyboard();
    const description = createElement('p', 'description', null, null, 'Keyboard for Windows operating system');
    const languageDescription = createElement('p', 'language', null, null, 'Switch language on click: left ctrl + shift');
    const textarea = createElement('textarea', 'textarea');
    document.body.append(title, textarea, keyboard, description, languageDescription);
  }

  createKeyboard() {
    const keyboard = createElement('div', 'keyboard', 'lang', this.currentLang);
    keyMap.forEach((rowKeys) => {
      const row = createElement('div', 'row');
      rowKeys.forEach((key) => {
        row.append(new Key(this.currentLang, key).createKey());
      });
      keyboard.append(row);
    });

    return keyboard;
  }
}
