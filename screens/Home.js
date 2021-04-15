import React, { useState, useEffect } from 'react';
import { AppState, Animated, StyleSheet, Switch, Text, Image, View, Vibration, SafeAreaView } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import * as Speech from 'expo-speech';

import Notify from '../components/Notify'

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import Btn from '../components/Btn'
import { Colors } from '../assets/Colors'
import Slider from '@react-native-community/slider';
import NavHeader from '../components/NavHeader'
import Rewards from '../components/Rewards'

import * as Analytics from 'expo-firebase-analytics';


import { STORAGE } from '../api/'
import { TouchableOpacity } from 'react-native-gesture-handler';

import Tooltip from 'react-native-walkthrough-tooltip';



const facts = ['Poor alignment is the leading cause of headaches. Frosture can help!', 'Frosture = Front-pocket + Posture. Who knew?', 'Adjust sensitivity in Settings for more accurate results!', 'Complete a Frosture session and watch your points grow!', 'Closing out of the app will cancel the Frosture Session!', 'Compete with your friends for the highest score', 'Turn off all other notifications for the best experience!', 'You can share your session in the Timeline screen! Get competitve!', "Buy shirts with lots of front pockets! You're goint to need them!", 'Flip the swtich to DOWN to have access to the charging port!']
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
            sessionID: '',
            totalTime: -1,
            todayTime: 0,
            fadeAnimation: new Animated.Value(0),
            factIndex: 0,
            fadeTurn: true,
            toolTipIndex: -1
        }

    }

    fadeIn = () => {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start();
    };

    fadeOut = () => {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true
        }).start();
    };

    _handleAppStateChange = async (state) => {
        if (state == 'background' && this.state.timerRunning) {
            this._cleanUp()
            console.log('closed app')
        }
    }

    _cleanUp = async () => {
        await STORAGE.quit(this.state.sessionID, this.state.timerSeconds, this.state.dingCount)
        clearInterval(this.interval)
        this._unsubscribe()
        this.setState({ timerRunning: false, timerSeconds: this.state.initialTime, dingCount: 0 })
    }

    async componentDidMount() {

        await Analytics.logEvent('ButtonTapped', {
            name: 'settings',
            screen: 'profile',
            purpose: 'Opens the internal settings',
        });

        this.props.navigation.addListener('focus', async () => {

            if (await STORAGE.isFirstTime()) {
                this.setState({ toolTipIndex: 0 })
            }
            this.forceUpdate()
        })
        AppState.addEventListener('change', this._handleAppStateChange);
        this.setState({ todayTime: await STORAGE.getTodayTotalTime() })
        this.textInterval = setInterval(() => {
            if (this.state.fadeTurn) {
                this.setState({ factIndex: this.state.factIndex + 1 }, () => {
                    this.fadeIn()
                })

            } else {
                this.fadeOut()
            }
            this.setState({ fadeTurn: !this.state.fadeTurn })
        }, 3000)

        if (await STORAGE.isFirstTime()) {
            this.setState({ toolTipIndex: 0 })
        }
    }

    componentWillUnmount() {
        this._unsubscribe()
        clearInterval(this.interval)
        clearInterval(this.textInterval)
        AppState.removeEventListener('change', this._handleAppStateChange);

    }

    _subscribe = async () => {
        let sensitivity = await STORAGE.getSensitivity()

        console.log('Sensitivity: ' + sensitivity)

        Gyroscope.setUpdateInterval(1000 + sensitivity * 100);

        this.setState({
            subscription:
                Gyroscope.addListener(gyroscopeData => {
                    if ((this.state.data.x - gyroscopeData.x > (0.14 + sensitivity / 100) || this.state.data.x - gyroscopeData.x < (-0.14 - sensitivity / 100)) && !this.state.skipNext) {
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

    _finished = async () => {
        clearInterval(this.interval)
        this._unsubscribe()
        await STORAGE.finished(this.state.sessionID, this.state.dingCount)
        this.setState({ timerRunning: false, timerSeconds: this.state.initialTime, showCongrats: true, dingCount: 0 })

        //Show a congradulations modal!
        this.setState({ showCongrats: true })
    }

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
                this.setState({ sessionID: await STORAGE.newSession(this.state.initialTime) })

            } else {
                this._cleanUp()
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
            <Tooltip
                isVisible={this.state.toolTipIndex == 2}
                content={<Text style={{ textAlign: 'center' }}>Flip your screen upside to have access to your charging port here!</Text>}
                placement="bottom"
                allowChildInteraction={false}
                onClose={() => this.setState({ toolTipIndex: this.state.toolTipIndex + 1 })}
            >
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
            </Tooltip>
        )
    }
    render() {
        const { x, y, z } = this.state.data;
        return (
            <SafeAreaView style={[styles.container, this.state.inverted && styles.inverted]}>
                {!this.state.timerRunning && <NavHeader nav={this.props.navigation} inverted={this.upsideDown()} rewards={<Tooltip
                    isVisible={this.state.toolTipIndex == 3}
                    content={<Text style={{ textAlign: 'center' }}>1 point equals 1 minute spent in a Frosture session. 1 slouch equals -1 point! Points don't count if you do not finish the session!</Text>}
                    placement="bottom"
                    allowChildInteraction={false}
                    onClose={() => this.setState({ toolTipIndex: this.state.toolTipIndex + 1 })}
                ><Rewards total={this.state.totalTime} /></Tooltip>} />}
                <Notify navigation={this.props.navigation} />
                {this.state.timerRunning &&
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.slouchCount}>Slouches: </Text>
                        <Text style={styles.slouches}>{this.state.dingCount}</Text>
                    </View>
                }
                <Animated.View
                    style={[
                        styles.fadingContainer,
                        {
                            opacity: this.state.fadeAnimation,
                        }
                    ]}
                >
                    {!this.state.timerRunning && this.state.todayTime == 0 && <Text style={styles.text}>{facts[(this.state.factIndex + 1) % facts.length]}</Text>}
                </Animated.View>
                <CountdownCircleTimer
                    isPlaying={this.state.timerRunning}
                    duration={this.state.initialTime}
                    colors={[[Colors.FIFTH, 0.33], [Colors.TERTIARY, 0.33], ['#B43718', 0.33]]}
                    size={215}
                    onComplete={async () => {
                        this._finished()
                    }}
                >
                    <Tooltip
                        isVisible={this.state.toolTipIndex == 4}
                        content={<Text style={{ textAlign: 'center' }}>Your time left will be shown here! Make sure it hits 00:00 for your points to count!</Text>}
                        placement="top"
                        onClose={() => this.setState({ toolTipIndex: this.state.toolTipIndex + 1 }, () => { this.props.navigation.openDrawer(); STORAGE.setFirstTime() })}
                    >
                        <Text style={styles.timerTxt}>{this.formatTime(this.state.timerSeconds)}</Text>
                    </Tooltip>
                </CountdownCircleTimer>

                {!this.state.timerRunning && <View style={styles.group}>
                    <Text style={styles.helperTxt}>Slide To Set Time!</Text>
                    <Tooltip
                        isVisible={this.state.toolTipIndex == 0}
                        content={<Text style={{ textAlign: 'center' }}>Adjust how long you want to stand up straight here!</Text>}
                        placement="top"
                        onClose={() => this.setState({ toolTipIndex: this.state.toolTipIndex + 1 })}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}>5</Text>

                            <Slider
                                style={{ width: "60%", height: 40 }}
                                minimumValue={300}
                                maximumValue={3600}
                                value={this.state.initialTime}
                                step={300}
                                onValueChange={val => this.setState({ initialTime: val, timerSeconds: val })}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor={Colors.FIFTH}
                                maximumTrackTintColor={Colors.PRIMARY}
                                minimumTrackTintColor={Colors.FIFTH}
                            />
                            <Text style={{ color: 'white' }}>60</Text>
                        </View>
                    </Tooltip>
                </View>}

                {!this.state.timerRunning &&
                    <Tooltip
                        isVisible={this.state.toolTipIndex == 1}
                        content={<Text style={{ textAlign: 'center' }}>You will have 10 seconds to put your phone in your front pocket and sit up straight before you are penalyzed! </Text>}
                        placement="top"
                        allowChildInteraction={false}
                        onClose={() => this.setState({ toolTipIndex: this.state.toolTipIndex + 1 })}
                    >
                        <Btn onPress={this.startStop} txtColor="white" bgColor={Colors.FIFTH}>{this.state.timerRunning ? "Pause" : "Start"}</Btn>
                    </Tooltip>}
                {this.state.timerRunning && <TouchableOpacity onPress={this.startStop} style={styles.btn}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>}
                <Image style={{ width: '30%', resizeMode: 'contain' }} source={require('../assets/logo-txt.png')} />

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
    group: {
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        width: "80%"
    },

    fadingContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    cancelTxt: {
        textAlign: 'center',
        color: Colors.PRIMARY,
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    helperTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    slouchCount: {
        textAlign: 'center',
        color: Colors.TERTIARY,
        fontSize: 25,
        fontWeight: 'bold',
        padding: 5
    },

    slouches: {
        textAlign: 'center',
        color: Colors.FIFTH,
        fontSize: 50,
        fontWeight: 'bold',
        padding: 5
    },

    timerTxt: {
        textAlign: 'center',
        color: "white",
        fontSize: 45,
        color: Colors.TERTIARY

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
