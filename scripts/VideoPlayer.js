// 🔹 Объявляется константа rootSelector, содержащая CSS-селектор для поиска корневого DOM-элемента видеоплеера.
// ➡️ Атрибут data-js-video-player используется как "якорь" для инициализации всех видеоплееров на странице.
const rootSelector = '[data-js-video-player]';

class VideoPlayer {
  // 🔹 Создаётся поле selectors — объект с CSS-селекторами для поиска вложенных элементов внутри одного плеера.
  selectors = {
    root: rootSelector, // Селектор корневого элемента плеера
    video: '[data-js-video-player-video]', // Селектор для видеоэлемента <video>
    panel: '[data-js-video-player-panel]', // Селектор панели управления (UI)
    playButton: '[data-js-video-player-play-button]' // Селектор кнопки воспроизведения
  };

  // 🔹 Создаётся поле stateClasses, содержащее классы состояний плеера.
  stateClasses = {
    isActive: 'is-active' // Класс, указывающий на активное состояние элемента (например, панель управления)
  };

  // 🔹 Конструктор класса VideoPlayer. Принимает rootElement — корневой DOM-элемент плеера.
  constructor(rootElement) {
    this.rootElement = rootElement; // Сохраняем корневой элемент

    // 🔹 Находим вложенные элементы внутри плеера:
    this.videoElement = this.rootElement.querySelector(this.selectors.video); // Видеоэлемент
    this.panelElement = this.rootElement.querySelector(this.selectors.panel); // Панель управления
    this.playButtonElement = this.rootElement.querySelector(
      this.selectors.playButton
    ); // Кнопка воспроизведения
    this.bindEvents(); //привязываем обработчики событий к элементам
  }

  //Этот метод вызывается при нажатии на кнопку "Play"
  onPlayButtonClick = () => {
    this.videoElement.play(); //Запускаем воспроизведение видео
    this.videoElement.controls = true; //Показываем встроенные браузерные элементы управления
    this.panelElement.classList.remove(this.stateClasses.isActive); //❌ Скрываем кастомную панель управления
  };

  //Этот метод вызывается, когда видео останавливается (например, пользователь нажал "Пауза")
  onVideoPause = () => {
    this.videoElement.controls = false; //❌ Скрываем встроенные браузерные элементы управления
    this.panelElement.classList.add(this.stateClasses.isActive); // ✅ Показываем панель управления
  };

  //привязываем обработчики событий к элементам
  bindEvents() {
    this.playButtonElement.addEventListener('click', this.onPlayButtonClick); // ▶️ Обработка клика по кнопке "Play"
    this.videoElement.addEventListener('pause', this.onVideoPause); // ⏸️ Обработка события паузы видео
  }
}

// 🔹 Класс VideoPlayerCollection управляет коллекцией всех видеоплееров на странице.
class VideoPlayerCollection {
  constructor() {
    this.init(); //  При создании экземпляра вызываем метод init()
  }

  // 🔹 Метод init находит все элементы, подходящие под rootSelector.
  // Для каждого найденного элемента создаётся экземпляр VideoPlayer.
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new VideoPlayer(element); //  Инициализируем каждый видеоплеер по отдельности
    });
  }
}

export default VideoPlayerCollection; //Экспортируется класс VideoPlayerCollection по умолчанию,
