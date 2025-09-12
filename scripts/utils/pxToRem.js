//Пиксили в rem

const pxToRem = (pixels) => {
  return pixels / 16; //Эта строка выполняет основную функцию функции: она делит количество пикселей ( pixels) на 16. Результат этого деления — это количество rem.
};

export default pxToRem;
