import {Component} from "react";
import CreatableSelect from "react-select/lib/Creatable";
import React from "react";
import update from 'immutability-helper';

class CurrencySymbolField extends Component {
	constructor(props) {
		super(props);

		this.handleCreate = this.handleCreate.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = { value: null,
			options: [
				{ value: 'ella', label: 'Ellaism' },
				{ value: 'eth', label: 'Ethereum' },
				{ value: 'xmr', label: 'Monero' },
				{ value: 'btc', label: 'Bitcoin' },
				{ value: 'etc', label: 'Ethereum Classic' },
				{ value: 'egem', label: 'eGem' },
				{ value: 'exp', label: 'Expanse' },
				{ value: 'pirl', label: 'Pirl' },
				{ value: 'ubiq', label: 'Ubiq' },
				{ value: 'whl', label: 'WhaleCoin' }
			]};
	}

	handleChange(newValue, actionMeta) {
		this.setState(update(this.state, {value: {$set: newValue}}));
		if (actionMeta.action === "clear")
		{
			this.props.onChange('');
		} else {
			this.props.onChange(newValue.value);
		}
	}

	handleCreate(inputValue)
	{
		let newOption = { value: inputValue, label: inputValue};
		this.setState(update(this.state, {options: {$push: [newOption]}, value: {$set: newOption}}));
		this.props.onChange(inputValue);
	}

	render()
	{
		const dot = function(data) {
			const icon = '/images/' + data.value + '.png';

			return {
				paddingLeft: "40px",
				backgroundImage: "url(" + icon + ")",
				backgroundSize: "24px 24px",
				backgroundRepeat: "no-repeat",
				backgroundOrigin: "content-box",
				backgroundPositionX: "-32px",
				backgroundPositionY: "center",
			}
		};

		const colourStyles = {
			option: (styles, { data, isDisabled, isFocused, isSelected }) => {

				return { ...styles, ...dot(data) };
			},
			input: styles => ({ ...styles }),
			placeholder: styles => ({ ...styles }),
			singleValue: (styles, { data }) => ({ ...styles, ...dot(data), paddingLeft: "32px" }),
		};

		return (
			<div className="currency-field form-group">
				<label htmlFor="currency-symbol">Currency Symbol</label>
				<CreatableSelect
					className="cf-select"
					isClearable
					onChange={this.handleChange}
					onCreateOption={this.handleCreate}
					options={this.state.options}
					value={this.state.value}
					styles={colourStyles}
				/>
				<small id="currency-symbol-help" className="form-text text-muted">Select a currency to apply to this record.</small>
		</div>);
	}

}

export default CurrencySymbolField;
