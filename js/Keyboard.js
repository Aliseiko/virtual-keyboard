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
    this.specChars = {
      Enter: '\n',
      Space: ' ',
      Tab: '\t',
    };
    this.arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.langList = Object.keys(languages);
    this.currentLang = langCode;
    this.keyboardKeysObj = [];
    this.isCaps = false;
    this.isControlLeftPressed = false;
    this.isAltLeftPressed = false;
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
    document.addEventListener('keyup', this.handleEvents);
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
    e.preventDefault();
    if ((!e.target.classList.contains('key') && !e.code) || e.repeat) return;
    e.stopPropagation();
    let key;
    try {
      key = (e.target.classList.contains('key')) ? e.target : this.keyboardKeysObj.find((el) => el.code === e.code).keyHTML;
    } catch (err) {
      return;
    }

    const keyCode = key.dataset.code;

    key.addEventListener('mouseleave', this.handleEvents);
    key.addEventListener('mouseup', this.handleEvents);

    const rebuildKeyboard = () => {
      this.keyboardKeysObj.forEach((keyObj) => {
        const k = keyObj;
        k.keyHTML.textContent = languages[this.currentLang].find((el) => el.code === keyObj.code)[(this.isCaps) ? 'shift' : 'small'];
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
      if (keyCode !== 'CapsLock'
          || (keyCode === 'CapsLock' && this.isCaps !== true)) key.classList.remove('active');

      if (['ShiftLeft', 'ShiftRight'].includes(keyCode)) {
        shiftKeyboard();
      }
      if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = false;
      }
      key.removeEventListener('mouseleave', this.handleEvents);
      key.removeEventListener('mouseup', this.handleEvents);
      this.textarea.focus();
    };

    const insertChar = (char) => this.textarea.setRangeText(char, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');

    const deleteChar = (delKeyCode) => {
      const cursorPosition = this.textarea.selectionStart;
      const { selectionStart, selectionEnd } = this.textarea;
      const output = this.textarea.value;
      const setCursorPosition = (shift = 0) => {
        ['Start', 'End'].forEach((el) => {
          this.textarea[`selection${el}`] = cursorPosition - shift;
        });
      };

      if (selectionStart !== selectionEnd) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd, output.length);
        setCursorPosition();
      } else if (delKeyCode === 'Backspace' && selectionStart !== 0) {
        this.textarea.value = output.slice(0, selectionStart - 1)
            + output.slice(selectionEnd, output.length);
        setCursorPosition(1);
      } else if (delKeyCode === 'Delete' && selectionEnd !== output.length) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd + 1, output.length);
        setCursorPosition();
      }
    };

    const moveCursor = (arrowKey) => {
      const cursorPosition = this.textarea.selectionStart;
      const output = this.textarea.value;

      const calcPosition = () => {
        const outputRowLength = output.split('\n').map((el, i, arr) => ((arr.length === i + 1) ? el.length : el.length + 1));
        console.log(outputRowLength)

        let positionRow = 1;
        let lengthToCursor = 0;
        let rowLengthSum =

        while (cursorPosition > )

        
      };
calcPosition()
      if (arrowKey === 'ArrowLeft' && cursorPosition !== 0) {
        this.textarea.selectionStart = cursorPosition - 1;
        this.textarea.selectionEnd = cursorPosition - 1;
      } else if (arrowKey === 'ArrowRight' && cursorPosition !== output.length) {
        this.textarea.selectionStart = cursorPosition + 1;
        this.textarea.selectionEnd = cursorPosition + 1;
      }
    };

    if (['mousedown', 'keydown'].includes(e.type)) {
      key.classList.add('active');
      this.textarea.focus();

      if (!key.dataset.isFnKey) {
        insertChar(key.textContent);
      } else if (this.specChars[keyCode]) {
        insertChar(this.specChars[keyCode]);
      } else if (['Backspace', 'Delete'].includes(keyCode)) {
        deleteChar(keyCode);
      } else if (['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(keyCode)) {
        shiftKeyboard();
      } else if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = true;
        if (this.isControlLeftPressed && this.isAltLeftPressed) switchLang();
      } else if (this.arrowKeys.includes(keyCode)) {
        moveCursor(keyCode);
      }
    } else if (['mouseup', 'mouseleave', 'keyup'].includes(e.type)) {
      deactivateKey();
    }
  };
}
