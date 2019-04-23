import React,{Component} from 'react';
import {Form,Button,Alert} from 'react-bootstrap'; 

class ResetLink extends Component {

    constructor(props) {
        super(props);
        this.state = {pword:'', pword2:'',id:''};
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRePassword = this.handleRePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePassword(event) {
        event.preventDefault();
        this.setState({pword:event.target.value});

    }

    handleRePassword(event) {
        event.preventDefault();
        this.setState({pword2:event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:3017/resetpass',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                pword:this.state.pword,
                pword2:this.state.pword2,
                id:this.state.id

            })

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.history.push('/message' ,{
                message:data.message
            })


        })



    }

    componentDidMount() {
        var id = this.props.match.params.id;
        this.setState({id});
        var url = 'http://localhost:3017/verifypassword/'+id;
        console.log('check url 1');
        console.log(url);
        console.log('check url 2');
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('checking response 1');
            console.log(data);
            console.log('checking response 2');
        })


    }





    render() {





    return (

        <div className='reset-container'>

                
                <Form id='login'>
                <Form.Label> Enter New Password</Form.Label>
                <Form.Control type='text' placeholder='Enter username' onChange={this.handleUsernameChange} />
                <Form.Label> ReEnter Password </Form.Label>
                <Form.Control type='password' placeholder='Enter password' onChange={this.handlePasswordChange}/>
                <Button variant='primary' type='submit' onClick={this.handleSubmit}> Login </Button>
                <br /> <br />
                {
                    this.state.invalidLogin ?
                    <Alert variant='danger'> Invalid Login Credentials </Alert>
                    : null
                }
                
                </Form>

            </div>



    )
    }
    }

    export default ResetLink;