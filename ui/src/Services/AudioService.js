import { Howl } from 'howler';
export default class AudioService {
    static loadedSounds = new Map();
    static fadeIntervals = new Map();
    /**
     * Play a sound with optional configuration
     * @param src - Sound file path
     * @param options - Howl configuration options
     * @returns Promise that resolves when sound starts playing
     */
    static async playSound(src, options = {}) {
        const { volume = 1, loop = false, cache = true, onend } = options;
        let sound;
        if (cache && this.loadedSounds.has(src)) {
            sound = this.loadedSounds.get(src);
            sound.volume(volume);
            sound.loop(loop);
            if (onend)
                sound.once('end', onend);
        }
        else {
            sound = new Howl({
                src: [src],
                volume,
                loop,
                onend,
                onloaderror: (_, error) => {
                    console.error(`Failed to load sound: ${src}`, error);
                },
                onplayerror: (_, error) => {
                    console.error(`Failed to play sound: ${src}`, error);
                }
            });
            if (cache) {
                this.loadedSounds.set(src, sound);
            }
        }
        sound.play();
        return sound;
    }
    /**
     * Preload sounds for better performance
     * @param sounds - Array of sound file paths to preload
     */
    static preloadSounds(sounds) {
        sounds.forEach(src => {
            if (!this.loadedSounds.has(src)) {
                const sound = new Howl({
                    src: [src],
                    preload: true,
                    onloaderror: (_, error) => {
                        console.error(`Failed to preload sound: ${src}`, error);
                    }
                });
                this.loadedSounds.set(src, sound);
            }
        });
    }
    /**
     * Stop and unload a specific sound
     * @param src - Sound file path to unload
     */
    static unloadSound(src) {
        const sound = this.loadedSounds.get(src);
        if (sound) {
            sound.stop();
            sound.unload();
            this.loadedSounds.delete(src);
        }
    }
    /**
     * Stop and unload all sounds
     */
    static unloadAllSounds() {
        this.stopAllFades();
        this.loadedSounds.forEach(sound => {
            sound.stop();
            sound.unload();
        });
        this.loadedSounds.clear();
    }
    /**
     * Fade in a sound from 0 to target volume
     * @param sound - Howl instance to fade in
     * @param targetVolume - Target volume (0.0 to 1.0)
     * @param duration - Fade duration in milliseconds
     */
    static fadeIn(sound, targetVolume = 1, duration = 2000) {
        if (!sound)
            return;
        // Clear any existing fade for this sound
        this.clearFade(sound);
        const fadeSteps = 50;
        const stepDuration = duration / fadeSteps;
        const volumeStep = targetVolume / fadeSteps;
        let currentStep = 0;
        sound.volume(0); // Start at 0 volume
        const fadeInterval = window.setInterval(() => {
            if (!sound || !sound.playing()) {
                this.clearFade(sound);
                return;
            }
            currentStep++;
            const newVolume = Math.min(targetVolume, volumeStep * currentStep);
            sound.volume(newVolume);
            if (currentStep >= fadeSteps || newVolume >= targetVolume) {
                sound.volume(targetVolume);
                this.clearFade(sound);
            }
        }, stepDuration);
        this.fadeIntervals.set(sound, fadeInterval);
    }
    /**
     * Fade out a sound from current volume to 0 and optionally stop it
     * @param sound - Howl instance to fade out
     * @param duration - Fade duration in milliseconds
     * @param stopAfterFade - Whether to stop the sound after fade completes
     */
    static fadeOut(sound, duration = 2000, stopAfterFade = true) {
        if (!sound)
            return;
        // Clear any existing fade for this sound
        this.clearFade(sound);
        const fadeSteps = 50;
        const stepDuration = duration / fadeSteps;
        const currentVolume = sound.volume();
        const volumeStep = currentVolume / fadeSteps;
        let currentStep = 0;
        const fadeInterval = window.setInterval(() => {
            if (!sound || !sound.playing()) {
                this.clearFade(sound);
                return;
            }
            currentStep++;
            const newVolume = Math.max(0, currentVolume - (volumeStep * currentStep));
            sound.volume(newVolume);
            if (currentStep >= fadeSteps || newVolume <= 0) {
                sound.volume(0);
                if (stopAfterFade) {
                    sound.stop();
                }
                this.clearFade(sound);
            }
        }, stepDuration);
        this.fadeIntervals.set(sound, fadeInterval);
    }
    /**
     * Clear fade interval for a specific sound
     * @param sound - Howl instance to clear fade for
     */
    static clearFade(sound) {
        const interval = this.fadeIntervals.get(sound);
        if (interval) {
            clearInterval(interval);
            this.fadeIntervals.delete(sound);
        }
    }
    /**
     * Stop all active fades
     */
    static stopAllFades() {
        this.fadeIntervals.forEach(interval => clearInterval(interval));
        this.fadeIntervals.clear();
    }
    /**
     * Play a sound with optional fade in effect
     * @param src - Sound file path
     * @param options - Extended options including fade settings
     * @returns Promise that resolves when sound starts playing
     */
    static async playSoundWithFade(src, options = {}) {
        const { volume = 1, loop = false, cache = true, onend, fadeIn = false, fadeInDuration = 2000 } = options;
        const startVolume = fadeIn ? 0 : volume;
        const sound = await this.playSound(src, {
            volume: startVolume,
            loop,
            cache,
            onend
        });
        if (fadeIn) {
            this.fadeIn(sound, volume, fadeInDuration);
        }
        return sound;
    }
    /**
     * Set global volume for Howler
     * @param volume - Volume level (0.0 to 1.0)
     */
    setGlobalVolume(volume) {
        Howl.volume(volume);
    }
}
