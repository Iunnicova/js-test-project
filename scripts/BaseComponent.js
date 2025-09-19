// 10:58 абстрактный класс который будет содержать метод getProxyState

class BaseComponent {
  constructor() {
    // Проверка: если пытаемся создать экземпляр именно BaseComponent (а не наследника),
    // то выбрасываем ошибку. Это делает класс "абстрактным".
    if (this.constructor === BaseComponent) {
      throw new Error(
        'Невозможно создать экземпляр абстрактного класса BaseComponent!'
      );
    }
  }

  getProxyState(initialState) {
    // Метод создаёт Proxy над объектом состояния (initialState).
    // Proxy позволяет отследить любые чтения и изменения свойств объекта.
    return new Proxy(initialState, {
      // "get" перехватывает доступ к свойствам state (например: this.state.isExpanded).
      get: (target, prop) => {
        return target[prop]; // просто возвращаем значение свойства
      },
      // "set" перехватывает присвоения (например: this.state.isExpanded = true).
      set: (target, prop, newValue) => {
        const oldValue = target[prop]; // сохраняем старое значение свойства

        target[prop] = newValue; // обновляем значение свойства в state

        // Если новое значение отличается от старого, вызываем updateUI(),
        // чтобы обновить интерфейс.
        if (newValue !== oldValue) {
          this.updateUI(); // После изменения состояния автоматически обновляем интерфейс
        }

        return true; // обязательно возвращаем true, чтобы присвоение прошло успешно
      }
    });
  }

  /**
   * Абстрактный метод, который нужно реализовать в классе-наследнике.
   * * Перерисовка UI в ответ на обновление состояния
   * Он будет вызван автоматически при изменении state (через Proxy).
   * обновляется кнопка, список и выделенные элементы.
   */
  updateUI() {
    throw new Error('Необходимо реализовать метод updateUI!');
  }
}

export default BaseComponent;
