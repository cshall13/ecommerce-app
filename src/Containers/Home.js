
import React, {Component} from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';


class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            productlines: []
        }
    }

    componentDidMount(){
        // get all product info...we already set this up in the NavBar
        $.getJSON(window.hostAddress+'/productlines/get',(productlinesData)=>{
			// console.log(productlinesData);
			this.setState({
				productlines: productlinesData
			})
		})
    }

    render() {
        const plImages = [];
        // loop through the product lines from the DB
        this.state.productlines.map((row, index)=>{
            plImages.push(
                <div key={index} className="col-sm-4 col-md-3 pl-images">
                    <Link className="pl-link" to={`/shop/${row.link}`}><img className="pl-icon" src={row.image} /></Link>
                    <div className="text">
                        {row.productLine}
                    </div>
                </div>
            )
        });
        return (
            <div>
                {plImages}
            </div>
        )
    }
}

export default Home;