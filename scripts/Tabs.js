//класс для основной логики группы табов

const rootSelector = '[data-js-tabs]'; //блок "blog-title"

class Tabs {
  //поле свойства с css селекторами
  selectors = {
    root: rootSelector, //главный контейнер табов
    button: '[data-js-tabs-button]', //строка с селектором для поиска кнопок вкладок.
    content: '[data-js-tabs-content]' //строка с селектором для поиска контента вкладок.
  };

  //поле
  stateClasses = {
    isActive: 'is-active' //css класс состояния
  };

  //поле для обновления
  stateAttributes = {
    ariaSelected: 'aria-selected', //HTML-атрибута, который будет менять код.
    tabIndex: 'tabindex ' //указывающее порядок фокуса при Tab-навигации
  };

  constructor(rootElement) {
    // Запоминаем главный контейнер табов (элемент с data-js-tabs)
    this.rootElement = rootElement;

    // Находим все кнопки внутри контейнера по селектору
    this.buttonElements = this.rootElement.querySelectorAll(
      this.selectors.button
    );

    // Находим все блоки с контентом вкладок внутри контейнера
    this.contentElements = this.rootElement.querySelectorAll(
      this.selectors.content
    );

    // Сохраняем состояние: индекс активной вкладки
    // ищем кнопку, у которой есть класс is-active
    this.state = {
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)
      )
    };

    // Запоминаем последний возможный индекс вкладки (чтобы не выйти за границы массива)
    this.limitTabsIndex = this.buttonElements.length - 1;

    // Привязываем обработчики событий( клики по кнопкам)
    this.bindEvents();
  }

  updateUI() {
    const { activeTabIndex } = this.state; // Достаём из состояния индекс активной вкладки

    // Перебираем все кнопки табов
    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = index === activeTabIndex; // Проверяем: текущая кнопка активная или нет

      // Если isActive === true → добавляем класс is-active
      // Если false → убираем класс is-active
      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
    });

    // Перебираем все блоки контента
    this.contentElements.forEach((contentElement, index) => {
      const isActive = index === activeTabIndex; // Проверяем: текущий блок соответствует активному индексу?
      contentElement.classList.toggle(this.stateClasses.isActive, isActive); // Включаем/выключаем класс is-active у контента
    });
  }

  // Метод вызывается при клике на кнопку
  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex; // Обновляем состояние: делаем активным таб с индексом buttonIndex

    this.updateUI(); // Перерисовываем UI: обновляем классы кнопок и контента
  }

  // Метод "вешает" обработчики событий на каждую кнопку табов
  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener(
        'click',
        () =>
          // Перебираем все кнопки (this.buttonElements — NodeList кнопок)
          this.onButtonClick(index) // Для каждой кнопки навешиваем событие "click"
      ); // При клике вызываем onButtonClick и передаём индекс этой кнопки
    });
  }
}

// для инициализации логики для всех табов на одной странице
//будет заниматься точечным запуском экземпляров основного класса табс

class TabsCollection {
  constructor() {
    this.init();
  }

  //Находим все элементы в документе, подходящие под селектор rootSelector
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element); //Внутри цикла создаём новый экземпляр класса Tabs:
    });
  }
}

export default TabsCollection;
