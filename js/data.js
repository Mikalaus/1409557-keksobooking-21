'use strict';

(() => {

  /**
   * генерация массива с информацией об объявлениях
   * @param {number} - кол-во создаваемых объявлений
   * @return {Array} - массив объявлений
   */
  const generateAds = (adsAmount) => {
    let adsList = [];
    for (let i = 0; i < adsAmount; i++) {
      let x = getRandomInteger(50, 1150);
      let y = getRandomInteger(130, 630);
      let user = {
        author: {
          avatar: `img/avatars/user0${i+1}.png`
        },

        offer: {
            title: 'Lorem ipsum dolor sit amet',
            address: `${x + 21}, ${y - 22}`,
            price: getRandomInteger(0, 100000),
            type: getRoomType(HOUSE_TYPE),
            rooms: getRandomInteger(0, 100),
            guests: getRandomInteger(0, 100),
            checkin: `${getRandomInteger(12, 14)}:00`,
            checkout: `${getRandomInteger(12, 14)}:00`,
            features: getUserArray(FEATURES),
            description: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot',
            photos: getUserArray(IMAGE_URLS)
        },

        location: {
            x: x,
            y: y
        }
      }

      adsList.push(user);
    }

    return adsList;
  }

  /**
   * типы домов
   * @type {Array}
   */
  const HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalow'];

  /**
   * доп возможности
   * @type {Array}
   */
  const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']

  /**
   * адреса фотографий
   * @type {Array}
   */
  const IMAGE_URLS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                      'http://o0.github.io/assets/images/tokyo/hotel3.jpg']

  /**
   * генерация случайного числа
   * @param {number} - минимальное значение
   * @param {number} - максимальное значение
   * @return {number} - случайное число
   */
  const getRandomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  /**
   * генерация типа дома
   * @param {Array} - массив видов домов
   * @return {string} - вид дома
   */
  const getRoomType = (houseTypeArray) => {
    let houseType = houseTypeArray[getRandomInteger(0, houseTypeArray.length - 1)];
    return houseType;
  }

  /**
   * создание случайного массива из переданного
   * @param {Array} - какой-то заданный массив
   * @return {Array} - массив случайных элементов из переданного
   */
   const getUserArray = (someArray) => {
     let elementsAmount = getRandomInteger(0, someArray.length - 1)
     let someArrayCopy = someArray.slice();
     let userArray = [];
     while (userArray.length !== elementsAmount) {
       let randomElementIndex = getRandomInteger(0, someArrayCopy.length - 1);
       let randomElement = someArrayCopy[randomElementIndex];
       someArrayCopy.splice(randomElementIndex, 1);
       userArray.push(randomElement);
     }
     return userArray;
   }


   window.data = {
     generateAds: generateAds
   }
 })();
