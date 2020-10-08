'use strict';

(() => {

  window.map = {

    /**
     * генерация меток на карте
     * @param {Array} - массив объектов
     */
    generatePins: (adsList) => {
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
    }
  }

  const mapPins = document.querySelector('.map__pins');
  const pinTemplate = document.querySelector('#pin');
  const map = document.querySelector('.map');
  const userPopup = document.querySelector('#card');
  const filtersContainer = document.querySelector('.map__filters-container');
  const mainPin = document.querySelector('.map__pin--main');
  const adForm = document.querySelector('.ad-form');
  const mapFilters = document.querySelector('.map__filters');
  const address = document.querySelector('#address');
  let mapPinList;

  let ads = window.data.generateAds(8);

  /**
   * ищет адрес объекта
   * @param {object} - объект, адрес которого надо найти
   */
  const getLocation = (obj) => {
    if (map.classList.contains('map--faded')){
      let left = obj.style.left = (parseInt(obj.style.left,10));
      let top =  obj.style.top = (parseInt(obj.style.top,10));
      address.value = `${left}, ${top}`
    } else {
      let left = obj.style.left = (parseInt(obj.style.left,10)) - window.PIN_OFFSET.LEFT;
      let top =  obj.style.top = (parseInt(obj.style.top,10)) - window.PIN_OFFSET.TOP;
      address.value = `${left}, ${top}`
    }
  }

  getLocation(mainPin);

  /**
   * cb для открытия карты и отрисовки меток
   */
  const activateMap = () => {
    map.classList.remove('map--faded');
    window.map.generatePins(ads);
    mapPinsClickHandler();
    window.form.checkAdFormTypeSelect();
    window.form.checkRoomNumberCapacity();
  }

  /**
   * функция для открытия popup
   * @param {number} - номер итерации цикла, перебирающего все метки на карте
   */
  const openPopupByPinClickHandler = (i) => {
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
  const mapPinsClickHandler = () => {
    mapPinList = document.querySelectorAll('.map__pin');
    for (let i = 1; i < mapPinList.length; i++) {
      /**
       * открытие popup по нажатию с мышки
       */
      mapPinList[i].addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        openPopupByPinClickHandler(i);
      });

      /**
       * открытие popup по нажатию с клавиатуры
       */
      mapPinList[i].addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') {
          openPopupByPinClickHandler(i);
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
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      deletePins();
      activateMap();
      getLocation(mainPin);
      controlInputForms('activate');
    }
  });

  /**
   * проверяет нажатие на mainPin при отключенном функционале странице по нажатию на Enter
   * @listens {click}
   */
  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.which === 1) {
      deletePins();
      activateMap();
      getLocation(mainPin);
      window.form.controlInputForms('activate');
    }
  });
})();
