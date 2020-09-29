"use strict";

const mapPins = document.querySelector('.map__pins');
const pinTemplate = document.getElementById('pin');
const map = document.querySelector('.map');
const userPopup = document.getElementById('card');
const filtersContainer = document.querySelector('.map__filters-container');
let popupList = document.createDocumentFragment();
let fragment = document.createDocumentFragment();

// массив создаваемых объектов
let userList = [];

// для getAvatarNum
let avatarCount = [];
let replacedNumsArray = [];
let avatarIndex;

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

//для getRoomType
let roomTypeArray = ['palace', 'flat', 'house', 'bungalow']
let typeNum;

// для createUserList
let x;
let y;
let price;
let roomsAmount;
let guestPossible;
let guestsAmount;

// для createFeatures
const features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
let featuresAmount;

// для createPhotos
const photosUrlArray = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
let photosAmount;

// вспомогательные функции
const getAvatarNum = () => {

  if (avatarCount.length === 0) {
    avatarCount = ['01', '02', '03', '04', '05', '06', '07', '08'];
    replacedNumsArray = [];
    avatarIndex = 7;
  }

  var num = randomInteger(0, avatarIndex);
  let replacedNum = avatarCount[num];
  replacedNumsArray.push(replacedNum);
  avatarCount.splice(num, 1);
  avatarIndex--;
  return replacedNum
}

const getRoomType = () => {
  typeNum = randomInteger(0, roomTypeArray.length - 1);
  return roomTypeArray[typeNum]
}

const createFeatures = () => {
  let userFeatures = [];
  featuresAmount = randomInteger(1, 6);
  for (let i = 0; i < featuresAmount; i++) {
    userFeatures.push(features[i]);
  }
  return userFeatures
}

const createPhotos = () => {
  let userPhotos = [];
  photosAmount = randomInteger(1, 3);
  for (let i = 0; i < photosAmount; i++) {
    userPhotos.push(photosUrlArray[i]);
  }
  return userPhotos;
}

// основная функция
const createUserList = (userNumber) => {

  for (let i = 0; i < userNumber; i++) {
    x = randomInteger(100, 1100);
    y = randomInteger(130, 630);
    price = Math.round(randomInteger(100, 20000) / 1000) * 1000;
    roomsAmount = randomInteger(1, 10);
    guestPossible = randomInteger(1, 4);
    guestsAmount = roomsAmount * guestPossible;
    let user = {
      author: {
        avatar: `img/avatars/user${getAvatarNum()}.png`
      },

      offer: {
          title: 'Lorem ipsum dolor sit amet',
          address: `${x}, ${y}`,
          price: price,
          type: getRoomType(),
          rooms: roomsAmount,
          guests: guestsAmount,
          checkin: `${randomInteger(12, 14)}:00`,
          checkout: `${randomInteger(12, 14)}:00`,
          features: createFeatures(),
          description: "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot",
          photos: createPhotos()
      },

      location: {
          x: x,
          y: y
      }
    }

    userList.push(user);
  }
}

// создание массива с объектами
createUserList(8);

// временная реализация откртия карты
map.classList.remove('map--faded');

// функция создания меток из массива объектов userList
const createPin = (userPin) => {
  let pin = pinTemplate.content.cloneNode(true);

  pin.querySelector('.map__pin').style.left = `${userPin.location.x}px`;
  pin.querySelector('.map__pin').style.top = `${userPin.location.y}px`;
  pin.querySelector('.map__pin-image').src = userPin.author.avatar;
  pin.querySelector('.map__pin-image').alt = userPin.offer.title;

  return pin;
}

// добавление созданных меток в DOM
for (let i = 0; i < userList.length; i++) {
  fragment.appendChild(createPin(userList[i]));
}

mapPins.appendChild(fragment);

const transformFeatures = (userFeaturesLink) => {
  let userFeatures = document.createDocumentFragment();
  for (let i = 0; i < userFeaturesLink.offer.features.length; i++) {
    let feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add(`popup__feature--${userFeaturesLink.offer.features[i]}`);
    userFeatures.appendChild(feature);
  }
  return userFeatures;
}

const transformImages = (userFeaturesLink) => {
  let flatImages = document.createDocumentFragment();
  for (let i = 0; i < userFeaturesLink.offer.photos.length; i++) {
    let image = document.createElement('img');
    image.width = "45";
    image.height = "40";
    image.classList.add('popup__photo');
    image.src = `${userFeaturesLink.offer.photos[i]}`;
    image.alt= "Фотография жилья";
    flatImages.appendChild(image);
  }
  return flatImages;
}

// функция создания popup для меток из массива объектов userList
const createPopup = (user) => {
  let popup = userPopup.content.cloneNode(true);
  let userFeatures = document.createDocumentFragment();

  popup.querySelector('.popup__title').textContent = user.offer.title;
  popup.querySelector('.popup__text--address').textContent = user.offer.address;
  popup.querySelector('.popup__text--price').textContent = `${user.offer.price}₽/ночь`;
  popup.querySelector('.popup__type').textContent = user.offer.type;
  popup.querySelector('.popup__text--capacity').textContent = `${user.offer.rooms} комнаты для ${user.offer.guests} гостей`;
  popup.querySelector('.popup__text--time').textContent = `Заезд после ${user.offer.checkin}, выезд до ${user.offer.checkout}`;
  popup.querySelector('.popup__features').appendChild(transformFeatures(user));
  popup.querySelector('.popup__photos').appendChild(transformImages(user));
  popup.querySelector('.popup__description').textContent = user.offer.description;
  popup.querySelector('.popup__avatar').src = user.author.avatar;

  return popup;
}

for (let i = 0; i < userList.length; i++) {
  popupList.appendChild(createPopup(userList[i]));
}

map.insertBefore(popupList, filtersContainer);
