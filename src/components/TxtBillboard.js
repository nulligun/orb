import {CopyToClipboard} from "react-copy-to-clipboard";
import React, {Component} from "react";
import { keyframes, easing, styler, spring, chain, delay, parallel } from 'popmotion';

const CRC32 = require('crc-32');

class TxtBillboard extends Component {
	constructor(props) {
		super(props);

		this.counter = 0;

		this.generateRecord = this.generateRecord.bind(this);
		this.handleCopied = this.handleCopied.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);

		this.state = {ready: false, justCopiedFlag: false, animating: false, x: 0, y: 0, copyLabel: 'Copy'};

		this.canBuild = true;

		this.copied1 = React.createRef();
		this.copied2 = React.createRef();
		this.txtRef = React.createRef();

		let y = -24;

		this.copyAnim1 = keyframes({
			values: [{opacity: 0, translateX: "-50%", "translateY": y}, {opacity: 1, translateX: "-50%", "translateY": y}, {opacity: 1, translateX: "-50%", "translateY": y}],
			times: [0, 0.5, 1],
			easings: [easing.easeIn, easing.linear],
			duration: 200
		});

		this.fadeOut1 = keyframes({
			values: [{opacity: 1, translateX: "-50%", "translateY": y}, {opacity: 0, translateX: "-50%", "translateY": y}],
			times: [0, 1],
			easings: [easing.easeIn],
			duration: 150
		});

		this.fadeOut2 = keyframes({
			values: [{opacity: 1, translateX: "-50%", "translateY": y}, {opacity: 0, translateX: "-50%", "translateY": y}],
			times: [0, 1],
			easings: [easing.linear],
			duration: 150
		});

		this.zoomAnim = spring({from: {scale: 1.01, opacity: 0.25, backgroundColor: '#cee7ff'}, to: {scale: 1, opacity: 1, backgroundColor: '#def7ff'}, stiffness: 300, damping: 10});

		this.copyAnim2b = spring({from: {rotateX: 90}, to: {rotateX: 180}, stiffness: 1000, damping: 10, velocity: 20});

