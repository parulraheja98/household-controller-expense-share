import React,{Component} from 'react';
import {ListGroup} from 'react-bootstrap';

class DisplayPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {paymentInfo:[],amountDue:[]};
    }

    componentDidMount() {

        var paymentId =  this.props.match.params.paymentId;
        fetch(`http://localhost:3017/memberinformation/${paymentId}`)
        .then(res => res.json())
        .then(data => {
            console.log('check data here 1');
            console.log(data);
            console.log('check here data 2');
            this.setState({paymentInfo:data.paymentInfo});

        })

    }

    render() {

        return (
            <div className='display-payments-main'>
            {   this.state.paymentInfo ?
            <div> 
                {
            this.state.paymentInfo.map((paymentList) => (
                <ListGroup>
                    <ListGroup.Item> {paymentList.amountDue} </ListGroup.Item>
                    <ListGroup.Item> {paymentList.username} </ListGroup.Item>
                    
                </ListGroup>
            ))
                }
            </div>
            
                : null
            }
            <div className='total-amount-due'> {this.state.amountDue}</div>
            </div>

            
        )

    }

}

export default DisplayPayment;