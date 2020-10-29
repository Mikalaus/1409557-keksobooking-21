'use strict';

(() => {

  const RIGHT_CLICK_MOUSE = 1;
  const ENTER = 'Enter';

  const mapPins = document.querySelector('.map__pins');
  const pinTemplate = document.querySelector('#pin');
  const map = document.querySelector('.map');
  const userPopup = document.querySelector('#card');
  const filtersContainer = document.querySelector('.map__filters-container');
  const mainPin = document.querySelector('.map__pin--main');
  const adForm = document.querySelector('.ad-form');
  const mapFilters = document.querySelector('.map__filters');
  const address = document.querySelector('#address');
  const adFormTitle = document.querySelector('#title');
  const adFormPrice = document.querySelector('#price');
  let mapPinList;

  /**
   * Функция получения дефолтных(начальных) координат метки
   * @param {object} - метка
   */
  const getStartLocation = (obj) => {
    let left = obj.style.left = (parseInt(obj.style.left,10));
    let top =  obj.style.top = (parseInt(obj.style.top,10));
    address.value = `${left}, ${top}`
  }

  getStartLocation(mainPin);

  /**
   * Функция получения координат метки
   * @param {object} - метка
   */
  const getLocation = (obj) => {
    let left = (parseInt(obj.style.left,10)) + window.form.PIN_OFFSET.LEFT;
    let top = (parseInt(obj.style.top,10)) + window.form.PIN_OFFSET.TOP;
    address.value = `${left}, ${top}`
  }

  /**
   * cb для открытия карты и отрисовки меток
   */
  const activateMap = () => {
    map.classList.remove('map--faded');
    window.backend.load(

      /**
       * генерация меток на карте
       * @param {Array} - массив объектов
       */
      (adsList) => {
      let pinsList = document.createDocumentFragment();
      for (let i = 0; i < adsList.length; i++) {
        let pin = pinTemplate.content.cloneNode(true);
        let mapPin = pin.querySelector('.map__pin');
        let mapPinImg = pin.querySelector('.map__pin img');
        mapPin.style.left = `${adsList[i].location.x}px`;
        mapPin.style.top = `${adsList[i].location.y}px`;
        mapPinImg.src = adsList[i].author.avatar;
        mapPinImg.alt = adsList[i].offer.title;
        pinsList.appendChild(pin);
        /**
         * открытие popup по нажатию с мышки
         */
        mapPin.addEventListener('mousedown', (evt) => {
          evt.preventDefault();
          openPopupByPinClick(i, adsList);
        });

        /**
         * открытие popup по нажатию с клавиатуры
         */
        mapPin.addEventListener('keydown', (evt) => {
          if (evt.key === ENTER) {
            openPopupByPinClick(i, adsList);
          }
        });
      }

      mapPins.appendChild(pinsList);

    });
    window.form.checkAdFormTypeSelect();
    window.form.checkRoomNumberCapacity();
    window.form.controlInputForms(true);
  }

  const disableMap = () => {
    map.classList.add('map--faded');
    window.form.controlInputForms(false);
    deletePins();
    mainPin.style.left = '570px';
    mainPin.style.top = '375px';
    getLocation(mainPin);
    mainPin.addEventListener('keydown', mainPinActivateHandler);
    mainPin.addEventListener('mousedown', mainPinActivateHandler);
  }

  /**
   * функция для открытия popup
   * @param {number} - номер итерации цикла, перебирающего все метки на карте
   */
  const openPopupByPinClick = (i, ads) => {
    let popup = document.querySelector('.popup');
    if (popup !== null) {
      popup.remove();
    }
    map.insertBefore(window.card.generateAd(ads[i]), filtersContainer);
    popup = document.querySelector('.popup');

    /**
     * удаление popup по нажатию на крестик
     */
    popup.querySelector('.popup__close').addEventListener('click', (evt) => {
      evt.preventDefault();
      popup.remove();
    });
  }

  /**
   * удаление всех загружаемых меток на карте
   */
  const deletePins = () => {
    let pins = mapPins.querySelectorAll('button:not(.map__pin--main)');

    for (let i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  const mainPinActivateHandler = (evt) => {
    if (evt.key === ENTER || evt.which === RIGHT_CLICK_MOUSE) {
      activateMap();
      getLocation(mainPin);
      mainPin.removeEventListener('keydown', mainPinActivateHandler);
      mainPin.removeEventListener('mousedown', mainPinActivateHandler);
    }
  }

  /**
   * проверяет нажатие на mainPin при отключенном функционале странице по нажатию на Enter
   * @listens {keydown}
   */
  mainPin.addEventListener('keydown', mainPinActivateHandler);

  /**
   * проверяет нажатие на mainPin при отключенном функционале странице по нажатию на Enter
   * @listens {click}
   */
  mainPin.addEventListener('mousedown', mainPinActivateHandler);

  window.map = {

    getLocation: getLocation,
    disable: disableMap
  }
})();
