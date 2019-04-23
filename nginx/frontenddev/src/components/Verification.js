import React,{Component} from 'react';
import {Alert} from 'react-bootstrap';

class Verification extends Component {

    constructor(props) {
        super(props);
        this.state= {tokenValid:true};
    }

    componentDidMount() {

        var household = this.props.match.params.household;
        var token = this.props.match.params.token;
        fetch('http://localhost:3017/validatetoken',{
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                token,
                household
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                this.setState({tokenValid:false});
            }
            else {
                console.log('test is completed this stage');
                this.props.history.push('/Register',{
                    household
                })

            }

        })



    }



    render() {

        return (

            <div className='verification-main'>
            
            {
                this.state.tokenValid ?
                null
                
                :
                <Alert variant='danger'> Token Entered is not valid </Alert>
            }
    
            
            </div>


        )



    }

}

export default Verification;