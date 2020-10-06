'use strict';

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
const adFormTypeSelect = document.querySelector('#type');
const adFormTimeIn = document.querySelector('#timein');
const adFormTimeInOptions = adFormTimeIn.querySelectorAll('option');
const adFormTimeOut = document.querySelector('#timeout');
const adFormTimeOutOptions = adFormTimeOut.querySelectorAll('option');

const roomNumber = document.querySelector('#room_number');
const roomNumberOptions = roomNumber.querySelectorAll('option');
const capacity = document.querySelector('#capacity')
const capacityOptions = capacity.querySelectorAll('option');

const mapFilterList = document.querySelectorAll('.map__filter');
const mapFeatures = document.querySelector('.map__features');
const adFormHeader = document.querySelector('.ad-form-header');
const adFormElements = document.querySelectorAll('.ad-form__element');

let mapPinList;

const PIN_OFFSET = {
  LEFT: 21,
  TOP: 22
}

/**
 * минимальные стоимости проживания за одну ночь
 * @type {Object}
 */
const MIN_PRICE = {
  BUNGALOW: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000
}

/**
 * Ограничения по вводу в главное описание добавляемого объявления
 * @type {Object}
 */
const TITLE_LENGTH = {
  MIN: 30,
  MAX: 100
}

/**
 * @type {number}
 * максимальная цена за одну ночь
 */
const MAX_PRICE = 1000000;

/**
 * проверяет валидность описания размещаемого объявления
 * @listens {input}
 */
adFormTitle.addEventListener('input', () => {
  let valueLength = adFormTitle.value.length;

  if (valueLength < TITLE_LENGTH.MIN) {
    adFormTitle.setCustomValidity('Ещё ' + (TITLE_LENGTH.MIN - valueLength) +' симв.');
  } else if (valueLength > TITLE_LENGTH.MAX) {
    adFormTitle.setCustomValidity('Удалите лишние ' + (valueLength - TITLE_LENGTH.MAX) +' симв.');
  } else {
    adFormTitle.setCustomValidity('');
  }

  adFormTitle.reportValidity();
});

/**
 * проверяет валидность введеного значения цены за ночь
 * @listens {input}
 */
