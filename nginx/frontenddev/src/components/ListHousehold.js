import React,{Component} from 'react';
import {ListGroup,Button,Form} from 'react-bootstrap';
class ListHousehold extends Component {

constructor(props) {
    super(props);
    this.state={listHousehold:[],household:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selHousehold = this.selHousehold.bind(this);
}

componentDidMount() {
    fetch('http://localhost:3017/householdlist', {
        credentials:'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        console.log(typeof data);
        this.setState({listHousehold:data.household});

    })

}

handleSubmit(event) {
    event.preventDefault();
    console.log('test' , this.state.household);
    fetch('http://localhost:3017/paymentpage',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            household:this.state.household
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('checking data ');
        console.log(data);
        console.log('checking data 2');
      this.props.history.push('/billpayment',{data})
    })

}



selHousehold(event) {
    console.log('first completed');
    this.setState({household:event.target.value});

}




render() {

return (

   <>
   {this.state.listHousehold ? 
    <Form>
   <ListGroup>
       <h2> Please select list of households </h2>
       {
   this.state.listHousehold.map(data => (
    <ListGroup.Item key={data._id}> 
    <Form.Check type='radio' label={data.name} onChange={this.selHousehold}  name='household' value={data.name} required/>
    <a href={'/billpayment/'+data.name}> Bill Payment </a>
   </ListGroup.Item>
   )
    )

   }
    </ListGroup>
    <Button variant='primary' onClick={this.handleSubmit}> Submit </Button>
    </Form>
   : <div> Test Unsuccessfull </div>
    }

</>
  

)

}
}

export default ListHousehold;
