import React from 'react';
import { Text, View, Icon } from 'native-base';
import { AsyncStorage, FlatList, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { RkComponent, RkTheme, RkText, RkButton, RkCard, RkStyleSheet } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import styleConstructor, { getStatusStyle } from './styles';
import ReactMoment from 'react-moment';
import Moment from 'moment';
import { Avatar } from '../../../components';
import withPreventDoubleClick from '../../../components/withPreventDoubleClick/withPreventDoubleClick';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

export default class ScheduleTile extends RkComponent {

    constructor(props) {
        super(props);
        this.styles = styleConstructor();
        let __props = this.props;
        __props.session.displayColor = '#ffffff';
        switch (__props.session.sessionType) {
            case 'common': {
                __props.session.displayColor = 'gray';
                break;
            }
            case 'keynote':
                __props.session.displayColor = 'green';
                break;
            case 'deepdive':
                __props.session.displayColor = 'orange';
                break;
            case 'panel':
                __props.session.displayColor = 'purple';
                break;
            case 'breakout':
                __props.session.displayColor = 'blue';
                break;
        }
        this.state = __props;

    }
    /**
    * Duration Details
    */
    getDuration = () => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                <Icon name="md-time" style={this.styles.tileIcons} style={{ color: '#5d5e5f', fontSize: 16, marginTop: 2, marginRight: 5 }} />
                <Text style={this.styles.duration} style={{ color: '#5d5e5f', fontSize: 14 }}>{Moment(this.props.session.startTime).format("HH:mm")} - {Moment(this.props.session.endTime).format("HH:mm")}</Text>
            </View>
        );
    }
    /**
    * Location Details
    */
    getLocation = () => {
        return (
            <View style={{ marginLeft: 20, flexDirection: 'row', alignSelf: 'flex-end' }}>
                <Icon name="md-pin" style={this.styles.tileIcons} style={{ color: '#5d5e5f', fontSize: 16, marginTop: 2, marginRight: 5 }} />
                <Text style={this.styles.roomName} style={{ color: '#5d5e5f', fontSize: 14 }}>{this.props.session.room ? this.props.session.room.roomName : ""}</Text>
            </View>
        );
    }

    applyTouchOpacity = (shouldApplyOpacity) => {
        if (!shouldApplyOpacity) {
            return <TouchableOpacityEx
                onPress={() => this.props.navigation.navigate('SessionDetails', { session: this.props.session})}
                style={{
                    flexDirection: 'row',
                    flex: 3,
                }}>
                <Text style={{ fontSize: 16, fontWeight: '600', width: 300 }} numberOfLines={1}>{this.props.session.sessionName}</Text>
            </TouchableOpacityEx>;
        } else {
            return <Text style={{ fontSize: 16, fontWeight: '600', width: 300 }} numberOfLines={1}>{this.props.session.sessionName}</Text>;
        }
    }

    applyTouchOpacityArrow = (shouldApplyOpacity) => {
        if (!shouldApplyOpacity) {
            return (
                <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 3 }}>
                    <TouchableOpacityEx
                        onPress={() => this.props.navigation.navigate('SessionDetails', { session: this.props.session })}
                    >
                        <RkText style={{ marginTop: 5 }}><Icon name="ios-arrow-forward" /></RkText>
                    </TouchableOpacityEx>
                </View>
            );
        } else {
            return <Text style={{ fontSize: 16, fontWeight: '600', width: 300 }} numberOfLines={1}>   </Text>;
        }
    }
    
    checkDeepDiveSession = (session) => {
        if (session.isRegistrationRequired) {
            return <Text style={this.styles.speaker} style={{ fontSize: 10, color: 'red' }}>**Pre-registration required**</Text>;
        }
        else if(session.sessionType == 'invite'){
            return <Text style={this.styles.speaker} style={{ fontSize: 10, color: 'red' }}>**By invitation only**</Text>;            
        }
        else {
            return <View></View>;
        }
    }
    /**
    * Render Schedule Tile
    */
    render() {
        if (this.props.session) {
            return (
                <TouchableOpacityEx disabled={this.props.session.isBreak}
                    onPress={() => this.props.navigation.navigate('SessionDetails', { session: this.props.session })}
                >
                    <RkCard rkType='shadowed' style={[this.styles.card, { borderLeftColor: this.props.session.displayColor }]}>
                        <View style={this.styles.header} style={{ height: 30 }}>
                            <View style={this.styles.mainHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 7 }}>
                                {this.applyTouchOpacity(this.props.session.isBreak)}
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 3 }}>
                                {this.applyTouchOpacityArrow(this.props.session.isBreak)}
                            </View>
                        </View >
                        <View style={this.styles.content} >
                         
                            <View style={this.styles.tileFooter}>
                                {this.getDuration()}
                                {this.getLocation()}
                            </View>
                        </View>
                         {this.checkDeepDiveSession(this.props.session)} 
                    </RkCard>
                </TouchableOpacityEx>
            );
        } else {
            return (
                <Text>
                    Unable to fetch detailis
                </Text>
            );
        }
    }
}


let styles = RkStyleSheet.create(theme => ({
    listContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    loading: {
        marginTop: 200,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 1,
        padding: 4,
        height: 75
    },
    header: {
        flex: 1,
        flexDirection: 'column'
    },
    mainHeader: {
        flexDirection: 'column',
        flex: 3,
        justifyContent: 'space-between',
        marginLeft: 5
    },
    roomName: {
        fontSize: 15,
        marginLeft: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    content: {
        margin: 2,
        padding: 2
    },
    duration: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10
    },
    tileIcons: {
        paddingLeft: 4,
        paddingTop: 4,
        fontSize: 16
    },
    tileFooter: {
        flexDirection: 'row',
        alignContent: 'space-between'
    }
}));
