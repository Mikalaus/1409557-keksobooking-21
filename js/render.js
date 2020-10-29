'use strict';

(() => {

  const filters = document.querySelector('.map__filters');
  const filtersSelectList = filters.querySelectorAll('select');
  const housingFeaturesSelect = filters.querySelectorAll('#housing-features input');

  /**
   * функция выдачи ранга каждому объявлению, исходя из которого идет сортировка всех объявлений
   * @param {Object} - объявление
   */
  const getRank = (ad) => {
    let rank = 0;
    let priceValue;

    if (ad.offer.price < 10000) {
      priceValue = 'low';
    } else if (ad.offer.price >= 10000 && ad.offer.price <= 50000) {
      priceValue = 'medium';
    } else if (ad.offer.price > 50000) {
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

    housingFeaturesSelect.forEach((input) => {
      console.log('а')
      if (input.hasAttribute('checked')) {
        console.log('ы')
        ad.offer.features.forEach((feature) => {
          if (feature === input.value) {
            rank++;
            console.log('d')
          }
        });
      }
    });



    return rank;
  }

  const renderAds = (adsList) => {
    adsList.sort((left, right) => {
      let rankDiff = getRank(right) - getRank(left);
      return rankDiff;
    });

    return adsList;
  }

  window.render = {
    ads: renderAds
  }
})();
