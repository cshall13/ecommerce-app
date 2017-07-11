import React, {Component} from 'react';


class Students extends Component{
    constructor(props){
        super(props);
        this.state = {
            students:[]
        }
    }

    componentDidMount(){
        var localStudents = [
            'Hayes',
            'Micheal',
            'Carla',
            'YingRong'
        ];
        this.setState({
            students: localStudents
        })
    }



    render() {

        var studentArray = [];
    // local function. also an anonymous function with no name
        this.state.students.map((student, index) => {
            studentArray.push(<li key={index}>{student}</li>)
        });

        return (
            <div>
                <h1>Students!!</h1>
                {studentArray}
            </div>
        );
    }
}

export default Students;


