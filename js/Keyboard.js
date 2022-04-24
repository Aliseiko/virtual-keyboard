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
    this.pressedKeys = [];
    this.keyboardKeysObj = [];
  }

  init() {
    const title = createElement('h1', 'title', null, null, 'Virtual keyboard');
    const keyboard = this.createKeyboard();
    const description = createElement('p', 'description', null, null, 'Keyboard for Windows operating system');
    const languageDescription = createElement('p', 'language', null, null, 'Switch language on click: left ctrl + shift');
    this.textarea = createElement('textarea', 'textarea');
    document.body.append(title, this.textarea, keyboard, description, languageDescription);
    this.textarea.focus();
    keyboard.addEventListener('mousedown', this.handleEvents);
  }

  createKeyboard() {
    const keyboard = createElement('div', 'keyboard', 'lang', this.currentLang);
    keyMap.forEach((rowKeys) => {
      const row = createElement('div', 'row');
      rowKeys.forEach((key) => {
        const newKey = new Key(this.currentLang, key);
        this.keyboardKeysObj.push(newKey);
        row.append(newKey.keyHTML);
      });
      keyboard.append(row);
    });

    return keyboard;
  }

  handleEvents = (e) => {
    if (!e.target.classList.contains('key')) return;
    const key = e.target;

    function deactivateKey() {
      key.classList.remove('active');
      key.removeEventListener('mouseleave', deactivateKey);
      key.removeEventListener('mouseup', deactivateKey);
    }

    e.stopPropagation();
    key.classList.add('active');

    if (!key.dataset.isFnKey
        || key.dataset.code === 'ArrowDown'
        || key.dataset.code === 'ArrowRight'
        || key.dataset.code === 'ArrowUp'
        || key.dataset.code === 'ArrowLeft') {
      this.pressedKeys.push(key.textContent);
    } else if (key.dataset.code === 'Enter') {
      this.pressedKeys.push('\n');
    } else if (key.dataset.code === 'Space') {
      this.pressedKeys.push(' ');
    } else if (key.dataset.code === 'Tab') {
      this.pressedKeys.push('\t');
    } else if (key.dataset.code === 'Backspace'
               && this.pressedKeys.length !== 0) {
      this.pressedKeys.pop();
    }

    this.textarea.value = this.pressedKeys.join('');
    key.addEventListener('mouseleave', deactivateKey);
    key.addEventListener('mouseup', deactivateKey);
  };
}
