class LoginMusicManager {
    private audio: HTMLAudioElement | null = null;
    private fadeOutInterval: number | null = null;

    startMusic() {
        if (this.audio) {
            return; // Music already playing
        }

        this.audio = new Audio('sounds/login/1.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.3;
        this.audio.play().catch((error) => {
            console.error('Failed to play login music:', error);
        });
    }

    fadeOutAndStop(duration: number = 2000) {
        if (!this.audio) return;

        const fadeSteps = 50;
        const stepDuration = duration / fadeSteps;
        const volumeStep = this.audio.volume / fadeSteps;
        let currentStep = 0;

        if (this.fadeOutInterval) {
            clearInterval(this.fadeOutInterval);
        }

        this.fadeOutInterval = window.setInterval(() => {
            if (!this.audio) {
                if (this.fadeOutInterval) clearInterval(this.fadeOutInterval);
                return;
            }

            currentStep++;
            this.audio.volume = Math.max(0, this.audio.volume - volumeStep);

            if (currentStep >= fadeSteps || this.audio.volume === 0) {
                this.stopMusic();
            }
        }, stepDuration);
    }

    stopMusic() {
        if (this.fadeOutInterval) {
            clearInterval(this.fadeOutInterval);
            this.fadeOutInterval = null;
        }

        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    }

    isPlaying(): boolean {
        return this.audio !== null && !this.audio.paused;
    }
}

export const loginMusicManager = new LoginMusicManager();
