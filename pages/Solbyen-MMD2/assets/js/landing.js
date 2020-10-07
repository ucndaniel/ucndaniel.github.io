const apiUrl = 'http://olichr5.dreamhosters.com/wp-json/wp/v2/';
const apiKey = 'HtL05J7Vl0cwq1ZORqWCuv2djQ0OVpf2';
const catId = "9"
const maxLength = 335;

let newsText = document.querySelector("#newsText");
let newsHeading = document.querySelector(".newsHeading");

let spinner = document.querySelector(".loading");
let spinning = false;

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
                        let WPdata = JSON.parse(this.responseText);

                        newsHeading.innerText = WPdata[0].acf.title;

                        let fullTextContent = WPdata[0].acf.text.substring(0, maxLength)
                        fullTextContent += "...";
                        newsText.innerText = fullTextContent;

                        js.spinner.stop();

                    } catch (error) {
                        alert(`Fejl ved fortolkning af JSON: ${error}`);
                        // parsing ?= fortolkning
                        // http://www.klid.dk/dansk/ordlister/ordliste.html#p 
                    }
                } if (this.readyState == 4 && this.status > 400) {
                    alert(`FEJL! Kunne ikke hente data. Prøv igen senere.`)
                }
            }
            xhttp.open("GET", `${apiUrl}posts?categories=${catId}&per_page=1`, true);
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

    }
}

js.init();