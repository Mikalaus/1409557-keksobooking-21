'use strict';

(() => {
  const map = document.querySelector('.map');
  const adFormTitle = document.querySelector('#title');
  const adFormPrice = document.querySelector('#price');
  const adFormTypeSelect = document.querySelector('#type');
  const adFormTimeIn = document.querySelector('#timein');
  const adFormTimeInOptions = adFormTimeIn.querySelectorAll('option');
  const adFormTimeOut = document.querySelector('#timeout');
  const adFormTimeOutOptions = adFormTimeOut.querySelectorAll('option');
  const adForm = document.querySelector('.ad-form');

  const roomNumber = document.querySelector('#room_number');
  const roomNumberOptions = roomNumber.querySelectorAll('option');
  const capacity = document.querySelector('#capacity')
  const capacityOptions = capacity.querySelectorAll('option');

  const mapFilterList = document.querySelectorAll('.map__filter');
  const mapFeatures = document.querySelector('.map__features');
  const adFormHeader = document.querySelector('.ad-form-header');
  const adFormElements = document.querySelectorAll('.ad-form__element');

  /**
   * key = roomNumber.value для каждого селекта
   * value = индексы массива кол-ва гостей для кол-ва комнат
   * @type {Object}
   */
  const ROOM_CAPACITY = {
    '1': [2],
    '2': [1, 2],
    '3': [0, 1, 2],
    '100': [3]
  }

  /**
   * минимальные стоимости проживания за одну ночь
   * @type {Object}
   */
  const MIN_PRICE = {
    bungalow: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
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
   * функция изменения placeholder и min цены для каждого типа жилья
   */
  const checkAdFormTypeSelect = () => {
    let type = adFormTypeSelect.value;
    adFormPrice.placeholder = MIN_PRICE[type]
    adFormPrice.setAttribute('min', MIN_PRICE[type]);
  }

  /**
   * функция изменения кол-ва возможных гостей для каждого предоставленного кол-ва комнат
   */
  const checkRoomNumberCapacity = () => {
    let number = roomNumber.value;

    capacityOptions.forEach((capacityOption) => {
      capacityOption.setAttribute('disabled', 'disabled');
    });

    ROOM_CAPACITY[number].forEach((index) => {
      capacityOptions[index].removeAttribute('disabled');
      capacityOptions[index].selected = 'selected';
    });
  }

  /**
   * дезактивация полей ввода
   * @param {boolean} - значение активации или дезактивации
   */
  const controlInputForms = (control) => {

    if (control === true) {
      adForm.classList.remove('ad-form--disabled')
      adFormHeader.removeAttribute('disabled');
      mapFeatures.removeAttribute('disabled');

      mapFilterList.forEach((filter) => {
        filter.removeAttribute('disabled');
      });

      adFormElements.forEach((element) => {
        element.removeAttribute('disabled');
      });

    } else if (control === false) {
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
    } else if (type === 'flat' && price < MIN_PRICE.FLAT) {
      adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.FLAT}`);
    } else if (type === 'house' && price < MIN_PRICE.HOUSE) {
      adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.HOUSE}`);
    } else if (type === 'palace' && price < MIN_PRICE.PALACE) {
      adFormPrice.setCustomValidity(`Вы не можете ввести значение ниже ${MIN_PRICE.PALACE}`);
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
    let time;

    if (bool === true){
      time = adFormTimeIn.value;
    } else if (bool === false) {
      time = adFormTimeOut.value;
    } else {
      alert('Введено неверное значение аттрибута');
    }


    for (let i = 0; i < adFormTimeOutOptions.length; i++) {
      adFormTimeOutOptions[i].removeAttribute('selected');
      adFormTimeInOptions[i].removeAttribute('selected');
      if (adFormTimeOutOptions[i].value === time) {
        adFormTimeOutOptions[i].selected = 'selected';
        adFormTimeInOptions[i].selected = 'selected';
      }
    }
  }


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
      window.map.disableMap();
      adForm.reset();
    });

    evt.preventDefault();
  });

  window.form = {
    checkAdFormTypeSelect: checkAdFormTypeSelect,

    checkRoomNumberCapacity: checkRoomNumberCapacity,

    controlInputForms: controlInputForms,

    PIN_OFFSET: {
      LEFT: 33,
      TOP: 12
    }
  }
})();
