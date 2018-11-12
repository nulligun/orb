import React, { Component } from 'react';
import OptionalFields from './components/OptionalFields';
import CurrencySymbolField from './components/CurrencySymbolField';
import TxtBillboard from './components/TxtBillboard';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleAddressChange = this.handleAddressChange.bind(this);
		this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
		this.handleFieldChange = this.handleFieldChange.bind(this);

		this.state = {
			currency_symbol: '',
			recipient_address: '',
			toggle: false
		};

		this.fields = React.createRef();
	}

	handleFieldChange(e)
	{
		this.setState({toggle: !this.state.toggle});
	}

	handleChange(e)
	{
		const s = {...this.state};
		s[e.target.id] = e.target.value;

		let u = {};
		u[e.target.id] = e.target.value;
	//	u['txt'] = this.generateRecord(s);
		this.setState(u);
	}

	handleAddressChange(address)
	{
		//const s = {...this.state, recipient_address: address};
		this.setState({recipient_address: address});//, txt: this.generateRecord(s)});
	}

	handleCurrencyChange(symbol)
	{
		//const s = {...this.state, currency_symbol: symbol};
		this.setState({currency_symbol: symbol});//, txt: this.generateRecord(s)});
	}

  render() {
    return (
      <div className="App">
	      <div className="container">
        <h1>OpenAlias Record Builder</h1>
	      <div className="instructions mandatory">
		      <p>This tool will allow you to easily build OpenAlias TXT records.  Select a currency and enter the address where funds should be received then copy the TXT record into your DNS config.</p>
	      </div>

	      <form className="oa-form">
		      <div className="row">
			      <div className="col-3">
		          <CurrencySymbolField onChange={this.handleCurrencyChange}/>
			      </div>
			      <div className="col-9">
		          <div className="form-group">
					      <label className="recipient-address" htmlFor="recipient-address">Recipient Address</label>
					      <input type="text" className="form-control" value={this.state.recipient_address} onChange={this.handleChange} id="recipient_address"/>
			          <small id="recipient-address-help" className="form-text text-muted">Crypto address where funds should be sent, <span className="bold">not</span> the domain name.</small>
		          </div>
	          </div>
		      </div>

		      <div className="txt-billboard">
		      <TxtBillboard state={this.state} fields={this.fields} />
		      </div>

		      <div className="optional-fields-container">
		      <h5>Optional Fields</h5>
			      <div className="instructions">
				      <p><span className="bold">Recipient Name</span> and <span className="bold">Address Signature</span> are recommended fields.  If you are adding an ETH based coin like Ellaism then you can add an address signature with MetaMask.  Checksum is computed automatically but can be overridden.</p>
			      </div>
		      <OptionalFields ref={this.fields} onChange={this.handleFieldChange} onAddressChange={this.handleAddressChange} />
		      </div>
	      </form>

      </div>
      </div>
    );
  }
}

export default App;
