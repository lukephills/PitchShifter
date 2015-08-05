class Tone {

    private _audioContext: AudioContext;

    constructor() {

    		this._audioContext = new AudioContext();

    }

    public get audioContext() {
        return this._audioContext;
    }
}

export = Tone;
