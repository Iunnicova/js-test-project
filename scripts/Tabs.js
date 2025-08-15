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
    tabIndex: tabindex //указывающее порядок фокуса при Tab-навигации
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElements = this.rootElement.querySelectorAll(
      this.selectors.button
    );
    this.contentElements = this.rootElement.querySelectorAll(
      this.selectors.content
    );
    this.state = {
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)
      )
    };
    this.limitTabsIndex = this.buttonElements.length - 1; //лимит индекса табов
    this.bindEvents();
  }

  updateUI() {
    const { activeTabIndex } = this.state;

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = index === activeTabIndex;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
    });

    this.contentElements.forEach((contentElement, index) => {
      const isActive = index === activeTabIndex;

      contentElement.classList.toggle(this.stateClasses.isActive, isActive);
    });
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex;
    this.updateUI();
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index));
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
