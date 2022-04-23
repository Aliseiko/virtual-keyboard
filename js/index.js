/* eslint-disable import/extensions */
import Keyboard from './Keyboard.js';

const langCode = localStorage.getItem('keybordLang') || 'en';
const keyboard = new Keyboard(langCode);
keyboard.init();
