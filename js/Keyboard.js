/* eslint-disable import/extensions */
import Key from './Key.js';
import createElement from './utils/createElement.js';
import languages from './lang/languages.js';

export default class Keyboard {
  constructor(langCode) {
    this.keyMap = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
      ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
    ];
    this.specialCharacters = {
      Enter: '\n',
      Space: ' ',
      Tab: '\t',
    };
    this.arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.langList = Object.keys(languages);
    this.currentLang = langCode;
    this.keyboardKeysObj = [];
    this.isCaps = false;
    this.isCtrlPressed = false;
    this.isAltPressed = false;
  }

  init() {
    const title = createElement('h1', 'title', null, null, 'Virtual keyboard');
    const keyboard = this.createKeyboard();
    const description = createElement('p', 'description', null, null, 'Keyboard for Windows operating system');
    const languageDescription = createElement('p', 'language', null, null, 'Switch language on click: left ctrl + alt');
    this.textarea = createElement('textarea', 'textarea');
    document.body.prepend(title, this.textarea, keyboard, description, languageDescription);
    this.textarea.focus();
    keyboard.addEventListener('mousedown', this.handleEvents);
    document.addEventListener('keydown', this.handleEvents);
  }

  createKeyboard() {
    const keyboard = createElement('div', 'keyboard', 'lang', this.currentLang);
    this.keyMap.forEach((rowKeys) => {
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
    if ((!e.target.classList.contains('key') && !e.code) || e.repeat) return;
    e.preventDefault();
    const key = (e.target.classList.contains('key')) ? e.target : this.keyboardKeysObj.find((el) => el.code === e.code).keyHTML;

    const rebuildKeyboard = () => {
      this.keyboardKeysObj.forEach((keyObj) => {
        keyObj.keyHTML.textContent = languages[this.currentLang].find((el) => el.code === keyObj.code)[(this.isCaps) ? 'shift' : 'small'];
      });
    };

    const switchLang = () => {
      const langIndex = this.langList.indexOf(this.currentLang);
      this.currentLang = this.langList[(langIndex === this.langList.length - 1)
        ? 0 : langIndex + 1];
      localStorage.setItem('keyboardLang', this.currentLang);
      rebuildKeyboard();
    };

    const shiftKeyboard = () => {
      this.isCaps = (!this.isCaps);
      rebuildKeyboard();
    };

    const deactivateKey = () => {
      if (key.dataset.code !== 'CapsLock'
          || (key.dataset.code === 'CapsLock' && this.isCaps !== true)) key.classList.remove('active');
      key.removeEventListener('mouseleave', deactivateKey);
      key.removeEventListener('mouseup', deactivateKey);
      document.removeEventListener('keyup', deactivateKey);
      if (key.dataset.code === 'ShiftLeft' || key.dataset.code === 'ShiftRight') {
        shiftKeyboard();
      }
      if (key.dataset.code === 'AltLeft') {
        this.isAltPressed = false;
      }
      if (key.dataset.code === 'ControlLeft') {
        this.isCtrlPressed = false;
      }
      this.textarea.focus();
    };

    const insertChar = (char) => this.textarea.setRangeText(char, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');

    const deleteChar = (delKeyCode) => {
      const cursorPosition = this.textarea.selectionStart;
      const setCursorPosition = (shift = 0) => {
        this.textarea.selectionStart = cursorPosition - shift;
        this.textarea.selectionEnd = cursorPosition - shift;
      };

      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart)
            + this.textarea.value.slice(this.textarea.selectionEnd, this.textarea.value.length);
        setCursorPosition();
      } else if (delKeyCode === 'Backspace' && this.textarea.selectionStart !== 0) {
        this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart - 1)
            + this.textarea.value.slice(this.textarea.selectionEnd, this.textarea.value.length);
        setCursorPosition(1);
      } else if (delKeyCode === 'Delete' && this.textarea.selectionEnd !== this.textarea.value.length) {
        this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart)
            + this.textarea.value.slice(this.textarea.selectionEnd + 1, this.textarea.value.length);
        setCursorPosition();
      }
    };

    e.stopPropagation();
    key.classList.add('active');
    this.textarea.focus();

    if (!key.dataset.isFnKey
        || this.arrowKeys.includes(key.dataset.code)) {
      insertChar(key.textContent);
    } else if (this.specialCharacters[key.dataset.code]) {
      insertChar(this.specialCharacters[key.dataset.code]);
    } else if (key.dataset.code === 'Backspace' || key.dataset.code === 'Delete') {
      deleteChar(key.dataset.code);
    } else if (key.dataset.code === 'ShiftLeft'
        || key.dataset.code === 'ShiftRight'
        || key.dataset.code === 'CapsLock') {
      shiftKeyboard();
    } else if (key.dataset.code === 'ControlLeft') {
      this.isCtrlPressed = true;
      if (this.isCtrlPressed && this.isAltPressed) switchLang();
    } else if (key.dataset.code === 'AltLeft') {
      this.isAltPressed = true;
      if (this.isCtrlPressed && this.isAltPressed) switchLang();
    }

    key.addEventListener('mouseleave', deactivateKey);
    key.addEventListener('mouseup', deactivateKey);
    document.addEventListener('keyup', deactivateKey);
  };
}
