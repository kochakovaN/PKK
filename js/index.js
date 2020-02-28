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

let search_result_container = document.querySelector(
    ".search_result_container"
);

vueData = {
    adressSugestions: [],
    shouldShowSuggestWrapper: true,
    searchResult: [],
    activeIndex: 1,
    suggestedCoords: 0,
    openSearchBox: true,
    objectTypes,
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
            coords.target.value === undefined ?
                (coords.target.value = coords.target.innerText) :
                "";
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
                    } else if (vueData.adressSugestions.length > 1) {}
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
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ),
    yandexMap = L.tileLayer(
        "http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU", {
            subdomains: ["01", "02", "03", "04"],
            attribution: '<a http="yandex.ru" target="_blank">Яндекс</a>',
            reuseTiles: true,
            updateWhenIdle: false
        }
    ),
    twoGis = L.tileLayer("http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}"),
    googleMaps = L.tileLayer(
        "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        }
    );

let pkk = L.tileLayer.wms(
    `https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?`, {
        dpi: 96,
        imageSR: 102100,
        transparent: true,
        f: "image",
        size: "1024,1024",
        format: "PNG32",
        bboxSR: 102100,
        tileSize: 1024,
        layers: "show:0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,23,24,29,30,31,32,33,34,35,38,39"
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
    marker == undefined ?
        (marker = L.marker(coords).addTo(map)) :
        marker._map !== null ?
        marker.setLatLng(coords) :
        marker.addTo(map);
    map.setView(coords);
}

async function searchAdress(adress, count) {
    //adress = adress.target.value;
    fd = {
        query: adress,
        count: count
    };
    if (!vueData.searchTimeOut) {
        await fetch(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
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
        //marker !== undefined ? map.removeLayer(marker) : ;
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
            map.setView(coords.split(","), 18);
            if (resp.features.length > 0) {
                resp.features !== undefined ?
                    (vueData.searchResult[type] = resp.features[0].attrs) :
                    console.log(resp);

                vueData.searchResult.push("");
                vueData.searchResult.pop();

                if (source === 0) {
                    getAdressCoords(resp.features[0].attrs.address);
                }

                let cn = resp.features[0].attrs.cn;
                cn = cn.split(":");

                cn.forEach((elem, index) => {
                    cn[index] = parseInt(cn[index], 10);
                });
                cn = cn.join(":");
                if (type === 5) {
                    formLayer = L.tileLayer.wms(
                        "https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?", {
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




                fetch(`https://reestr.cloud/getInfByCadnomer?cadnomer=${cn}&mapKey=RGRNHdwhIrjhrthbg8392djfghg24452m2-GHJLPRST`).then(info => {
                    info.json().then(info => {
                        vueData.loading = false;
                        if (info.result !== false) {
                            vueData.searchResult[type] = info
                            vueData.searchResult.push("");
                            vueData.searchResult.pop();
                        }
                    })
                }).catch(function(e) {
                    vueData.loading = false;
                })




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
        if (vueData.adressSugestions[0] === undefined) {} else {
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

document.querySelector("#searchInput").addEventListener("focus", event => {
    vueData.shouldShowSuggestWrapper = true;
});
document
    .querySelector("#suggestionWrapper")
    .addEventListener("focus", event => {
        vueData.shouldShowSuggestWrapper = true;
    });