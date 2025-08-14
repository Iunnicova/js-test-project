//класс для основной логики группы табов

const rootSelector = '[data-js-tabs]'; //блок "blog-title"

class Tabs {
  //поле
selectors = {
  root: rootSelector,
  button: '[data-js-tabs-button]',
  content: '[data-js-tabs-content]',
} 

//поле
stateClasses = {
  isActive: 'is-active', //css класс состояния
}

//поле
stateAttributes = {
  ariaSelected: 'aria-selected',
  tabIndex: tabindex,
}
}

// для инициализации логики для всех табов на одной странице
//будет заниматься точечным запуском экземпляров основного класса табс

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element);
    }); //ищем все дом элементы
  }
}

export default TabsCollection;
