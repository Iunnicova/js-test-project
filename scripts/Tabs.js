//класс для основной логики группы табов

import BaseComponent from './BaseComponent.js';

const rootSelector = '[data-js-tabs]'; //!section "blog-title"

class Tabs extends BaseComponent {
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
    tabIndex: 'tabindex' //указывающее порядок фокуса при Tab-навигации
  };

  constructor(rootElement) {
    super(); //расширение класса BaseComponent без него работать не будет расширение классов extends BaseComponent
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
    this.state = this.getProxyState({
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)
      )
    });

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

      // Устанавливаем атрибут aria-selected (true/false),
      // чтобы скринридеры и доступность работали правильно
      buttonElement.setAttribute(
        this.stateAttributes.ariaSelected, // имя атрибута
        isActive.toString() // значение в виде строки ("true"/"false")
      );

      buttonElement.setAttribute(
        this.stateAttributes.tabIndex, // имя атрибута (tabindex)
        isActive ? '0' : '-1' // если кнопка активная → 0 (можно фокусить tab-ом),если неактивная → -1 (нельзя попасть tab-ом)
      );
    });

    // Перебираем все блоки контента
    this.contentElements.forEach((contentElement, index) => {
      const isActive = index === activeTabIndex; // Проверяем: текущий блок соответствует активному индексу?
      contentElement.classList.toggle(this.stateClasses.isActive, isActive); // Включаем/выключаем класс is-active у контента
    });
  }

  // Метод активирует вкладку с заданным индексом
  activateTab(newTabIndex) {
    this.state.activeTabIndex = newTabIndex; // Обновляем состояние: активная вкладка = newTabIndex
    this.buttonElements[newTabIndex].focus(); // Устанавливаем фокус на соответствующую кнопку
  }

  // Метод переключается на предыдущую вкладку
  previousTab = () => {
    // Если текущая вкладка первая, то предыдущая = последняя (циклично)
    // Иначе просто уменьшаем индекс на 1
    const newTabIndex =
      this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1;

    this.activateTab(newTabIndex); // Активируем найденную вкладку
  };

  // Метод переключается на следующую вкладку
  nextTab = () => {
    // Если текущая вкладка последняя, то следующая = первая (циклично)
    // Иначе просто увеличиваем индекс на 1
    const newTabIndex =
      this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1;

    this.activateTab(newTabIndex); // Активируем найденную вкладку
  };

  // Метод активирует первую вкладку
  firstTab = () => {
    this.activateTab(0); // Индекс первой вкладки = 0
  };

  // Метод активирует последнюю вкладку
  lastTab = () => {
    this.activateTab(this.limitTabsIndex); // Индекс последней вкладки = максимальный индекс
  };

  // Метод вызывается при клике на кнопку
  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex; // Обновляем состояние: делаем активным таб с индексом buttonIndex
  }

  onKeyDown = (event) => {
    const { code, metaKey } = event; // Достаём из события код клавиши и metaKey (Command на Mac / Windows key)

    // код клавиши с действием:
    // Создаём объект соответствия кода клавиши → функция действия
    const action = {
      ArrowLeft: this.previousTab, // Стрелка влево → предыдущая вкладка
      ArrowRight: this.nextTab, // Стрелка вправо → следующая вкладка
      Home: this.firstTab, // Home → первая вкладка
      End: this.lastTab // End → последняя вкладка
    }[code]; // По ключу code выбираем функцию

    // Для Mac: если нажата стрелка влево + metaKey (Command)
    const isMacHomeKey = metaKey && code === 'ArrowLeft';
    if (isMacHomeKey) {
      this.firstTab(); // Переходим на первую вкладку
      return; // Прерываем выполнение дальше
    }

    // Для Mac: если нажата стрелка вправо + metaKey (Command)
    const isMacEndKey = metaKey && code === 'ArrowRight';
    if (isMacEndKey) {
      this.lastTab(); // Переходим на последнюю вкладку
      return; // Прерываем выполнение дальше
    }

    // Если функция существует (не undefined) → вызываем её
    action?.(); // вызывает только если action существует
  };

  // Метод "вешает" обработчики событий "click"
  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index)); // При клике вызываем onButtonClick и передаём индекс этой кнопки
    });
    this.rootElement.addEventListener('keydown', this.onKeyDown);
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
