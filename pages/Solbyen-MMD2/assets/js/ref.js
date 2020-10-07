const apiUrl = "http://olichr5.dreamhosters.com/wp-json/wp/v2/";
const apiKey = "HtL05J7Vl0cwq1ZORqWCuv2djQ0OVpf2";
const catId = "7";

let formattedWPdata = {}; // tomt object
let years = []; // tomt array
let shownYear = 0; // 0 = false

let yearList = document.querySelector("#yearList");
let h2 = document.querySelector("h2");

let spinner = document.querySelector(".loading");
let spinning = false;

let js = {
    init: function () {
        document.addEventListener("input", function (event) {
            if (event.target.id !== "yearList") {
                return;
            }
            shownYear = event.target.value;
        }, false);
        yearList.innerHTML = `<option value="">${currentYear}</option>`;
        js.spinner.start();
        h2.innerText = "Henter Data"
        js.WPdata.get();
    },
    WPdata: {
        get: function () {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        js.spinner.stop();
                        let WPdata = JSON.parse(this.responseText);
                        WPdata.forEach((post, i) => {
                            // creates empty array
                            let pdfLinks = [];
                            let val = Object.values(WPdata[i].acf.pdf);
                            val.forEach((link, i) => {
                                if (link) {
                                    pdfLinks.push(link);
                                }
                                formattedWPdata[post.acf.year] = pdfLinks;
                            });
                            years[i] = post.acf.year;
                        });
                        js.load.years();
                        shownYear = Math.max(...years);
                        h2.innerText = shownYear;
                        js.load.links(shownYear);

                    } catch (error) {
                        alert(`Fejl ved fortolkning af JSON: ${error}`);
                        // parsing ?= fortolkning
                        // http://www.klid.dk/dansk/ordlister/ordliste.html#p
                    }
                }
                if (this.readyState == 4 && this.status > 400) {
                    alert(`FEJL! Kunne ikke hente data. Prøv igen senere.`);
                }
            };
            xhttp.open("GET", `${apiUrl}posts?categories=${catId}&per_page=100`, true);
            xhttp.setRequestHeader("Authorization", `Bearer ${apiKey}`);
            xhttp.send();
        }
    },
    spinner: {
        toggle: function () {
            if (spinning) {
                js.spinner.stop();
            } else {
                js.spinner.stop();
            }
        },
        stop: function () {
            spinner.classList.remove("shown");
        },
        start: function () {
            spinner.classList.add("shown");
        }
    },
    load: {
        years: function () {
            yearList.innerHTML = "";
            let allYears = 0;
            allYears = Object.keys(formattedWPdata);
            allYears.reverse()
                .forEach(year => {
                    yearList.innerHTML += `<option value="${year}">${year}</option>`;
                });
            let select = document.querySelector("select");
            select.addEventListener("change", event => {
                window.scrollTo(0, 0);
                h2.innerText = shownYear;
                js.load.links(shownYear);
            });
        },
        links: function () {
            let prevlinks = document.querySelectorAll("main a");
            prevlinks.forEach(child => {
                child.parentNode.removeChild(child);
            });
            // for each year from WP
            Object.entries(formattedWPdata)
                .forEach(year => {
                    // if user clicked on that year
                    
                    if (shownYear == year[0]) {
                        // load all the pdfs for that year
                        Object.entries(year[1])
                            .forEach(pdf => {
                                var pdflink = document.createElement("a");
                                pdflink.href = pdf[1];
                                pdflink.innerText = pdf[1].split("/").pop();
                                h2.after(pdflink);
                            });
                    }
                });
        }
    }
};

js.init();