// Un único contexto global
const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// ---- Loop de música con crossfade ----
const tracks = [
 'mp3/synthwave-80s-retro-background-music-400483.mp3',
 "mp3/synthwave-retro-80s-321106.mp3",
 'mp3/pixelate-pixelated-dreams-313358.mp3'
];

let buffers = [];
let currentTrack = 0;
let crossfadeDuration = 3; // segundos de solapamiento

async function loadTracks() {
 for (let t of tracks) {
  const resp = await fetch(t);
  const arrayBuffer = await resp.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  buffers.push(audioBuffer);
 }
 //playTrack(currentTrack);
}

let trackSources = [];
let trackGains = [];
let muted = false;
let isAudioPlaying=false;
function playTrack(index) {
 isAudioPlaying=true;
 const buffer = buffers[index];
 const source = audioCtx.createBufferSource();
 source.buffer = buffer;
 
 const gain = audioCtx.createGain();
 gain.gain.setValueAtTime(muted ? 0 : 0.8, audioCtx.currentTime); // respeta el mute
 
 source.connect(gain).connect(audioCtx.destination);
 source.start();
 
 trackSources[index] = source;
 trackGains[index] = gain;
 
 const duration = buffer.duration;
 
 setTimeout(() => {
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + crossfadeDuration);
  currentTrack = (currentTrack + 1) % buffers.length;
  playTrack(currentTrack);
 }, (duration - crossfadeDuration) * 1000);
}

// función para mutear / desmutear
function toggleMute() {
 muted = !muted;
trackGains.forEach(gain => {
 gain.gain.setValueAtTime(muted ? 0 : 0.8, audioCtx.currentTime);
 });
}


loadTracks();





// ---- Beep con oscilador ----
function playRingSound() {
 const oscillator = audioCtx.createOscillator();
 const gainNode = audioCtx.createGain();
 
 oscillator.type = "sine";
 oscillator.frequency.value = 880;
 
 oscillator.connect(gainNode);
 gainNode.connect(audioCtx.destination);
 
 gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
 gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
 
 oscillator.start(audioCtx.currentTime);
 oscillator.stop(audioCtx.currentTime + 0.2);
}
