
class App extends React.Component {

    constructor(props) {

        super(props)
        
        this.state = {
            quotes: [{quote : "", author: ""}],
            selected_quote_idx: 0,
        }

        this.newQuote_click = this.newQuote_click.bind(this)
    }

    async componentDidMount(){

        const res = await fetch('./quotes.json')
        const data = await res.json()
        
        this.setState({
            quotes: data.quotes,
            selected_quote_idx: Math.floor(Math.random() * data.quotes.length)
        })
    }
    
    updateBackGroundColor(){
        
        let r = Math.floor(55 + Math.random() * 150);
        let g = Math.floor(55 + Math.random() * 150);
        let b = Math.floor(55 + Math.random() * 150);
        
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        function rgbToHex(r, g, b){
            return "#" + r.toString(16) + g.toString(16) + b.toString(16);
        }

        const root = document.documentElement
        let cc = hexToRgb(root.style.getPropertyValue('--background-color'));
        
        if(cc === null){
            root.style.setProperty('--background-color', rgbToHex(r, g, b));
            return;
        }

        let idx = 50;
        let dr = (r - cc.r) * (1/idx);
        let dg = (g - cc.g) * (1/idx);
        let db = (b - cc.b) * (1/idx);

        const id = setInterval(frame, 5);
        
        function frame(){

            if(idx===0){
                clearInterval(id);
            }
            else{
                idx--;
                cc.r += dr;
                cc.g += dg;
                cc.b += db;
                root.style.setProperty('--background-color', rgbToHex(Math.floor(cc.r), Math.floor(cc.g), Math.floor(cc.b)));
            }
        }
    }

    newQuote_click(){

        this.setState({
            selected_quote_idx: Math.floor(Math.random() * this.state.quotes.length)
        })

        this.updateBackGroundColor()
    }

    render() {
        
        const curQuote = this.state.quotes[this.state.selected_quote_idx].quote
        const curAuthor = this.state.quotes[this.state.selected_quote_idx].author
        const curTweetURL = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + curQuote + '" ' + curAuthor)

        return (

            <div id="all-box" >
                
                <div id="quote-box">

                    <div id="text">{curQuote}</div>
                    <div id="author">{curAuthor}</div>

                    <div id="buttons">
                        <button id="new-quote" onClick={this.newQuote_click}>New quote</button>
                        <a id="tweet-quote" target="_top" href={curTweetURL}> <i className="fa fa-twitter" /> </a>
                    </div>

                </div>

                <text id="AmmarDab3an">rewritten by AmmarDab3an</text> 
            </div>
            
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));