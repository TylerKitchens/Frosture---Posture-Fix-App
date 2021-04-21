import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Modal, Image, Text, Switch, View, Vibration, SafeAreaView, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LineChart, Grid } from 'react-native-svg-charts'

import * as Notifications from 'expo-notifications';

import { Colors } from '../assets/Colors'
import NavHeader from '../components/NavHeader'
import Sensitivity from '../components/Sensitivity'

import { STORAGE } from '../api/'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Charts extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isNotified: false,
            showSens: false
        }
    }

    async componentDidMount() {
        this.setState({ isNotified: await STORAGE.getNotificationStatus() == 'yes' })

    }

    async componentWillUnmount() {

    }

    delete = () => {
        Alert.alert(
            "Are you sure you want to delete all your data?",
            "This action cannot be undone and all your hard earned points will go to waste! Only continue if you are sure you know what you are doing. This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "DELETE", onPress: () => STORAGE.deleteData() }
            ]
        );
    }

    resetTutorial = async () => {
        await STORAGE.resetTutorial()
        this.props.navigation.jumpTo('Home')
    }

    toggleNotifications = () => {
        this.setState({ isNotified: !this.state.isNotified }, async () => {
            await STORAGE.setNotificationStatus(this.state.isNotified ? 'yes' : 'no')
            if (!this.state.isNotified) {
                Notifications.cancelScheduledNotificationAsync(await STORAGE.getTwoDayNotify())

            } else {
                const twoDay = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Don't Give Up On Your Posture!",
                        body: 'Start Frosturizing again!',
                        data: { data: 'goes here' },
                    },
                    trigger: { seconds: 172800 }
                });
                //Cancel this when user opens the app
                STORAGE.saveTwoDayNotify(twoDay)
            }
        })
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <NavHeader nav={this.props.navigation} />

                <Text style={styles.title}>Settings</Text>
                <View style={{ alignSelf: 'stretch' }}>

                    <Text style={styles.settingsLbl}>General</Text>
                   {/* <View style={[styles.setting, styles.top]}>
                        <Text style={styles.text}>Notifications</Text>
                        <Switch
                            trackColor={{ false: 'grey', true: Colors.TERTIARY }}
                            thumbColor={this.state.isNotified ? Colors.FIFTH : Colors.TERTIARY}
                            ios_backgroundColor={Colors.PRIMARY}
                            onValueChange={() => this.toggleNotifications()}
                            value={this.state.isNotified}
                        />
                    </View>
          */}

                    <TouchableOpacity onPress={() => this.setState({showSens : true})} style={[styles.setting, styles.top]}>
                        <Text style={styles.text}>Adjust Sensitivity</Text>
                        <AntDesign name="right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.resetTutorial} style={[styles.setting, styles.bottom]}>
                        <Text style={styles.text}>Show Tutorial</Text>
                        <AntDesign name="right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>


                    <Text style={styles.settingsLbl}>About</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('http://frosture.com/index.html#faq')} style={[styles.setting, styles.top]}>
                        <Text style={styles.text}>FAQ and Support</Text>
                        <AntDesign name="right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('http://frosture.com/privacy.html')} style={[styles.setting, styles.bottom]}>
                        <Text style={styles.text}>Privacy Policy</Text>
                        <AntDesign name="right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>

                    <Text style={styles.settingsLbl}>Danger Zone</Text>
                    <TouchableOpacity onPress={this.delete} style={[styles.setting, styles.top, styles.bottom]}>
                        <Text style={styles.text}>Delete All Data</Text>
                        <AntDesign name="right" size={24} color={Colors.PRIMARY} />
                    </TouchableOpacity>

                </View>


                <View style={{ height: 40 }} />
                <Image style={{ width: '30%', resizeMode: 'contain' }} source={require('../assets/logo-txt.png')} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showSens}
                    onRequestClose={() => {
                        this.setState({ showSens: false })
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Sensitivity onClose={() => this.setState({ showSens: false })} />
                    </View>
                </Modal>

                


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

    top: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },

    bottom: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },

    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        backgroundColor: '#efefef',
        padding: 13,
        marginHorizontal: 10,
        alignItems: 'center',
        borderBottomWidth: 0.6,
        borderBottomColor: "grey"
    },
    text: {
        textAlign: 'center',
        color: Colors.PRIMARY,
        fontSize: 18,

    },

    settingsLbl: {
        textAlign: 'left',
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 20,
        marginTop: 10
    },
    title: {
        textAlign: 'center',
        color: "white",
        fontSize: 25,
        marginBottom: 10
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
