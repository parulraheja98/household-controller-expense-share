import React,{Component} from 'react';
import {withCookies,Cookies} from 'react-cookie';

class Home extends Component {

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {};
    }

    componentDidMount() {
        
        
    }


    render() {
        return (
            <div className='container-home'>
                Welcome To The Household Application 
                <button onClick={this.props.checking}>
                    Testing 
                </button>
            
    
            </div>
        )
    }
}

export default withCookies(Home);