		this.copyAnim2 = keyframes({
			values: [
				{rotateX: 0, opacity: 0, translateX: "-50%", "translateY": y},
				{rotateX: 45, opacity: 1, translateX: "-50%", "translateY": y},
				{rotateX: 90, opacity: 1, translateX: "-50%", "translateY": y}
			],
			times: [0, 0.5, 1],
			easings: [easing.easeIn, easing.linear],
			duration: 200
		});
	}

	componentDidMount() {
		this.copyStyler1 = styler(this.copied1.current, {});
		this.copyStyler2 = styler(this.copied2.current, {});
		//this is because we have to force a redraw after the component remounts, since fields.current is not quite ready when it gets loaded
		this.setState({ready: true});
	}

	escape(str)
	{
		if (str.includes(';')) {
			str = '"' + str + '"';
		}
		if (str.match(/^\".*\"$/s)) {
			str = str.replace(/\"/g, '');
			str = '"' + str + '"';
		}
		return str;
	}

	generateRecord(state, fields) {
		if (fields.current === null) return 'Loading...';
		let keys = fields.current.state.fields.filter(f => f.key !== "").map(f => f.key.value);
		let entries = fields.current.state.fields.filter(f => f.key !== "").map(f => f.key.value + '=' + this.escape(f.value));

		let res = '';

		if ((state.currency_symbol !== "") && (state.recipient_address !== "")) {
			let txt = 'oa1:' + state.currency_symbol.toLowerCase() + ' recipient_address=' + this.escape(state.recipient_address);
			if (entries.length > 0) txt += '; ' + entries.join('; ');
			if (!(keys.includes('checksum'))) {
				txt += ';';
				txt += ' checksum=' + CRC32.str(txt);
			}
			if (this.raw !== txt) this.justCopied = false;
			this.raw = txt;
			res = (<div id="txt-to-copy">{txt}</div>);
			this.canBuild = true;
		} else {
			let missing = [];
			if (state.currency_symbol === "") missing.push(<span>select a <span style={{fontWeight: "bold"}}>Currency Symbol</span></span>);
			if (state.recipient_address === "") {
				if (missing.length > 0) missing.push(<span>&nbsp;and&nbsp;</span>);
				missing.push(<span>enter a <span style={{fontWeight: "bold"}}>Recipient Address</span></span>);
			}
			res = (<div>Please {missing} to build a record.</div>);
			this.canBuild = false;
			this.justCopied = false;
		}

		return res;
	}

	handleCopied(e)
	{
		let myself = this;
		console.log("MOUSE " + this.counter);
		this.counter = this.counter + 1;
		let selected = window.getSelection();
		let selTxt = selected.toString();
		if (!(selected.baseNode))
		{
			navigator.clipboard.writeText(this.raw);
			console.log("deselect? no selection, store: " + this.raw);
		} else {
			if (selected.anchorNode.parentNode.id === "txt-to-copy") {
				if (selected.toString() === "") {
					navigator.clipboard.writeText(this.raw);
					console.log("no selection, store: " + this.raw);
				} else {
					if (selected.focusNode !== selected.anchorNode)
					{
						navigator.clipboard.writeText(this.raw);
						console.log("selected too much, using raw, store: " + this.raw);
					} else {
						navigator.clipboard.writeText(selTxt);
						console.log("store selection: " + selTxt);
					}
				}
			} else if (e.target.id === "copy-info-bottom") {
				navigator.clipboard.writeText(this.raw);
				console.log("clicked bottom using raw, store: " + this.raw);
			}
		}

		console.log("Copy Processed");

		this.setState({x: e.pageX, y: e.pageY});

		delay(300).start({
			complete: () => {
				myself.txtStyler = styler(this.txtRef.current, {});
				myself.setState({copyLabel: 'Copied'});
				myself.zoomAnim.start({
					update: v => {
						myself.txtStyler.set(v);
					}
				});
			}
		});
		this.justCopied = true;
		this.setState({justCopiedFlag: !this.state.justCopiedFlag, animating: true});
		this.copyAnim1.start({
			update: v => {
				myself.copyStyler1.set(v);
			}
		});

		myself.setState({copyLabel: 'Copy'});
		let copyAnim2Playback = this.copyAnim2.start({
			update: v => {
				myself.copyStyler2.set(v);
			},
			complete: () => {
				this.copyAnim2b.start({
					update: v => {
						myself.copyStyler2.set(v);
					}
				});
			}
		});

		setTimeout(function() {
			copyAnim2Playback.stop();
			parallel(
				myself.fadeOut1,
				myself.fadeOut2
			).start({
			update: ([ fadeOut1Output, fadeOut2Output ]) => {
				myself.copyStyler1.set(fadeOut1Output);
				myself.copyStyler2.set(fadeOut2Output);
				},
			complete: () => {
				myself.setState({animating: false});
			}});
			}, 400);
	}

	handleMouseMove(e)
	{
		this.setState({animating: false});
	}

	render() {
		const copiedStyle = {left: this.state.x, top: this.state.y};
		let txt = this.generateRecord(this.props.state, this.props.fields);
		let billboard = (<div onMouseMove={this.handleMouseMove} className={(this.canBuild ? "copiable": "") + " " + (this.state.animating ? 'animating' : '') + " " + (this.justCopied ? 'copied' : '')}>
			<div className="txt-record"><span ref={this.txtRef}>{txt}</span></div>
			{this.canBuild && <div id="copy-info-bottom" className={"copy-info copy-info-bottom" + (this.justCopied ? ' copied' : '')}>{this.justCopied ? 'Copied!' : 'Click anywhere to copy'}</div>}
		</div>);

		return (<div>
				{this.canBuild &&
				<div onMouseUp={this.handleCopied}>
					<div>{billboard}</div>
				</div>
				}
				{!this.canBuild &&
					<div>{billboard}</div>
				}
				<div style={copiedStyle} className={this.state.animating ? 'copy-animating' : 'copy-not-animating'}>
				<div id="copied1" className="copy-anim" ref={this.copied1}>Copy</div>
				<div id="copied2" className="copy-anim" ref={this.copied2}>{this.state.copyLabel}</div>
				</div>
			</div>
		);
	}

}

export default TxtBillboard;
