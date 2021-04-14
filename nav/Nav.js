import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Timeline from '../screens/Timeline'
import Home from '../screens/Home'

import {Colors} from '../assets/Colors'
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();

export default function Nav() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
       drawerStyle={{backgroundColor : Colors.SECONDARY, width : '50%'}} initialRouteName="Home"
        drawerContentOptions = {{
          labelStyle : {
            color : 'white'
          },
          activeTintColor : Colors.SECONDARY,
          inactiveTintColor : Colors.SECONDARY
        }}
       >
        <Drawer.Screen name="Home" component={Home}  options={{
          drawerIcon : config => <Entypo name="home" size={24} color="white" />,
          drawerStyle : {color : 'white'}
        }}/>
        <Drawer.Screen name="Timeline" component={Timeline}  options={{
          drawerIcon : config => <MaterialIcons name="timeline" size={24} color="white" />,
          drawerStyle : {color : 'white'}
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}