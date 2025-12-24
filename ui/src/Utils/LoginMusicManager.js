import AudioService from '../Services/AudioService';
class LoginMusicManager {
    audio = null;
    fadeOutInterval = null;
    fadeInInterval = null;
    musicPath = '/sounds/login/1.mp3';
    targetVolume = 0.3;
    async startMusic(fadeInDuration = 2000) {
        // If music is already playing, don't start again
        if (this.audio && this.audio.playing()) {
            return;
        }
        // Clean up any existing audio
        this.cleanup();
        try {
            this.audio = await AudioService.playSound(this.musicPath, {
                volume: 0, // Start at 0 volume for fade in
                loop: true,
                cache: true
            });
            // Fade in the music
            this.fadeIn(fadeInDuration);
        }
        catch (error) {
            console.error('Failed to start login music:', error);
        }
    }
    fadeIn(duration) {
        if (!this.audio)
            return;
        const fadeSteps = 50;
        const stepDuration = duration / fadeSteps;
        const volumeStep = this.targetVolume / fadeSteps;
        let currentStep = 0;
        if (this.fadeInInterval) {
            clearInterval(this.fadeInInterval);
        }
        this.fadeInInterval = window.setInterval(() => {
            if (!this.audio) {
                if (this.fadeInInterval)
                    clearInterval(this.fadeInInterval);
                return;
            }
            currentStep++;
            const newVolume = Math.min(this.targetVolume, volumeStep * currentStep);
            this.audio.volume(newVolume);
            if (currentStep >= fadeSteps || newVolume >= this.targetVolume) {
                if (this.fadeInInterval) {
                    clearInterval(this.fadeInInterval);
                    this.fadeInInterval = null;
                }
                this.audio.volume(this.targetVolume);
            }
        }, stepDuration);
    }
    cleanup() {
        if (this.fadeOutInterval) {
            clearInterval(this.fadeOutInterval);
            this.fadeOutInterval = null;
        }
        if (this.fadeInInterval) {
            clearInterval(this.fadeInInterval);
            this.fadeInInterval = null;
        }
        if (this.audio) {
            this.audio.stop();
            AudioService.unloadSound(this.musicPath);
            this.audio = null;
        }
    }
    fadeOutAndStop(duration = 2000) {
        if (!this.audio)
            return;
        // Clear any ongoing fade in
        if (this.fadeInInterval) {
            clearInterval(this.fadeInInterval);
            this.fadeInInterval = null;
        }
        const fadeSteps = 50;
        const stepDuration = duration / fadeSteps;
        const currentVolume = this.audio.volume();
        const volumeStep = currentVolume / fadeSteps;
        let currentStep = 0;
        if (this.fadeOutInterval) {
            clearInterval(this.fadeOutInterval);
        }
        this.fadeOutInterval = window.setInterval(() => {
            if (!this.audio) {
                if (this.fadeOutInterval) {
                    clearInterval(this.fadeOutInterval);
                    this.fadeOutInterval = null;
                }
                return;
            }
            currentStep++;
            const newVolume = Math.max(0, currentVolume - (volumeStep * currentStep));
            this.audio.volume(newVolume);
            if (currentStep >= fadeSteps || newVolume <= 0) {
                this.stopMusic();
            }
        }, stepDuration);
    }
    stopMusic() {
        this.cleanup();
    }
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume(volume);
        }
    }
    isPlaying() {
        return this.audio !== null && this.audio.playing();
    }
}
export const loginMusicManager = new LoginMusicManager();
