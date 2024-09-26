"use client"

import { useAppDispatch, useAppSelector } from '@/redux/redux';
import { setNumber } from '@/redux/state';
import { useState, useEffect } from 'react';

export default function TextToSpeech() { 
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const dispatch = useAppDispatch();

  const number = useAppSelector(
    (state) => state.global.number
  );

  const increaseNumber = () => {
    dispatch(setNumber(number + 1));
  };

  let utterance;

  useEffect(() => {
    // Fetch available voices when the component mounts
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // Set default voice
      }
    };

    // Load voices immediately if they're available
    loadVoices();

    // Add event listener for voice changes (especially useful in some browsers like Chrome)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSpeak = () => {
    if (!text) {
      alert('Please enter some text.');
      return;
    }

    const synth = window.speechSynthesis;

    // Cancel any ongoing speech before starting a new one
    synth.cancel();

    utterance = new SpeechSynthesisUtterance(text);

    // Set selected voice, pitch, and rate
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak the text
    synth.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
  };

  const handleCancel = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Text-to-Speech with Pause/Resume/Cancel</h1>
      
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <br /><br />

      <label>Choose a voice: </label>
      <select
        value={voices.indexOf(selectedVoice)}
        onChange={(e) => setSelectedVoice(voices[e.target.value])}
      >
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <br /><br />

      <label>Pitch: </label>
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
      />
      <span>{pitch}</span>
      <br /><br />

      <label>Rate: </label>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <span>{rate}</span>
      <br /><br />

      <button onClick={handleSpeak} disabled={isSpeaking}>
        Speak
      </button>
      <button onClick={handlePause} disabled={!isSpeaking}>
        Pause
      </button>
      <button onClick={handleResume} disabled={!isSpeaking}>
        Resume
      </button>
      <button onClick={handleCancel} disabled={!isSpeaking}>
        Cancel
      </button>


      <br />
      <button onClick={increaseNumber}>Increase</button>
      <h1>Number: {number}</h1>
    </div>
  );
}
