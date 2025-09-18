// Логика маски для полей ввода.
// Используем библиотеку "imaskjs cdn".
// Документация: https://imask.js.org

const rootSelector = '[data-js-input-mask]'; // Селектор для элементов с атрибутом data-js-input-mask

class InputMask {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.init();
  }

  init() {
    // Проверяем, подключена ли библиотека IMask
    const isLibReady = typeof window.IMask !== 'undefined'; // true → подключена, false → нет

    if (isLibReady) {
      // Инициализация маски для конкретного поля
      window.IMask(this.rootElement, {
        mask: this.rootElement.dataset.jsInputMask // берём формат из data-атрибута
      });
    } else {
      console.error('Библиотека "imask" не подключена!');
    }
  }
}

class InputMaskCollection {
  constructor() {
    this.init(); // При создании объекта сразу запускаем init()
  }

  // init:
  // 1) Находит все элементы с селектором rootSelector
  // 2) Для каждого создаёт экземпляр InputMask
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new InputMask(element); // Подключаем маску для каждого поля
    });
  }
}

export default InputMaskCollection;
