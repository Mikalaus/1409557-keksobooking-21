'use strict';

(() => {
  const DATA_URL = 'https://21.javascript.pages.academy/keksobooking/data';

  const load = (onSuccess, onError) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', (evt) => {
      let error;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
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
        onError(error);
      }

    });

    xhr.addEventListener('error', () => {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', () => {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 4000;

    xhr.open('GET', DATA_URL);
    xhr.send();

  }

  window.backend = {
    load: load
  }
})();
