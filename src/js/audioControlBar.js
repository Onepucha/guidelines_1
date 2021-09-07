// Audio

// Обновление времени панели
function timerBar(where, time) {
	let timerNum = document.createTextNode(formated(time));
	while (where.firstChild) {
		where.removeChild(where.firstChild);
	}
	where.appendChild(timerNum)
}
// Форматирование времени
function formated(time) {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time) % 60;
	let formated = [
		minutes.toString(),
		seconds.toString().padStart(2, '0')
	].join(':');
	return formated;
}
// Поиск всех плееров и аудио тегов
const $allAudioPlayers = document.querySelectorAll('.audio-player');
const $audio = document.querySelectorAll('audio');

let allPlayers = [];
let audios = [];

for (var i = 0; i < $allAudioPlayers.length; i++) allPlayers.push($allAudioPlayers[i]);
for (var i = 0; i < $audio.length; i++) audios.push($audio[i]);

// Первый аудио трек
let currentAudio = audios[0];

// Настройка панели управления в шапке
const mainControlBar = document.querySelector('.main-control');

const mainPlayBtn = mainControlBar.querySelector('.play');
const mainProgress = mainControlBar.querySelector('.progress-line');
const mainProgressBar = mainControlBar.querySelector('.progress-bar');
const mainTimer = mainControlBar.querySelector('.timer');
const mainEnd = mainControlBar.querySelector('.end');

mainPlayBtn.addEventListener('click', function () {
	if (currentAudio.paused) {
		currentAudio.play();
		mainPlayBtn.classList.add('pause');

	} else {
		currentAudio.pause();
		mainPlayBtn.classList.remove('pause');
	}
});

currentAudio.addEventListener('loadedmetadata', function () {
	timerBar(mainEnd, currentAudio.duration);
})

function progressScroll(event, line, audio) {
	let target = event.target.closest('.progress-bar');
	let targetCoords = target.getBoundingClientRect();
	let xCoord = Math.round(((event.clientX - targetCoords.left) / targetCoords.width) * 100);
	audio.currentTime = xCoord / 100 * audio.duration;
	line.style.width = xCoord + '%';
}

function scroll(event) {
	progressScroll(event, mainProgress, currentAudio)
}

mainProgressBar.addEventListener('mousedown', function (event) {
	progressScroll(event, mainProgress, currentAudio)
	if (event.target.closest('.progress-bar')) {
		mainProgressBar.addEventListener('mousemove', scroll)
	}
})

mainProgressBar.addEventListener('mouseleave', function () {
	mainProgressBar.removeEventListener('mousemove', scroll)
})

mainProgressBar.addEventListener('mouseup', function () {
	mainProgressBar.removeEventListener('mousemove', scroll)
})

// Настройка плееров на странице
allPlayers.forEach(audioPlayer => {
	const audio = audioPlayer.querySelector('audio');
	const playBtn = audioPlayer.querySelector('.play');
	const progress = audioPlayer.querySelector('.progress-line');
	const progressBar = audioPlayer.querySelector('.progress-bar');
	const timer = audioPlayer.querySelector('.timer');
	const end = audioPlayer.querySelector('.end');

	let duration = 0;

	audio.addEventListener('loadedmetadata', function () {
		duration = audio.duration;
		timerBar(end, duration);
	})

	audioPlayer.addEventListener('click', function () {
		currentAudio = audio;
		timerBar(mainEnd, currentAudio.duration);
	})

	playBtn.addEventListener('click', function () {

		audios.forEach(el => {
			if (el !== audio) {
				el.pause();
				let buttons = el.parentElement.querySelector('.play');
				buttons.classList.remove('pause');
			}
		})

		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	})

	audio.addEventListener('play', function () {
		playBtn.classList.add('pause');
		mainPlayBtn.classList.add('pause');
	})

	audio.addEventListener('pause', function () {
		playBtn.classList.remove('pause');
		mainPlayBtn.classList.remove('pause');
	})

	audio.addEventListener('timeupdate', function () {

		let curTime = audio.currentTime;
		let width = curTime / duration * 100;
		progress.style.width = width + '%';
		mainProgress.style.width = width + '%';

		timerBar(timer, curTime);
		timerBar(mainTimer, curTime);

	});

	function scroll(event) {
		progressScroll(event, progress, audio)
	}

	progressBar.addEventListener('mousedown', function (event) {
		progressScroll(event, progress, audio)
		if (event.target.closest('.progress-bar')) {
			progressBar.addEventListener('mousemove', scroll)
		}
	})

	progressBar.addEventListener('mouseleave', function () {
		progressBar.removeEventListener('mousemove', scroll)
	})

	progressBar.addEventListener('mouseup', function () {
		progressBar.removeEventListener('mousemove', scroll)
	})

	audio.addEventListener('ended', function () {
		audio.currentTime = 0;
	})

})
