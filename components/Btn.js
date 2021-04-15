import React from 'react';
import { Text, Platform, TouchableOpacity, View } from 'react-native';

export default class Btn extends React.Component {

    constructor(props) {
        super(props)

    }

    fireEvent = () => {
  
        this.props.onPress()
    }

    styles = {
        // ...
        btnContainer: {
            backgroundColor : this.props.bgColor,
            alignItems : 'center',
            padding : 10,
            alignSelf : 'stretch',
            borderRadius : 18,
            height : 50,
            width : 200,
            margin : 5,
            borderWidth : 2,
            borderColor : this.props.borderColor != null ? this.props.borderColor : this.props.bgColor
        },
        
        btnText: {
            fontSize : 20,
            color : this.props.txtColor,
            textAlign : 'center'
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.fireEvent} style={[this.props.style, this.styles.btnContainer]} >
                <Text style={this.styles.btnText}>{this.props.children}</Text>
            </TouchableOpacity >

        )
    }

}