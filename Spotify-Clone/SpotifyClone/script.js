console.log("Starting the music player...");
let songs;
let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    try {
        // Fetch the list of songs (update this to match your server setup)
        let response = await fetch(`http://127.0.0.1:5500/SpotifyClone/${folder}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse response as text (assuming directory listing or API response)
        let html = await response.text();

        // Create a temporary DOM element to extract links
        let div = document.createElement("div");
        div.innerHTML = html;

        let links = div.getElementsByTagName("a");
        let songs = [];
        for (let link of links) {
            if (link.href.endsWith(".mp3")) {
                songs.push(link.href.split("/songs/")[1]);
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return []; // Return an empty array if an error occurs
    }
}

const playMusic = (track, pause = false) => {

    currentSong.src = `/SpotifyClone/songs/${track}`;
    if (!pause) {
        currentSong.play();
        play.src="./img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
    // Get the list of song
     // Add an event to the card to load the playlist data

     let songs = await getSongs(`songs/ncs`);
    playMusic(songs[0], false)
    console.log("Songs fetched:", songs);

    // Reference to the song list container
    let songUL = document.querySelector(".songList ul");

    // Dynamically populate the song list
    for (const song of songs) {
        const li = document.createElement("li");
        li.innerHTML = `
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Keshu</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>`;
        songUL.appendChild(li);
    }


    async function displayAlbums() {
        try {
            // Fetch the songs directory HTML
            let response = await fetch(`http://127.0.0.1:5500/SpotifyClone/songs/`);
            if (!response.ok) throw new Error("Failed to fetch songs directory.");
            let res = await response.text();
    
            let div = document.createElement("div");
            div.innerHTML = res;
    
            // Select all <a> tags inside the fetched content
            let anchors = div.getElementsByTagName("a");
            let cardContainer = document.querySelector(".cardContainer");
    
            // Iterate through each <a> tag
            for (let e of anchors) {
                if (e.href.includes("/songs")) {
                    let folder = e.href.split("/").splice(-1)[0]; // Extract folder name
                    console.log(`Processing folder: ${folder}`);
    
                    try {
                        // Fetch folder's metadata
                        let metadataResponse = await fetch(
                            `http://127.0.0.1:5500/SpotifyClone/songs/${folder}/info.json`
                        );
                        if (!metadataResponse.ok) {
                            console.error(`Failed to fetch info.json for folder: ${folder}`);
                            continue;
                        }
    
                        let metadata = await metadataResponse.json();
    
                        // Add song card
                        let cardHTML = `
                            <div data-folder="${folder}" class="card">
                                <div class="play">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                            stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <img src="http://127.0.0.1:5500/SpotifyClone/songs/${folder}/cover.jpg" alt="">
                                <h2>${metadata.title}</h2>
                                <p>${metadata.description}</p>
                            </div>`;
                        cardContainer.innerHTML += cardHTML;
                    } catch (error) {
                        console.error(`Error processing folder ${folder}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error("Error displaying albums:", error);
        }
        let z=document.getElementsByClassName("card")
        Array.from(z).forEach((element)=>{
            element.addEventListener("click", async (e)=>{
               const ul = document.getElementById("library")
               ul.innerHTML = "";
               console.log("event hitted")
               songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`);
               let songUL = document.querySelector(".songList ul");
               for (const song of songs) {
                   const li = document.createElement("li");
                   li.innerHTML = `
                       <img class="invert" width="34" src="img/music.svg" alt="">
                       <div class="info">
                           <div>${song.replaceAll("%20", " ")}</div>
                           <div>Keshu</div>
                       </div>
                       <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" src="img/play.svg" alt="">
                       </div>`;
                   songUL.appendChild(li);
                   Array.from(songUL.getElementsByTagName("li")).forEach((li) => {
                       li.addEventListener("click", () => {
                           const songName = li.querySelector(".info").firstElementChild.innerHTML.trim();
                           playMusic(songName);
                       });
                   });
                   playMusic(songs[0], false)
               }
           
            })
    
        });
    }
    
    
  
    

    // Attach event listeners to each song in the list
    Array.from(songUL.getElementsByTagName("li")).forEach((li) => {
        li.addEventListener("click", () => {
            const songName = li.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
        });
    });

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./img/play.svg";
        }
    });

    // Listen For TimeUpdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });

    // Add an event listener to Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    });


    // Add An event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    });

    
    // Add An event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    });


    // Add an event listener to previous and next
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    });
    
    next.addEventListener("click",()=>{
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index+1)<songs.length){
          playMusic(songs[index+1])
      }
    });

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
         currentSong.volume = (e.target.value) / 100
    });

    let z=document.getElementsByClassName("card")
    Array.from(z).forEach((element)=>{
        element.addEventListener("click", async (e)=>{
           const ul = document.getElementById("library")
           ul.innerHTML = "";
           console.log("event hitted")
           songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`);
           let songUL = document.querySelector(".songList ul");
           for (const song of songs) {
               const li = document.createElement("li");
               li.innerHTML = `
                   <img class="invert" width="34" src="img/music.svg" alt="">
                   <div class="info">
                       <div>${song.replaceAll("%20", " ")}</div>
                       <div>Keshu</div>
                   </div>
                   <div class="playnow">
                       <span>Play Now</span>
                       <img class="invert" src="img/play.svg" alt="">
                   </div>`;
               songUL.appendChild(li);
               Array.from(songUL.getElementsByTagName("li")).forEach((li) => {
                   li.addEventListener("click", () => {
                       const songName = li.querySelector(".info").firstElementChild.innerHTML.trim();
                       playMusic(songName);
                   });
               });
           }
       
        })

    });

   
   displayAlbums();
    
}


// Initialize the app
main();
