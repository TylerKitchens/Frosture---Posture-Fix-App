import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View, Vibration, SafeAreaView } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import * as Speech from 'expo-speech';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import Btn from '../components/Btn'
import { Colors } from '../assets/Colors'
import Slider from '@react-native-community/slider';
import NavHeader from '../components/NavHeader'
import Rewards from '../components/Rewards'

import {STORAGE} from '../api/'

export default class Timeline extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
           
        }
    }

    async componentDidMount() {
        let arr = await STORAGE.getAllSessions()
        arr.forEach(frost => {

            console.log(frost)
        });
    }



    componentWillUnmount() {
       
    }


    render() {
        return (
            <SafeAreaView style={[styles.container, this.state.inverted && styles.inverted]}>
                <NavHeader nav={this.props.navigation} />
                <Text>NOTHING</Text>
            </SafeAreaView>
        );
    }

}

function round(n) {
    if (!n) {
        return 0;
    }
    return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: Colors.SECONDARY,
        paddingVertical: 60
    },
    group: {
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        width: "50%"
    },
    helperTxt: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        fontWeight: 'bold'
    },
    timerTxt: {
        textAlign: 'center',
        color: "white",
        fontSize: 45,

    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 15,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
    },
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    inverted: {
        transform: [{
            rotate: '-180deg'
        }],
    }
});
