class App extends React.Component {

	constructor(props) {

		super(props);

		this.state = Object.assign({}, this.initState);

		this.handelNum = this.handelNum.bind(this);
		this.handelOp = this.handelOp.bind(this);
		this.handelEqu = this.handelEqu.bind(this);
		this.handelClear = this.handelClear.bind(this);
		this.handelDec = this.handelDec.bind(this);
		this.handelAns = this.handelAns.bind(this);
	}

	initState = {
		ops: '',
		ans: '0',
		ansDec: false,
		tmp: '0',
		tmpDec: false,
		displayed: 'tmp',
		error: false,
	};

	handelClear() {
		this.setState(Object.assign({}, this.initState));
	}

	handelNum(num) {

		return () => {

			this.setState((state) => {
				if (state.displayed === 'ans') {
					return ({
						tmp: num,
						tmpDec: false,
						displayed: 'tmp',
					})
				}
				else {
					return ({
						tmp: state.tmp === '0' ? num : state.tmp + num,
					})
				}
			})
		}
	}

	handelDec() {

		this.setState((state) => {
			if (state.displayed === 'ans') {
				return ({
					tmp: '0.',
					tmpDec: true,
					displayed: 'tmp',
				})
			}
			else {
				return ({
					tmp: state.tmpDec ? state.tmp : state.tmp + '.',
					tmpDec: true,
				})
			}
		})
	}

	handelOp(op) {

		return () => {

			this.setState((state) => {

				if (state.displayed === 'ans') {
					return ({
						tmp: '0',
						tmpDec: false,
						displayed: 'tmp',
						ops: state.ans.toString() + ' ' + op,
					});
				}
				else if (state.displayed === 'tmp') {

					if (state.ops !== '' && state.tmp === '0') {
						return ({
							ops: state.ops + ' ' + op,
						})
					}
					else {
						return ({
							tmp: '0',
							tmpDec: false,
							displayed: 'tmp',
							ops: state.ops + ' ' + state.tmp.toString() + ' ' + op,
						})
					}
				}
			})
		}
	}

	handelEqu() {

		this.setState((state) => {

			if (state.displayed === 'ans') {
				return {};
			}
			else if (state.tmp !== '0') {
				return ({
					tmp: '0',
					tmpDec: false,
					displayed: 'tmp',
					ops: state.ops + ' ' + state.tmp.toString(),
				})
			}
			else {
				try {
					var cans = eval(state.ops);

					if (Number.isNaN(cans) || !Number.isFinite(cans)) {
						throw 'err nan or inf';
					}

					cans = Math.round(cans * 10000) / 10000;
					return ({
						tmp: '0',
						tmpDec: false,
						ans: cans.toString(),
						ansDec: !Number.isInteger(cans),
						displayed: 'ans',
						ops: '',
					})
				}
				catch (error) {

					console.log(error.message);

					setTimeout(() => {
						this.setState({
							error: false
						});
					}, 1000);

					return ({
						ops: '',
						ans: '0',
						ansDec: false,
						tmp: '0',
						tmpDec: false,
						displayed: 'tmp',
						error: true,
					});
				}
			}
		})
	}

	handelAns() {
		this.setState((state) => {
			return ({
				tmp: '0',
				tmpDec: false,
				displayed: 'tmp',
				ops: (state.ops === '') ? state.ans : state.ops + ' ' + state.ans,
			})
		})
	}

	handelKeyPress(e) {

		switch (String(e.key)) {

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

	handelClick(e) {
		if (document.activeElement.toString() == '[object HTMLButtonElement]') { 
			document.activeElement.blur(); 
		} 
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handelKeyPress);
		document.addEventListener("click", this.handelClick);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handelKeyPress);
		document.removeEventListener("click", this.handelClick);
	}

	render() {

		return (

			<div>
				
				<div className="bg-light" id="calc">

					<div id="displayBox">
						<div id="d_0">
							<div id="displayMod">last ans</div>
							<div id="result">{(this.state.ans)}</div>
						</div>
						<div id="d_1">
							<div id="operation">{this.state.ops}</div>
						</div>
						{
							this.state.error
								?
								<div id="display">ERROR</div>
								:
								<div id="display">{this.state.displayed === 'ans' ? this.state.ans : this.state.tmp}</div>
						}
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
					<button className="btn btn-outline-primary rounded-0 border-0" onClick={this.handelAns} id="ans">Ans</button>
				</div>

			</div>
		);
	}
}


ReactDOM.render(
	
	<React.StrictMode>
		<App />
	</React.StrictMode>

	, document.getElementById("root"));
