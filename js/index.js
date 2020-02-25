let marker;
let searchInput = document.querySelector("#searchInput");
let objectTypes = {
  1: { title: "Земельный участок", icon: "landscape" },
  5: { title: "Помещение", icon: "home" }
};
let objectAttributes = {
  address: "Адрес",
  cad_cost: "Кадастровая стоимость, руб",
  cad_record_date: "Последнее обновление",
  area_value: "Декларированная площадь",
  floors: "Этажи",
  //id: "Кадастровый номер",
  kvartal: "Квартал",
  kvartal_cn: "Кадастровый номер квартала",
  name: "Название",
  ci_first: "Имя",
  date_create: "Постановка на учет",
  ci_n_certificate: "Номер сертификата",
  ci_patronymic: "Отчество",
  ci_surname: "Фамилия",
  lastmodified: "Дата последнего обновления",
  cn: "Кадастровый номер",
  cc_date_approval: "Дата подтверждения",
  cc_date_entering: "Дата вхождения",
  okrug: "Округ",
  oks_type: "Тип ОКС",
  pubdate: "Дата опублкования",
  rayon: "Район",
  underground_floors: "Подземные этажи",
  year_built: "Год постройки",
  year_used: "Год введения в экспулатацию"
};

let landscape_type = {
  "003002000000": "ЗЕМЛИ НАСЕЛЕННЫХ ПУНКТОВ",
  "003002000010":
    "Земли в пределах населенных пунктов, отнесенные к территориальным зонам сельскохозяйственного использования",
  "003002000020":
    "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
  "003002000030":
    "Земельные участки, предоставленные для жилищного строительства",
  "003002000040":
    "Земельные участки, приобретенные в собственность юридическими и физическими лицами на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)  ",
  "003002000050": "",
  "003002000060": "",
  "003002000070": "",
  "003002000080": "",
  "003002000090": "",
  "003002000100": ""
};

let building_type = {
  "204001000000": "Нежилое здание",

  "204002000000": "Жилой дом",

  "204003000000": "Многоквартирный дом "
};
let walls = {
  "061001000000": "Стены",
  "061001001000": "Каменные",
  "061001001001": "Кирпичные",
  "061001001002": "Кирпичные облегченные",
  "061001001003": "Из природного камня",
  "061001002000": "Деревянные",
  "061001002001": "Рубленые",
  "061001002002": "Каркасно-засыпные",
  "061001002003": "Каркасно-обшивные",
  "061001002004": "Сборно:щитовые",
  "061001002005": "Дощатые",
  "061001002006": "Деревянный каркас без обшивки",
  "061001003000": "Смешанные",
  "061001003001": "Каменные и деревянные",
  "061001003002": "Каменные и бетонные",
  "061001004000": "Легкие из местных материалов",
  "061001005000": "Из прочих материалов",
  "061001006000": "Бетонные",
  "061001006001": "Монолитные",
  "061001006002": "Из мелких бетонных блоков",
  "061001006003": "Из легкобетонных панелей",
  "061001007000": "Железобетонные",
  "061001007001": "Крупнопанельные",
  "061001007002": "Каркасно:панельные",
  "061001007003": "Монолитные",
  "061001007004": "Крупноблочные",
  "061001007005": "Из унифицированных железобетонных элементов",
  "061001007006": "Из железобетонных сегментов",
  "061001008000": "Шлакобетонные",
  "061001009000": "Металлические",
  "061001001000": "Стены каменные",
  "061001001001": "Стены каменные кирпичные",
  "061001001002": "Стены каменные кирпичные облегченные",
  "061001001003": "Стены каменные из природного камня",
  "061001002000": "Стены деревянные",
  "061001002001": "Стены деревянные рубленые",
  "061001002002": "Стены деревянные каркасно:засыпные",
  "061001002003": "Стены деревянные каркасно:обшивные",
  "061001002004": "Стены деревянные сборно:щитовые",
  "061001002005": "Стены деревянные дощатые",
  "061001003000": "Стены смешанные",
  "061001003001": "Стены каменные и деревянные",
  "061001003002": "Стены каменные и бетонные",
  "061001004000": "Стены легкие из местных материалов",
  "061001005000": "Стены из прочих материалов",
  "061001006000": "Стены бетонные",
  "061001006001": "Стены бетонные монолитные",
  "061001006002": "Стены бетонные из мелких бетонных блоков",
  "061001006003": "Стены бетонные из легкобетонных панелей",
  "061001007000": "Стены железобетонные",
  "061001007001": "Стены железобетонные крупнопанельные",
  "061001007002": "Стены железобетонные каркасно:панельные",
  "061001007003": "Стены железобетонные монолитные",
  "061001007004": "Стены железобетонные крупноблочные",
  "061001007005":
    "Стены железобетонные из унифицированных железобетонных элементов",
  "061001007006": "Стены железобетонные из железобетонных сегментов",
  "061001008000": "Стены шлакобетонные",
  "061001009000": "Стены металлические"
};

let search_result_container = document.querySelector(
  ".search_result_container"
);

vueData = {
  adressSugestions: [],
  building_type,
  shouldShowSuggestWrapper: true,
  searchResult: [],
  objectAttributes,
  objectTypes,
  activeIndex: 1,
  suggestedCoords: 0,
  openSearchBox: true,
  searchQuery: "",
  loading: false,
  searchTimeOut: false
};

