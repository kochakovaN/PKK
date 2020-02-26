let marker;
let formLayer;
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

let leg_type = {
  "100": "частная собственность",
  "110": "собственность граждан",

  "111":
    "собственность физических лиц, занимающихся предпринимательской деятельностью без образования юридического лица",

  "112": "собственность дехканского хозяйства",
  "113": "собственность фермерского хозяйства",

  "114":
    "частная собственность гражданина на средства производства и производимый продукт (с образованием юридического лица)",

  "116": "собственность общая (коллективная)",
  "120": "махаллинская собственность",
  "130": "кооперативная собственность",
  "131": "собственность потребительского кооператива",
  "133": "собственность сельскохозяйственных кооперативов (ширкатов)",
  "134": "Cобственность коллективных хозяйств (колхозов)",
  "135": "собственность унитарных предприятий",
  "136": "собственность производственных кооперативов",
  "140": "собственность хозяйственных объединений и товариществ",
  "141": "собственность хозяйственных обществ",

  "142":
    "собственность хозяйственных обществ (общества с ограниченной или дополнительной ответственностью)",

  "143": "собственность товариществ",
  "144": "собственность открытых акционерных обществ",
  "145": "собственность закрытых акционерных обществ",
  "146": "собственность объединений юридических лиц (ассоциаций и союзов)",
  "147": "собственность коммандитных(полных) товариществ",
  "148": "собственность дочерних хозяйственных обществ",
  "150": "собственность общественных объединений и религиозных организаций",
  "151": "собственность религиозных организаций",
  "152": "собственность общественных организаций",
  "154": "собственность общественных фондов",
  "155": "собственность общественных ассоциаций, союзов и федераций",

  "160":
    "собственность совместных предприятий, иностранных граждан и организаций",

  "161": "собственность совместных предприятий",
  "162": "собственность иностранных граждан и лиц без гражданства",

  "163":
    "собственность иностранных юридических лиц (филиалов и отделений иностранных фирм)",

  "164": "собственность иностранных государств и международных организаций",
  "165": "собственность дипломатических служб, представительств",

  "166":
    "собственность международных организаций и межгосударственных объединений",

  "190": "другие виды частной собственности",
  "200": "публичная собственность",
  "210": "республиканская собственность",
  "211": "собственность государственных концернов",
  "212": "собственность государственных учреждений",
  "213": "собственность государственных организаций и предприятий",
  "214": "собственность учебных и научно-исследовательских учреждений",
  "215": "собственность государственных фондов",

  "220":
    "муниципальная собственность (административно-территориальных образований)",

  "221": "собственность республики каракалпакстан",
  "222": "собственность областных хокимиятов",
  "223": "собственность районных хокимиятов",
  "224": "собственность городских хокимиятов",
  "225": "собственность жилищного и коммунального хозяйства",

  "226":
    "собственность учреждений народного образования, культуры и здравоохранения",

  "227":
    "собственность махаллинских (городских) органов самоуправления граждан",

  "228": "собственность сельских органов самоуправления граждан",
  "290": "другие виды публичной собственности"
};

let landscape_type = {
  "003002000000": "Земли населенных пунктов",
  "003002000010":
    "Земли в пределах населенных пунктов, отнесенные к территориальным зонам сельскохозяйственного использования",
  "003002000020":
    "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
  "003002000030":
    "Земельные участки, предоставленные для жилищного строительства",
  "003002000040":
    "Земельные участки, приобретенные в собственность юридическими и физическими лицами на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)  ",
  "003002000050":
    "Земельные участки, приобретенные в собственность физическими лицами на условиях осуществления на них индивидуального жилищного строительства",
  "003002000060":
    "Земельные участки, предоставленные для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
  "003002000070":
    "Земельные участки, предоставленные юридическим лицам для ведения садоводства и огородничества или животноводства, а также дачного хозяйства",
  "003002000080":
    "Земельные участки, предоставленные физическим лицам для личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
  "003002000090":
    "Земли в пределах населенных пунктов, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
  "003002000100": "Прочие земельные участки"
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
  landscape_type,
  leg_type,
  shouldShowSuggestWrapper: true,
  searchResult: [],
  objectAttributes,
  objectTypes,
  activeIndex: 1,
  suggestedCoords: 0,
  openSearchBox: true,
  moreInfo: {
    1: false,
    5: false
  },
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
      if (!vueData.searchTimeOut) {
        searchAdress(coords.target.value, 5);
        vueData.searchTimeOut = true;
        setTimeout(() => {
          vueData.searchTimeOut = false;
          searchAdress(coords.target.value, 5);
        }, 1000);
      }
    },
    showSuggestWrapper: data => {
      vueData.shouldShowSuggestWrapper = !vueData.shouldShowSuggestWrapper;
    }
  },
  watch: {
    searchQuery: data => {
      if (data === "") {
        vueData.searchResult = [];
        //marker !== undefined ? map.removeLayer(marker) : "";
        formLayer !== undefined ? map.removeLayer(formLayer) : "";
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
  //ЯндексКарта: yandexMap,
  "2GIS": twoGis,
  "Google Maps": googleMaps
};

var overlays = {
  "Публичная кадастровая карта": pkk
};

var map = L.map("map", {
  center: [57.016814017391106, 47.109375],
  zoom: 5,
  zoomControl: false,
  layers: [pkk, openStreetMaps]
});

function onLocationFound(e) {
  console.log(e);
  var radius = e.accuracy;

  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("You are within " + radius + " meters from this point")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then(function(result) {
    if (result.state == "granted") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(e => {
          map.setView([e.coords.latitude, e.coords.longitude], 18);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } else if (result.state == "prompt") {
      report(result.state);
    } else if (result.state == "denied") {
      report(result.state);
    }
    result.onchange = function() {
      report(result.state);
    };
  });
}

function report(state) {
  console.log("Permission " + state);
}

handlePermission();

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
  console.log(coords);
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

  if (type === 5) {
    console.log(formLayer);
    formLayer !== undefined ? map.removeLayer(formLayer) : "";
  }
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
          getAdressCoords(resp.features[0].attrs.address);
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
                let bbox =
                  map.getBounds().getWest() +
                  "," +
                  map.getBounds().getSouth() +
                  "," +
                  map.getBounds().getEast() +
                  "," +
                  map.getBounds().getNorth();
                if (type == 5) {
                  formLayer = L.tileLayer.wms(
                    "https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?",
                    {
                      dpi: 96,
                      imageSR: 102100,
                      transparent: true,
                      f: "image",
                      layers: "show:5",
                      format: "PNG32",
                      bboxSR: 102100,

                      layerDefs: JSON.stringify({ "5": "ID = '" + cn + "'" })
                    }
                  );
                  formLayer.addTo(map);
                  formLayer.setZIndex(9);
                }
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
    console.log(data);
    if (vueData.adressSugestions[0] === undefined) {
    } else {
      let suggested_coords = `${vueData.adressSugestions[0].data.geo_lat},${vueData.adressSugestions[0].data.geo_lon}`;
      getData(suggested_coords, 5);
      getData(suggested_coords, 1);
      setMarker(suggested_coords);
      vueData.suggestedCoords = suggested_coords;
      vueData.adressSugestions = [];
      return suggested_coords;
    }
  });
}
