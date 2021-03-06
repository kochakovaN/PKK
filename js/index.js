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
    cantFind: false,
    suggestedCoords: 0,
    openSearchBox: true,
    objectTypes,
    moreInfo: {
        1: false,
        5: false
    },
    ordering:{
        checkedOrdering:[],
        name:"",
        errorMessage:"",
        phone:'',
        email:'',
        response:{},
    },
    
    searchQuery: "",
    loading: false,
    searchTimeOut: false
};



var app = new Vue({
    el: "#search_box",
    data: vueData,
    methods: {
        sendPayingData: () =>{
            let cadnum = vueData.searchResult[vueData.activeIndex].cadnum ? vueData.searchResult[vueData.activeIndex].cadnum : vueData.searchResult[vueData.activeIndex].cn
            let order = vueData.ordering
            if(order.email && order.phone && order.checkedOrdering){
                fetch(`https://reestr.cloud/createOrder?mapKey=11&email=${order.email}&phone=${order.phone}&cadnomer=${cadnum}&doc_type=${order.checkedOrdering.join('-')}`).then(async resp =>{
                    let result = await resp.json()
                    vueData.ordering.errorMessage = ''
                    vueData.ordering.response = result
                }).catch(e =>{
                    vueData.ordering.errorMessage = e
                })
            }else{
                vueData.ordering.errorMessage = 'Не все поля заполнены' 
            }
        },
        inputChanged: (coords, suggested) => {

            vueData.loading = true
            coords.target.value === undefined ?
                (coords.target.value = coords.target.innerText) :
                "";
            coords.target.value.length === 0 ? (vueData.searchResult = []) : "";

            coords = coords.target.value;

            if (coords.length > 2000) {
                return
            }

            if (suggested != undefined) {
                getAdressCoords(coords).then(e => {
                    getData(vueData.suggestedCoords, 5);
                    getData(vueData.suggestedCoords, 1);
                    setMarker(vueData.suggestedCoords)
                });

                //console.log(vueData.suggestedCoords);
            } else {
                searchAdress(coords, 5).then(() => {
                    if (vueData.adressSugestions.length === 1) {
                        let suggested_coords = `${vueData.adressSugestions[0].data.geo_lat},${vueData.adressSugestions[0].data.geo_lon}`;
                        getData(suggested_coords, 5);
                        getData(suggested_coords, 1);
                        setMarker(suggested_coords)
                    } else if (vueData.adressSugestions.length === 0) {
                        this.loading = true
                        searchByCadNumber(coords, 5).then(result => {
                            if (result && result.result !== false) {
                                vueData.searchResult[1] = {};
                                vueData.searchResult[5] = result;
                                vueData.activeIndex = 5
                                vueData.searchResult.push("")
                                vueData.searchResult.pop("")
                                getAdressCoords(result.address).then(addres_coords => {
                                    setMarker(addres_coords)
                                })

                            } else {
                                vueData.searchResult[1] = {};
                                vueData.searchResult[5] = {};
                            }


                        })

                    } else if (vueData.adressSugestions.length > 1) {}
                });
            }
        },

        suggestAdress: coords => {
            if (coords.target.value.length > 100) {
                return
            }
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

let pkkOptions = {
    dpi: 98,

    imageSR: 102100,
    transparent: true,
    f: "image",
    size: "1024,1024",
    updateWhenIdle: true,
    format: "PNG8",
    reuseTiles: true,
    tileSize: 1024,
    opacity: 0.9,
}

let pkkLand = L.WMS.tileLayer(
    `https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/Cadastre/MapServer/export?`, {
        ...pkkOptions,
        layers: "show:23,22,24,36,37"
    }
);

let pkkkap = L.WMS.tileLayer(
    `https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/Cadastre/MapServer/export?`, {
        ...pkkOptions,
        layers: "show:31,29,30,38,32,34,39,33,35"
    }
);

let pkkUnits = L.WMS.tileLayer(
    `https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/Cadastre/MapServer/export?`, {
        ...pkkOptions,
        layers: "show:0,8,17"
    }
);



var baseLayers = {
    OSM: openStreetMaps,
    //ЯндексКарта: yandexMap,
    "2GIS": twoGis,
    "Google Maps": googleMaps
};

var overlays = {
    "Объекты капитального стросительства": pkkkap,
    "Земельные участки": pkkLand,
    "Единицы кадастрового деления": pkkUnits,
};

var map = L.map("map", {
    center: [55.752719, 37.617178],
    
    zoom: 14,
    zoomControl: false,
    layers: [pkkkap, pkkLand, pkkUnits, twoGis]
});

map.addControl(new L.Control.Fullscreen({position: "bottomright"}))


L.control.custom({
    position: 'bottomright',
    content : '<i  class="material-icons leaflet-custom-bar leaflet-bar " > print </i>',
    classes : 'btn-group-vertical btn-group-sm',
    style   :
    {
        margin: '10px',
        padding: '0px 0 0 0',
        cursor: 'pointer',
    },
    datas   :
    {
        'foo': 'bar',
    },
    events:
    {
        click: function(data)
        {
            vueData.moreInfo[1] = true
            vueData.moreInfo[5] = true
            setTimeout(() => {
                window.print() 
            }, 500);
            
            
        },
        dblclick: function(data)
        {
            console.log('wrapper div element dblclicked');
            console.log(data);
        },
        contextmenu: function(data)
        {
            console.log('wrapper div element contextmenu');
            console.log(data);
        },
    }
})
.addTo(map);




function handlePermission() {
    try {
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
    } catch (error) {

    }

}

function report(state) {
    console.log("Permission " + state);
}

handlePermission();

map.on("click", e => {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;
    let latlng = lat + "," + lng;
    console.log(map.getBounds().getWest() + "," + map.getBounds().getSouth() + "," + map.getBounds().getEast() + "," + map.getBounds().getNorth())

    getData(latlng, 1);
    getData(latlng, 5);
    //vueData.searchQuery = latlng;
});

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
L.control
    .zoom({
        position: "bottomright"
    })
    .addTo(map);

function setMarker(coords) {
    coords = coords.split(",");
    if (coords.length === 2) {
        marker == undefined ?
            (marker = L.marker(coords).addTo(map)) :
            marker._map !== null ?
            marker.setLatLng(coords) :
            marker.addTo(map);
        let zoom = map._zoom > 18 ? map._zoom : 18
        map.setView(coords, zoom);
    }

}

async function searchAdress(adress, count) {
    fd = {
        query: adress,
        count: count
    };
    // задержка между запросами 
    !vueData.searchTimeOut ? vueData.searchTimeOut = true : await sleep(1000);
    let adress_cur = await fetch(
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
            return adress.suggestions;
        })
    );

    return adress_cur
}

async function getAdressCoords(adress) {
    vueData.loading = true
    let searched_adress = await searchAdress(adress, 1).then(data => {
        vueData.loading = false
        let suggested_coords = `${data[0].data.geo_lat},${data[0].data.geo_lon}`;
        vueData.suggestedCoords = suggested_coords;
        vueData.adressSugestions = [];

        return suggested_coords;

    });
    return searched_adress
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    //vueData.searchResult = [];

    let timeStamp = new Date().getTime();

    fetch(
        `https://pkk.rosreestr.ru/api/features/${type}?_=1584461211208&text=${coords}&limit=40&skip=0&inPoint=true`
        
    ).then(res =>
        res.json().then(resp => {
            //map.setView(coords.split(","), 18);
            if (resp.features.length > 0) {
                resp.features !== undefined ?
                    (vueData.searchResult[type] = resp.features[0].attrs) :
                    console.log(resp);


                vueData.searchResult[type].length !== 0 ? vueData.activeIndex = type : ''
                vueData.searchResult.push("");
                vueData.searchResult.pop();

                if (source === 0) {
                    if (resp.features !== undefined) {
                        getAdressCoords(resp.features[0].attrs.address).then((data) => {
                            console.log(123)
                            getData(data, 5)
                            getData(data, 1)
                            return
                        }).catch(e => {
                            console.log(e)
                            return
                        })
                    }
                }
                if (coords !== null) {
                    setMarker(coords)
                }

                let cn = resp.features[0].attrs.cn;
                cn = cn.split(":");

                cn.forEach((elem, index) => {
                    cn[index] = parseInt(cn[index], 10);
                });
                cn = cn.join(":");



                searchByCadNumber(cn, type).then(result => {
                    if (result && result.result !== false) {
                        vueData.searchResult[type] = result;
                    }
                })

            } else {
                vueData.loading = false;
                vueData.searchResult[type] = result;
            }
        }));
}




async function searchByCadNumber(cn, type) {
    vueData.moreInfo[1] = false
    vueData.moreInfo[5] = false
    if (type === 5) {
        formLayer = L.WMS.tileLayer(
            "https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreSelected/MapServer/export?", {
                dpi: 96,
                imageSR: 102100,
                transparent: true,
                f: "image",
                layers: "show:5",
                format: "PNG16",
                styles: 'boxfill/alg',
                bboxSR: 102100,
                opacity: 0.6,

                layerDefs: JSON.stringify({ "5": "ID = '" + cn + "'" })
            }
        );
        formLayer.addTo(map);
        formLayer.setZIndex(9);
        let formLayerContainer = formLayer.getContainer()
        formLayerContainer.classList.add('filter')
    }

    let res = await fetch("https://reestr.cloud/getInfByCadnomer?cadnomer=".concat(cn, "&mapKey=RGRNHdwhIrjhrthbg8392djfghg24452m2-GHJLPRST"))
        .then(async info => {
            let result = await info.json()
            vueData.loading = false;
            return result
        }).catch(function(e) {
            vueData.loading = false;
            return false
        })

    return res
}

function toggleFullscreen(event) {
    var element = document.body;
  
      if (event instanceof HTMLElement) {
          element = event;
      }
  
      var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
  
      element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
      document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };
  
      isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
  }