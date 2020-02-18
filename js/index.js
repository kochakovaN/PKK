let search_result_container = document.querySelector(
  ".search_result_container"
);

vueData = {
  adressSugestions: [],
  searchResult: {},
  searchQuery: "",
  loading: false,
  searchTimeOut: false
};

var app = new Vue({
  el: "#search_box",
  data: vueData,
  methods: {
    searchCoords: coords => {
      if (coords.target.value.length > 3) {
        console.log(vueData.adressSugestions);
        getData(coords.target.value, 5);
        getData(coords.target.value, 1);
      }
    },
    suggestAdress: data => {
      searchAdress(data);
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
    format: "PNG8",
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
  center: [57.143239, 65.611802],
  zoom: 13,
  layers: [pkk, openStreetMaps]
});

map.on("click", e => {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  getData(lat + "," + lng, 5);
  getData(lat + "," + lng, 1);
});

L.control.layers(baseLayers, overlays).addTo(map);

function searchAdress(adress,count) {
  adress = adress.target.value;
  fd = {
    query: adress,
    count: 10
  };
  if (!vueData.searchTimeOut) {
    fetch(
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
        vueData.searchTimeOut = true;
        setTimeout(() => {
          vueData.searchTimeOut = false;
        }, 1000);
      })
    );
  }
}

function getData(coords, type) {
  let result = {};
  vueData.searchQuery = coords;
  vueData.loading = true;
  fetch(
    `https://pkk5.rosreestr.ru/api/features/${type}?text=${coords}&tolerance=1&limit=11`
  ).then(res =>
    res.json().then(resp => {
      if (resp.features.length > 0) {
        let cn = resp.features[0].attrs.cn;
        fetch(`https://pkk5.rosreestr.ru/api/features/${type}/${cn}`).then(
          info =>
            info.json().then(response => {
              result = response;
              vueData.loading = false;
              if (response.feature !== null)
                vueData.searchResult[type] = response.feature.attrs;
              else vueData.searchResult[type] = [];
            })
        );
      } else {
        vueData.loading = false;
        vueData.searchResult[type] = result;
      }
    })
  );
}
