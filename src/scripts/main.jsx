var React = require('react');
var ReactDOM = require('react-dom');

var colorThief = new ColorThief();

var ColorBlock = React.createClass({
	render: function() {
		var colorText = '';
		this.props.color.map(function(v, i) {
			if (i === 0) colorText += '#';
			if (v < 15) colorText += '0';
			colorText += v.toString(16);

		});
		return (
			<div className="color-block" style={{backgroundColor: colorText}}>
				<div className="color-text center">{colorText}</div>
			</div>
		);
	}
});

var ColorThiefContainer = React.createClass({
	getInitialState: function() {
		return {
			mainColor: [],
			palette: [
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			]
		};
	},
	handleFile: function() {
		var file = this.refs.fileUpload.files[0];
		var image = this.refs.imageDisplay;
		if (file) {
			var reader = new FileReader();

			reader.onload = function(e) {
				image.src = e.target.result;
			};

			reader.readAsDataURL(file);
		}
	},
	handleLoad: function() {
		var image = this.refs.imageDisplay;
		this.setState({
			mainColor: colorThief.getPalette(image, 5)[0],
			palette: colorThief.getPalette(image, 8)
		});
	},
	render: function() {
		var mainColorBlock = <ColorBlock color={this.state.mainColor} />;
		var paletteBlock = this.state.palette.map(function(v, i) {
			return (<ColorBlock key={'colorblock-' + i} color={v} />)
		});
		return (
			<div>
				<div className="container">
					<input type="file" accept="image/*" onChange={this.handleFile} ref="fileUpload" />
					<hr/>
				</div>
				<div className="row">
					<div className="six columns">
						<img ref="imageDisplay" onLoad={this.handleLoad} />
					</div>
					<div className="six columns">
						<div className="row">
							<h3>Main Color</h3>
							{mainColorBlock}
						</div>
						<div className="row">
							<h3>Color Palette</h3>
							{paletteBlock}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(<ColorThiefContainer />, document.getElementById('color-thief'));
