
const marked = window.marked;
const renderer = new marked.Renderer();
const prism = window.Prism;

marked.setOptions({
	breaks: true,
	highlight: function (code) {
		return prism.highlight(code, prism.languages.javascript, 'javascript');
	}
});

renderer.link = function (href, title, text) {
	return `<a target="_blank" href="${href}">${text}</a>`;
};
class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user_input: ''
		}

		this.user_input_changed = this.user_input_changed.bind(this);
		this.editor_expand_clicked = this.editor_expand_clicked.bind(this);
		this.preview_expand_clicked = this.preview_expand_clicked.bind(this);
	}

	async componentDidMount() {

		const tmp = await fetch('./init_content.txt');
		const tmp_text = await tmp.text();

		this.setState({
			user_input: tmp_text,
			editor_expanded: false,
			preview_expanded: false
		});
	}

	user_input_changed(e) {
		this.setState({
			user_input: e.target.value
		})
	}

	editor_expand_clicked(e) {
		this.setState({
			editor_expanded: !this.state.editor_expanded
		});
	}

	preview_expand_clicked(e) {
		this.setState({
			preview_expanded: !this.state.preview_expanded
		});
	}

	Toolbar(props) {
		return (
			<div className="toolbar">
				<i className="fa fa-free-code-camp" aria-hidden="true" />
				<p className="toolbar_title">{props.title}</p>
				<i className="fa fa-arrows-alt" aria-hidden="true" onClick={props.onClick}></i>
			</div>
		)
	}

	render() {

		return (
			<div id="app_container">

				<div id="editor_box" className={this.state.editor_expanded ? "expanded" : (this.state.preview_expanded ? "hidden" : "normal")}>
					<this.Toolbar title="Editor" onClick={this.editor_expand_clicked} />
					<textarea
						id="editor"
						value={this.state.user_input}
						onChange={this.user_input_changed}
					/>
				</div>

				<div id="preview_box" className={this.state.preview_expanded ? "expanded" : (this.state.editor_expanded ? "hidden" : "normal")}>
					<this.Toolbar title="Preview" onClick={this.preview_expand_clicked} />
					<div
						id="preview"
						dangerouslySetInnerHTML={{
							__html: marked.parse(this.state.user_input),
							renderer: renderer
						}}
					/>
				</div>

			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("root"));