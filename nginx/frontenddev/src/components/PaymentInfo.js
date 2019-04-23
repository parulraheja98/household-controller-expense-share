import React,{Component} from 'react';
import {ListGroup} from 'react-bootstrap';
class PaymentInfo extends Component {


constructor(props) {
    super(props);
    this.state = {};
}


componentDidMount() {
    fetch('http://localhost:3017/paymentinformation')
    .then(response => response.json())
    .then(data =>  {
        this.setState({payment:data.pay});


    })

}

render() {


    return (

        <div className='payment-info-main'>
            {
                this.state.payment ? <div>
                    {
                this.state.payment.map((listOfPayment) => (
                    <ListGroup>
                        <ListGroup.Item variant='info'> {listOfPayment.paymentType} </ListGroup.Item>
                        <ListGroup.Item> {listOfPayment.amountDue}</ListGroup.Item>
                        <ListGroup.Item> <a href={`/memberinfo/${listOfPayment.paymentId}`}> Payment Information  </a></ListGroup.Item>
                    </ListGroup>

                ))

                    }
                </div>

                : null
             }
        
        
        
        </div>




    )

}
}

export default PaymentInfo;