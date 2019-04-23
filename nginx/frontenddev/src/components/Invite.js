import React,{Component} from 'react';
import {Form,Button} from 'react-bootstrap';
class Invite extends Component {

constructor(props) {
    super(props);
    this.state = {email:'',household:''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
}

handleSubmit(event) {
    event.preventDefault();
    console.log('testing here ')
    fetch('http://localhost:3017/addmember',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            email:this.state.email,
            household:this.state.household
        })
    }).then(response => response.json())
    .then(data => {
        console.log('testing 1');
        console.log(data);
        console.log('testing 2');
        if(data.error) {
            this.props.history.push('/message',{
                message:'Error Invitation Not Sent'
            })
        }

        else {
            this.props.history.push('/message' ,{
                message:'Invitation sent Successfully'
            })
        }
    })
    
}

handleEmail(event) {
    event.preventDefault();
    this.setState({email:event.target.value});
}

componentDidMount() {
   var household = this.props.match.params.household;
   console.log('value of household check');
   console.log(household);
   console.log('value of household check 1');
   this.setState({household});


}


render() {

return (

    <Form onSubmit={this.handleSubmit}>
    <Form.Group>
    <Form.Label> Enter Email Address</Form.Label>
    <Form.Control type='text' placeholder='Email' onChange={this.handleEmail} />
    </Form.Group>
    <Button variant='primary' type='submit'> Send Invite </Button>
    </Form>



)



}

}

export default Invite;