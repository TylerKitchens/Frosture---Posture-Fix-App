import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../assets/Colors'

export default function Rewards({ total }) {

    return (
        <TouchableOpacity onPress={() => console.log('open up rewards menu')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', borderRadius: 5, justifyContent: 'space-between', backgroundColor: Colors.TERTIARY, width: 100, marginRight: 10, borderTopRightRadius: 50, borderBottomRightRadius:50, paddingRight : 0}}>
                <FontAwesome5 style={{padding: 2}} name="trophy" size={20} color={Colors.FOURTH} />
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{total}</Text>
                <AntDesign style={{marginRight : 0, paddingRight : 0}}name="pluscircle" size={30} color={Colors.FIFTH} />
            </View>
        </TouchableOpacity>
    )
}