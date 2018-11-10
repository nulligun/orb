import {CopyToClipboard} from "react-copy-to-clipboard";
import React, {Component} from "react";
import { pointer, listen } from 'popmotion';

const CRC32 = require('crc-32');


class TxtBillboard extends Component {
	constructor(props) {
		super(props);

		this.generateRecord = this.generateRecord.bind(this);

		this.state = {ready: false};

		this.canBuild = true;

		let pointerTracker;

		listen(document, 'mousedown touchstart').start(() => {
			pointerTracker = pointer()
				.start(({ x, y }) => console.log(x, y));
		});

		this.copied1 = React.createRef();
		this.copied2 = React.createRef();
	}

	componentDidMount()
	{
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
			this.raw = txt;
			res = (<div>{txt}</div>);
			this.canBuild = true;
		} else {
			let missing = [];
			if (state.currency_symbol === "") missing.push(<span>select a <span style={{fontWeight: "bold"}}>Currency Symbol</span></span>);
			if (state.recipient_address === "") {
				if (missing.length > 0) missing.push(<span> and </span>);
				missing.push(<span>enter a <span style={{fontWeight: "bold"}}>Recipient Address</span></span>);
			}
			res = (<div>Please {missing} to build a record.</div>);
			this.canBuild = false;
		}

		return res;
	}

	render() {
		let txt = this.generateRecord(this.props.state, this.props.fields);
		let billboard = (<div style={{cursor: this.canBuild ? 'pointer' : 'default'}}>
			<div className="txt-record"><span>{txt}</span></div>
			{this.canBuild && <div className="copy-info copy-info-bottom">Click anywhere to copy</div>}
		</div>);

		return (<div>
				{this.canBuild &&
				<CopyToClipboard text={this.raw}>
					<div>{billboard}</div>
				</CopyToClipboard>
				}
				{!this.canBuild &&
					<div>{billboard}</div>
				}
				<div id="copied1" className="copy-anim" ref={this.copied1}>Copy</div>
				<div id="copied2" className="copy-anim" ref={this.copied2}>Copy</div>
			</div>
		);
	}

}

export default TxtBillboard;
