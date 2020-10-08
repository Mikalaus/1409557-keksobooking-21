'use strict';

(() => {

  window.form = {
    checkAdFormTypeSelect: () => {
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
    },

    checkRoomNumberCapacity: () => {
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
    },

    /**
     * дезактивация полей ввода
     * @param {string} - значение активации или дезактивации
     */
    controlInputForms: (control) => {

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
  }

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

  window.PIN_OFFSET = {
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

  /**
   * проверяет value у select типов домов, изменяет значение placeholder у adFormPrice
   * @listens {change}
   */
  adFormTypeSelect.addEventListener('change', () => {
    window.form.checkAdFormTypeSelect();
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

  /**
   * проверяет валидность соотношения значений roomNumber и capacity
   * @listens {change}
   */
  roomNumber.addEventListener('change', () => {
    window.form.checkRoomNumberCapacity();
  });

  window.form.controlInputForms('disable');
})();
