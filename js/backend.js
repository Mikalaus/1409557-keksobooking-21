'use strict';

(() => {
  const DATA_URL_LOAD = 'https://21.javascript.pages.academy/keksobooking/data';
  const DATA_URL_UPLOAD = 'https://21.javascript.pages.academy/keksobooking';
  const ESC = 'Escape';
  const SERVER = {
    success: 200,
    invalidInquiry: 400,
    noAuthorization: 401,
    nothingFound: 404
  }

  const errorTemplate = document.querySelector('#error');
  const serverErrorTemplate = document.querySelector('#server-error');
  const successTemplate = document.querySelector('#success');
  const map = document.querySelector('.map');

  /**
   * Отображение ошибки при загрузке данных с сервера
   * @param {string} - текст ошибки
   */
  const showServerError = (errorText) => {
    let errorMessage = serverErrorTemplate.content.cloneNode(true);

    errorMessage.querySelector('.error__message').textContent = `Произошла ошибка! ${errorText}`;

    errorMessage.querySelector('.error__button').addEventListener('click', (evt) => {
      evt.preventDefault();
      location.reload(true);
    });

    map.appendChild(errorMessage)
  }

  /**
   * cb по нажатию на escape
   * @param {object} - удаляемый объект
   * @param {boolean} - успешная/неуспешная загрузка
   */
  const escHandler = (obj, success) => (evt) => {
    if (evt.key === ESC) {
      evt.preventDefault();
      obj.remove();

      if (success) {
        location.reload(true);
      }
    }
  }

  /**
   * cb по нажатию на праввую кнопку мыши
   * @param {object} - удаляемый объект
   * @param {boolean} - успешная/неуспешная загрузка
   */
  const mousedownHandler = (obj, success) => (evt) => {
    if (evt.which === 1) {
      evt.preventDefault();
      obj.remove();

      if (success) {
        location.reload(true);
      }
    }
  }

  /**
   * Отображение ошибки при отправке формы
   */
  const uploadFail = () => {
    let errorMessage = errorTemplate.content.cloneNode(true);

    errorMessage.querySelector('.error__button').addEventListener('click', (evt) => {
      evt.preventDefault();
      location.reload(true);
    });

    map.appendChild(errorMessage)

    let errorPopup = document.querySelector('.error');

    document.addEventListener('keydown', escHandler(errorPopup));
    document.addEventListener('mousedown', mousedownHandler(errorPopup));
  }

  /**
   * Отображение попап при успешной отправке формы
   */
  const uploadSuccess = () => {
    let successMessage = successTemplate.content.cloneNode(true);

    map.appendChild(successMessage)

    let successPopup = document.querySelector('.success');

    document.addEventListener('keydown', escHandler(successPopup, true));
    document.addEventListener('mousedown', mousedownHandler(successPopup, true));
  }

  /**
   * генерация массива с информацией об объявлениях
   * @param {Array} - массив с объектами (информацией об объявлениях)
   * @return {Array} - массив объявлений
   */
  const generateAds = (adsInfo) => {
    let adsList = [];
    for (let i = 0; i < adsInfo.length; i++) {
      let user = {
        author: {
          avatar: adsInfo[i].author.avatar
        },

        offer: {
          title: adsInfo[i].offer.title,
          address: adsInfo[i].offer.address,
          price: adsInfo[i].offer.price,
          type: adsInfo[i].offer.adsInfo,
          rooms: adsInfo[i].offer.rooms,
          guests: adsInfo[i].offer.guests,
          checkin: adsInfo[i].offer.checkin,
          checkout: adsInfo[i].offer.checkout,
          features: adsInfo[i].offer.features,
          description: adsInfo[i].offer.description,
          photos: adsInfo[i].offer.photos
        },

        location: {
          x: adsInfo[i].location.x,
          y: adsInfo[i].location.y
        }
      }

      adsList.push(user);
    }

    window.map.generatePins(adsList);
  }

  /**
   * Функция загрузки данных объявлений с сервера
   */
  const load = () => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', (evt) => {
      let error;
      switch (xhr.status) {
        case SERVER.success:
          generateAds(xhr.response);
          break;
        case SERVER.invalidInquiry:
          error = 'Неверный запрос';
          break;
        case SERVER.noAuthorization:
          error = 'Пользователь не авторизован';
          break;
        case SERVER.nothingFound:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        showServerError(error);
      }

    });

    xhr.addEventListener('error', () => {
      showServerError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', () => {
      showServerError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 1000;

    xhr.open('GET', DATA_URL_LOAD);
    xhr.send();
  }

  /**
   * Функция отправки данных объявлений пользователя на сервера
   * @param {FormData} - данные формы
   * @param {function} - что сделать при успешной выгрузки данных
   */
  const upload = (data, onSuccess) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', (evt) => {
      let error;
      switch (xhr.status) {
        case SERVER.success:
          onSuccess();
          break;
        case SERVER.invalidInquiry:
          error = 'Неверный запрос';
          break;
        case SERVER.noAuthorization:
          error = 'Пользователь не авторизован';
          break;
        case SERVER.nothingFound:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        uploadFail();
      }

    });

    xhr.addEventListener('error', () => {
      uploadFail();
    });

    xhr.addEventListener('timeout', () => {
      uploadFail();
    });

    xhr.timeout = 1000;

    xhr.open('POST', DATA_URL_UPLOAD);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload,
    uploadSuccess: uploadSuccess
  }
})();
