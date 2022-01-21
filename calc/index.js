
class _number{

	constructor(n){
		this.num = n;
		this.isFraction = !Number.isInteger(eval(n));
	}

	setFaction(){
		let ret = new _number(this.num);
		ret.isFraction = this.isFraction;
		if(!ret.isFraction){
			ret.num += ".";
			ret.isFraction = true;
		}
		return ret;
	}

	addDigit(d){
		let ret = new _number(this.num);
		ret.isFraction = this.isFraction;
		if(ret.num === '0'){
			ret.num = d;
		}
		else{
			ret.num += d;
		}
		return ret;
	}
}

class App extends React.Component {

	debug = false;

	constructor(props){

		super(props);

		this.state = Object.assign({}, this.initState);

		this.handelNum = this.handelNum.bind(this);
		this.handelOp = this.handelOp.bind(this);
		this.handelEqu = this.handelEqu.bind(this);
		this.handelClear = this.handelClear.bind(this);
		this.handelDec = this.handelDec.bind(this);
	}

	initState = {
		result: new _number('0'),
		tempNum: new _number('0'),
		operation: "+",
		displayEqualToResult: true,
		displayEqualToOperation: false,
		displayEqualToTempNum: false
	};

	handelClear(){
		this.setState(Object.assign({}, this.initState));
	}

	handelNum(num){

		if(this.state.displayEqualToResult){
			return (
				() => {
					this.setState({
						result: this.state.result.addDigit(num)
					})
				}
			)
		}
		else if(this.state.displayEqualToTempNum){
			return (
				() => {
					this.setState({
						tempNum: this.state.tempNum.addDigit(num)
					})
				}
			)
		}
		else if(this.state.displayEqualToOperation){
			return (
				() => {
					this.setState({
						tempNum: new _number(num),
						displayEqualToOperation: false,
						displayEqualToTempNum: true
					})
				}
			)
		}
	}

	handelDec(){
		if(this.state.displayEqualToResult){
			this.setState({
				result: this.state.result.setFaction()
			})
		}
		else if(this.state.displayEqualToTempNum){
			this.setState({
				tempNum: this.state.tempNum.setFaction()
			})
		}
		else if(this.state.displayEqualToOperation){
			this.setState({
				tempNum: this.state.tempNum.setFaction(),
				displayEqualToOperation: false,
				displayEqualToTempNum: true
			})
		}
	}

	handelOp(_op){

		if(this.state.displayEqualToResult){
			return (
				() => {
					this.setState({
						tempNum: new _number('0'),
						operation: _op,
						displayEqualToOperation: true,
						displayEqualToResult: false
					});
				}
			)
		}
		else if(this.state.displayEqualToOperation){
			return (
				() => {
					this.setState({
						operation: _op
					})
				}
			)
		}
		else if(this.state.displayEqualToTempNum){
			return (
				() => {
					this.setState({
						result: new _number(eval(`(${this.state.result.num}) ${this.state.operation} (${this.state.tempNum.num})`)),
						tempNum: new _number('0'),
						operation: _op,
						displayEqualToOperation: true,
						displayEqualToTempNum: false
					});
				}
			)
		}
	}

	handelEqu(){

		if(this.state.displayEqualToResult || this.state.displayEqualToTempNum){
			this.setState({
				result: new _number(eval(`(${this.state.result.num}) ${this.state.operation} (${this.state.tempNum.num})`)),
				displayEqualToResult: true,
				displayEqualToOperation: false,
				displayEqualToTempNum: false
			})
		}
		else if(this.state.displayEqualToOperation){
			this.setState({
				operation: '+',
				tempNum: new _number('0'),
				displayEqualToOperation: false,
				displayEqualToResult: true
			})
		}
	}

	handelKeyPress(e){

		if(this.debug){
			console.log(e)
		}

		switch(String(e.key)){

			case '0':
				document.getElementById("zero").click();
			break;
			case '1':
				document.getElementById("one").click();
			break;
			case '2':
				document.getElementById("two").click();
			break;
			case '3':
				document.getElementById("three").click();
			break;
			case '4':
				document.getElementById("four").click();
			break;
			case '5':
				document.getElementById("five").click();
			break;
			case '6':
				document.getElementById("six").click();
			break;
			case '7':
				document.getElementById("seven").click();
			break;
			case '8':
				document.getElementById("eight").click();
			break;
			case '9':
				document.getElementById("nine").click();
			break;

			case '.':
				document.getElementById("decimal").click();
			break;

			case '+':
				document.getElementById("add").click();
				break;
			case '-':
				document.getElementById("subtract").click();
			break;
				case '*':
				document.getElementById("multiply").click();
			break;
			case '/':
				document.getElementById("divide").click();
			break;

			case 'Enter':
				document.getElementById("equals").click();
			break;
			case 'Backspace':
				document.getElementById("clear").click();
			break;
		}
	};

	componentDidMount(){
		document.addEventListener("keydown", this.handelKeyPress);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.handelKeyPress);
	}

    render() {

		if(this.debug){
			console.log(this.state);
		}

		let displayMod;
		let displayValue;
		if(this.state.displayEqualToOperation){
			displayMod = "Op";
			displayValue = this.state.operation;
		}
		else if(this.state.displayEqualToResult){
			displayMod = "Ans";
			displayValue = this.state.result.num;
		}
		else if(this.state.displayEqualToTempNum){
			displayMod = "Tmp";
			displayValue = this.state.tempNum.num;
		}

		return (
            <div>

                <div className="bg-light" id="calc">

                    <div id="displayBox">
						<div id="d_0">
							<div id="displayMod">{displayMod}</div>
							<div id="result">{(this.state.result.num)}</div>
						</div>
						<div id="d_1">
							<div id="operation">{this.state.operation}</div>
							<div id="tempNum">{(this.state.tempNum.num)}</div>
						</div>
						<div id="display">{displayValue}</div>

                    </div>

                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('0')} id="zero">0</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('1')} id="one">1</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('2')} id="two">2</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('3')} id="three">3</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('4')} id="four">4</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('5')} id="five">5</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('6')} id="six">6</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('7')} id="seven">7</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('8')} id="eight">8</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelNum('9')} id="nine">9</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelOp('+')} id="add">+</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelOp('-')} id="subtract">-</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelOp('*')} id="multiply">*</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelOp('/')} id="divide">/</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelDec} id="decimal">.</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelClear} id="clear">AC</button>
                    <button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelEqu} id="equals">=</button>
                </div>

            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById("root"));
