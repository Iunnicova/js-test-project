// 10:49
//логика открытия закрытия Phone Number
//!с доработкай большего функционала работы с клавиатурой можно на сайте  https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/

// Логика открытия/закрытия и работы кастомного Select

import BaseComponent from './BaseComponent.js';
import MatchMedia from './MatchMedia.js';

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

  //! Обновление UI на основе состояния
  updateUI() {
    // 🔹 Достаём из state три свойства:
    // - isExpanded → открыт ли сейчас выпадающий список
    // - currentOptionIndex → индекс текущей активной опции
    // - selectedOptionElement → DOM-элемент выбранной опции
    const { isExpanded, currentOptionIndex, selectedOptionElement } =
      this.state;

    // 🔹 Берём текст выбранной опции (например, "Phone Number")
    // и обрезаем пробелы по краям
    const newSelectedOptionValue = selectedOptionElement.textContent.trim();

    //! Когда пользователь выбирает пункт в кастомном выпадающем списке, эта функция обновляет значение у настоящего <select>
    const updateOriginalControl = () => {
      this.originalControlElement.value = newSelectedOptionValue;
    };

    //! Обновляем кастомную кнопку
    const updateButton = () => {
      //  Вставляем в кнопку текст выбранной опции
      // Например: "Phone Number"
      this.buttonElement.textContent = newSelectedOptionValue;

      // Добавляем или убираем CSS-класс "is-expanded"
      // true → выпадающий список открыт
      // false → список закрыт
      this.buttonElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded
      );

      // Обновляем aria-атрибут "aria-expanded"
      // Нужен для доступности (screen reader понимает, открыт ли список)
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaExpanded,
        isExpanded
      );

      // Обновляем aria-атрибут "aria-activedescendant"
      // Сюда записывается id активной (текущей) опции
      // Это помогает screen reader-ам озвучивать правильный пункт при навигации
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id
      );
    };

    //! Обновляем dropdown (видимость)
    // Если isExpanded === true → к dropdownElement добавляется класс is-expanded.
    // Если isExpanded === false → класс is-expanded убирается.
    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded
      );
    };

    //! Обновляем каждую опцию
    const updateOptions = () => {
      // Перебираем все опции (каждый элемент в dropdown)
      this.optionElements.forEach((optionElement, index) => {
        // Проверяем, является ли эта опция текущей (подсвеченная стрелками/фокусом)
        const isCurrent = currentOptionIndex === index;

        // Проверяем, является ли эта опция выбранной (выбранное значение)
        const isSelected = selectedOptionElement === optionElement;

        // Добавляем/убираем класс "is-current" (для визуального выделения текущей опции)
        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);

        // Добавляем/убираем класс "is-selected" (чекбокс ✔ у выбранного элемента)
        optionElement.classList.toggle(
          this.stateClasses.isSelected,
          isSelected
        );

        // Устанавливаем атрибут aria-selected (для доступности — скринридеры поймут, какая опция выбрана)
        optionElement.setAttribute(
          this.stateAttributes.ariaSelected,
          isSelected
        );
      });
    };

    //! вызываем
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

  //! Настройка tabIndex: на мобилках используется нативный select, на десктопе — кастомный
  updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
    // 👆 Функция получает параметр isMobileDevice.
    // Если его не передали, по умолчанию берётся MatchMedia.mobile.matches
    // (true — мобильное устройство, false — десктоп).

    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1;
    // 👉 Если это мобильное устройство → ставим tabindex=0
    // (оригинальный <select> будет доступен для табуляции и может открываться).
    // Если это НЕ мобилка → tabindex=-1
    // (оригинальный <select> скрыт от клавиатуры, им нельзя пользоваться напрямую).

    this.buttonElement.tabIndex = isMobileDevice ? -1 : 0;
    // 👉 Наоборот для кастомной кнопки:
    // На мобилке → tabindex=-1 (нельзя фокусироваться на кастомной кнопке).
    // На десктопе → tabindex=0 (можно попасть в кастомный селект с клавиатуры).
  }

  //! Проверяем, нужно ли открыть список (например, при нажатии стрелок)
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

  //! УПРАВЛЕНИЕ КЛАВИАТУРОЙ

  //* Обработка клавиши "стрелка вверх"
  onArrowUpKeyDown = () => {
    // Если список закрыт, но кнопка в фокусе → открываем dropdown
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    // Иначе просто двигаем выделение на один элемент вверх
    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  };

  //* Обработка клавиши "стрелка вниз"
  onArrowDownKeyDown = () => {
    // Если список закрыт, но кнопка в фокусе → открываем dropdown
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    // Иначе двигаем выделение на один элемент вниз
    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
    }
  };

  //* Обработка клавиши "пробел"
  onSpaceKeyDown = () => {
    // Если список закрыт и кнопка в фокусе → открываем dropdown
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    // Иначе выбираем текущий элемент и закрываем dropdown
    this.selectCurrentOption();
    this.collapse();
  };

  //* Обработка клавиши "Enter"
  onEnterKeyDown = () => {
    // Если список закрыт и кнопка в фокусе → открываем dropdown
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    // Иначе выбираем текущий элемент и закрываем dropdown
    this.selectCurrentOption();
    this.collapse();
  };

  //* Главный обработчик нажатия клавиш
  onKeyDown = (event) => {
    const { code } = event;

    // Сопоставляем код клавиши с нужным методом
    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown
    }[code];

    // Если нажата "нужная" клавиша
    if (action) {
      event.preventDefault(); // отменяем стандартное поведение (например, скролл страницы пробелом)
      action(); // запускаем соответствующий метод
    }
  };

  //!метод следит за изменением ширины экрана и "переключает управление" между нативным селектом и кастомным UI.
  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches);
  };

  // Обновление при смене значения в нативном select
  onOriginalControlChange = () => {
    this.state.selectedOptionElement =
      this.optionElements[this.originalControlElement.selectedIndex];
  };

  //! Подписка на события
  bindEvents() {
    //  Подписываемся на событие "change" у медиа-запроса
    // Когда ширина экрана пересекает 767.98px — вызывается метод onMobileMatchMediaChange
    MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange);

    //  При клике на кнопку селекта (тот самый кастомный <button>)
    // будет вызываться метод onButtonClick (открыть/закрыть список)
    this.buttonElement.addEventListener('click', this.onButtonClick);

    //  Отслеживаем клики по документу
    // чтобы понять, кликнули ли ВНЕ селекта и, если да, — закрыть его
    document.addEventListener('click', this.onClick);

    //  Добавляем обработку клавиатуры (стрелки, Enter, Space)
    // это делает селект доступным для навигации без мышки
    this.rootElement.addEventListener('keydown', this.onKeyDown);

    //  Отслеживаем изменение значения у оригинального <select>
    // если его поменяли (например, с мобилки), обновляем состояние
    this.originalControlElement.addEventListener(
      'change',
      this.onOriginalControlChange
    );
  }
}

// Коллекция всех кастомных select'ов на странице у всех js одинаковый
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
