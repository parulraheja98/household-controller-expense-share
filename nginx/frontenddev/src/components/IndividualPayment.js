import React,{Component} from 'react';
import {ListGroup} from 'react-bootstrap';

class IndividualPayment extends Component {

constructor(props) {
    super(props);
    this.state = {payment:[], totalAmountDue:''};
}


componentDidMount() {

    fetch('http://localhost:3017/getpayment',{
        credentials:'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log('data check 1 ');
        console.log(data);
        this.setState({payment:data.mem[0].payment, totalAmountDue:data.mem[0].amount});
        console.log('data check 2');

    })

}

render() {
    return (
        <div>
            {
             this.state.payment ? <div>
                    {
                this.state.payment.map((listOfPayment) => (
                    <ListGroup>
                        <ListGroup.Item variant='info'> Payment Id {listOfPayment.paymentId} </ListGroup.Item>
                        <ListGroup.Item> Amount Due {listOfPayment.amountDue}</ListGroup.Item>
                    </ListGroup>

                ))

                    }
                </div>

                : null
            }

            <ListGroup>
            <ListGroup.Item variant='success' style={{marginTop:'30px'}}> Total Amount Due is {this.state.totalAmountDue}</ListGroup.Item>
            </ListGroup>

        </div>





    )

}
}

export default IndividualPayment;