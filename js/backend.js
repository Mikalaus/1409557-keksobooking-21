'use strict';

const DATA_URL_LOAD = 'https://21.javascript.pages.academy/keksobooking/data';
const DATA_URL_UPLOAD = 'https://21.javascript.pages.academy/keksobooking';
const ESC = 'Escape';
const LEFT_BUTTON = 0;
const ServerRequestStatus = {
  SUCCESS: 200,
  INVALID_INQUIRY: 400,
  NO_AUTHORIZATION: 401,
  NOTHING_FOUND: 404
};

const ServerRequest = {
  get: 'GET',
  post: 'POST'
};

const SERVER_TIMEOUT = 1000;

const serverErrorTemplate = document.querySelector('#server-error');
const successTemplate = document.querySelector('#success');
const map = document.querySelector('.map');

/**
 * Отображение ошибки при загрузке данных с сервера
 * @param {String} - текст ошибки
 */
const showServerError = (errorText) => {
  let errorMessage = serverErrorTemplate.content.cloneNode(true);

  errorMessage.querySelector('.error__message').textContent = `Произошла ошибка! ${errorText}`;

  errorMessage.querySelector('.error__button').addEventListener('click', (evt) => {
    evt.preventDefault();
    location.reload(true);
  });

  map.appendChild(errorMessage);
};

/**
 * cb по нажатию на escape
 * @param {Object}
 */
const escHandler = (evt) => {
  if (evt.key === ESC) {
    deleteServerInfoPopus(evt);
  }
};

/**
 * cb по нажатию на праввую кнопку мыши
 * @param {Object}
 */
const mousedownHandler = (evt) => {
  if (evt.button === LEFT_BUTTON) {
    deleteServerInfoPopus(evt);
  }
};

/**
 * функция для удаления попапов при успешной выгрузке объявления и неудачной загрузки данных, а так же
 * eventListener на документе
 * @param {Object}
 */
const deleteServerInfoPopus = (evt) => {
  evt.preventDefault();
  let errorPopup = document.querySelector('.error');
  if (errorPopup) {
    errorPopup.remove();
  }
  let successPopup = document.querySelector('.success');
  if (successPopup) {
    successPopup.remove();
  }
  successPopup.remove();
  document.removeEventListener('keydown', escHandler);
  document.removeEventListener('mousedown', mousedownHandler);
};

/**
 * Отображение попап при успешной отправке формы
 */
const uploadSuccess = () => {
  let successMessage = successTemplate.content.cloneNode(true);

  map.appendChild(successMessage);

  document.addEventListener('keydown', escHandler);
  document.addEventListener('mousedown', mousedownHandler);
};

const checkXhrRequestErrors = (xhr, func = () => {}) => {

  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
    let error;
    switch (xhr.status) {
      case ServerRequestStatus.SUCCESS:
        func(xhr.response);
        break;
      case ServerRequestStatus.INVALID_INQUIRY:
        error = 'Неверный запрос';
        break;
      case ServerRequestStatus.NO_AUTHORIZATION:
        error = 'Пользователь не авторизован';
        break;
      case ServerRequestStatus.NOTHING_FOUND:
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

  xhr.timeout = SERVER_TIMEOUT;
};

/**
 * Функция загрузки данных объявлений с сервера
 * @param {function} - при успешной загрузке
 */
const load = (onSuccess) => {
  let xhr = new XMLHttpRequest();

  checkXhrRequestErrors(xhr, onSuccess);

  xhr.open(ServerRequest.get, DATA_URL_LOAD);
  xhr.send();
};

/**
 * Функция отправки данных объявлений пользователя на сервера
 * @param {FormData} - данные формы
 * @param {function} - что сделать при успешной выгрузки данных
 */
const upload = (data, onSuccess) => {
  let xhr = new XMLHttpRequest();

  checkXhrRequestErrors(xhr, onSuccess);

  xhr.open(ServerRequest.post, DATA_URL_UPLOAD);
  xhr.send(data);
};

window.backend = {
  load: load,
  upload: upload,
  uploadSuccess: uploadSuccess
};
