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

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {
                x: 0,
                y: 0,
                z: 0,
            },
            timerSeconds: 1800,
            initialTime: 1800,
            timerRunning: false,
            subscription: null,
            interval: null,
            dingCount: 0,
            skipNext: false,
            inverted: false,
            sessionID : ''
        }
    }

    componentDidMount() {
    }



    componentWillUnmount() {
        this._unsubscribe()
        clearInterval(this.interval)
    }

    _subscribe = () => {
        Gyroscope.setUpdateInterval(1000);
        this.setState({
            subscription:
                Gyroscope.addListener(gyroscopeData => {
                    if ((this.state.data.x - gyroscopeData.x > 0.14 || this.state.data.x - gyroscopeData.x < -0.14) && !this.state.skipNext) {
                        this.setState({ dingCount: this.state.dingCount + 1, skipNext: true })
                        Vibration.vibrate()
                    } else {
                        this.setState({ skipNext: false })
                    }

                    this.setState({ data: gyroscopeData });

                })
        });
    };

    _unsubscribe = () => {
        this.state.subscription && this.state.subscription.remove();
        this.setState({ subscription: null })
    };

    startStop = () => {
        this.setState({ timerRunning: !this.state.timerRunning }, async () => {
            if (this.state.timerRunning) {
                
                this.interval = setInterval(() => {
                    if (this.state.timerSeconds > 0) {
                        this.setState({ timerSeconds: this.state.timerSeconds - 1 })     
                    }
                }, 1000)
                this._subscribe()
                //Session ID is a ISO time stamp of when it started
                this.setState({sessionID : await STORAGE.newSession(this.state.initialTime)})

            } else {
                await STORAGE.quit(this.state.sessionID, this.state.timerSeconds, this.state.dingCount)
                clearInterval(this.interval)
                this._unsubscribe()
                //Save that they quit
            }
        })

        console.log(this.state.timerSeconds)
    }

    formatTime = (remainingTime) => {
        let minutes = Math.floor(remainingTime / 60)
        let seconds = remainingTime % 60
        if (minutes < 10) {
            minutes = "0" + minutes.toString()
        }
        if (seconds < 10) {
            seconds = "0" + seconds.toString()
        }
        return `${minutes}:${seconds}`
    }

    upsideDown = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {!this.state.inverted && <Text style={{ fontSize: 12, color: "white", textAlign: 'center', alignSelf: 'center', paddingHorizontal: 4 }}>UP</Text>}
                <Switch
                    trackColor={{ false: '#767577', true: Colors.TERTIARY }}
                    thumbColor={this.state.inverted ? Colors.FIFTH : Colors.TERTIARY}
                    ios_backgroundColor={Colors.FIFTH}
                    onValueChange={() => this.setState({ inverted: !this.state.inverted })}
                    value={this.state.inverted}
                />
                {this.state.inverted && <Text style={{ fontSize: 12, color: "white", textAlign: 'center', alignSelf: 'center', paddingHorizontal: 4 }}>DOWN</Text>}


            </View>
        )
    }
    render() {
        const { x, y, z } = this.state.data;
        return (
            <SafeAreaView style={[styles.container, this.state.inverted && styles.inverted]}>
                <NavHeader nav={this.props.navigation} inverted={this.upsideDown()} rewards={<Rewards total={20} />} />
                <Text style={styles.text}>You have stood up straight for {this.state.initialTime} minutes today!</Text>
                <CountdownCircleTimer
                    isPlaying={this.state.timerRunning}
                    duration={this.state.initialTime}
                    colors={[[Colors.FIFTH, 0.33], [Colors.TERTIARY, 0.33], ['#B43718', 0.33]]}
                    onComplete={async () => {
                        this._unsubscribe()
                        clearInterval(this.interval)
                        await STORAGE.finished(this.state.sessionID, this.state.dingCount)
                    }}
                >
                    <Text style={styles.timerTxt}>{this.formatTime(this.state.timerSeconds)}</Text>
                </CountdownCircleTimer>

                <View style={styles.group}>
                    <Text style={styles.helperTxt}>Slide To Set Time!</Text>
                    <Slider
                        style={{ width: "60%", height: 40 }}
                        minimumValue={300}
                        maximumValue={3600}
                        value={1800}
                        step={300}
                        onValueChange={val => this.setState({ initialTime: val, timerSeconds: val })}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        thumbTintColor={Colors.FIFTH}
                        maximumTrackTintColor={Colors.PRIMARY}
                        minimumTrackTintColor={Colors.FIFTH}
                    />
                </View>


                <Text>{this.state.dingCount}</Text>

                <Btn onPress={this.startStop} txtColor="white" bgColor={Colors.FIFTH}>{this.state.timerRunning ? "Pause" : "Start"}</Btn>
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