adFormPrice.addEventListener('input', () => {
  let price = adFormPrice.value;
  let type = adFormTypeSelect.value;

  if (price > MAX_PRICE) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение превышающее ${MAX_PRICE}`);
  } else if (adFormPrice.validity.valueMissing) {
    adFormPrice.setCustomValidity('Введите стоимость проживания за ночь');
  } else {
    adFormPrice.setCustomValidity('');
  }

  if (type === 'bungalow' && price < MIN_PRICE.BUNGALOW) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.BUNGALOW}`);
    adFormPrice.placeholder = `${MIN_PRICE.BUNGALOW}`
  } else if (type === 'flat' && price < MIN_PRICE.FLAT) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.FLAT}`);
    adFormPrice.placeholder = `${MIN_PRICE.FLAT}`
  } else if (type === 'house' && price < MIN_PRICE.HOUSE) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.HOUSE}`);
    adFormPrice.placeholder = `${MIN_PRICE.HOUSE}`
  } else if (type === 'palace' && price < MIN_PRICE.PALACE) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.PALACE}`);
    adFormPrice.placeholder = `${MIN_PRICE.PALACE}`
  }

  adFormPrice.reportValidity();
});

const checkAdFormTypeSelect = () => {
  let type = adFormTypeSelect.value;
  if (type === 'bungalow') {
    adFormPrice.placeholder = `${MIN_PRICE.BUNGALOW}`
  } else if (type === 'flat') {
    adFormPrice.placeholder = `${MIN_PRICE.FLAT}`
  } else if (type === 'house') {
    adFormPrice.placeholder = `${MIN_PRICE.HOUSE}`
  } else if (type === 'palace') {
    adFormPrice.placeholder = `${MIN_PRICE.PALACE}`
  }
}

/**
 * проверяет value у select типов домов, изменяет значение placeholder у adFormPrice
 * @listens {change}
 */
adFormTypeSelect.addEventListener('change', () => {
  checkAdFormTypeSelect();
});

/**
 * проверяет value у adFormTimeIn, изменяет значение adFormTimeOut
 * @listens {change}
 */
adFormTimeIn.addEventListener('change', () => {
  let time = adFormTimeIn.value;
  adFormTimeOutOptions.forEach((timeOutOption) => {
    timeOutOption.removeAttribute('selected');
    if (timeOutOption.value === time) {
      timeOutOption.selected = 'selected';
    }
  });

  adFormTimeInOptions.forEach((timeInOption) => {
    timeInOption.removeAttribute('selected');
    if (timeInOption.value === time) {
      timeInOption.selected = 'selected';
    }
  });

});

/**
 * проверяет value у adFormTimeOut, изменяет значение adFormTimeIn
 * @listens {change}
 */
adFormTimeOut.addEventListener('change', () => {
  let time = adFormTimeOut.value;
  adFormTimeInOptions.forEach((timeInOption) => {
    timeInOption.removeAttribute('selected');
    if (timeInOption.value === time) {
      timeInOption.selected = 'selected';
    }
  });

  adFormTimeOutOptions.forEach((timeOutOption) => {
    timeOutOption.removeAttribute('selected');
    if (timeOutOption.value === time) {
      timeOutOption.selected = 'selected';
    }
  });

});

const checkRoomNumberCapacity = () => {
  let number = roomNumber.value;

  capacityOptions.forEach((capacityOption) => {
    capacityOption.setAttribute('disabled', 'disabled');
    capacityOption.removeAttribute('selected');
    if (capacityOption.value <= number && capacityOption.value !== '0' && number !== '100') {
      capacityOption.removeAttribute('disabled');
      capacityOption.selected = 'selected';
    } else if (number === '100' && capacityOption.value === '0') {
      capacityOption.removeAttribute('disabled');
      capacityOption.selected = 'selected';
    }
  });
}

/**
 * проверяет валидность соотношения значений roomNumber и capacity
 * @listens {change}
 */
roomNumber.addEventListener('change', () => {
  checkRoomNumberCapacity();
});

/**
 * дезактивация полей ввода
 * @param {string} - значение активации или дезактивации
 */
const controlInputForms = (control) => {

  if (control === 'activate') {
    adForm.classList.remove('ad-form--disabled')
    adFormHeader.removeAttribute('disabled');
    mapFeatures.removeAttribute('disabled');

    mapFilterList.forEach((filter) => {
      filter.removeAttribute('disabled');
    });

    adFormElements.forEach((element) => {
      element.removeAttribute('disabled');
    });

  } else if (control === 'disable') {
    adForm.classList.add('ad-form--disabled')
    adFormHeader.setAttribute('disabled', 'disabled');
    mapFeatures.setAttribute('disabled', 'disabled');

    mapFilterList.forEach((filter) => {
      filter.setAttribute('disabled', 'disabled');
    });

    adFormElements.forEach((element) => {
      element.setAttribute('disabled', 'disabled');
    });
  } else {
    alert('Введено неверное значение атрибута');
  }
}

controlInputForms('disable');

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
    let left = obj.style.left = (parseInt(obj.style.left,10)) - PIN_OFFSET.LEFT;
    let top =  obj.style.top = (parseInt(obj.style.top,10)) - PIN_OFFSET.TOP;
    address.value = `${left}, ${top}`
  }
}

getLocation(mainPin);

/**
 * cb для открытия карты и отрисовки меток
 */
const activateMap = () => {
  map.classList.remove('map--faded');
  generatePins(ads);
  mapPinsClickHandler();
  checkAdFormTypeSelect();
  checkRoomNumberCapacity();
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
  map.insertBefore(generateAd(ads[i-1]), filtersContainer);
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
    controlInputForms('activate');
  }
});


/**
 * типы домов
 * @type {Array}
 */
const HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalow'];

/**
 * доп возможности
 * @type {Array}
 */
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']

/**
 * адреса фотографий
 * @type {Array}
 */
const IMAGE_URLS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                    'http://o0.github.io/assets/images/tokyo/hotel3.jpg']

/**
 * генерация случайного числа
 * @param {number} - минимальное значение
 * @param {number} - максимальное значение
 * @return {number} - случайное число
 */
const getRandomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

/**
 * генерация типа дома
 * @param {Array} - массив видов домов
 * @return {string} - вид дома
 */
const getRoomType = (houseTypeArray) => {
  let houseType = houseTypeArray[getRandomInteger(0, houseTypeArray.length - 1)];
  return houseType;
}

/**
 * создание случайного массива из переданного
 * @param {Array} - какой-то заданный массив
 * @return {Array} - массив случайных элементов из переданного
 */
 const getUserArray = (someArray) => {
   let elementsAmount = getRandomInteger(0, someArray.length - 1)
   let someArrayCopy = someArray.slice();
   let userArray = [];
   while (userArray.length !== elementsAmount) {
     let randomElementIndex = getRandomInteger(0, someArrayCopy.length - 1);
     let randomElement = someArrayCopy[randomElementIndex];
     someArrayCopy.splice(randomElementIndex, 1);
     userArray.push(randomElement);
   }
   return userArray;
 }

/**
 * генерация массива с информацией об объявлениях
 * @param {number} - кол-во создаваемых объявлений
 * @return {Array} - массив объявлений
 */
const generateAds = (adsAmount) => {
  let adsList = [];
  for (let i = 0; i < adsAmount; i++) {
    let x = getRandomInteger(50, 1150);
    let y = getRandomInteger(130, 630);
    let user = {
      author: {
        avatar: `img/avatars/user0${i+1}.png`
      },

      offer: {
          title: 'Lorem ipsum dolor sit amet',
          address: `${x + 21}, ${y - 22}`,
          price: getRandomInteger(0, 100000),
          type: getRoomType(HOUSE_TYPE),
          rooms: getRandomInteger(0, 100),
          guests: getRandomInteger(0, 100),
          checkin: `${getRandomInteger(12, 14)}:00`,
          checkout: `${getRandomInteger(12, 14)}:00`,
          features: getUserArray(FEATURES),
          description: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot',
          photos: getUserArray(IMAGE_URLS)
      },

      location: {
          x: x,
          y: y
      }
    }

    adsList.push(user);
  }

  return adsList;
}

let ads = generateAds(8);

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
}

/**
 * отображение доп возможностей через разметку из массива доп возможностей объявления
 * @param {element} - создаваемый элемент разметки (popup)
 * @param {Array} - массив элементов разметки доп возможностей
 * @param {Array} - массив доп возможностей пользователя
 */
const transformFeatures = (popup, htmlFeaturesArray, features) => {
  if (features.length > 0) {
    for (let i = 0; i < htmlFeaturesArray.length; i++) {
      let fix = 0;
      for (let f = 0; f < features.length; f++) {
        if (htmlFeaturesArray[i].classList.contains(`popup__feature--${features[f]}`) === false) {
          fix++;
          if (fix === features.length) {
            htmlFeaturesArray[i].remove();
          }
        } else {
          break
        }
      }
    }
  } else {
    popup.querySelector('.popup__features').remove();
  }
}

/**
 * отображение изображений через разметку из массива изображений объявления
 * @param {Array} - массив фотографий объявления
 */
const transformImages = (popup, images) => {
  let popupPhotos = popup.querySelector('.popup__photos');
  let popupPhoto = popup.querySelector('.popup__photo');
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      if (i === 0) {
        popupPhoto.src = images[i];
      } else {
        let image = document.createElement('img');
        image.width = '45';
        image.height = '40';
        image.classList.add('popup__photo');
        image.src = images[i];
        image.alt= 'Фотография жилья';
        popupPhotos.appendChild(image);
      }
    }
  } else {
    popupPhotos.remove();
  }
}

/**
 * генерация объявления на карте
 * @param {object} - объект создаваемого объявления
 * @return {element} - объявление
 */
const generateAd = (ad) => {
  let popup = userPopup.content.cloneNode(true);
  let popupFeatures = popup.querySelectorAll('.popup__feature');

  popup.querySelector('.popup__title').textContent = ad.offer.title;
  popup.querySelector('.popup__text--address').textContent = ad.offer.address;
  popup.querySelector('.popup__text--price').textContent = `${ad.offer.price}₽/ночь`;
  popup.querySelector('.popup__type').textContent = ad.offer.type;
  popup.querySelector('.popup__text--capacity').textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  popup.querySelector('.popup__text--time').textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  transformFeatures(popup, popupFeatures, ad.offer.features);
  transformImages(popup, ad.offer.photos);
  popup.querySelector('.popup__description').textContent = ad.offer.description;
  popup.querySelector('.popup__avatar').src = ad.author.avatar;

  return popup;
}
