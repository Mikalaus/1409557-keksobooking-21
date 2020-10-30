'use strict';

const escPopupHandler = (evt) => {
  let popup = document.querySelector('.map__card');
  if (popup !== null) {
    popup.remove();
  }

  document.removeEventListener('keydown', escPopupHandler);
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

  document.addEventListener('keydown', escPopupHandler);

  return popup;
}


const userPopup = document.querySelector('#card');

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

window.card = {

  generateAd: generateAd
}
