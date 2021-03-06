import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, Vibration, SafeAreaView } from 'react-native';

import Session from '../components/Session'
import { Colors } from '../assets/Colors'
import NavHeader from '../components/NavHeader'

import { STORAGE } from '../api/'

export default class Timeline extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sessions: []
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
        this.setState({ sessions: arr.reverse() }, () => {
            console.log(this.state.sessions)
        })
    }


    componentWillUnmount() {

    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                
                <NavHeader nav={this.props.navigation} />
                {this.state.sessions.length == 0 && <Text style={styles.title}>Timeline</Text>}
                {this.state.sessions.length == 0 && <Text style={styles.subTitle}>Complete Your First Frosture Session For Data To Appear Here!</Text>}
                {this.state.sessions.length != 0 && <ScrollView style={{ alignSelf: 'stretch' }}>
                <Text style={styles.title}>Timeline</Text>

                    {this.state.sessions.length > 0 && this.state.sessions.map(sesh => <Session key={sesh.date.toISOString()} session={sesh} />)}
                </ScrollView>
                }
            </SafeAreaView>
        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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
    subTitle: {
        textAlign: 'center',
        color: Colors.TERTIARY,
        fontSize: 20,
        marginTop : 100,
        padding : 20
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
