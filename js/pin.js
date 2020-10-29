'use strict';

(() => {
  const mainPin = document.querySelector('.map__pin--main');
  const COORDINATES = {
    minX: -33,
    maxX: 1167,
    minY: 118,
    maxY: 618
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

      if (mainPin.offsetLeft - shift.x >= COORDINATES.minX && mainPin.offsetLeft - shift.x <= COORDINATES.maxX) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      if (mainPin.offsetTop - shift.y >= COORDINATES.minY && mainPin.offsetTop - shift.y <= COORDINATES.maxY) {
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
