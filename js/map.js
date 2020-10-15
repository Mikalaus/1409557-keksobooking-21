'use strict';

(() => {

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

  const RIGHT_CLICK_MOUSE = 1;
  const ENTER = 'Enter';

  /**
   * генерация меток на карте
   * @param {Array} - массив объектов
   */
  const generatePins = (adsList) => {
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
    }

    mapPins.appendChild(pinsList);

    clickMapPins(adsList);
  }

  /**
   * Функция получения координат метки
   * @param {object} - метка
   */
  const getLocation = (obj) => {
    if (map.classList.contains('map--faded')){
      let left = obj.style.left = (parseInt(obj.style.left,10));
      let top =  obj.style.top = (parseInt(obj.style.top,10));
      address.value = `${left}, ${top}`
    } else {
      let left = (parseInt(obj.style.left,10)) + window.form.PIN_OFFSET.LEFT;
      let top = (parseInt(obj.style.top,10)) + window.form.PIN_OFFSET.TOP;
      address.value = `${left}, ${top}`
    }
  }

  getLocation(mainPin);

  /**
   * cb для открытия карты и отрисовки меток
   */
  const activateMap = () => {
    map.classList.remove('map--faded');
    window.backend.load();
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
    map.insertBefore(window.card.generateAd(ads[i-1]), filtersContainer);
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
   * функция для добавления EventListener на метки объявления, для открытия ads
   */
  const clickMapPins = (ads) => {
    mapPinList = document.querySelectorAll('.map__pin');
    for (let i = 1; i < mapPinList.length; i++) {
      /**
       * открытие popup по нажатию с мышки
       */
      mapPinList[i].addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        openPopupByPinClick(i, ads);
      });

      /**
       * открытие popup по нажатию с клавиатуры
       */
      mapPinList[i].addEventListener('keydown', (evt) => {
        if (evt.key === ENTER) {
          openPopupByPinClick(i);
        }
      });
    }
  }

  /**
   * удаление всех загружаемых меток на карте
   */
  const deletePins = () => {
    let pins = mapPins.querySelectorAll('button');

    for (let i = 1; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  /**
   * проверяет нажатие на mainPin при отключенном функционале странице по нажатию на Enter
   * @listens {keydown}
   */
  mainPin.addEventListener('keydown', (evt) => {
    if (evt.key === ENTER) {
      deletePins();
      activateMap();
      getLocation(mainPin);
    }
  });

  /**
   * проверяет нажатие на mainPin при отключенном функционале странице по нажатию на Enter
   * @listens {click}
   */
  mainPin.addEventListener('mousedown', (evt) => {
    if (evt.which === RIGHT_CLICK_MOUSE) {
      deletePins();
      activateMap();
      getLocation(mainPin);
    }
  });

  window.map = {

    generatePins: generatePins,
    getLocation: getLocation,
    disableMap: disableMap
  }
})();
