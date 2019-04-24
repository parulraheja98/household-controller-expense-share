import { ListGroup,Form,Button } from "react-bootstrap";
import React,{Component} from 'react';

class PaymentTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {paymentItems:[],paymentType:'',amount:'',household:'',username:''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePaymentType = this.handlePaymentType.bind(this);
        this.handleAmount = this.handleAmount.bind(this);

    }

    handlePaymentType(event) {
        console.log(event.target.value);
        this.setState({paymentType:event.target.value});
    }

    handleAmount(event) {
        event.preventDefault();
        this.setState({amount:event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:3017/transactionpayment',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({
                paymentType:this.state.paymentType,
                amount:this.state.amount,
                household:this.state.household,
                username:this.state.username

            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('check data 1');
            console.log(data);
            console.log('check data 2');
            this.props.history.push('/message',{
                message:data.message
            })


        })


    }

    componentDidMount() {
        var household = this.props.match.params.household;
        var url = 'http://localhost:3017/billitems/'+household;
        fetch(url,{
            credentials:'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('data check 1');
            console.log(data);
            console.log('data check 2');
            this.setState({paymentItems:data.items,username:data.username,household:data.household});


        })




    }



    render() {
        return (
            <Form>
                {
                    this.state.paymentItems ?
                    <ListGroup>
                        {
                        this.state.paymentItems.map(item => (
                            <ListGroup.Item> 
                                <Form.Check type='radio' name='paymentType' value={item.paymentType} 
                                onChange={this.handlePaymentType} label={item.paymentType} required
                                />
                               
                            </ListGroup.Item>

                        ))
                        }
                    </ListGroup>
                        
                    : null

                }
                <Form.Group>
                    <Form.Label> Amount </Form.Label>
                    <Form.Control type='number' name='amount' onChange={this.handleAmount} required/>
                </Form.Group>


                <Button variant='primary' type='submit' onClick={this.handleSubmit}>
                    Make Transaction
                </Button>

            </Form>




        )
    }
}

export default PaymentTransaction;