// JS by Dan Høegh
// UCN MMD 2020

// A framework for showing time-encoded hotspots on multiple videos.
// Assumes either video.js or a parent <div> for the video that has the same dimensions as the video.

// ## SETTINGS START
const fps = 30; // ## adjust this to set the frames per second precision on the hotspot appearance (lower = less cpu used)
const debug = false; // ## set to true to get console.log output, use   video.log('text')
// ## SETTINGS END

const msInterval = Math.floor(1000 / fps); // calculate how many ms per loop to match desired FPS. Rounded down
let engine; // declare a variable that will be used for the interval loop

let video = {
    log: (message = 'Missing log text') => {
        if (debug) {
            console.log(message);
        }
    },
    hotspots: {
        running: false,
        init: () => {
            video.log('video hotspot engine: init');
            const elmsVideo = document.querySelectorAll('video'); // grab all videos on the page
            elmsVideo.forEach((elmVideo) => { // loop through the parents of the video elements
                elmVideo.parentElement.classList.add('videoHotspotsParent');
                elmVideo.addEventListener('play', (event) => { // add eventlistener play on videos
                    if (!video.hotspots.running) { // start engine, if it is not running already
                        video.hotspots.on();
                    }
                });
                elmVideo.addEventListener('seeked', (event) => { // add eventlistener play on videos
                    if (!video.hotspots.running) { // start engine, if it is not running already
                        video.hotspots.on(true);
                    }
                });
                elmVideo.addEventListener('pause', (event) => { // add eventlistener stop/pause on videos
                    if (video.hotspots.running) { // if engine is running
                        let videoPlaying = false; // check if all videos are stopped/paused
                        elmsVideo.forEach((elmVideo) => {
                            if (!elmVideo.paused) {
                                videoPlaying = true;
                            }
                        });
                        if (!videoPlaying) {
                            video.hotspots.off(); // if all videos are NOT playing we can turn off the loop engine
                        }
                    }
                });
            });
        },
        on: (isSeeked = false) => {
            // start the interval loop
            video.log('video hotspot engine: on');
            if (!video.hotspots.running) { // only start it if it isn't already running
                video.hotspots.running = true; // make sure to tell our boolean that we are turning on the engine
            }
            engine = setInterval(() => { // start the interval engine
                video.log('engine loop');
                video.hotspots.update(isSeeked);
            }, msInterval);
        },
        off: () => {
            // kill the interval var
            video.log('video hotspot engine: off');
            video.hotspots.running = false; // make sure to tell our boolean that the engine is being stopped
            clearInterval(engine); // stop the engine
        },
        update: () => {
            hotspots.forEach((hotspot, index) => {
                if (hotspot.active) {
                    // get video element for hotspot
                    const video = document.querySelector(`#${hotspot.videoId}>video`);
                    if (video) {
                        const now = video.currentTime;
                        const elmHotspotCheck = document.querySelector(`#hotspotId${index}`);

                        if (hotspot.markIn > now || hotspot.markOut <= now) {
                            // check to see if element with the current hotspot id exists
                            if (elmHotspotCheck) {
                                // remove hotspot element
                                const elmHotspot = document.querySelector(`#hotspotId${index}`);
                                elmHotspot.parentElement.removeChild(elmHotspot);
                                hotspot.onscreen = false; // clear on-screen flag for the current hotspot
                            }
                        } else if (hotspot.markIn <= now && hotspot.markOut > now) {
                            if (!elmHotspotCheck) { // only draw new hotspot if it isn't already drawn
                                let elmHotspot = document.createElement('a');
                                elmHotspot.id = `hotspotId${index}`;
                                elmHotspot.className = 'hotspot';
                                if (hotspot.ui.title) {
                                    elmHotspot.title = hotspot.ui.title;
                                }
                                if (hotspot.ui.text && hotspot.ui.text != "") {
                                    elmHotspot.innerHTML = hotspot.ui.text;
                                }
                                let css = "";
                                css += `width: ${hotspot.sizeX}%;`;
                                css += `height: ${hotspot.sizeY}%;`;
                                css += `left: ${hotspot.posX}%;`;
                                css += `top: ${hotspot.posY}%;`;
                                css += `${hotspot.ui.style};`;
                                if (hotspot.ui.type == 'image') {
                                    // insert image css
                                    css += `background-image: url(${hotspot.ui.image});`;
                                    elmHotspot.classList.add('image');
                                }
                                elmHotspot.style = css;
                                if (hotspot.hotspot.type == 'link') {
                                    // it's a link, set target and href
                                    elmHotspot.href = hotspot.hotspot.url;
                                    elmHotspot.target = hotspot.hotspot.target;
                                    elmHotspot.alt = hotspot.hotspot.alt;
                                } else {
                                    // it's a function, set an eventlistener for click
                                    elmHotspot.addEventListener('click', (event) => {
                                        event.preventDefault(); // prevent the normal action when clicking on an <a> tag
                                        hotspot.hotspot.func(); // run the function that the hotspot JSON contains for this hotspot
                                    });
                                }
                                video.parentElement.appendChild(elmHotspot);
                            }
                        }
                    }
                }
            });
        },
        remove: () => {
            // kill all hotspot related functions, json feed and DOM elements - use  video.hotspots.remove()  to do this
            video.log('video hotspot engine: cleanup');
            video.hotspots.off(); // turn off engine
            const elmsHotspots = document.querySelectorAll('a.hotspot'); // find all hotspot DOM elements
            elmsHotspots.forEach((elmHotspot) => { // loop through hotspots
                elmHotspot.parentElement.removeChild(elmHotspot); // remove current hotspot
            });
            delete video; // remove the variable from memory
            delete hotspots; // remove the variable from memory
        }

    }
}

