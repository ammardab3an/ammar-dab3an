
const audioClips = [
    {
        keyCode: 81,
        keyTrigger: 'Q',
        id: 'Heater-1',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
    },
    {
        keyCode: 87,
        keyTrigger: 'W',
        id: 'Heater-2',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
    },
    {
        keyCode: 69,
        keyTrigger: 'E',
        id: 'Heater-3',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
    },
    {
        keyCode: 65,
        keyTrigger: 'A',
        id: 'Heater-4',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
    },
    {
        keyCode: 83,
        keyTrigger: 'S',
        id: 'Clap',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
    },
    {
        keyCode: 68,
        keyTrigger: 'D',
        id: 'Open-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
    },
    {
        keyCode: 90,
        keyTrigger: 'Z',
        id: "Kick-n'-Hat",
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
    },
    {
        keyCode: 88,
        keyTrigger: 'X',
        id: 'Kick',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
    },
    {
        keyCode: 67,
        keyTrigger: 'C',
        id: 'Closed-HH',
        url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
    }
];

function App() {

    const [volume, setVolume] = React.useState(0.5);
    const [lastTriggered, setTriggered] = React.useState("");
    const [record, setRecord] = React.useState([]);
    const [speed, setSpeed] = React.useState(1.0);
    const [playing, setPlaying] = React.useState(false);
    const [playingInt, setPlayingInt] = React.useState(0);

    const handelKeyPress = (e) => {
        if (e.keyCode === 8) {
            setRecord(() => {
                const tmp = [...record];
                tmp.pop();
                return tmp;
            });
        }
    };

    React.useEffect(() => {
        document.addEventListener("keydown", handelKeyPress);
        return () => {
            document.removeEventListener("keydown", handelKeyPress);
        }
    });
    
    const playRecord = () => {
        
        setPlaying(true);

        let idx = 0;
        const selfInterval = setInterval(() => {

            if(idx === record.length){
                setPlaying(false);
                clearInterval(selfInterval);
                return;
            }

            const audioTag = document.getElementById(record[idx++]);
            audioTag.volume = volume;
            audioTag.currentTime = 0;
            audioTag.playbackRate = speed;
            audioTag.play();

        }, 300 / speed);

        setPlayingInt(selfInterval);
    };

    return (

        <div id="drum-machine">

            <h2 id="appTitle">Drum Machine</h2>

            <div id="drumsControl">
                {
                    lastTriggered && 
                    <div id="display">{lastTriggered}</div>
                }
                <div id="drumsBox">
                    {
                        audioClips.map((clip, idx) => (
                            <div key={clip.keyTrigger} className="drum-pad-cont">
                                <Pad
                                    clip={clip} 
                                    volume={volume}
                                    button_id={"drum"+String(idx)}
                                    setTriggered={setTriggered}
                                    setRecord={setRecord}
                                    speed={speed}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div id="volumeControl">
                
                <h3 id="volumeLabel">Volume</h3>

                <input
                    type="range"
                    className="volumeSlider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                        setVolume(e.target.value)
                        const label = document.getElementById("volumeLabel");
                        label.innerText = e.target.value;
                    }}
                    onMouseUp={(e) => {
                        setTimeout(() => {
                            const label = document.getElementById("volumeLabel");
                            label.innerText = "Volume";
                        }, 1000);
                    }}
                />
            </div>

            <div id="speedControl">
                
                <h3 id="speedLabel">Speed</h3>

                <input
                    type="range"
                    className="speedSlider"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={speed}
                    onChange={(e) => {
                        setSpeed(e.target.value)
                        const label = document.getElementById("speedLabel");
                        label.innerText = e.target.value;
                    }}
                    onMouseUp={(e) => {
                        setTimeout(() => {
                            const label = document.getElementById("speedLabel");
                            label.innerText = "Speed";
                        }, 1000);
                    }}
                />
            </div>
            
            {(record.length > 0) && 
                <div id="recordControl">
                    <button id="recordClearBtn" onClick={() => setRecord([])} disabled={playing}>Clear record</button>
                    <button id="recordPlay" onClick={playRecord} disabled={playing}>Play record</button>
                    {
                        playing && 
                        <button id="recordStopPlaying" onClick={() => {
                            setPlaying(false);
                            clearInterval(playingInt);
                        }}>Stop Playing</button>
                    }
                    <textarea
                        value={record.join(' ')}
                    />
                </div>
            }

        </div>
    )
}

function Pad({ clip, volume, speed, button_id, setTriggered, setRecord}) {

    const [active, setActive] = React.useState(0);

    const handelKeyPress = (e) => {
        if (e.keyCode === clip.keyCode) {
            playSound();
        }
    };

    React.useEffect(() => {
        document.addEventListener("keydown", handelKeyPress);
        return () => {
            document.removeEventListener("keydown", handelKeyPress);
        }
    });

    const playSound = () => {

        const audioTag = document.getElementById(clip.keyTrigger);
        audioTag.volume = volume;
        audioTag.currentTime = 0;
        audioTag.playbackRate = speed;
        audioTag.play();

        setTriggered(clip.id);
        setRecord((record) => [...record, clip.keyTrigger]);
    };

    return (
        <button id={button_id} className="drum-pad" onClick={playSound}>
            <audio id={clip.keyTrigger} className="clip" src={clip.url}/>
            {clip.keyTrigger}
        </button>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));