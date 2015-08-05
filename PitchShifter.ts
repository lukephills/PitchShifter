
class PitchShifter {

    private previousPitch = -1;
    private delayTime = 0.50;

    public static get FADE_TIME() {
        return 0.25;
    }

    public static get BUFFER_TIME() {
        return 0.50;
    }

    private shiftDownBuffer;
    private shiftUpBuffer;
    private context;
    public input: any;
    public output: any;

    //private mod1;
    //private mod2;
    private bufferSources: any[] = [];

    //private mod1Gain;
    //private mod2Gain;
    //private mod3Gain;
    //private mod4Gain;
    private modGains: any[] = [];

    //private modGain1;
    //private modGain2;
    private delayGains: any[] = [];

    //private delay1;
    //private delay2;
    private delays: any[] = [];

    //private fade1;
    //private fade2;
    private fadeBufferSources: any[] = [];

    //private mix1;
    //private mix2;
    private mixGains: any[] = [];




    constructor(context){
        this.context = context;
        // Create nodes for the input and output of this "module".
        this.input = this.context.createGain();
        this.output = this.context.createGain();

        // Delay modulation. //TODO: for loop!
        //var mod1 = this.context.createBufferSource();
        //var mod2 = this.context.createBufferSource();
        //var mod3 = this.context.createBufferSource();
        //var mod4 = this.context.createBufferSource();
        for (let i = 0; i < 4; i++){
            this.bufferSources.push(this.context.createBufferSource());
        }

        this.shiftDownBuffer = this.createDelayTimeBuffer(false);
        this.shiftUpBuffer = this.createDelayTimeBuffer(true);

        //todo: for loop!
        this.bufferSources.forEach((bufferSource, i: number) => {
            bufferSource.buffer = i < 2 ? this.shiftDownBuffer : this.shiftUpBuffer;
            bufferSource.loop = true;
        });
        //todo for loop!
        //this.bufferSources[0].buffer = this.shiftDownBuffer;
        //this.bufferSources[1].buffer = this.shiftDownBuffer;
        //this.bufferSources[2].buffer = this.shiftUpBuffer;
        //this.bufferSources[3].buffer = this.shiftUpBuffer;
        //this.bufferSources[0].loop = true;
        //this.bufferSources[1].loop = true;
        //this.bufferSources[2].loop = true;
        //this.bufferSources[3].loop = true;

        // for switching between oct-up and oct-down //todo FOR LOOP!
        for (let i = 0; i < 4; i++){
            this.modGains.push(this.context.createGain());
            this.bufferSources[i].connect(this.modGains[i])
        }
        //var mod1Gain = this.context.createGain();
        //var mod2Gain = this.context.createGain();
        //var mod3Gain = this.context.createGain();
        //var mod4Gain = this.context.createGain();

        this.modGains.forEach((modGain, i: number) => {
            modGain.gain.value = i < 2 ? 1 : 0;
        });
        //mod3Gain.gain.value = 0;
        //mod4Gain.gain.value = 0;


        //this.bufferSources[0].connect(mod1Gain);
        //this.bufferSources[1].connect(mod2Gain);
        //this.bufferSources[2].connect(mod3Gain);
        //this.bufferSources[3].connect(mod4Gain);

        // Delay amount for changing pitch.
        //var modGain1 = this.context.createGain();
        //var modGain2 = this.context.createGain();
        //var delay1 = this.context.createDelay();
        //var delay2 = this.context.createDelay();
        for (let i = 0; i < 2; i++){
            this.delayGains.push(this.context.createGain());
            this.delays.push(this.context.createDelay());
            this.delayGains[i].connect(this.delays[i].delayTime);
        }



        for (let i = 0; i < 4; i++) {
            if (i % 2 === 0){
                this.modGains[i].connect(this.delayGains[0])
            } else {
                this.modGains[i].connect(this.delayGains[1])
            }
        }
        //mod1Gain.connect(modGain1);
        //mod2Gain.connect(modGain2);
        //mod3Gain.connect(modGain1);
        //mod4Gain.connect(modGain2);

        //modGain1.connect(delay1.delayTime);
        //modGain2.connect(delay2.delayTime);

        // Crossfading.
        //var fade1 = this.context.createBufferSource();
        //var fade2 = this.context.createBufferSource();
        var fadeBuffer = this.createFadeBuffer();
        //fade1.buffer = fadeBuffer;
        //fade2.buffer = fadeBuffer;
        //fade1.loop = true;
        //fade2.loop = true;

        //var mix1 = this.context.createGain();
        //var mix2 = this.context.createGain();
        //mix1.gain.value = 0;
        //mix2.gain.value = 0;

        //fade1.connect(mix1.gain);
        //fade2.connect(mix2.gain);

        // Connect processing graph.
        for (let i = 0; i < 2; i++){
            this.fadeBufferSources.push(this.context.createBufferSource());
            this.fadeBufferSources[i].buffer = fadeBuffer;
            this.fadeBufferSources[i].loop = true;

            this.mixGains.push(this.context.createGain());
            this.mixGains[i].gain.value = 0;

            this.fadeBufferSources[i].connect(this.mixGains[i].gain);

            this.input.connect(this.delays[i]);
            this.delays[i].connect(this.mixGains[i]);
            this.mixGains[i].connect(this.output);

        }
        //this.input.connect(delay1);
        //this.input.connect(delay2);
        //delay1.connect(mix1);
        //delay2.connect(mix2);
        //mix1.connect(this.output);
        //mix2.connect(this.output);

        // Start
        var t = this.context.currentTime + 0.050;
        var t2 = t + PitchShifter.BUFFER_TIME - PitchShifter.FADE_TIME;
        this.bufferSources[0].start(t);
        this.bufferSources[1].start(t2);
        this.bufferSources[2].start(t);
        this.bufferSources[3].start(t2);
        this.fadeBufferSources[0].start(t);
        this.fadeBufferSources[1].start(t2);

        //this.mod1 = this.bufferSources[0];
        //this.mod2 = this.bufferSources[1];
        //this.mod1Gain = mod1Gain;
        //this.mod2Gain = mod2Gain;
        //this.mod3Gain = mod3Gain;
        //this.mod4Gain = mod4Gain;
        //this.modGain1 = modGain1;
        //this.modGain2 = modGain2;
        //this.fade1 = fade1;
        //this.fade2 = fade2;
        //this.mix1 = mix1;
        //this.mix2 = mix2;
        //this.delay1 = delay1;
        //this.delay2 = delay2;

        this.setDelay(this.delayTime);
    }

