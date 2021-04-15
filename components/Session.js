import React from 'react';
import { Text, TouchableOpacity, View, Share } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../assets/Colors';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment'


export default function Session({ session }) {

    const styles = {
        container: {
            alignSelf: 'stretch',
            backgroundColor: "#efefef",
            padding: 10,
            margin: 15,
            borderRadius: 10

        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        dings: {
            textAlign: 'center',
            fontSize: 40,
            marginRight: 5,
            color: Colors.FIFTH
        },
        timeTxt: {
            color: 'white',
        },
        otherTxt : {
            color : Colors.PRIMARY
        },
        dateTxt: {
            color: Colors.PRIMARY,
            textAlign: 'right'
        },
        pill: {
            backgroundColor: Colors.TERTIARY,
            padding: 3,
            borderRadius: 10,
            alignSelf: 'none'
        },
        helperTxt: {
            color: Colors.PRIMARY,
            fontSize: 18
        }
    }

    const share = async () => {
        await Share.share({
            message: "Frosture helped me sit up straight for " + (session.duration / 60) + " minutes but it caught me slouching " + session.dings + " times! Can you beat that?"
        })
    }
    return (
        <View >
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <View style={styles.pill}>
                        <Text style={styles.timeTxt}>{session.duration / 60} {session.isCompleted ?  "Minute Frosture" : "Minute Attempt"} </Text>
                    </View>
                    <Text style={styles.otherTxt}>{moment(session.date).fromNow()}</Text>

                    <TouchableOpacity onPress={share}>
                        <Entypo name="share" size={24} color={Colors.TERTIARY} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.dings}>{session.dings}</Text>
                    {session.dings == 1 && <Text style={styles.helperTxt}>time caught slouching</Text>}
                    {session.dings != 1 && <Text style={styles.helperTxt}>times caught slouching</Text>}

                </View>

                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                        {session.isCompleted && <Entypo name="check" size={30} color={Colors.SECONDARY} />}
                        {!session.isCompleted && <FontAwesome name="times" size={30} color={"#B43718"} />}
                    </View>
                    <Text style={styles.dateTxt}>{moment(session.date).format("MM/DD/YYYY")}</Text>

                </View>




            </View>
        </View>
    )
}