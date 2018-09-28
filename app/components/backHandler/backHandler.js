import {BackHandler, Alert} from 'react-native';

const exitAlert = () => {
  Alert.alert(
      'Confirm exit',
      'Do you want to quit the app?',
      [
        { text: 'Ok', onPress: () => {BackHandler.exitApp()}},
        { text: 'Cancel', onPress: () =>{}}
      ]
    );
};

export {exitAlert};