var app = new Vue({
  el: "#search_box",
  data: vueData,
  methods: {
    inputChanged: (coords, suggested) => {
      coords.target.value === undefined
        ? (coords.target.value = coords.target.innerText)
        : "";
      coords.target.value.length === 0 ? (vueData.searchResult = []) : "";

      coords = coords.target.value;

      if (suggested != undefined) {
        getAdressCoords(coords).then(e => {
          getData(vueData.suggestedCoords, 5);
          getData(vueData.suggestedCoords, 1);
        });

        //console.log(vueData.suggestedCoords);
      } else {
        searchAdress(coords, 5).then(() => {
          if (vueData.adressSugestions.length === 1) {
            let suggested_coords = `${vueData.adressSugestions[0].data.geo_lat},${vueData.adressSugestions[0].data.geo_lon}`;
            getData(suggested_coords, 5);
            getData(suggested_coords, 1);
          } else if (vueData.adressSugestions.length === 0) {
            getData(coords, 5, 0);
            getData(coords, 1, 0);
          } else if (vueData.adressSugestions.length > 1) {
          }
        });
      }
    },

    suggestAdress: coords => {
      searchAdress(coords.target.value, 5);
    },
    showSuggestWrapper: data => {
      vueData.shouldShowSuggestWrapper = !vueData.shouldShowSuggestWrapper;
    }
  },
  watch: {
    searchQuery: data => {
      if (data === "") {
        vueData.searchResult = [];
        marker !== undefined ? map.removeLayer(marker) : "";
      }
    }
  }
});

var openStreetMaps = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),
  yandexMap = L.tileLayer(
    "http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU",
    {
      subdomains: ["01", "02", "03", "04"],
      attribution: '<a http="yandex.ru" target="_blank">Яндекс</a>',
      reuseTiles: true,
      updateWhenIdle: false
    }
  ),
  twoGis = L.tileLayer("http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}"),
  googleMaps = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      subdomains: ["mt0", "mt1", "mt2", "mt3"]
    }
  );

let pkk = L.tileLayer.wms(
  `https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?`,
  {
    dpi: 96,
    imageSR: 102100,
    transparent: true,
    f: "image",
    size: "1024,1024",
    format: "PNG32",
    bboxSR: 102100,
    tileSize: 1024,
    layers:
      "show:0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,29,30,31,32,33,34,35,38,39"
  }
);
var baseLayers = {
  OSM: openStreetMaps,
  ЯндексКарта: yandexMap,
  "2GIS": twoGis,
  "Google Maps": googleMaps
};

var overlays = {
  "Публичная кадастровая карта": pkk
};

var map = L.map("map", {
  center: [57.097768401511225, 65.59434413909914],
  zoom: 18,
  zoomControl: false,
  layers: [pkk, openStreetMaps]
});

map.on("click", e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  let latlng = lat + "," + lng;
  setMarker(latlng);
  getData(latlng, 1);
  getData(latlng, 5);
  vueData.searchQuery = latlng;
});

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
L.control
  .zoom({
    position: "bottomright"
  })
  .addTo(map);

function setMarker(coords) {
  coords = coords.split(",");
  marker == undefined
    ? (marker = L.marker(coords).addTo(map))
    : marker._map !== null
    ? marker.setLatLng(coords)
    : marker.addTo(map);
  map.setView(coords, 18);
}

async function searchAdress(adress, count) {
  //adress = adress.target.value;
  fd = {
    query: adress,
    count: count
  };
  if (!vueData.searchTimeOut) {
    await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      {
        method: "POST",
        headers: {
          Authorization: "Token f1888befe1c3e366e2d3110c7dcccb709591a652",
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(fd)
      }
    ).then(response =>
      response.json().then(adress => {
        vueData.adressSugestions = adress.suggestions;
        //console.log(adress.suggestions);
        return vueData.adressSugestions;
      })
    );
  }
}

function getData(coords, type, source) {
  let result = {};
  vueData.openSearchBox = true;
  vueData.adressSugestions = [];
  vueData.loading = true;
  vueData.searchResult = [];

  let timeStamp = new Date().getTime();

  fetch(
    `https://pkk5.rosreestr.ru/api/features/${type}?text=${coords}&tolerance=8&limit=11`
  ).then(res =>
    res.json().then(resp => {
      if (resp.features.length > 0) {
        resp.features !== undefined
          ? (vueData.searchResult[type] = resp.features[0].attrs)
          : console.log(resp);

        if (source === 0) {
          if (type === 5) getAdressCoords(resp.features[0].attrs.address);
        }

        let cn = resp.features[0].attrs.cn;
        cn = cn.split(":");

        cn.forEach((elem, index) => {
          cn[index] = parseInt(cn[index], 10);
        });

        cn = cn.join(":");

        fetch(`https://pkk5.rosreestr.ru/api/features/${type}/${cn}`, {}).then(
          info =>
            info.json().then(response => {
              vueData.loading = false;

              if (response.feature !== null) {
                response.feature.attrs.elements_constuct !== undefined
                  ? response.feature.attrs.elements_constuct.map(element => {
                      element.wall = walls[element.wall];
                    })
                  : (response.feature.attrs.elements_constuct = [
                      {
                        wall: "Не определено"
                      }
                    ]);
                response.feature.attrs.coords = coords;
                response.feature.attrs.address !== undefined
                  ? (vueData.searchResult[type] = response.feature.attrs)
                  : (vueData.searchResult[type] = []);
              }

              vueData.searchResult.push("");
              vueData.searchResult.pop();
            })
        );
      } else {
        vueData.loading = false;
        vueData.searchResult[type] = result;
      }
    })
  );
}

async function getAdressCoords(adress) {
  searchAdress(adress, 1).then(data => {
    let suggested_coords = `${vueData.adressSugestions[0].data.geo_lat},${vueData.adressSugestions[0].data.geo_lon}`;
    getData(suggested_coords, 5);
    getData(suggested_coords, 1);
    setMarker(suggested_coords);
    vueData.suggestedCoords = suggested_coords;
    vueData.adressSugestions = [];
    return suggested_coords;
  });
}
