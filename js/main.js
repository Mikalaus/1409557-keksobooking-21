"use strict";

let mapPins = document.querySelector('.map__pins');

// массив создаваемых объектов
let userList = [];

// для getAvatarNum
let avatarCount = [];
let replacedNumsArray = [];
let i;

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
const photosUrlArray = ['http:o0.github.io/assets/images/tokyo/hotel1.jpg', 'http:o0.github.io/assets/images/tokyo/hotel2.jpg', 'http:o0.github.io/assets/images/tokyo/hotel3.jpg'];
let photosAmount;

// вспомогательные функции
const getAvatarNum = () => {

  if (avatarCount.length === 0) {
    avatarCount = ['01', '02', '03', '04', '05', '06', '07', '08'];
    replacedNumsArray = [];
    i = 7;
  }

  var num = randomInteger(0, i);
  let replacedNum = avatarCount[num];
  replacedNumsArray.push(replacedNum);
  avatarCount.splice(num, 1);
  i--;
  return replacedNum
}

const getRoomType = () => {
  typeNum = randomInteger(0, roomTypeArray.length - 1);
  return roomTypeArray[typeNum]
}

const createFeatures = () => {
  let userFeatures = [];
  featuresAmount = randomInteger(1, 6);
  for (let v = 0; v < featuresAmount; v++) {
    userFeatures.push(features[v]);
  }
  return userFeatures
}

const createPhotos = () => {
  let userPhotos = [];
  photosAmount = randomInteger(1, 10);
  for (let v = 0; v < photosAmount; v++) {
    let randomPhoto = randomInteger(0, 2);
    userPhotos.push(photosUrlArray[randomPhoto]);
  }
  return userPhotos;
}

// основная функция
const createUserList = (userNumber) => {

  for (let i = 0; i < userNumber; i++) {
    x = randomInteger(100, 1100);
    y = randomInteger(130, 630);
    price = randomInteger(100, 20000);
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

createUserList(8);

const map = document.querySelector('.map');
map.classList.remove('map--faded');

let pinTemplate = document.getElementById('pin');

const createPin = (userPin) => {
  let pin = pinTemplate.content.cloneNode(true);

  pin.querySelector('.map__pin').style.left = `${userPin.location.x}px`;
  pin.querySelector('.map__pin').style.top = `${userPin.location.y}px`;
  pin.querySelector('.map__pin-image').src = userPin.author.avatar;
  pin.querySelector('.map__pin-image').alt = userPin.offer.title;

  return pin;
}

var fragment = document.createDocumentFragment();
for (let i = 0; i < userList.length; i++) {
  fragment.appendChild(createPin(userList[i]));
}

mapPins.appendChild(fragment);

// На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона #pin.
//
// У метки укажите:
//
// Координаты: style="left: {{location.x + смещение по X}}px; top: {{location.y + смещение по Y}}px;"
// Обратите внимание. Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки, а координаты, на которые указывает метка своим острым концом. Чтобы найти эту координату нужно учесть размеры элемента с меткой.
//
// У изображения метки укажите:
//
// Аватар: src="{{author.avatar}}"
// Альтернативный текст: alt="{{заголовок объявления}}"
// Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
