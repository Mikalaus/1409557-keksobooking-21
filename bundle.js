(()=>{"use strict";window.debounce=e=>{let t=null;return(...o)=>{t&&window.clearTimeout(t),t=window.setTimeout((()=>{e(...o)}),500)}},(()=>{const e="any",t=document.querySelector(".map__filters").querySelectorAll("select"),o=(o,r)=>{let n,l=!0;return o.offer.price<1e4?n="low":o.offer.price>=1e4&&o.offer.price<=5e4?n="middle":o.offer.price>5e4&&(n="high"),t[0].value!==o.offer.type&&t[0].value!==e&&(l=!1),t[1].value!==n&&t[1].value!==e&&(l=!1),+t[2].value!==o.offer.rooms&&t[2].value!==e&&(l=!1),+t[3].value!==o.offer.guests&&t[3].value!==e&&(l=!1),r.forEach((e=>{-1===o.offer.features.indexOf(e.value)&&e.classList.contains("checked")&&(l=!1)})),l?o:null};window.render={ads:(e,t=[])=>{let r=[];for(let n=0;n<e.length;n++){let l=o(e[n],t);if(null!==l&&r.push(l),5===r.length)break}return r}}})(),(()=>{const e=document.querySelector("#server-error"),t=document.querySelector("#success"),o=document.querySelector(".map"),r=t=>{let r=e.content.cloneNode(!0);r.querySelector(".error__message").textContent="Произошла ошибка! "+t,r.querySelector(".error__button").addEventListener("click",(e=>{e.preventDefault(),location.reload(!0)})),o.appendChild(r)},n=e=>{"Escape"===e.key&&a(e)},l=e=>{1===e.which&&a(e)},a=e=>{e.preventDefault();let t=document.querySelector(".error");null!==t&&t.remove();let o=document.querySelector(".success");null!==o&&o.remove(),o.remove(),document.removeEventListener("keydown",n),document.removeEventListener("mousedown",l)},d=(e,t=(()=>{}))=>{e.responseType="json",e.addEventListener("load",(()=>{let o;switch(e.status){case 200:t(e.response);break;case 400:o="Неверный запрос";break;case 401:o="Пользователь не авторизован";break;case 404:o="Ничего не найдено";break;default:o="Cтатус ответа: : "+e.status+" "+e.statusText}o&&r(o)})),e.addEventListener("error",(()=>{r("Произошла ошибка соединения")})),e.addEventListener("timeout",(()=>{r("Запрос не успел выполниться за "+e.timeout+"мс")})),e.timeout=1e3};window.backend={load:e=>{let t=new XMLHttpRequest;d(t,e),t.open("GET","https://21.javascript.pages.academy/keksobooking/data"),t.send()},upload:(e,t)=>{let o=new XMLHttpRequest;d(o,t),o.open("POST","https://21.javascript.pages.academy/keksobooking"),o.send(e)},uploadSuccess:()=>{let e=t.content.cloneNode(!0);o.appendChild(e),document.addEventListener("keydown",n),document.addEventListener("mousedown",l)}}})(),(()=>{const e={bugalow:"Бунгало",palace:"Дворец",flat:"Квартира",house:"Дом"},t=e=>{if("Escape"===e.key){let e=document.querySelector(".map__card");null!==e&&e.remove(),document.removeEventListener("keydown",t)}},o=document.querySelector("#card");window.card={generateAd:r=>{let n=o.content.cloneNode(!0),l=n.querySelectorAll(".popup__feature");return n.querySelector(".popup__title").textContent=r.offer.title,n.querySelector(".popup__text--address").textContent=r.offer.address,n.querySelector(".popup__text--price").textContent=r.offer.price+"₽/ночь",n.querySelector(".popup__type").textContent=e[r.offer.type],n.querySelector(".popup__text--capacity").textContent=`${r.offer.rooms} комнаты для ${r.offer.guests} гостей`,n.querySelector(".popup__text--time").textContent=`Заезд после ${r.offer.checkin}, выезд до ${r.offer.checkout}`,((e,t,o)=>{if(o.length>0)for(let e=0;e<t.length;e++){let r=0;for(let n=0;n<o.length&&!1===t[e].classList.contains("popup__feature--"+o[n]);n++)r++,r===o.length&&t[e].remove()}else e.querySelector(".popup__features").remove()})(n,l,r.offer.features),((e,t)=>{let o=e.querySelector(".popup__photos"),r=e.querySelector(".popup__photo");if(t.length>0)for(let e=0;e<t.length;e++)if(0===e)r.src=t[e];else{let r=document.createElement("img");r.width="45",r.height="40",r.classList.add("popup__photo"),r.src=t[e],r.alt="Фотография жилья",o.appendChild(r)}else o.remove()})(n,r.offer.photos),n.querySelector(".popup__description").textContent=r.offer.description,n.querySelector(".popup__avatar").src=r.author.avatar,document.addEventListener("keydown",t),n}}})(),(()=>{const e=document.querySelector(".map__pins"),t=document.querySelector("#pin"),o=document.querySelector(".map"),r=document.querySelector(".map__filters-container"),n=document.querySelector(".map__pin--main"),l=document.querySelector(".ad-form"),a=document.querySelector(".map__filters"),d=document.querySelector("#address"),s=a.querySelectorAll("select"),c=a.querySelectorAll("#housing-features input"),u=document.querySelector(".ad-form-header__preview img"),i=document.querySelector(".ad-form__photo");let p;const m=()=>{v(),window.debounce(window.map.generatePins(window.render.ads(p)))};s.forEach((e=>{e.addEventListener("change",m)})),c.forEach((e=>{e.addEventListener("click",(()=>{e.classList.toggle("checked"),v(),window.debounce(window.map.generatePins(window.render.ads(p,c)))}))}));const f=e=>{let t=e.style.left=parseInt(e.style.left,10),o=e.style.top=parseInt(e.style.top,10);d.value=`${t}, ${o}`};f(n);const y=e=>{let t=parseInt(e.style.left,10)+33,o=parseInt(e.style.top,10)+12;d.value=`${t}, ${o}`},v=()=>{let e=document.querySelector(".popup");null!==e&&e.remove()},w=(e,t)=>{v(),o.insertBefore(window.card.generateAd(t[e]),r);let n=document.querySelector(".popup");n.querySelector(".popup__close").addEventListener("click",(e=>{e.preventDefault(),n.remove()}))},h=()=>{let t=e.querySelectorAll("button:not(.map__pin--main)");for(let e=0;e<t.length;e++)t[e].remove()},_=e=>{"Enter"!==e.key&&1!==e.which||(o.classList.remove("map--faded"),window.backend.load((e=>{window.map.generatePins(window.render.ads(e,c)),p=e})),window.form.checkAdFormTypeSelect(),window.form.checkRoomNumberCapacity(),window.form.controlInputs(!0),y(n),n.removeEventListener("keydown",_),n.removeEventListener("mousedown",_))};n.addEventListener("keydown",_),n.addEventListener("mousedown",_),window.map={generatePins:o=>{h();let r=document.createDocumentFragment();for(let e=0;e<o.length;e++){let n=t.content.cloneNode(!0),l=n.querySelector(".map__pin"),a=n.querySelector(".map__pin img");l.style.left=o[e].location.x+"px",l.style.top=o[e].location.y+"px",a.src=o[e].author.avatar,a.alt=o[e].offer.title,r.appendChild(n),l.addEventListener("click",(t=>{32!==t.which&&w(e,o)}))}e.appendChild(r)},getLocation:y,disable:()=>{o.classList.add("map--faded"),window.form.controlInputs(!1),h(),y(n),v(),n.addEventListener("keydown",_),n.addEventListener("mousedown",_),l.reset(),a.reset(),n.style.left="570px",n.style.top="375px",f(n),i.style.backgroundImage="none",u.src="img/muffin-grey.svg"}}})(),(()=>{const e=document.querySelector(".map__pin--main");e.addEventListener("mousedown",(t=>{t.preventDefault();let o={x:t.clientX,y:t.clientY};const r=t=>{t.preventDefault();let r=o.x-t.clientX,n=o.y-t.clientY;o={x:t.clientX,y:t.clientY},e.offsetLeft-r>=-33&&e.offsetLeft-r<=1167&&(e.style.left=e.offsetLeft-r+"px"),e.offsetTop-n>=93&&e.offsetTop-n<=593&&(e.style.top=e.offsetTop-n+"px"),window.map.getLocation(e)},n=e=>{e.preventDefault(),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",n)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",n)}))})(),(()=>{const e={1:[2],2:[1,2],3:[0,1,2],100:[3]},t={bungalow:0,flat:1e3,house:5e3,palace:1e4},o=["gif","jpg","jpeg","png"],r=document.querySelector("#title"),n=document.querySelector("#price"),l=document.querySelector("#type"),a=document.querySelector("#timein"),d=a.querySelectorAll("option"),s=document.querySelector("#timeout"),c=s.querySelectorAll("option"),u=document.querySelector(".ad-form"),i=document.querySelector(".ad-form__reset"),p=document.querySelector("#room_number"),m=document.querySelector("#capacity").querySelectorAll("option"),f=document.querySelectorAll(".map__filter"),y=document.querySelector(".map__features"),v=document.querySelector(".ad-form-header"),w=document.querySelectorAll(".ad-form__element"),h=document.querySelector("#avatar"),_=document.querySelector(".ad-form-header__preview img"),S=document.querySelector("#images"),q=document.querySelector(".ad-form__photo"),g=()=>{let e=l.value;n.placeholder=t[e],n.setAttribute("min",t[e])},b=()=>{let t=p.value;m.forEach((e=>{e.setAttribute("disabled","disabled")})),e[+t].forEach((e=>{m[e].removeAttribute("disabled"),m[e].selected="selected"}))},L=e=>{e?(u.classList.remove("ad-form--disabled"),v.removeAttribute("disabled"),y.removeAttribute("disabled"),f.forEach((e=>{e.removeAttribute("disabled")})),w.forEach((e=>{e.removeAttribute("disabled")}))):(u.classList.add("ad-form--disabled"),v.setAttribute("disabled","disabled"),y.setAttribute("disabled","disabled"),f.forEach((e=>{e.setAttribute("disabled","disabled")})),w.forEach((e=>{e.setAttribute("disabled","disabled")})))};r.addEventListener("input",(()=>{let e=r.value.length;e<30?r.setCustomValidity("Ещё "+(30-e)+" симв."):e>100?r.setCustomValidity("Удалите лишние "+(e-100)+" симв."):r.setCustomValidity(""),r.reportValidity()})),n.addEventListener("input",(()=>{let e=n.value,o=l.value;e>1e6?n.setCustomValidity("Вы не можете ввести значение превышающее 1000000"):n.validity.valueMissing?n.setCustomValidity("Введите стоимость проживания за ночь"):n.setCustomValidity(""),"bungalow"===o&&e<t.bungalow?n.setCustomValidity("Вы не можете ввести значение ниже "+t.bungalow):"flat"===o&&e<t.flat?n.setCustomValidity("Вы не можете ввести значение ниже "+t.flat):"house"===o&&e<t.house?n.setCustomValidity("Вы не можете ввести значение ниже "+t.house):"palace"===o&&e<t.palace&&n.setCustomValidity("Вы не можете ввести значение ниже "+t.palace),g(),n.reportValidity()})),l.addEventListener("change",(()=>{g()}));const E=e=>{let t;t=e?a.value:s.value;for(let e=0;e<c.length;e++)c[e].removeAttribute("selected"),d[e].removeAttribute("selected"),c[e].value===t&&(c[e].selected="selected",d[e].selected="selected")};a.addEventListener("change",(()=>{E(!0)})),s.addEventListener("change",(()=>{E(!1)})),p.addEventListener("change",(()=>{b()})),L(!1),u.addEventListener("submit",(e=>{window.backend.upload(new FormData(u),(()=>{window.backend.uploadSuccess(),window.map.disable()})),e.preventDefault()})),h.addEventListener("change",(()=>{let e=h.files[0],t=e.name.toLowerCase();if(o.some((e=>t.endsWith(e)))){let t=new FileReader;t.addEventListener("load",(()=>{_.src=t.result})),t.readAsDataURL(e)}})),S.addEventListener("change",(()=>{let e=S.files[0],t=e.name.toLowerCase();if(o.some((e=>t.endsWith(e)))){let t=new FileReader;t.addEventListener("load",(()=>{q.style.backgroundSize="cover",q.style.backgroundImage=`url(${t.result})`})),t.readAsDataURL(e)}})),i.addEventListener("click",window.map.disable),window.form={checkAdFormTypeSelect:g,checkRoomNumberCapacity:b,controlInputs:L}})()})();