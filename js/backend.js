'use strict';

(() => {
  const DATA_URL_LOAD = 'https://21.javascript.pages.academy/keksobooking/data';
  const DATA_URL_UPLOAD = 'https://21.javascript.pages.academy/keksobooking';
  const ESC = 'Escape';
  const errorTemplate = document.querySelector('#error');
  const successTemplate = document.querySelector('#success');
  const map = document.querySelector('.map');

  const showError = (error) => {
    let err = error;
    let errorMessage = errorTemplate.content.cloneNode(true);

    errorMessage.querySelector('.error__message').textContent = `Произошла ошибка! ${err}`;

    errorMessage.querySelector('.error__button').addEventListener('click', (evt) => {
      evt.preventDefault();
      location.reload(true);
    });

    map.appendChild(errorMessage)
  }

  const escHandler = (obj, success) => (evt) => {
    if (evt.key === ESC) {
      evt.preventDefault();
      obj.remove();

      if (success) {
        location.reload(true);
      }
    }
  }

  const mousedownHandler = (obj, success) => (evt) => {
    if (evt.which === 1) {
      evt.preventDefault();
      obj.remove();

      if (success) {
        location.reload(true);
      }
    }
  }

  const uploadFail = () => {
    let errorMessage = errorTemplate.content.cloneNode(true);

    errorMessage.querySelector('.error__button').addEventListener('click', (evt) => {
      evt.preventDefault();
      location.reload(true);
    });

    map.appendChild(errorMessage)

    let errorPopup = document.querySelector('.error');

    document.addEventListener('keydown', errorEscHandler(errorPopup));
    document.addEventListener('mousedown', errorMousedownHandler(errorPopup));
  }

  const uploadSuccess = () => {
    let successMessage = successTemplate.content.cloneNode(true);

    map.appendChild(successMessage)

    let successPopup = document.querySelector('.success');

    document.addEventListener('keydown', escHandler(successPopup, true));
    document.addEventListener('mousedown', mousedownHandler(successPopup, true));
  }

  /**
   * генерация массива с информацией об объявлениях
   * @param {number} - кол-во создаваемых объявлений
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

  const load = () => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', (evt) => {
      let error;
      switch (xhr.status) {
        case 200:
          generateAds(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        showError(error);
      }

    });

    xhr.addEventListener('error', () => {
      showError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', () => {
      showError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 4000;

    xhr.open('GET', DATA_URL_LOAD);
    xhr.send();
  }

  const upload = (data, onSuccess) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', (evt) => {
      let error;
      switch (xhr.status) {
        case 200:
          onSuccess();
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
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

    xhr.timeout = 4000;

    xhr.open('POST', DATA_URL_UPLOAD);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload,
    uploadSuccess: uploadSuccess
  }
})();
