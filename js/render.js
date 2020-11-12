'use strict';

const LOW_PRICE_LIMIT = 10000;
const HIGH_PRICE_START = 50000;
const PINS_LIMIT = 5;
const DEFAULT_FILTER = 'any';
const NOT_ARRAY_ITEM_INDEX = -1;

const PriceValue = {
  LOW: 'low',
  MED: 'middle',
  HIGH: 'high'
};

const filters = document.querySelector('.map__filters');
const filtersSelectList = filters.querySelectorAll('select');

/**
 * функция выдачи ранга каждому объявлению, исходя из которого идет сортировка всех объявлений
 * @param {Object} - объявление
 * @param {Array} - массив фильтров чекбоксов
 * @return {Number} - обявление/null
 */
const checkAd = (ad, filtersList) => {
  let isSame = true;
  let priceValue;

  if (ad.offer.price < LOW_PRICE_LIMIT) {
    priceValue = PriceValue.LOW;
  } else if (ad.offer.price >= LOW_PRICE_LIMIT && ad.offer.price <= HIGH_PRICE_START) {
    priceValue = PriceValue.MED;
  } else if (ad.offer.price > HIGH_PRICE_START) {
    priceValue = PriceValue.HIGH;
  }

  if (filtersSelectList[0].value !== ad.offer.type && filtersSelectList[0].value !== DEFAULT_FILTER) {
    isSame = false;
  }

  if (filtersSelectList[1].value !== priceValue && filtersSelectList[1].value !== DEFAULT_FILTER) {
    isSame = false;
  }

  if (+filtersSelectList[2].value !== ad.offer.rooms && filtersSelectList[2].value !== DEFAULT_FILTER) {
    isSame = false;
  }

  if (+filtersSelectList[3].value !== ad.offer.guests && filtersSelectList[3].value !== DEFAULT_FILTER) {
    isSame = false;
  }

  filtersList.forEach((filter) => {
    if (ad.offer.features.indexOf(filter.value) === NOT_ARRAY_ITEM_INDEX && filter.classList.contains('checked')) {
      isSame = false;
    }
  });

  if (isSame) {
    return ad;
  } else {
    return null;
  }
};

/**
 * функция рендера массива объявления с целью поиска наиболее похожих
 * @param {Array} - массив объявлений
 * @param {Array} - массив housingFeaturesSelect фильтров
 * @return {Array} - отрендеренный массив
 */
const renderAds = (adsList, filtersList = []) => {
  let renderedList = [];
  for (let i = 0; i < adsList.length; i++) {
    let renderedAd = checkAd(adsList[i], filtersList);
    if (renderedAd !== null) {
      renderedList.push(renderedAd);
    }
    if (renderedList.length === PINS_LIMIT) {
      break;
    }
  }

  return renderedList;
};

window.render = {
  ads: renderAds
};
