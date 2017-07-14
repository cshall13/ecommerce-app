import React, {Component} from 'react';
import Slider from 'react-slick'; //(npm install - - save react-slick)
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


class Slick extends Component{
    render(){
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true
        }

        return(
            <div>
                {/*the elipses mean, pass all items from object 'settings'*/}
                <Slider {...settings}>
                    <div className="slick-image"><img src="/images/ferrari.jpg" /></div>
                    <div className="slick-image"><img src="/images/train1.jpg" /></div>
                    <div className="slick-image"><img src="/images/lamb.jpg" /></div>
                    <div className="slick-image"><img src="/images/schooner.jpg" /></div>
                </Slider>
            </div>
        )
    }
}

export default Slick;