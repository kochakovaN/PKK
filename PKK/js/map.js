


let search_input = document.querySelector('#search_input')
let wait = false
var pkk = L.layerGroup();
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', attribution: mbAttr }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', attribution: mbAttr }),
    openStreetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    yandexMap = L.tileLayer(
        'http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU', {
        subdomains: ['01', '02', '03', '04'],
        attribution: '<a http="yandex.ru" target="_blank">Яндекс</a>',
        reuseTiles: true,
        updateWhenIdle: false
    }
    ),
    twoGis = L.tileLayer('http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}')
googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] })
    ;
var baseLayers = {

    "OSM": openStreetMaps,
    "ЯндексКарта": yandexMap,
    "2GIS": twoGis,
    "Google Maps": googleMaps
};

L.tileLayer.wms('https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?', {
    format: "PNG8",
    size: "1024,1024",
    transparent: true,
    tileSize: 512,
    bboxSR: 102100,
    imageSR: 102100,
    transparent: true,
    layers: "show:0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,29,30,31,32,33,34,35,38,39",
    dpi: 96,
    f: "image"
}).addTo(pkk)





var overlays = {
    "Публичная кадастровая карта": pkk
};

var map = L.map('mapid', {
    center: [57.143239, 65.611802],
    zoom: 13,
    layers: [pkk, openStreetMaps]
});

L.control.layers(baseLayers, overlays).addTo(map);

map.on('click', onMapClick);

function onMapClick(e) {
    console.log(e.latlng);
}

search_input.addEventListener('input', (e) => searchAdress(e.target.value))

function searchAdress(adress) {
    fd = {
        query: adress,
        count: 10
    }
    if (!wait) {
        fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: 'POST', headers: {
                Authorization: "Token f1888befe1c3e366e2d3110c7dcccb709591a652",
                'Content-Type': 'application/json',
                'Accept': "application/json"
            }, body: JSON.stringify(fd)
        }).then(response => response.json().then(adress => { 
            console.log(adress) 
            wait = true
            setTimeout(() => {
                wait = false
            }, 1000);
        }))
    }
}