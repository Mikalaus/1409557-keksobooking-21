'use strict';

const LOW_PRICE_LIMIT = 10000;
const HIGH_PRICE_START = 50000;

const filters = document.querySelector('.map__filters');
const filtersSelectList = filters.querySelectorAll('select');
const housingFeaturesSelect = filters.querySelectorAll('#housing-features input');

/**
 * функция выдачи ранга каждому объявлению, исходя из которого идет сортировка всех объявлений
 * @param {Object} - объявление
 * @param {Object} - объявление
 * @return {Number} - ранг обявления
 */
const getRank = (ad, filtersList) => {
  let rank = 0;
  let extraRank = 0;
  let priceValue;

  if (ad.offer.price < LOW_PRICE_LIMIT) {
    priceValue = 'low';
  } else if (ad.offer.price >= LOW_PRICE_LIMIT && ad.offer.price <= HIGH_PRICE_START) {
    priceValue = 'medium';
  } else if (ad.offer.price > HIGH_PRICE_START) {
    priceValue = 'high';
  }

  if (filtersSelectList[0].value === ad.offer.type) {
    rank++;
  }

  if (filtersSelectList[1].value === priceValue) {
    rank++;
  }

  if (filtersSelectList[2].value === ad.offer.rooms) {
    rank++;
  }

  if (filtersSelectList[3].value === ad.offer.guests) {
    rank++;
  }

  filtersList.forEach((filter) => {
    if (ad.offer.features.indexOf(filter.value) !== -1 && filter.classList.contains('checked')) {
      extraRank++;
    }
  });

  return rank + extraRank;
}


/**
 * функция рендера массива объявления с целью поиска наиболее похожих
 * @param {Array} - массив объявлений
 * @param {Array} - массив housingFeaturesSelect фильтров
 * @return {Array} - отрендеренный массив
 */
const renderAds = (adsList, filtersList = []) => {
  adsList.sort((left, right) => {
    let rankDiff = getRank(right, filtersList) - getRank(left, filtersList);
    return rankDiff;
  });

  return adsList;
}

window.render = {
  ads: renderAds
}
