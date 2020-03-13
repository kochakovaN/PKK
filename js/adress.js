async function searchAdress(adress, count) {
    //adress = adress.target.value;
    let fd = {
        query: adress,
        count: count
    };

    if (!vueData.searchTimeOut) {
        await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: "POST",
            headers: {
                Authorization: "Token f1888befe1c3e366e2d3110c7dcccb709591a652",
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(fd)
        }).then(function(response) {
            return response.json().then(function(adress) {
                vueData.adressSugestions = adress.suggestions; //console.log(adress.suggestions);

                return vueData.adressSugestions;
            });
        });
    }
}

function getData(coords, type, source) {
    var result = {};

    if (type === 5) {
        //marker !== undefined ? map.removeLayer(marker) : ;
        formLayer !== undefined ? map.removeLayer(formLayer) : "";
    }

    vueData.openSearchBox = true;
    vueData.adressSugestions = [];
    vueData.loading = true;
    vueData.searchResult = [];
    var timeStamp = new Date().getTime();
    console.log(123)
    fetch("https://pkk5.rosreestr.ru/api/features/".concat(type, "?text=").concat(coords, "&tolerance=8&limit=11")).then(function(res) {
        return res.json().then(function(resp) {
            //map.setView(coords.split(","), 18);

            if (resp.features.length > 0) {
                resp.features !== undefined ? vueData.searchResult[type] = resp.features[0].attrs : console.log(resp);
                vueData.searchResult.push("");
                vueData.searchResult.pop();

                if (source === 0) {
                    getAdressCoords(resp.features[0].attrs.address);
                }

                var cn = resp.features[0].attrs.cn;
                cn = cn.split(":");
                cn.forEach(function(elem, index) {
                    cn[index] = parseInt(cn[index], 10);
                });
                cn = cn.join(":");

                searchByCadNumber(cn)

                if (type === 5) {
                    formLayer = L.tileLayer.wms("https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?", {
                        dpi: 96,
                        imageSR: 102100,
                        transparent: true,
                        f: "image",
                        layers: "show:5",
                        format: "PNG32",
                        bboxSR: 102100,
                        layerDefs: JSON.stringify({
                            "5": "ID = '" + cn + "'"
                        })
                    });
                    formLayer.addTo(map);
                    formLayer.setZIndex(9);
                }


            } else {

                !searchByCadNumber(cn).then(resp => {
                    if (!resp) {
                        vueData.loading = false;
                        vueData.searchResult[type] = result;

                        updateVue()
                    }
                })


            }
        });
    });
}

async function searchByCadNumber(cn) {
    vueData.moreInfo[1] = false
    vueData.moreInfo[5] = false
    vueData.moreInfo.push()
    vueData.moreInfo.pop()
    console.log(123)

    let result = await fetch("https://reestr.cloud/getInfByCadnomer?cadnomer=".concat(cn, "&mapKey=RGRNHdwhIrjhrthbg8392djfghg24452m2-GHJLPRST")).then(function(info) {
        info.json().then(function(info) {
            vueData.loading = false;
            if (info.result !== false) {
                vueData.searchResult[type] = [...ueData.searchResult[type], ...info];

                updateVue()
                return info
            }
            return false
        });
    }).catch(function(e) {
        return false
        vueData.loading = false;
    })

    return
}

function updateVue() {
    vueData.push();
    vueData.pop();
}

async function getAdressCoords(adress) {
    searchAdress(adress, 1).then(function(data) {
        console.log(data);

        if (vueData.adressSugestions[0] === undefined) {} else {
            var suggested_coords = "".concat(vueData.adressSugestions[0].data.geo_lat, ",").concat(vueData.adressSugestions[0].data.geo_lon);

            setMarker(suggested_coords);
            vueData.suggestedCoords = suggested_coords;
            vueData.adressSugestions = [];
            return suggested_coords;
        }
    });
}