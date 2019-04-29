

import React,{Component} from 'react';
import {ListGroup} from 'react-bootstrap';
import {withCookies,Cookies} from 'react-cookie';
class PaymentDetails extends Component {

constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {paymentInfo:[],amountDue:''};
}

componentDidMount() {
    const {cookies} = this.props;
    var paymentId = this.props.match.params.paymentId;
    var url = 'http://localhost:3017/memberinformation/'+paymentId;
    fetch(url,{
        credentials:'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log('data check 1');
        console.log(data);
        this.setState({paymentInfo:data.paymentInfo,amountDue:data.amountDue});
        console.log('data check 2');
    })


}


render() {


    return (
        <div className='payment-details-main'>
        {
        this.state.paymentInfo ? <div>
                    {
                this.state.paymentInfo.map((listOfPayment) => (
                    <ListGroup style={{marginTop:'20px'}}>
                        <ListGroup.Item variant='info'> Amount  {listOfPayment.paymentDetails.amountDue} </ListGroup.Item>
                        <ListGroup.Item> Member {listOfPayment.user}</ListGroup.Item>
                    </ListGroup>

                ))

                    }
                </div>

                : null
             }

             {
                 this.state.amountDue ?
                 <ListGroup style={{marginTop:'30px'}}>
                     <ListGroup.Item> Total Amount Due {this.state.amountDue} </ListGroup.Item>
                 </ListGroup>
                 : null
             }
        
        
        
        
        
        </div>


    )
}
}

export default withCookies(PaymentDetails);
