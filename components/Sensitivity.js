import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../assets/Colors'
import Slider from '@react-native-community/slider';
import { STORAGE } from '../api';
import { useEffect } from 'react';

export default function Sensitivity({ onClose }) {
    const [value, setValue] = useState(0)

    const styles = {
        container: {
            backgroundColor: '#efefef',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            width: "80%",
            borderRadius: 10,
            shadowOffset: {
                width: 7,
                height: 10
            },
            shadowOpacity: 0.7,
            shadowRadius: 3
        },
        title: {
            textAlign: 'center',
            fontSize: 30,
            marginBottom: 10,
            fontWeight: 'bold'
        },
        val: {
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 10,
            fontWeight: 'bold'
        },

        reset: {
            color: Colors.FIFTH,
            textDecorationLine: 'underline'
        }
    }

    const saveSensitivity = (val) => {
        STORAGE.setSensitivity(val)
    }

    useEffect(() => {
        (async () => {
            let sensitivity = await STORAGE.getSensitivity()
            if (sensitivity) {
                setValue(sensitivity)
            }
        })()
    }, [])


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-start' }}>
                <FontAwesome name="times" size={30} color={Colors.FIFTH} />
            </TouchableOpacity>
            <Text style={styles.title}>Adjust Slouching Sensitivity</Text>
            <Text style={{textAlign : 'center'}}>Adjust this setting if you think Frosture is detecting too many or too little slouches. Moving it to the left will make Frosture more sensitive</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop : 10 }}>

                <Text>-</Text>
                <Slider
                    style={{ height: 40, width: "70%" }}
                    minimumValue={-5}
                    maximumValue={5}
                    value={value}
                    step={.5}
                    onValueChange={val => setValue(val)}
                    minimumTrackTintColor="black"
                    maximumTrackTintColor="#000000"
                    thumbTintColor={Colors.FIFTH}
                    maximumTrackTintColor={Colors.PRIMARY}
                    minimumTrackTintColor={Colors.FIFTH}
                    onSlidingComplete={(val) => saveSensitivity(val)}
                />
                <Text>+</Text>
            </View>
            <Text style={styles.val}>{value}</Text>
            <TouchableOpacity onPress={() => { setValue(0); saveSensitivity(0) }}>
                <Text style={styles.reset}>Default</Text>
            </TouchableOpacity>
        </View>

    )
}