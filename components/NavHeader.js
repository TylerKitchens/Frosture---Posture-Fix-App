import React from 'react';
import { Text, TouchableOpacity, View, Switch } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Colors } from '../assets/Colors';


export default function NavHeader({ nav, inverted, rewards }) {

    return (
        <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => nav.openDrawer()}>
                <EvilIcons name="navicon" size={45} color={Colors.TERTIARY} />
            </TouchableOpacity>
           

            {inverted}
            {rewards}

        </View>
    )
}