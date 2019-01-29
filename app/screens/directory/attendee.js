import React from 'react';
import { View,Text } from 'react-native';
class Attendee extends React.Component{
    static navigationOptions={
        tabLabel: 'Sponsers'
    }
    render(){
        return <View
        style={
            {
                flex: 1,
                justifyContent:'center',
                alignItems:'center'
            }
        }>
        <Text>Sponsers1</Text>
            </View>
    }
}
export default Attendee;