var menuisOpen = false
function openMenu() {
    if (!menuisOpen) {
        $("#menuApps").addClass('open')
        var menuItems = document.querySelectorAll('.menuItem')
        menuItems.forEach((menuItem) => {
            menuItem.classList.add('open');
        });
        setTimeout(() => {
            menuisOpen = true
        }, 100);
    }
}

window.addEventListener('click', () => {
    if (menuisOpen) {
        $("#menuApps").removeClass('open')
        var menuItems = document.querySelectorAll('.menuItem')
        menuItems.forEach((menuItem) => {
            menuItem.classList.remove('open');
        });
        menuisOpen = false
    }
});

window.addEventListener("load", () => {

});
let chuva
let chuva3h
let vento3h
let vento
let nuvens
function clima() {
    try {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((geo) => {
                geo = geo.coords;
                $.ajax({
                    url: 'https://api.openweathermap.org/data/2.5/weather',
                    type: 'GET',
                    data: {
                        appid: '9ea904c4a857fe5269f69874e2bb6df5',
                        units: 'metric',
                        lang: 'pt_br',
                        lat: geo.latitude,
                        lon: geo.longitude,
                    },
                    success: (response) => {
                        let temp = response.main.temp;
                        nuvens = response.clouds.all;
                        console.log(nuvens)
                        let descricao = response.weather[0].description;
                        vento = () => {
                            if (response.wind.speed * 3.6 < 25) {
                                return "low";
                            } else if (response.wind.speed * 3.6 >= 25) {
                                return "mid";
                            } else if (response.wind.speed * 3.6 >= 50) {
                                return "high";
                            }
                        };
                        chuva = () => {
                            try {
                                if (response.rain["1h"] < .8) {
                                    return "low"
                                } else if (response.rain['1h'] >= .8) {
                                    return "mid"
                                } else if (response.rain['1h'] >= 2.3) {
                                    return "high"
                                }
                            } catch (error) {
                                return "Nan"
                            }

                        }

                        var elementos = document.querySelectorAll('[clima-info]');

                        elementos.forEach(function (elemento) {
                            var type = elemento.getAttribute('clima-info');
                            switch (type) {
                                case "temp":
                                    elemento.innerHTML = Math.round(temp) + "ºC";
                                    break;
                                case "descricao":
                                    elemento.innerHTML = descricao;
                                    break;
                                case "nuvens":
                                    elemento.innerHTML = nuvens;
                                    break;
                                case "vento":
                                    elemento.innerHTML = vento();
                                    break;
                                case "chuva":
                                    elemento.innerHTML = chuva();
                                    break;
                                default:
                                    reject(new Error("Tipo de informação inválida"));
                            }
                        });
                        setTimeout(() => { principalInfo() }, 500)
                    },
                    error: (err) => {
                        console.error("Erro ao obter os dados do clima:", err);
                        reject(err);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Erro na requisição interna, identificavel como erro: ', error)
    }

}
clima()
setInterval(() => { clima() }, 3.6e+6)


function clima3h() {
    try {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((geo) => {
                geo = geo.coords;
                $.ajax({
                    url: 'https://api.openweathermap.org/data/2.5/forecast',
                    type: 'GET',
                    data: {
                        appid: '9ea904c4a857fe5269f69874e2bb6df5',
                        units: 'metric',
                        lang: 'pt_br',
                        lat: geo.latitude,
                        lon: geo.longitude,
                    },
                    success: (response) => {

                        let descricao = response.list[0].weather[0].description + " nas proximas 3h";
                        vento3h = () => {
                            if ((response.list[0].wind.speed * 3.6) < 25) {
                                return "low";
                            } else if ((response.list[0].wind.speed * 3.6) >= 25) {
                                return "mid";
                            } else if ((response.list[0].wind.speed * 3.6) >= 50) {
                                return "high";
                            }
                        };
                        if (Math.round((response.list[0].pop * 100) / 3) > 0) {
                            chuva3h = Math.round((response.list[0].pop * 100) / 3) + "% de chance de chuva nas proximas 3h"
                        }


                        var elementos = document.querySelectorAll('[clima-3h]');

                        elementos.forEach(function (elemento) {
                            var type = elemento.getAttribute('clima-3h');
                            switch (type) {
                                case "descricao":
                                    elemento.innerHTML = descricao;
                                    break;
                                case "vento":
                                    elemento.innerHTML = vento3h();
                                    break;
                                case "chuva":
                                    elemento.innerHTML = chuva3h;
                                    break;
                                default:
                                    reject(new Error("Tipo de informação inválida"));
                            }
                        });
                    },
                    error: (err) => {
                        console.error("Erro ao obter os dados do clima:", err);
                        reject(err);
                    }

                });
            });
        });
    } catch (error) {
        console.error('Erro na requisição interna, identificavel como erro: ', error)
    }

}
clima3h()


function principalInfo() {
    let infochuva = "Nenhuma chance de chuva agora", infoChuva3h = "Nenhuma chance de chuva nas proximas 3 horas", infoVento3h = "Vento fraco nas proximas 3 horas", infoVento = "Vento fraco", infoNuvem = "Poucas nuvens agora"
    let priority;

    switch (chuva()) {
        case "high":
            infochuva = "Chuva forte agora, recomendo levar um guarda chuva"
            priority = 1
            break;
        case "mid":
            infochuva = "Chuva na sua região, considere levar um guarda chuva"
            priority = 1
            break;
        case "low":
            infochuva = "Pouca chance de chuva agora"
            break;
        case "nan":
            infochuva = "Nenhuma chance de chuva agora"
            break;
        default:
            break;
    }
    try {
        var numerosDaString = chuva3h.match(/\d+/g);
    } catch (error) {
        var numerosDaString = 0;
    }


    infoChuva3h = numerosDaString.join("");
    if (Math.floor(infoChuva3h / 10) == null) {
        infoChuva3h = "Nenhuma chance de chuva nas proximas 3 horas"
    } else if (Math.floor(infoChuva3h / 10) <= 10) {
        infoChuva3h = "Pouca chance de chuva nas próximas 3 horas"
    } else if (Math.floor(infoChuva3h / 10) <= 20) {
        infoChuva3h = "Leves chances de chuva nas proximas 3 horas"
    } else if (Math.floor(infoChuva3h / 10) > 20) {
        infoChuva3h = "Poderá chover nas proximas 3 horas, considere levar um guarda chuva"
        priority = 2
    } else if (Math.floor(infoChuva3h / 10) >= 70) {
        infoChuva3h = "Alta probabilidade de chuva nas proximas 3 horas"
        priority = 2
    }

    switch (vento3h()) {
        case "low":
            infoVento3h = "Vento fraco nas proximas 3 horas"
            break;
        case "mid":
            infoVento3h = "Ventania média nas proximas 3 horas"
            break;
        case "high":
            infoVento3h = "Ventania intensa nas proximas 3 horas"
            priority = 3
            break;
        default:
            break;
    }

    switch (vento()) {
        case "low":
            infoVento = "Pouco vento agora"
            break;
        case "mid":
            infoVento = "Ventania média"
            break;
        case "high":
            infoVento = "Ventania intensa"
            priority = 4
            break;
        default:
            break;
    }

    var infos = [infochuva, infoChuva3h, infoVento3h, infoVento, infoNuvem]
    switch (priority) {
        case 1:
            document.querySelectorAll('[auto-switch-clima]').forEach((e) => {
                e.innerHTML = infos[priority - 1];
            })
            break;
        case 2:
            document.querySelectorAll('[auto-switch-clima]').forEach((e) => {
                e.innerHTML = infos[priority - 1];
            })
            break;
        case 3:
            document.querySelectorAll('[auto-switch-clima]').forEach((e) => {
                e.innerHTML = infos[priority - 1];
            })
            break;
        case 4:
            document.querySelectorAll('[auto-switch-clima]').forEach((e) => {
                e.innerHTML = infos[priority - 1];
            })
            break;
        default:
            var indice = Math.floor(Math.random() * infos.length);

            document.querySelectorAll('[auto-switch-clima]').forEach((e) => {
                e.innerHTML = infos[indice];
            })
            break;
    }

}

setInterval(() => {
    principalInfo()
}, 600000);