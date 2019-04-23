import React,{Component} from 'react';
class Check extends Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log(this.props.location.state.data);

    }

    render() {
        return (
            <div className='main-container'>
            
            this is a sample 
            </div>



        )


    }


}

export default Check;