let choice = {
    type: "box",
    style: `position: absolute;`
};

let choiceCircle = {
    type: "box",
    style: "border-radius: 50%; position: absolute;"
}
let backToMap = {
    type: "box",
    style: "border: solid 2px #004250; background-color: #fff; text-align:center; font-weight: bold; font-size: 26px; color: #004250; padding: 0.5%; background",
    text: "Tilbage til kortet",
    position: "absolute"
};


// hotspots
const hotspots = [
        {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 10.2,
        ui: {
           choice, 
            type: "box",
            text: "Indgang"
        },
        hotspot: {
            type: "function",
            func: () => {
                // Indgang
                videoPlayer.currentTime(5);
                videoPlayer.play();
                pauseTime = 11;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 17.9,
        ui: {
            choice, 
             type: "box",
             text: "Servicecenter"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Servicecenter
                videoPlayer.currentTime(12.5);
                videoPlayer.play();
                pauseTime = 19;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 25.6,
        ui: {
            choice, 
             type: "box",
             text: "Studieadministration"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Studieadministration
                videoPlayer.currentTime(20.5);
                videoPlayer.play();
                pauseTime = 27.3;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 33.4,
        ui: {
            choice, 
             type: "box",
             text: "Studievejledning"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Studievejledning
                videoPlayer.currentTime(28.5);
                videoPlayer.play();
                pauseTime = 36;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 41,
        ui: {
            choice, 
             type: "box",
             text: "Faglokale"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Faglokale
                videoPlayer.currentTime(37);
                videoPlayer.play();
                pauseTime = 44;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 48.9,
        ui: {
            choice, 
             type: "box",
             text: "Gruppeområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Gruppeområde
                videoPlayer.currentTime(46);
                videoPlayer.play();
                pauseTime = 57;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 56.4,
        ui: {
            choice, 
             type: "box",
             text: "Auditorium"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Auditorium
                videoPlayer.currentTime(59);
                videoPlayer.play();
                pauseTime = 67;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 64.4,
        ui: {
            choice, 
             type: "box",
             text: "Bibliotek"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Bibliotek
                videoPlayer.currentTime(70);
                videoPlayer.play();
                pauseTime = 78;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 72.1,
        ui: {
            choice, 
             type: "box",
             text: "Internationalt kontor"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Internationalt kontor
                videoPlayer.currentTime(80);
                videoPlayer.play();
                pauseTime = 90;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 23,
        sizeY: 7,
        posX: 76,
        posY: 79.7,
        ui: {
            choice, 
             type: "box",
             text: "Kantine og spiseområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // Kantine og spiseområde
                videoPlayer.currentTime(91);
                videoPlayer.play();
                pauseTime = 101;
            }
        }
    },


    // map hotspots    
    //hotspots for small circles
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.7,
        sizeY: 4.7,
        posX: 8.2,
        posY: 70.5,
        ui:  {
           choiceCircle, 
            type: "box",
            style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
            text: "indgang"
        },
        hotspot: {
            type: "function",
            func: () => {
                // Indgang circel
                videoPlayer.currentTime(5);
                videoPlayer.play();
                pauseTime = 11;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.7,
        sizeY: 4.7,
        posX: 42.6,
        posY: 88.4,
        ui:  {
           choiceCircle, 
            type: "box",
            style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
            text: "indgang"
        },
        hotspot: {
            type: "function",
            func: () => {
                // Indgang circel 2
                videoPlayer.currentTime(5);
                videoPlayer.play();
                pauseTime = 11;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.7,
        sizeY: 4.7,
        posX: 46.5,
        posY: 86.2,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Servicecenter"
         },
        hotspot: {
            type: "function",
            func: () => {
                // servicecenter circel
                videoPlayer.currentTime(12.5);
                videoPlayer.play();
                pauseTime = 19;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 63.2,
        posY: 69.5,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Studieadministration"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studieadministration circel
                videoPlayer.currentTime(20.5);
                videoPlayer.play();
                pauseTime = 27.3;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 60.3,
        posY: 69.4,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Studievejledning"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studievejledning 1 circel
                videoPlayer.currentTime(28.5);
                videoPlayer.play();
                pauseTime = 36;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 65.4,
        posY: 68.4,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Studievejledning"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studievejledning 2 circel
                videoPlayer.currentTime(28.5);
                videoPlayer.play();
                pauseTime = 36;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 2.7,
        posY: 44.1,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Faglokale"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studievejledning 3 circel //ændres : faglokale
                videoPlayer.currentTime(37);
                videoPlayer.play();
                pauseTime = 44;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 6.6,
        posY: 53,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Faglokale"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studievejledning 4 circel //ændres til faglokale
                videoPlayer.currentTime(37);
                videoPlayer.play();
                pauseTime = 44;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 6.1,
        posY: 70.5,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Faglokale"
         },
        hotspot: {
            type: "function",
            func: () => {
                // studievejledning 5 circel // ændres til faglokale
                videoPlayer.currentTime(37);
                videoPlayer.play();
                pauseTime = 44;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.7,
        sizeY: 4.7,
        posX: 16,
        posY: 49.5,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "gruppeområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // faglokale 1 circel // ændres til gruppeområde 1
                videoPlayer.currentTime(46);
                videoPlayer.play();
                pauseTime = 57;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 26.4,
        posY: 62,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "gruppeområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // faglokale 2 circel // ændres til gruppeområde 2
                videoPlayer.currentTime(46);
                videoPlayer.play();
                pauseTime = 57;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 5.7,
        posY: 49.8,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "gruppeområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // faglokale 3 circel // ændres til gruppeområde
                videoPlayer.currentTime(46);
                videoPlayer.play();
                pauseTime = 57;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 48.4,
        posY: 77,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "gruppeområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // faglokale 4 circel // ændres til gruppeområde
                videoPlayer.currentTime(46);
                videoPlayer.play();
                pauseTime = 57;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 29.4,
        posY: 62,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Auditorium"
         },
        hotspot: {
            type: "function",
            func: () => {
                // gruppeområde 1 circel // ændres til auditorium
                videoPlayer.currentTime(59);
                videoPlayer.play();
                pauseTime = 67;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 11.9,
        posY: 69.4,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Auditorium"
         },
        hotspot: {
            type: "function",
            func: () => {
                // gruppeområde 2 circle // ændres til Auditorium
                videoPlayer.currentTime(59);
                videoPlayer.play();
                pauseTime = 67;
            }
        }
    },

    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 50.5,
        posY: 63,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Bibliotek"
         },
        hotspot: {
            type: "function",
            func: () => {
                // auditorium circle // ændres til bibliotek
                videoPlayer.currentTime(70);
                videoPlayer.play();
                pauseTime = 78;
            }
        }
    },

{
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 44.9,
        posY: 72.5,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Bibliotek"
         },
        hotspot: {
            type: "function",
            func: () => {
                // bibliotek circle 
                videoPlayer.currentTime(70);
                videoPlayer.play();
                pauseTime = 78;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 52.3,
        posY: 79.1,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "Internationalt kontor"
         },
        hotspot: {
            type: "function",
            func: () => {
                // internationalt kontor circle
                videoPlayer.currentTime(80);
                videoPlayer.play();
                pauseTime = 90;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 17.5,
        posY: 55,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "kantine og spiseområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // kantine og spiseområde circle
                videoPlayer.currentTime(91);
                videoPlayer.play();
                pauseTime = 101;
            }
        }
    },
    {
        active: true,
        videoId: "video1",
        markIn: 0,
        markOut: 4.1,
        sizeX: 2.3,
        sizeY: 4.4,
        posX: 17.5,
        posY: 66,
        ui:  {
            choiceCircle, 
             type: "box",
             style: `border-radius: 50%; position: absolute; color: rgba(0, 0, 0, 0) ;`,
             text: "kantine og spiseområde"
         },
        hotspot: {
            type: "function",
            func: () => {
                // kantine og spiseområde circle 2
                videoPlayer.currentTime(91);
                videoPlayer.play();
                pauseTime = 101;
            }
        }
    },


    // BACK TO MAP POINTS

// permanent point?
{
    active: true,
    videoId: "video1",
    markIn: 5,
    markOut: 101,
    sizeX: `auto`,
    sizeY: `auto`,
    posX: 70,
    posY: 10,
    ui: {
        type: "box",
        style: `border: none;
        font-size: 20px;
        color: #fff;
        text-align: center;
        background-color: rgb(0 66 80 / 60%);
        padding: 1vw; 
        border-radius: .5vw;
        position: absolute;`,
        text: "Tilbage til kortet"
    },
    hotspot: {
        type: "function",
        func: () => {
            // back to map (konstant box)
            videoPlayer.currentTime(0);
            videoPlayer.play();
            pauseTime = 3.4;
        }
    }
},  

// forskellige points indsat efter bestemte tider
//  {
//         active: true,
//         videoId: "video1",
//         markIn: 10,
//         markOut: 11,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (indgang)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },  
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 18,
//         markOut: 19.4,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (servicecenter)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },  
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 25,
//         markOut: 27,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (studieadministration)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },  
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 34,
//         markOut: 37,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (studievejledning)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },  

//     {
//         active: true,
//         videoId: "video1",
//         markIn: 41,
//         markOut: 44,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (faglokale)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },  
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 55,
//         markOut: 57,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (gruppeområde)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 65,
//         markOut: 67,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (auditorium)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 77,
//         markOut: 78,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (bibliotek)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 88,
//         markOut: 90,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (internationalt kontor)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },
//     {
//         active: true,
//         videoId: "video1",
//         markIn: 99,
//         markOut: 101,
//         sizeX: 36,
//         sizeY: 38,
//         posX: 62,
//         posY: 16.4,
//         ui: backToMap,
//         hotspot: {
//             type: "function",
//             func: () => {
//                 // back to map (kantine og spiseområde)
//                 videoPlayer.currentTime(0);
//                 videoPlayer.play();
//                 pauseTime = 4;
//             }
//         }
//     },
];




    // {
    //     active: true,
    //     videoId: "video1",
    //     markIn: 0,
    //     markOut: 4.1,
    //     sizeX: 17,
    //     sizeY: 6,
    //     posX: 76,
    //     posY: 16.4,
    //     ui: choice,
    //     hotspot: {
    //         type: "function",
    //         func: () => {
    //             // Indgang
    //             videoPlayer.currentTime(5);
    //             videoPlayer.play();
    //             pauseTime = 11;
    //         }
    //     }
    // },




/*

// MIXED EXAMPLE WITH MORE KEY/VALUE PAIRS THAN YOU REALLY NEED

{
    active: true,           // you can set this to false if you don't want this hotspot to appear
    videoId: "video4",      // the id of the video tag you want to add a hotspot to
    markIn: 5,              // when to start (seconds)
    markOut: 6,             // when to end (seconds)
    sizeX: 50,              // width (in %, but don't write %)
    sizeY: 50,              // height (in %, but don't write %)
    posX: 0,                // left position (in %, but don't write %)
    posY: 50,               // top position (in %, but don't write %)
    ui: {                               // how should the hotspot look?
        type: "box",                                // type: "box" or "image"
        title: "Text when hovering the hotspot",    // optional: add a title attribute with the text
        image: "",                                  // add url for image (if type=image)
        style: "",                                  // add styles, can be used for both image and box
    },
    hotspot: {                          // what should the hotspot do when clicked?
        type: "link",                               // type: "link" or "function"
        onHover: true,                              // trigger on hover (if type=function)
        url: "http://tv2.dk",                       // url (if type=link)
        target: "_blank",                           // target (if type=link)
        func: () => {             // (if type=function)
            // run any javascript you want done when clicking on the hotspot
            // Leave empty if you want nothing to happen
        }
    }
}



// BOX/LINK ONLY EXAMPLE ----------------------------------------------------
// All these keys are required for boxes/links

{
    active: true,
    videoId: "video4",
    markIn: 5,
    markOut: 6,
    sizeX: 50,
    sizeY: 50,
    posX: 0,
    posY: 50,
    ui: {
        type: "box",
        title: "Text when hovering the hotspot",    // optional: add a title attribute with the text
        style: "border: 2px solid green; background-color: rgba(0,255,0,.5)"
    },
    hotspot: {
        type: "link",
        url: "http://tv2.dk",
        target: "_blank"
    }
}


// IMAGE/FUNCTION ONLY EXAMPLE ----------------------------------------------------
// All these keys are required for images/functions

const hotspots = [
    {
        active: true,
        videoId: "video1",
        markIn: 20.4,
        markOut: 21,
        sizeX: 30,
        sizeY: 32,
        posX: 52,
        posY: 6,
        ui: {
            type: "image",
            title: "Text when hovering the hotspot",    // optional: add a title attribute with the text
            image: "assets/images/speech-scream.png",
            style: "border: none"
        },
        hotspot: {
            type: "function",
            onHover: true,      // optional, will default to false (trigger function on click)
            func: () => {
                console.log("Internal screaming!");
            }
        }
    },


*/