const fnKeys = ['AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Delete', 'Enter', 'ShiftLeft', 'ShiftRight', 'Tab', 'MetaLeft'];

export default class Key {
  constructor(small, shift, code) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = fnKeys.includes(code);
  }

  createKey() {
    const key = document.createElement('div');
    key.classList.add('key');
    if (this.isFnKey) key.classList.add(this.code);
    key.dataset.code = this.code;
    key.innerHTML = this.small;
    return key;
  }
}
