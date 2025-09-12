//кнопка стрелка для развертывания контента текста

import pxToRem from './utils/pxToRem.js';

const rootSelector = '[data-js-expandable-content]'; //поиска основного контейнера разворачиваемого контента.

class ExpandableContent {
  selectors = {
    root: rootSelector, // Селектор корневого элемента (контейнер блока)
    button: '[data-js-expandable-content-button]' // Кнопка, по которой происходит разворачивание
  };

  stateClasses = {
    isExpanded: 'is-expanded' // Класс, который добавляется, когда контент разворачивается
  };

  animationParams = {
    duration: 500, // Продолжительность анимации в миллисекундах (0.5 секунды)
    easing: 'ease' // Плавность анимации (CSS свойство)
  };

  constructor(rootElement) {
    this.rootElement = rootElement; // Сохраняем переданный корневой элемент
    this.buttonElement = this.rootElement.querySelector(this.selectors.button); // Находим кнопку внутри блока
    this.bindEvents(); // Привязываем обработчики событий
  }

  //   offsetHeight — текущая высота блока.

  // scrollHeight — полная высота содержимого, включая скрытую часть.
  expand() {
    const { offsetHeight, scrollHeight } = this.rootElement;

    this.rootElement.classList.add(this.stateClasses.isExpanded); // Добавляем класс "развернуто"
    this.rootElement.animate(
      [
        {
          maxHeight: `${pxToRem(offsetHeight)}rem` // Начальное значение max-height
        },
        {
          maxHeight: `${pxToRem(scrollHeight)}rem` // Конечное значение max-height
        }
      ],
      this.animationParams
    ); // Применяем анимацию
  }

  onButtonClick = () => {
    this.expand(); //Обработчик нажатия на кнопку — вызывает метод expand().
  };

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick); //Назначает обработчик клика на кнопку.
  }
}

class ExpandableContentCollection {
  constructor() {
    this.init();
  }

  //   Находит все элементы по селектору rootSelector.
  // Создает для каждого отдельный экземпляр ExpandableContent, чтобы управлять его поведением.
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ExpandableContent(element); // Для каждого блока создается свой экземпляр ExpandableContent
    });
  }
}

export default ExpandableContentCollection;
