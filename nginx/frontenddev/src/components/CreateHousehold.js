import {Form,Button} from 'react-bootstrap';
import React,{Component} from 'react'; 
class CreateHousehold extends Component {

constructor(props) {
    super(props);
    this.state={householdName:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHouseholdName = this.changeHouseholdName.bind(this);
}

changeHouseholdName(event) {
    event.preventDefault();
    this.setState({householdName:event.target.value});
}

handleSubmit(event) {
event.preventDefault();
console.log('final 1');
console.log(this.state.householdName);
console.log('final 2');
fetch('http://localhost:3017/addhousehold' , {
    method:'POST',
    credentials:'include',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
        household:this.state.householdName
    })
})
.then(response => response.json())
.then(data => {
    console.log(data);
    this.props.history.push(
        '/Message', {
            message:'Household Created'
        }
    )
})


}
render() {

    return (

        <Form>
        <Form.Group>
            <Form.Label>  Enter Household Name </Form.Label>
            <Form.Control type='text' placeholder='Enter Household Name' onChange={this.changeHouseholdName} required />
        </Form.Group>
        <Button variant='primary' onClick={this.handleSubmit}>
            Create Household
        </Button>
        </Form>


    )
}

}

export default CreateHousehold;