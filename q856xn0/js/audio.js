const audioSources = {
    background: 'https://v3.fal.media/files/elephant/f0DnrsbV43NuqogY_hzgH_output_20250712105327_0.wav',
    footstep: 'https://v3.fal.media/files/monkey/M02Y_T2pTCgcMsKq63AT7_output_20250712105321_0.wav',
    switch: 'https://v3.fal.media/files/lion/rqFWlqehlgMnnX66Tjvvv_output_20250712105315_0.wav',
    alert: 'https://v3.fal.media/files/tiger/4nmXmf1wO86b_LU9-_v-d_output_20250712105309_0.wav'
};

const audio = {};
let soundsLoaded = false;
let footstepTimeout = null;

function loadSounds() {
    audio.background = new Audio(audioSources.background);
    audio.background.loop = true;
    audio.background.volume = 0.3;

    audio.footstep = new Audio(audioSources.footstep);
    audio.switch = new Audio(audioSources.switch);
    audio.alert = new Audio(audioSources.alert);

    soundsLoaded = true;
}

function playBackgroundMusic() {
    if (soundsLoaded && audio.background.paused) {
        audio.background.play().catch(e => console.error("Background audio play failed. User interaction might be required.", e));
    }
}

function playFootstep() {
    if (soundsLoaded && !footstepTimeout) {
        audio.footstep.currentTime = 0;
        audio.footstep.play().catch(e => console.error("Footstep audio play failed.", e));
        footstepTimeout = setTimeout(() => {
            footstepTimeout = null;
        }, 400);
    }
}

function playSwitchClick() {
    if (soundsLoaded) {
        audio.switch.currentTime = 0;
        audio.switch.play().catch(e => console.error("Switch audio play failed.", e));
    }
}

function playAlert() {
    if (soundsLoaded) {
        audio.alert.currentTime = 0;
        audio.alert.play().catch(e => console.error("Alert audio play failed.", e));
    }
}

export { loadSounds, playBackgroundMusic, playFootstep, playSwitchClick, playAlert };
