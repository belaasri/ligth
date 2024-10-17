document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('downloadForm');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const downloadMp4Btn = document.getElementById('downloadMp4');
    const downloadMp3Btn = document.getElementById('downloadMp3');
    const downloadProgress = document.getElementById('downloadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const videoUrl = document.getElementById('videoUrl').value;
        const videoId = getVideoId(videoUrl);

        if (!videoId) {
            showError('Invalid YouTube URL');
            return;
        }

        try {
            const videoInfo = await fetchVideoInfo(videoId);
            displayVideoInfo(videoInfo);
        } catch (error) {
            showError('Error fetching video information');
        }
    });

    function getVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    async function fetchVideoInfo(videoId) {
        const response = await fetch(`https://youtube-v31.p.rapidapi.com/videos?part=contentDetails%2Csnippet%2Cstatistics&id=${videoId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
                'x-rapidapi-key': 'd1c53133acmsh2e7c470c0bfbb2ep1a074cjsne9dd522da151'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch video information');
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0];
        } else {
            throw new Error('No video information found');
        }
    }

    function displayVideoInfo(videoInfo) {
        document.getElementById('videoTitle').textContent = videoInfo.snippet.title;
        document.getElementById('videoThumbnail').src = videoInfo.snippet.thumbnails.high.url;
        document.getElementById('viewCount').textContent = videoInfo.statistics.viewCount;
        document.getElementById('likeCount').textContent = videoInfo.statistics.likeCount;
        document.getElementById('videoDescription').textContent = videoInfo.snippet.description;

        resultDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
    }

    function simulateDownload(format) {
        let progress = 0;
        downloadProgress.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    alert(`Download complete! (${format})`);
                    downloadProgress.classList.add('hidden');
                }, 500);
            }
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 500);
    }

    downloadMp4Btn.addEventListener('click', () => simulateDownload('MP4'));
    downloadMp3Btn.addEventListener('click', () => simulateDownload('MP3'));
});
