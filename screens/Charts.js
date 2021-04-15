import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, Vibration, SafeAreaView } from 'react-native';

import { LineChart, Grid } from 'react-native-svg-charts'
import { Colors } from '../assets/Colors'
import NavHeader from '../components/NavHeader'

import { STORAGE } from '../api/'

export default class Charts extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            data: []
        }
    }

    async componentDidMount() {
        this.setSessions()
        this.props.navigation.addListener('focus', () => {
            this.setSessions()
        })

    }

    async componentWillUnmount() {

    }

    setSessions = async () => {
        let arr = await STORAGE.getAllSessions()
        let slouches = []
        arr.forEach(sesh => {
            slouches.push(sesh.duration)
        })
        console.log(slouches)
        this.setState({ sessions: arr, data: slouches }, () => {
            console.log(this.state.data.length != 0)
        })
    }


    componentWillUnmount() {

    }


    render() {
        return (
            <SafeAreaView style={styles.container}>

                <NavHeader nav={this.props.navigation} />
                <Text style={styles.title}>Chart</Text>
                {this.state.data.length != 0 && <LineChart
                    style={{ height: 400 }}
                    data={this.state.data}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                    <Grid />
                </LineChart>
                }

            </SafeAreaView>
        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: Colors.SECONDARY,
        paddingVertical: 60
    },

    text: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        width: "50%"
    },
    title: {
        textAlign: 'center',
        color: "white",
        fontSize: 25,
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
