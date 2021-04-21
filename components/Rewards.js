import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../assets/Colors'

export default function Rewards({ total }) {

    return (
        <TouchableOpacity onPress={() => console.log('open up rewards menu')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', borderRadius: 5, justifyContent: 'space-between', backgroundColor: Colors.TERTIARY,  marginRight: 10, borderRadius : 10, paddingHorizontal : 10}}>
                <FontAwesome5 style={{padding: 2}} name="trophy" size={20} color={Colors.FIFTH} />
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{total}</Text>
                {/*<AntDesign style={{marginRight : 0, paddingRight : 0}}name="pluscircle" size={30} color={Colors.FIFTH} />*/}
            </View>
        </TouchableOpacity>
    )
}