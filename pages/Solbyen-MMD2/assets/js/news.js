const apiUrl = 'http://olichr5.dreamhosters.com/wp-json/wp/v2/';
const apiKey = 'HtL05J7Vl0cwq1ZORqWCuv2djQ0OVpf2';
const catId = "9"
let totalPages;
const perPage = 2;
let pageNum = 1;

let pageTitle = document.querySelector(".pageTitle");

let spinner = document.querySelector(".loading");
let spinning = false;


let lastNewsNode;

let js = {
    init: function () {
        js.spinner.start();
        js.WPdata.get();
    },
    WPdata: {
        get: function () {
            const xhttp = new XMLHttpRequest;
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        js.spinner.stop();
                        totalPages = xhttp.getResponseHeader("X-WP-TotalPages");
                        let WPdata = JSON.parse(this.responseText);
                        WPdata.reverse();
                        WPdata.forEach(element => {
                            let article = document.createElement("article")
                            article.innerHTML = `<p class="date">${element.acf.date}</p><h3 class="mediumS">${element.acf.title}</h3><p>${element.acf.text}</p>`
                            pageTitle.after(article);
                        });
                        js.lazy.detect();
                    } catch (error) {
                        alert(`Fejl ved fortolkning af JSON: ${error}`);
                        // parsing ?= fortolkning
                        // http://www.klid.dk/dansk/ordlister/ordliste.html#p 
                    }
                }
                if (this.readyState == 4 && this.status > 400) {
                    alert(`FEJL! Kunne ikke hente data. Prøv igen senere.`)
                }
            }
            xhttp.open("GET", `${apiUrl}posts?categories=${catId}&per_page=${perPage}`, true);
            xhttp.setRequestHeader("Authorization", `Bearer ${apiKey}`)
            xhttp.send();
        }
    },
    spinner: {
        toggle: function () {
            if (spinning) {
                js.spinner.stop;
            } else {
                js.spinner.stop;
            }
        },
        stop: function () {
            spinner.classList.remove("shown");
            spinning = false;
        },
        start: function () {
            spinner.classList.add("shown");
            spinning = true;
        }

    },
    lazy: {
        detect: function () {
            window.onscroll = function () {
                lastNewsNode = document.getElementsByTagName("article");
                lastNewsNode = lastNewsNode[lastNewsNode.length - 1];
                let bounding = lastNewsNode.getBoundingClientRect();
                if (
                    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    (pageNum < totalPages)) {
                    js.lazy.load()
                }
            }
        },
        load: function () {
            pageNum++;
            js.spinner.start();
            const xhttp = new XMLHttpRequest;
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        js.spinner.stop();
                        let WPdata = JSON.parse(this.responseText);
                        WPdata.reverse();
                        WPdata.forEach(element => {
                            let article = document.createElement("article")
                            article.innerHTML = `<p class="date">${element.acf.date}</p><h3 class="mediumS">${element.acf.title}</h3><p>${element.acf.text}</p>`
                            lastNewsNode.after(article);
                        });
                    } catch (error) {
                        alert(`Fejl ved fortolkning af JSON: ${error}`);
                    }
                }
                if (this.readyState == 4 && this.status > 400) {
                    alert(`FEJL! Kunne ikke hente data. Prøv igen senere.`)
                }
            }
            xhttp.open("GET", `${apiUrl}posts?categories=${catId}&per_page=${perPage}&page=${pageNum}`, true);
            xhttp.setRequestHeader("Authorization", `Bearer ${apiKey}`)
            xhttp.send();
        }
    }
}
js.init();