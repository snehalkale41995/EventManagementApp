import React from 'react';
import { View,Text } from 'react-native';
class Sponsers extends React.Component{
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
        <Text>Sponsers</Text>
            </View>
    }
}
export default Sponsers;