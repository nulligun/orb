import React, { Component } from 'react';
import OptionalField from "./OptionalField";
import AddressSignatureField from "./AddressSignatureField";
import update from 'immutability-helper';

class OptionalFields extends Component {
	constructor(props) {
		super(props);

		this.handleCreate = this.handleCreate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddressChange = this.handleAddressChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);

		this.state = {
			fields: [{key: '', value: ''}],
			options: [
				{ value: 'recipient_name', label: 'Recipient Name' },
				{ value: 'address_signature', label: 'Address Signature' },
				{ value: 'tx_description', label: 'Transaction Description' },
				{ value: 'tx_amount', label: 'Transaction Amount' },
				{ value: 'payment_id', label: 'Payment ID' },
				{ value: 'checksum', label: 'Checksum' }
			]
		}
	}

	handleAddressChange(address)
	{
		this.props.onAddressChange(address)
	}

	handleValueChange(index, newValue)
	{
		let newF = this.state.fields[index];
		newF.value = newValue;
		this.setState(update(this.state, {fields: {$splice: [[index, 1, newF]]}}), () => {
			this.props.onChange();
		});
	}

	handleChange(index, newValue, actionMeta)
	{
		if (actionMeta.action === "clear") {
			this.setState(update(this.state, {fields: {$splice: [[index, 1]]}}), () => {
				this.props.onChange();
			});
		} else {
			let newF = this.state.fields[index];
			newF.key = newValue;
			let up = {};
			if (index === (this.state.fields.length - 1)) {
				up = update(this.state, {fields: {$splice: [[index, 1, newF, {key: '', value: ''}]]}});
			} else {
				up = update(this.state, {fields: {$splice: [[index, 1, newF]]}});
			}
			this.setState(up, () => {
				this.props.onChange();
			});
		}
	}

	handleCreate(index, inputValue)
	{
		let newOption = { value: inputValue, label: inputValue};
		let newF = this.state.fields[index];
		newF.key = newOption;
		let up = {};
		if (index === (this.state.fields.length - 1))
		{
			up = update(this.state, {options: {$push: [newOption]}, fields: {$splice: [[index, 1, newF, {key: '', value: ''}]]}});
		} else {
			up = update(this.state, {options: {$push: [newOption]}, fields: {$splice: [[index, 1, newF]]}});
		}
		this.setState(up);
	}

	render()
	{
		const keysUsed = this.state.fields.map((f) => {
			return f.key.value;
		});
		const options = this.state.options.filter((o) => {
			return !keysUsed.includes(o.value);
		});
		return (<div className="optional-fields">
			{this.state.fields.map((f, index) => {
				return (

					(f.key.value === "address_signature") ?
						<AddressSignatureField key={index} index={index} keyValue={f.key} value={f.value} options={options} onAddressChange={this.handleAddressChange} onCreateOption={this.handleCreate} onChange={this.handleChange} onValueChange={this.handleValueChange} />
						:
					<OptionalField key={index} index={index} keyValue={f.key} value={f.value} options={options} onAddressChange={this.handleAddressChange} onCreateOption={this.handleCreate} onChange={this.handleChange} onValueChange={this.handleValueChange} />

				);
			})}
		</div>);
	}
}

export default OptionalFields;
