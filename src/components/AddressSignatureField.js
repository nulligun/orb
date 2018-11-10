import {Component} from "react";
import CreatableSelect from "react-select/lib/Creatable";
import OptionalField from "./OptionalField";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import React from "react";
const Web3 = require('web3');

class AddressSignatureField extends OptionalField {
	constructor(props) {
		super(props);

		this.handleCreate = this.handleCreate.bind(this);
		this.signatureTool = this.signatureTool.bind(this);
		this.handleSignatureChange = this.handleSignatureChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.signatureTool = this.signatureTool.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.signData = this.signData.bind(this);
		this.eth = null;
		this.state =
			{ show: false,
				message: ''};
	}

	initWeb3()
	{
		this.eth = null;
		return new Promise(async (resolve, reject) => {
			if (window.ethereum) {
				window.web3 = new Web3(window.ethereum);
				try {
					await window.ethereum.enable();
					resolve();
				} catch (error) {
					reject();
					// User denied account access...
				}
			}
			// Legacy dapp browsers...
			else if (window.web3) {
				window.web3 = new Web3(window.web3.currentProvider);
				resolve();
			}
			// Non-dapp browsers...
			else {
				console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
				reject();
			}
		});
	}

	handleChange(newValue, actionMeta) {
		this.props.onChange(this.props.index, newValue, actionMeta);
	}

	handleValueChange(e) {
		this.props.onValueChange(this.props.index, e.target.value);
	}

	handleCreate(inputValue) {
		this.props.onCreateOption(this.props.index, inputValue);
	}

	signatureTool(e)
	{
		this.setState({show: true});
	}

	signData(data)
	{
		let self = this;
		let a = window.web3.eth.getAccounts();
		a.then((result) => {
			let account = result[0];
			if (account) {
				window.web3.eth.personal.sign(data, account).then((result) => {
					self.props.onValueChange(self.props.index, result);
					self.props.onAddressChange(account);
					self.setState({message: ''});
				});
			}
		});
	}

	handleClose(e) {
		if (this.state.message)
		{
			if (this.eth === null) {
				this.initWeb3().then(() => {
					this.signData(this.state.message)
				});
			} else {
				this.signData(this.state.message);
			}
		}
		this.setState({show: false});
	}

	handleSignatureChange(e)
	{
		this.setState({message: e.target.value});
	}

	render()
	{
		return (<div className="optional-field">
			<div className="static-modal">
				<Modal isOpen={this.state.show}>
					<ModalHeader>
						Signature Tool
					</ModalHeader>
					<ModalBody>
						<h4>Enter the text you want to sign</h4>
						<div className="form-group">
							<textarea value={this.state.message} onChange={this.handleSignatureChange} className="form-control" placeholder="This should be the fully qualified domain name for the record you want to sign.  eg, outdoordevs.com" rows="3"></textarea>
						</div>
						<p>
							You must sign the message with the same account that this OpenAlias record points to. Unlock MetaMask and switch to the account that was entered in the Recipient Address field.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button className="btn-success" onClick={this.handleClose}>Sign</Button>
					</ModalFooter>
				</Modal>
			</div>
			<div className="row">
				<div className="col-3">
					<CreatableSelect
						className="optional-select"
						isClearable
						onChange={this.handleChange}
						onCreateOption={this.handleCreate}
						options={this.props.options}
						value={this.props.keyValue}/>
				</div>
				<div className="col-9">
					{this.props.keyValue.value &&
						<div>
					<div className="input-group mb-3 optional-field-value">
						<div className="input-group-prepend">
							<button onClick={this.signatureTool} className="btn btn-outline-secondary" type="button" id="signature-button">Signature Tool</button>
						</div>
						<input aria-describedby="button-addon1" type="text" value={this.props.value} onChange={this.handleValueChange} className="form-control" id="currency_symbol"/>
					</div>
					<div className="input-group mb-3">
						<small id="currency-symbol-help" className="form-text text-muted">{this.descriptions[this.props.keyValue.value]}</small>
					</div>
						</div>
					}
				</div>
			</div>
		</div>);
	}

}

export default AddressSignatureField;