    public setDelay(delayTime) {
        this.delayGains.forEach((delayGain) => {
            delayGain.gain.setTargetAtTime(0.5*delayTime, 0, 0.010);
        });
        //this.modGain1.gain.setTargetAtTime(0.5*delayTime, 0, 0.010);
        //this.modGain2.gain.setTargetAtTime(0.5*delayTime, 0, 0.010);
    }

    get PitchOffset(): number {
        return this.previousPitch;
    }

    set PitchOffset(multiplier) {
        if (multiplier>0) { // pitch up

            this.modGains.forEach((modGain, i: number) => {
                modGain.gain.value = i < 2 ? 0 : 1;
            });
            //this.mod1Gain.gain.value = 0;
            //this.mod2Gain.gain.value = 0;
            //this.mod3Gain.gain.value = 1;
            //this.mod4Gain.gain.value = 1;
        } else { // pitch down

            this.modGains.forEach((modGain, i: number) => {
                modGain.gain.value = i < 2 ? 1 : 0;
            });
            //this.mod1Gain.gain.value = 1;
            //this.mod2Gain.gain.value = 1;
            //this.mod3Gain.gain.value = 0;
            //this.mod4Gain.gain.value = 0;
        }
        this.setDelay(this.delayTime*Math.abs(multiplier));
        this.previousPitch = multiplier;
    }

    private createFadeBuffer() {
        var length1 = PitchShifter.BUFFER_TIME * this.context.sampleRate;
        var length2 = (PitchShifter.BUFFER_TIME - 2 * PitchShifter.FADE_TIME) * this.context.sampleRate;
        var length = length1 + length2;
        var buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        var p = buffer.getChannelData(0);

        console.log("createFadeBuffer() length = " + length);

        var fadeLength = PitchShifter.FADE_TIME * this.context.sampleRate;

        var fadeIndex1 = fadeLength;
        var fadeIndex2 = length1 - fadeLength;

        // 1st part of cycle
        for (var i = 0; i < length1; ++i) {
            var value;

            if (i < fadeIndex1) {
                value = Math.sqrt(i / fadeLength);
            } else if (i >= fadeIndex2) {
                value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
            } else {
                value = 1;
            }

            p[i] = value;
        }

        // 2nd part
        for (var i = length1; i < length; ++i) {
            p[i] = 0;
        }


        return buffer;
    }

    private createDelayTimeBuffer(shiftUp) {
        const length1 = PitchShifter.BUFFER_TIME * this.context.sampleRate;
        const length2 = (PitchShifter.BUFFER_TIME - 2 * PitchShifter.FADE_TIME) * this.context.sampleRate;
        const length = length1 + length2;
        const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        let p = buffer.getChannelData(0);

        console.log("createDelayTimeBuffer() length = " + length);

        // 1st part of cycle
        for (let i = 0; i < length1; ++i) {
            if (shiftUp)
            // This line does shift-up transpose
                p[i] = (length1-i)/length;
            else
            // This line does shift-down transpose
                p[i] = i / length1;
        }

        // 2nd part
        for (var i = length1; i < length; ++i) {
            p[i] = 0;
        }

        return buffer;
    }

    connect(unit, outputNum, inputNum) {
        if (Array.isArray(this.output)){
            outputNum = outputNum ? outputNum : 0;
            this.output[outputNum].connect(unit, 0, inputNum);
        } else {
            this.output.connect(unit, outputNum, inputNum);
        }
        return this;
    }

    disconnect(outputNum) {
        if (Array.isArray(this.output)){
            outputNum = outputNum ? outputNum : 0;
            this.output[outputNum].disconnect();
        } else {
            this.output.disconnect();
        }
        return this;
    }
}

export = PitchShifter;
