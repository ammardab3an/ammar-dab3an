
const _SEC = 1000;

const accurateInterval = function (fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    cancel = function () {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel: cancel
    };
};

class App extends React.Component {

    init_state = {
        session_length: 25,
        break_length: 5,
        state: "Ready",
        label: "Session",
        r_minutes: 25,
        r_seconds: 0,
        timer_cancel: () => {},
    }

    constructor(props) {

        super(props);
        this.state = Object.assign({}, this.init_state);

        this.go = () => {
            this.setState(state => {
                if (state.state === "Running Session") {
                    if (state.r_minutes === 0 && state.r_seconds === 0) {
                        this.play_beep_sound();
                        return {
                            label: "Break",
                            state: "Running Break",
                            r_minutes: state.break_length,
                            r_seconds: 0,
                        }
                    }
                    else {
                        if (state.r_seconds === 0) {
                            return {
                                r_minutes: state.r_minutes - 1,
                                r_seconds: 59,
                            }
                        }
                        else {
                            return {
                                r_seconds: state.r_seconds - 1,
                            }
                        }
                    }
                }
                else if (state.state === "Running Break") {
                    if (state.r_minutes === 0 && state.r_seconds === 0) {
                        this.play_beep_sound();
                        state.timer_cancel()
                        return {
                            label: "Session",
                            state: "Ready",
                            r_minutes: state.session_length,
                            r_seconds: 0,
                            timer_cancel: () => {},
                        }
                    }
                    else {
                        if (state.r_seconds === 0) {
                            return {
                                r_minutes: state.r_minutes - 1,
                                r_seconds: 59,
                            }
                        }
                        else {
                            return {
                                r_seconds: state.r_seconds - 1,
                            }
                        }
                    }
                }
            })
        }
    }

    reset_state = () => {
        this.stop_beep_sound();
        this.setState(state => {
            state.timer_cancel();
            return this.init_state;
        })
    }

    handle_start_stop = () => {
        this.setState(state => {

            if (state.state === "Ready") {
                return {
                    state: "Running Session",
                    label: "Session",
                    r_minutes: state.session_length,
                    r_seconds: 0,
                    timer_cancel: accurateInterval(this.go, _SEC).cancel,
                }
            }
            else {
                
                if (state.state.split(' ')[0] === 'Running') {
                    state.timer_cancel();
                    return {
                        state: `Paused ${state.state.split(' ')[1]}`,
                        timer_cancel: () => {},
                    }
                }
                else {
                    return {
                        state: `Running ${state.state.split(' ')[1]}`,
                        timer_cancel: accurateInterval(this.go, _SEC).cancel,
                    }
                }
            }
        })
    }

    play_beep_sound(){
        const beep = document.getElementById("beep");
        beep.currentTime = 0;
        beep.play();
    }

    stop_beep_sound(){
        const beep = document.getElementById("beep");
        beep.pause();
        beep.currentTime = 0;
    }

    render() {
        return (

            <div className="container">
                
                <div className="title">
                    <h1>25 + 5 Clock</h1>   
                </div>

                <div className="timers-len">
                    <div className="timer-box">
                        <div className="labels-box">
                            <p id="session-label">Session Length</p>
                            <p id="session-length">{this.state.session_length}</p>
                        </div>
                        <div className="buttons-box">
                            <div className="_button" id="session-increment" onClick={() => this.setState(state => ({ session_length: Math.min(60, state.session_length + 1) }))}><i className="fas fa-arrow-circle-up"></i></div>
                            <div className="_button" id="session-decrement" onClick={() => this.setState(state => ({ session_length: Math.max(1, state.session_length - 1) }))}><i className="fas fa-arrow-circle-down"></i></div>
                        </div>
                    </div>
                    <div className="timer-box">
                        <div className="labels-box">
                            <p id="break-label">Break Length</p>
                            <p id="break-length">{this.state.break_length}</p>
                        </div>
                        <div className="buttons-box">
                            <div className="_button" id="break-increment" onClick={() => this.setState(state => ({ break_length: Math.min(60, state.break_length + 1) }))}><i className="fas fa-arrow-circle-up"></i></div>
                            <div className="_button" id="break-decrement" onClick={() => this.setState(state => ({ break_length: Math.max(1, state.break_length - 1) }))}><i className="fas fa-arrow-circle-down"></i></div>
                        </div>
                    </div>
                </div>


                <div className="timer-status">
                    <h2 id="timer-label">{this.state.label}</h2>

                    <div id="time-left">
                        {
                            this.state.state === "Ready" 
                                ? (
                                this.state.session_length.toString().padStart(2, '0') + ":00"
                                )
                                : (
                                `${this.state.r_minutes.toString().padStart(2, '0')}:${this.state.r_seconds.toString().padStart(2, '0')}`
                                )
                        }
                    </div>
                </div>
                
                <div className="control-buttons">

                    <div className="_button" id="start_stop" onClick={this.handle_start_stop}>
                        {
                            ["Ready", "Paused Session", "Paused Break"].includes(this.state.state)
                            ?
                            <i className="fas fa-play-circle"></i>
                            :
                            <i className="fas fa-pause-circle"></i>
                        }
                    </div>

                    <div className="_button" id="reset" onClick={this.reset_state}>
                        <i className="fas fa-stop-circle"></i>
                    </div>
                </div>

                <audio id="beep" src="./res/beep.wav"/>
                
                <div className="AmmarDab3an">
                    <p>AmmarDab3an</p>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));