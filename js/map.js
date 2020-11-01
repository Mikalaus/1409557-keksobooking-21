'use strict';

const RIGHT_CLICK_MOUSE = 1;
const ENTER = 'Enter';
const SPACE = 32

const pinOffset = {
  LEFT: 33,
  TOP: 12
};

const mapPins = document.querySelector('.map__pins');
const pinTemplate = document.querySelector('#pin');
const map = document.querySelector('.map');

const filtersContainer = document.querySelector('.map__filters-container');
const mainPin = document.querySelector('.map__pin--main');
const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const address = document.querySelector('#address');

const filtersSelectList = mapFilters.querySelectorAll('select');
const housingFeaturesSelect = mapFilters.querySelectorAll('#housing-features input');
const avatarPreview = document.querySelector('.ad-form-header__preview img');
const houseImagePreview = document.querySelector('.ad-form__photo');
let xhrData;

/**
 * cb для рендера объявлений при фильтрации
 */
const switchSelectHandler = () => {
  removeAdPopup();
  window.debounce(window.map.generatePins(window.render.ads(xhrData)));
};

/**
 * навешивание EventListener на все select формы фильтрации
 */
filtersSelectList.forEach((filter) => {
  filter.addEventListener('change', switchSelectHandler);
});

/**
 * навешивание EventListener на все checkbox формы фильтрации
 */
housingFeaturesSelect.forEach((filter) => {
  filter.addEventListener('click', () => {

    filter.classList.toggle('checked');

    removeAdPopup();
    window.debounce(window.map.generatePins(window.render.ads(xhrData, housingFeaturesSelect)));
  });
});

/**
 * Функция получения дефолтных(начальных) координат метки
 * @param {object} - метка
 */
const getStartLocation = (obj) => {
  let left = obj.style.left = (parseInt(obj.style.left, 10));
  let top = obj.style.top = (parseInt(obj.style.top, 10));
  address.value = `${left}, ${top}`;
};

getStartLocation(mainPin);

/**
 * Функция получения координат метки
 * @param {object} - метка
 */
const getLocation = (obj) => {
  let left = (parseInt(obj.style.left, 10)) + pinOffset.LEFT;
  let top = (parseInt(obj.style.top, 10)) + pinOffset.TOP;
  address.value = `${left}, ${top}`;
};

/**
 * генерация меток на карте
 * @param {Array} - массив объектов
 */
const generatePins = (adsList) => {
  deletePins();
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
     * открытие popup по нажатию с мышки и клавиатуры
     */
    mapPin.addEventListener('click', (evt) => {
      if (evt.which !== SPACE) {
        openPopupByPinClick(i, adsList);
      }
    });
  }

  mapPins.appendChild(pinsList);
};

/**
 * cb для открытия карты и отрисовки меток
 */
const activateMap = () => {
  map.classList.remove('map--faded');
  window.backend.load((adsList) => {
    window.map.generatePins(window.render.ads(adsList, housingFeaturesSelect));
    xhrData = adsList;
  });
  window.form.checkAdFormTypeSelect();
  window.form.checkRoomNumberCapacity();
  window.form.controlInputs(true);
};

const disableMap = () => {
  map.classList.add('map--faded');
  window.form.controlInputs(false);
  deletePins();
  getLocation(mainPin);
  removeAdPopup();
  mainPin.addEventListener('keydown', mainPinActivateHandler);
  mainPin.addEventListener('mousedown', mainPinActivateHandler);
  adForm.reset();
  mapFilters.reset();
  mainPin.style.left = '570px';
  mainPin.style.top = '375px';
  getStartLocation(mainPin);
  houseImagePreview.style.backgroundImage = 'none';
  avatarPreview.src = 'img/muffin-grey.svg';
};

const removeAdPopup = () => {
  let popup = document.querySelector('.popup');
  if (popup !== null) {
    popup.remove();
  }
};

/**
 * функция для открытия popup
 * @param {number} - номер итерации цикла, перебирающего все метки на карте
 * @param {Array} - массив карточек объявлений
 */
const openPopupByPinClick = (i, ads) => {
  removeAdPopup();
  map.insertBefore(window.card.generateAd(ads[i]), filtersContainer);
  let popup = document.querySelector('.popup');

  /**
   * удаление popup по нажатию на крестик
   */
  popup.querySelector('.popup__close').addEventListener('click', (evt) => {
    evt.preventDefault();
    popup.remove();
  });
};

/**
 * удаление всех загружаемых меток на карте
 */
const deletePins = () => {
  let pins = mapPins.querySelectorAll('button:not(.map__pin--main)');

  for (let i = 0; i < pins.length; i++) {
    pins[i].remove();
  }
};

const mainPinActivateHandler = (evt) => {
  if (evt.key === ENTER || evt.which === RIGHT_CLICK_MOUSE) {
    activateMap();
    getLocation(mainPin);
    mainPin.removeEventListener('keydown', mainPinActivateHandler);
    mainPin.removeEventListener('mousedown', mainPinActivateHandler);
  }
};

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

  generatePins: generatePins,
  getLocation: getLocation,
  disable: disableMap
};
