// 10:49
//логика открытия закрытия Phone Number

// Логика открытия/закрытия и работы кастомного Select

import BaseComponent from './BaseComponent.js';
import MatchMedia from './MatchMedia.js'

const rootSelector = '[data-js-select]';

class Select extends BaseComponent {
  // поля Селекторы для поиска нужных частей внутри компонента
  selectors = {
    root: rootSelector, // сам компонент
    originalControl: '[data-js-select-original-control]', // скрытый нативный <select>
    button: '[data-js-select-button]', // кастомная кнопка (открывает/закрывает список)
    dropdown: '[data-js-select-dropdown]', // выпадающий список
    option: '[data-js-select-option]' // отдельный пункт списка
  };

  // CSS-классы для управления состояниями
  stateClasses = {
    isExpanded: 'is-expanded', // открыт/закрыт список
    isSelected: 'is-selected', // выбранный элемент
    isCurrent: 'is-current', // подсвеченный (фокус/навигация клавиатурой)
    isOnTheLeftSide: 'is-on-the-left-side', // дропдаун открыт слева
    isOnTheRightSide: 'is-on-the-right-side' // дропдаун открыт справа
  };

  // Атрибуты ARIA для доступности
  stateAttributes = {
    ariaExpanded: 'aria-expanded', // открыт ли список
    ariaSelected: 'aria-selected', // выбран ли элемент
    ariaActiveDescendant: 'aria-activedescendant' // какой элемент сейчас активен
  };

  // Начальное состояние компонента
  initialState = {
    isExpanded: false, // изначально список закрыт
    currentOptionIndex: null, // индекс текущей опции
    selectedOptionElement: null // DOM-элемент выбранной опции
  };

  constructor(rootElement) {
    super(); //вызываеи ' '
    this.rootElement = rootElement;

    // Находим части компонента
    // Находим нативный <select>, который скрывается (для мобильных он остаётся рабочим).
    this.originalControlElement = this.rootElement.querySelector(
      this.selectors.originalControl
    );

    // Находим кастомную кнопку, по клику на неё открывается/закрывается список.
    this.buttonElement = this.rootElement.querySelector(this.selectors.button);

    // Находим выпадающий список (контейнер для всех опций).
    this.dropdownElement = this.rootElement.querySelector(
      this.selectors.dropdown
    );

    // Находим все опции внутри выпадающего списка (NodeList из пунктов).
    this.optionElements = this.dropdownElement.querySelectorAll(
      this.selectors.option
    );

    // Текущее состояние (берем выбранный элемент из нативного select) обновление интерфейс
    this.state = this.getProxyState({
      ...this.initialState, // берём базовое начальное состояние isExpanded: false, currentOptionIndex: null, selectedOptionElement: null
      currentOptionIndex: this.originalControlElement.selectedIndex, // индекс выбранного элемента из нативного <select>
      selectedOptionElement:
        this.optionElements[this.originalControlElement.selectedIndex] // сама DOM-опция (li/div), соответствующая выбранному элементу
    });

    this.fixDropdownPosition(); // проверяем с какой стороны открыть список
    this.updateTabIndexes(); // настраиваем tabIndex для мобильных/desktop
    this.bindEvents(); // вешаем все события
  }

  // Обновление UI на основе состояния
  updateUI() {
    const { isExpanded, currentOptionIndex, selectedOptionElement } =
      this.state;

    const newSelectedOptionValue = selectedOptionElement.textContent.trim();

    // Обновляем скрытый <select>
    const updateOriginalControl = () => {
      this.originalControlElement.value = newSelectedOptionValue;
    };

    // Обновляем кастомную кнопку
    const updateButton = () => {
      this.buttonElement.textContent = newSelectedOptionValue;
      this.buttonElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaExpanded,
        isExpanded
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id
      );
    };

    // Обновляем dropdown (видимость)
    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded
      );
    };

    // Обновляем каждую опцию
    const updateOptions = () => {
      this.optionElements.forEach((optionElement, index) => {
        const isCurrent = currentOptionIndex === index;
        const isSelected = selectedOptionElement === optionElement;

        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
        optionElement.classList.toggle(
          this.stateClasses.isSelected,
          isSelected
        );
        optionElement.setAttribute(
          this.stateAttributes.ariaSelected,
          isSelected
        );
      });
    };

    // Запускаем обновления
    updateOriginalControl();
    updateButton();
    updateDropdown();
    updateOptions();
  }

  // --- Управление состоянием открытия/закрытия ---
  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
  }

  expand() {
    this.state.isExpanded = true;
  }

  collapse() {
    this.state.isExpanded = false;
  }

  // Определяем, где открывать dropdown (слева или справа)
  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth;
    const halfViewportX = viewportWidth / 2;
    const { width, x } = this.buttonElement.getBoundingClientRect();
    const buttonCenterX = x + width / 2;
    const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX;

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isButtonOnTheLeftViewportSide
    );

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isButtonOnTheLeftViewportSide
    );
  }

  // Настройка tabIndex: на мобилках используется нативный select, на десктопе — кастомный
  updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1;
    this.buttonElement.tabIndex = isMobileDevice ? -1 : 0;
  }

  // Проверяем, нужно ли открыть список (например, при нажатии стрелок)
  get isNeedToExpand() {
    const isButtonFocused = document.activeElement === this.buttonElement;
    return !this.state.isExpanded && isButtonFocused;
  }

  // Устанавливаем выбранный элемент как текущий
  selectCurrentOption() {
    this.state.selectedOptionElement =
      this.optionElements[this.state.currentOptionIndex];
  }

  // --- Обработчики событий ---
  onButtonClick = () => {
    this.toggleExpandedState();
  };

  onClick = (event) => {
    const { target } = event;

    const isButtonClick = target === this.buttonElement;
    const isOutsideDropdownClick =
      target.closest(this.selectors.dropdown) !== this.dropdownElement;

    // Клик вне списка → закрываем
    if (!isButtonClick && isOutsideDropdownClick) {
      this.collapse();
      return;
    }

    // Клик по опции → выбираем
    const isOptionClick = target.matches(this.selectors.option);
    if (isOptionClick) {
      this.state.selectedOptionElement = target;
      this.state.currentOptionIndex = [...this.optionElements].findIndex(
        (optionElement) => optionElement === target
      );
      this.collapse();
    }
  };

  // Управление клавиатурой
  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  };

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
    }
  };

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.selectCurrentOption();
    this.collapse();
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.selectCurrentOption();
    this.collapse();
  };

  onKeyDown = (event) => {
    const { code } = event;

    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown
    }[code];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  // Переключение tabIndex при изменении размера экрана
  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches);
  };

  // Обновление при смене значения в нативном select
  onOriginalControlChange = () => {
    this.state.selectedOptionElement =
      this.optionElements[this.originalControlElement.selectedIndex];
  };

  // Подписка на события
  bindEvents() {
    MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange);
    this.buttonElement.addEventListener('click', this.onButtonClick);
    document.addEventListener('click', this.onClick);
    this.rootElement.addEventListener('keydown', this.onKeyDown);
    this.originalControlElement.addEventListener(
      'change',
      this.onOriginalControlChange
    );
  }
}

// Коллекция всех кастомных select'ов на странице
class SelectCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Select(element);
    });
  }
}

export default SelectCollection;
