document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const powerSwitch = document.getElementById('power');
  const bankSwitch = document.getElementById('bank');
  const volumeControl = document.getElementById('volume');
  const drumPads = document.querySelectorAll('.drum-pad');

  let isPoweredOn = true;
  let currentVolume = 0.5;
  let currentBank = 1;

  const bank1Sounds = {
    Q: ['Heater-1', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'],
    W: ['Heater-2', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'],
    E: ['Heater-3', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'],
    A: ['Heater-4', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'],
    S: ['Clap', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'],
    D: ['Open-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'],
    Z: ['Kick-n-Hat', 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'],
    X: ['Kick', 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'],
    C: ['Closed-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3']
  };

  const bank2Sounds = {
    Q: ['Chord-1', 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'],
    W: ['Chord-2', 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'],
    E: ['Chord-3', 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'],
    A: ['Shaker', 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'],
    S: ['Open-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'],
    D: ['Closed-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'],
    Z: ['Punchy-Kick', 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'],
    X: ['Side-Stick', 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'],
    C: ['Snare', 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3']
  };

  function updateSounds() {
    const sounds = currentBank === 1 ? bank1Sounds : bank2Sounds;
    drumPads.forEach(pad => {
      const key = pad.dataset.key;
      const [name, src] = sounds[key];
      const audio = pad.querySelector('audio');
      audio.src = src;
      pad.id = name;
    });
  }

  function setVolume(vol) {
    document.querySelectorAll('.clip').forEach(audio => {
      audio.volume = vol;
    });
  }

  function playSound(key) {
    if (!isPoweredOn) return;
    const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
    if (!pad) return;

    const audio = pad.querySelector('audio');
    audio.currentTime = 0;
    audio.play();

    display.textContent = pad.id;
    pad.classList.add('active');
    setTimeout(() => pad.classList.remove('active'), 150);

    setTimeout(() => {
      if (isPoweredOn) display.textContent = `Bank ${currentBank}`;
    }, 1000);
  }

  powerSwitch.addEventListener('change', () => {
    isPoweredOn = powerSwitch.checked;
    document.getElementById('drum-machine').classList.toggle('disabled', !isPoweredOn);
    display.textContent = isPoweredOn ? `Bank ${currentBank}` : 'Power Off';
  });

  bankSwitch.addEventListener('change', () => {
    currentBank = bankSwitch.checked ? 2 : 1;
    updateSounds();
    if (isPoweredOn) display.textContent = `Bank ${currentBank}`;
  });

  volumeControl.addEventListener('input', e => {
    currentVolume = parseFloat(e.target.value);
    setVolume(currentVolume);
    if (isPoweredOn) {
      display.textContent = `Volume: ${Math.round(currentVolume * 100)}%`;
      setTimeout(() => {
        display.textContent = `Bank ${currentBank}`;
      }, 1000);
    }
  });

  drumPads.forEach(pad => {
    pad.addEventListener('click', () => {
      playSound(pad.dataset.key);
    });
  });

  document.addEventListener('keydown', e => {
    const key = e.key.toUpperCase();
    if (bank1Sounds[key]) {
      playSound(key);
    }
  });

  updateSounds();
  setVolume(currentVolume);
});
