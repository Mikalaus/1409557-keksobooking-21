'use strict';

/**
 * @type {number}
 * максимальная цена за одну ночь
 */
const MAX_PRICE = 1000000;

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

/**
 * минимальные стоимости проживания за одну ночь
 * @type {Object}
 */
const minPrice = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

/**
 * key = roomNumber.value для каждого селекта
 * value = индексы массива кол-ва гостей для кол-ва комнат
 * @type {Object}
 */
const RoomCapacity = {
  1: [2],
  2: [1, 2],
  3: [0, 1, 2],
  100: [3]
};

/**
 * Ограничения по вводу в главное описание добавляемого объявления
 * @type {Object}
 */
const TitleLength = {
  MIN: 30,
  MAX: 100
};

const adFormTitle = document.querySelector('#title');
const adFormPrice = document.querySelector('#price');
const adFormTypeSelect = document.querySelector('#type');
const adFormTimeIn = document.querySelector('#timein');
const adFormTimeInOptions = adFormTimeIn.querySelectorAll('option');
const adFormTimeOut = document.querySelector('#timeout');
const adFormTimeOutOptions = adFormTimeOut.querySelectorAll('option');
const adForm = document.querySelector('.ad-form');
const formReset = document.querySelector('.ad-form__reset');

const roomNumber = document.querySelector('#room_number');
const capacity = document.querySelector('#capacity');
const capacityOptions = capacity.querySelectorAll('option');

const mapFilterList = document.querySelectorAll('.map__filter');
const mapFeatures = document.querySelector('.map__features');
const adFormHeader = document.querySelector('.ad-form-header');
const adFormElements = document.querySelectorAll('.ad-form__element');

const avatarInput = document.querySelector('#avatar');
const avatarPreview = document.querySelector('.ad-form-header__preview img');
const houseImagesInput = document.querySelector('#images');
const houseImagePreview = document.querySelector('.ad-form__photo');

/**
 * функция изменения placeholder и min цены для каждого типа жилья
 */
const checkAdFormTypeSelect = () => {
  let type = adFormTypeSelect.value;
  adFormPrice.placeholder = minPrice[type];
  adFormPrice.setAttribute('min', minPrice[type]);
};

/**
 * функция изменения кол-ва возможных гостей для каждого предоставленного кол-ва комнат
 */
const checkRoomNumberCapacity = () => {
  let number = roomNumber.value;

  capacityOptions.forEach((capacityOption) => {
    capacityOption.setAttribute('disabled', 'disabled');
  });

  RoomCapacity[+number].forEach((index) => {
    capacityOptions[index].removeAttribute('disabled');
    capacityOptions[index].selected = 'selected';
  });
};

/**
 * дезактивация полей ввода
 * @param {boolean} - значение активации или дезактивации
 */
const controlInputForms = (control) => {

  if (control) {
    adForm.classList.remove('ad-form--disabled');
    adFormHeader.removeAttribute('disabled');
    mapFeatures.removeAttribute('disabled');

    mapFilterList.forEach((filter) => {
      filter.removeAttribute('disabled');
    });

    adFormElements.forEach((element) => {
      element.removeAttribute('disabled');
    });

  } else {
    adForm.classList.add('ad-form--disabled');
    adFormHeader.setAttribute('disabled', 'disabled');
    mapFeatures.setAttribute('disabled', 'disabled');

    mapFilterList.forEach((filter) => {
      filter.setAttribute('disabled', 'disabled');
    });

    adFormElements.forEach((element) => {
      element.setAttribute('disabled', 'disabled');
    });
  }
};

/**
 * проверяет валидность описания размещаемого объявления
 * @listens {input}
 */
adFormTitle.addEventListener('input', () => {
  let valueLength = adFormTitle.value.length;

  if (valueLength < TitleLength.MIN) {
    adFormTitle.setCustomValidity('Ещё ' + (TitleLength.MIN - valueLength) + ' симв.');
  } else if (valueLength > TitleLength.MAX) {
    adFormTitle.setCustomValidity('Удалите лишние ' + (valueLength - TitleLength.MAX) + ' симв.');
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

  if (type === 'bungalow' && price < minPrice.bungalow) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${minPrice.bungalow}`);
  } else if (type === 'flat' && price < minPrice.flat) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${minPrice.flat}`);
  } else if (type === 'house' && price < minPrice.house) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${minPrice.house}`);
  } else if (type === 'palace' && price < minPrice.palace) {
    adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${minPrice.palace}`);
  }

  checkAdFormTypeSelect();

  adFormPrice.reportValidity();
});

/**
 * проверяет value у select типов домов, изменяет значение placeholder у adFormPrice
 * @listens {change}
 */
adFormTypeSelect.addEventListener('change', () => {
  checkAdFormTypeSelect();
});

/**
 * cb для функции рассчета времени заезда/выезда
 * @param {boolean} - true - in || false - out
 */
const timeInChangeHandler = (bool) => {
  let time = bool ? adFormTimeIn.value : adFormTimeOut.value;

  for (let i = 0; i < adFormTimeOutOptions.length; i++) {
    adFormTimeOutOptions[i].removeAttribute('selected');
    adFormTimeInOptions[i].removeAttribute('selected');
    if (adFormTimeOutOptions[i].value === time) {
      adFormTimeOutOptions[i].selected = 'selected';
      adFormTimeInOptions[i].selected = 'selected';
    }
  }
};


/**
 * проверяет value у adFormTimeIn, изменяет значение adFormTimeOut
 * @listens {change}
 */
adFormTimeIn.addEventListener('change', () => {
  timeInChangeHandler(true);
});

/**
 * проверяет value у adFormTimeOut, изменяет значение adFormTimeIn
 * @listens {change}
 */
adFormTimeOut.addEventListener('change', () => {
  timeInChangeHandler(false);
});

/**
 * проверяет валидность соотношения значений roomNumber и capacity
 * @listens {change}
 */
roomNumber.addEventListener('change', () => {
  checkRoomNumberCapacity();
});

controlInputForms(false);

/**
 * дезактивация страницы после успешной отправки формы
 * @listens {submit}
 */
adForm.addEventListener('submit', (evt) => {
  window.backend.upload(new FormData(adForm), () => {
    window.backend.uploadSuccess();
    window.map.disable();
  });

  evt.preventDefault();
});

/**
 * отображение загруженного превью аватара
 * @listens {change}
 */
avatarInput.addEventListener('change', () => {
  let file = avatarInput.files[0];
  let fileName = file.name.toLowerCase();

  const isMatches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (isMatches) {
    let reader = new FileReader();

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

/**
 * отображение загруженного превью квартиры
 * @listens {change}
 */
houseImagesInput.addEventListener('change', () => {
  let file = houseImagesInput.files[0];
  let fileName = file.name.toLowerCase();

  const isMatches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (isMatches) {
    let reader = new FileReader();

    reader.addEventListener('load', () => {
      houseImagePreview.style.backgroundSize = 'cover';
      houseImagePreview.style.backgroundImage = `url(${reader.result})`;
    });

    reader.readAsDataURL(file);
  }
});

formReset.addEventListener('click', window.map.disable);

window.form = {
  checkAdFormTypeSelect: checkAdFormTypeSelect,

  checkRoomNumberCapacity: checkRoomNumberCapacity,

  controlInputs: controlInputForms,
};
