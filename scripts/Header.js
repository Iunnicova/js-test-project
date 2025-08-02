//логика кнопки и оверлей "Contsct Us"
// Header экспортируем в самом конце файла

class Header {
  selectors = {
    root: '[data-js-header]', //Селектор корневого элемента шапки
    overlay: '[data-js-header-overlay]', //Селектор элемента наложения (overlay) мобильного меню
    burgerButton: '[data-js-header-burger-button]' //Селектор кнопки “бургер”
  };

  stateClasses = {
    isActive: 'is-active', //isActive: Класс, который добавляется/удаляется для активации элемента (например, для отображения/скрытия наложения или изменения вида кнопки “бургер”).

    isLock: 'is-lock' // isLock: Класс, который добавляется/удаляется к элементу documentElement
  };

  //конструктор класса. Он вызывается при создании нового экземпляра класса
  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay
    );
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton
    );
    this.bindEvents();
  }

  //метод класса, который вызывается при нажатии на кнопку “бургер”.
  onBurgerButtonClick = () => {
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive);
    this.overlayElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  };
  //метод класса, который привязывает обработчики событий к DOM-элементам
  bindEvents() {
    this.burgerButtonElement.addEventListener(
      'click',
      this.onBurgerButtonClick
    );
  }
}

export default Header;
