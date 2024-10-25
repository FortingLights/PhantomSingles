const audio = new Audio();
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const trackList = document.getElementById("track-list");
const playbar = document.getElementById("playbar");
const volumeControl = document.getElementById("volume");
const currentTrackDisplay = document.getElementById("current-track");
let isRepeating = false;
let isShuffling = false; // Variable to track shuffle state
let shuffledIndices = []; // Array to hold shuffled track indices

// Track details
const tracks = [
    { title: "Lost Road", src: "Songs/Lost Road.mp3" },
];

let currentTrackIndex = 0;

// Function to load the current track
function loadTrack(index) {
    audio.src = tracks[index].src;
    audio.load(); // Preload the audio
    currentTrackDisplay.innerText = tracks[index].title; // Update Now Playing display
}

// Function to populate track list
function populateTrackList() {
    tracks.forEach((track, index) => {
        const trackItem = document.createElement("div");
        trackItem.className = "track-item";
        trackItem.innerText = track.title;
        trackItem.addEventListener("click", () => {
            currentTrackIndex = isShuffling ? shuffledIndices[index] : index; // Use shuffled index if shuffling
            loadTrack(currentTrackIndex);
            audio.play();
            playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
        });
        trackList.appendChild(trackItem);
    });
}

// Shuffle the tracks
function shuffleTracks() {
    shuffledIndices = [...Array(tracks.length).keys()]; // Create an array of indices
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]]; // Swap
    }
}

// Play/Pause functionality
playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
    } else {
        audio.pause();
        playButton.innerHTML = "&#9654;"; // Play icon
    }
});

// Previous Track
prevButton.addEventListener("click", () => {
    if (isShuffling) {
        currentTrackIndex = (currentTrackIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
        loadTrack(shuffledIndices[currentTrackIndex]);
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
    }
    audio.play();
    playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
});

// Next Track
nextButton.addEventListener("click", () => {
    if (isShuffling) {
        currentTrackIndex = (currentTrackIndex + 1) % shuffledIndices.length;
        loadTrack(shuffledIndices[currentTrackIndex]);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
    }
    audio.play();
    playButton.innerHTML = "&#10074;&#10074;"; // Pause icon
});

// Autoplay next track when the current one ends
audio.addEventListener('ended', () => {
    if (!isRepeating) {
        if (isShuffling) {
            currentTrackIndex = (currentTrackIndex + 1) % shuffledIndices.length; // Move to the next shuffled track
            loadTrack(shuffledIndices[currentTrackIndex]); // Load the next track
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // Move to the next track
            loadTrack(currentTrackIndex); // Load the next track
        }
        audio.play(); // Start playing the next track
    } else {
        audio.currentTime = 0; // Replay the current track
        audio.play();
    }
});

// Shuffle Button functionality
shuffleButton.addEventListener("click", () => {
    isShuffling = !isShuffling; // Toggle shuffle state
    shuffleButton.classList.toggle("active", isShuffling); // Add active class for styling
    if (isShuffling) {
        shuffleTracks(); // Shuffle the tracks when shuffling is enabled
        currentTrackIndex = 0; // Reset to the first track of the shuffled list
        loadTrack(shuffledIndices[currentTrackIndex]); // Load the first shuffled track
    } else {
        currentTrackIndex = 0; // Reset to the first track
        loadTrack(currentTrackIndex); // Load the original track list
    }
});

// Load the first track on page load
loadTrack(currentTrackIndex);
populateTrackList();

// Volume Control
volumeControl.addEventListener("input", (event) => {
    audio.volume = event.target.value / 100; // Set audio volume (0 to 1)
});

// Update Playbar
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        playbar.value = (audio.currentTime / audio.duration) * 100; // Update playbar position
    }
});

// Seek functionality for playbar
playbar.addEventListener("input", (event) => {
    audio.currentTime = (audio.duration * event.target.value) / 100; // Seek to the selected position
});

// Error handling for audio
audio.addEventListener("error", (e) => {
    console.error("Error occurred while playing audio: ", e);
    // Optionally load the next track on error
    nextButton.click();
});
