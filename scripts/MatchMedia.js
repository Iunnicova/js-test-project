//! для понимания, мобильная версия сайта сейчас или десктопная.
// Чтобы можно было по-разному обрабатывать логику

// Импортируем функцию pxToRem, которая переводит пиксели в rem.
// Например, pxToRem(16) → "1rem".

import pxToRem from './utils/pxToRem.js';

// Создаём объект MatchMedia с одним свойством "mobile".
// window.matchMedia(...) возвращает объект MediaQueryList,
// который умеет отслеживать, выполняется ли CSS-медиа-запрос.

const MatchMedia = {
  mobile: window.matchMedia(`(width <= ${pxToRem(767.98)}rem)`) // Здесь проверяем условие: ширина окна <= 767.98px (переведённое в rem).
  // Обычно это "мобильная" точка.
};

export default MatchMedia;
