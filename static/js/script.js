document.addEventListener('DOMContentLoaded', (event) => {
    // Hide the video player by default when the page loads
    const videoPlayer = document.getElementById('dynamicVideoPlayer');
    videoPlayer.classList.remove('visible-video');
    videoPlayer.classList.add('hidden-video');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    // Clear any potential default source in case of browser caching
    videoPlayer.removeAttribute('src');
    while (videoPlayer.firstChild) {
        videoPlayer.removeChild(videoPlayer.firstChild);
    }
});


function handleButtonClick(feeling) {
    const videoPlayer = document.getElementById('dynamicVideoPlayer');
    const videoSource = document.createElement('source');

    // First, hide and pause the video player regardless, then decide to play or not
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoPlayer.classList.remove('visible-video');
    videoPlayer.classList.add('hidden-video');
    videoPlayer.removeAttribute('src');
    // Remove all existing source elements
    while (videoPlayer.firstChild) {
        videoPlayer.removeChild(videoPlayer.firstChild);
    }

    if (feeling === 'default') {
        // If "Default" is clicked, ensure no video plays and the player stays hidden.
        // All necessary hiding/pausing is already done above.
        console.log("Default button clicked: No video will play.");
        return; // Exit the function
    }

    // If it's not the "default" button, proceed with fetching and playing a video
    fetch('/get_video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feeling: feeling }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.video_url) {
            videoSource.src = data.video_url;
            videoSource.type = 'video/mp4'; // Assuming MP4 for simplicity, adjust if needed
            videoPlayer.appendChild(videoSource);
            videoPlayer.classList.remove('hidden-video');
            videoPlayer.classList.add('visible-video');
            videoPlayer.load(); // Load the new video source
            videoPlayer.play();
        } else if (data.error) {
            console.error('Error fetching video:', data.error);
            // If there's an error for a specific video, keep it hidden
            videoPlayer.classList.remove('visible-video');
            videoPlayer.classList.add('hidden-video');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
        // Handle network errors, keep hidden
        videoPlayer.classList.remove('visible-video');
        videoPlayer.classList.add('hidden-video');
    });
}
