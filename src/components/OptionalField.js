import {Component} from "react";
import CreatableSelect from "react-select/lib/Creatable";
import React from "react";

class OptionalField extends Component {
	constructor(props) {
		super(props);

		this.handleCreate = this.handleCreate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);

		this.descriptions = {
			'recipient_name': 'The name of the recipient as it would be displayed to users in software that supports OpenAlias.',
			'address_signature': 'If you have a standardised way of signing messages based on an address\' private key, then this can be used to validate the FQDN. The message that you should sign is the entire FQDN (eg. donate.getmonero.org) with nothing else. If you have MetaMask you can click the Signature Tool button to sign your message.',
			'tx_description': 'In addition to the name of the recipient, if you are using OpenAlias for transactions you may choose to define a transaction description. Bear in mind that DNS is typically long-lived data and not always updated at request time, so this should only be used if it does not need to be updated constantly.',
			'tx_amount': 'This provides a way to suggest an amount that should be sent when using this domain.',
			'payment_id': 'This field is particular to Monero, but is standardised as other cryptocurrencies may find it useful. It is typically a hex string of 32 characters, but that is not enforced in the standard.',
			'checksum': 'This is a CRC-32. It has to appear as the last item in the TXT record, otherwise the record is open to manipulation. In order to calculate or verify the checksum, take the entire record up until the checksum key-value pair (ie. excluding the checksum key-value pair). Strip any spaces from either side, and calculate the CRC-32 on that final record.'
		}
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

	render() {
		return (<div className="optional-field">

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
						<input aria-describedby="button-addon1" type="text" value={this.props.value} onChange={this.handleValueChange} className="form-control" id="optional"/>
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

export default OptionalField;
