
import React,{Component} from 'react';
import {Form,Button} from 'react-bootstrap';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {email:''};
        this.handleEmail = this.handleEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmail(event) {
        event.preventDefault();
        this.setState({email:event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('check email 1');
        console.log(this.state.email);
        console.log('chec emaila 2');
        console.log('initial debugging');
        fetch('http://localhost:3017/generatepassword' , {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:this.state.email
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
            this.props.history.push('/message',{
                message:data.message
            })
            }
            else {
                this.props.history.push('/message',{
                    message:data.error
                })

            }




        })

    }

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label> Email Address </Form.Label>
                    <Form.Control type='email' placeholder='Enter Email ' onChange={this.handleEmail} />
                    <Button variant='primary' type='submit' onClick={this.handleSubmit}> Send Link </Button>
                </Form.Group>


            </Form>
        )

    }
}

export default ResetPassword;