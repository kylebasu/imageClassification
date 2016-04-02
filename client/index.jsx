import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


//simple component used to render rest of game using Webpack
class App extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			data: null
		};
	}

	componentDidMount() {
      	this.serverRequest = $.get('http://127.0.0.1:1337/images/', function (result) {
      		this.setState({
       			data: result
			});
  		}.bind(this));
	}

	clickHandleYes(){
		this.state.data.pop();
		this.setState({
			data: this.state.data
		});
	}

	clickHandleNo(){
		this.state.data[this.state.data.length-1].classification = null;
		this.setState({
			data: this.state.data
		});
	}

	handleChange(event) {
		this.state.data[this.state.data.length - 1].classification = event.target.value
		this.serverRequest = $.ajax({
			url: 'http://localhost:1337/images/',
			type: 'POST',
			data: JSON.stringify(this.state.data[this.state.data.length - 1]),
			contentType: 'application/json',
			complete: function(result){
				this.state.data.pop();
				this.setState({
					data: this.state.data
				})
			}.bind(this)
		});
  	}

  	render () {
  		console.log(this.state.data)
  		if(this.state.data === null){
  			return(
  				<div>Loading....</div>
  			)
  		}else{
  			if(this.state.data[this.state.data.length - 1].classification === null){
		    		return(
						<div>
							<div id='container'>
							{this.state.data.map(function(image, position){
								return (
									<img src={image.image}/>
								)
							}, this)}
							</div>
							<div className='question'>Are these people, an interior, an exterior, or food?</div>
							 <select key={this.state.data} onChange={this.handleChange.bind(this)}>
							 	<option></option>
    								<option value="person">Person</option>
   								<option value="interior">Interior</option>
    								<option value="exterior">Exterior</option>
    								<option value="food">Food</option>
    								<option value="animal">Animal</option>
  							</select>
						</div>
	    			)
		    	}else{
		    		return(
						<div>
							<div id='container'>
							{this.state.data.map(function(image, position){
								return (
									<img src={image.image}/>
								)
							}, this)}
							</div>
							<div className='question'>is this a/an {this.state.data[this.state.data.length -1].classification}?</div>
							<div><span onClick={this.clickHandleYes.bind(this)}>Yes</span><span onClick={this.clickHandleNo.bind(this)}>No</span></div>
						</div>
	    			)		
		    	}
	    	}
  	}
}

ReactDOM.render(<App/>, document.getElementById('app'));