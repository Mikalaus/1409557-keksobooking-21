'use strict';

(() => {
  const mainPin = document.querySelector('.map__pin--main');
  const COORDINATES = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  }

  const MAIN_PIN_SIZE = {
    WIDTH: 66,
    HEIGHT: 24
  }

  /**
   * Функция подсчета координат метки пользователя и перемещения ее по карте
   */
  mainPin.addEventListener('mousedown', (evt) => {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const mouseMoveHandler = (moveEvt) => {
      moveEvt.preventDefault();

      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mainPin.offsetLeft - shift.x >= COORDINATES.MIN_X - MAIN_PIN_SIZE.WIDTH / 2 &&
          mainPin.offsetLeft - shift.x <= COORDINATES.MAX_X - MAIN_PIN_SIZE.WIDTH / 2)
      {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      if (mainPin.offsetTop - shift.y >= COORDINATES.MIN_Y - MAIN_PIN_SIZE.HEIGHT / 2 &&
          mainPin.offsetTop - shift.y <= COORDINATES.MAX_Y - MAIN_PIN_SIZE.HEIGHT / 2)
      {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }

      window.map.getLocation(mainPin);
    };

    const mouseUpHandler = (upEvt) => {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  })
})();
