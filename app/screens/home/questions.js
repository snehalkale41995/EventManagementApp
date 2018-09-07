import React from 'react';
import {ScrollView ,Platform,NetInfo} from 'react-native';
import { Text, View, Icon, Container, Label } from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Keyboard, Alert, AsyncStorage,ActivityIndicator } from 'react-native';
import { RkComponent, RkTheme,RkStyleSheet, RkText, RkAvoidKeyboard, RkButton, RkCard, RkChoice, RkTextInput, RkChoiceGroup } from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation';
import ReactMoment from 'react-moment';
import {GradientButton} from '../../components/gradientButton';
import * as questionFormService from '../../serviceActions/questionForm';
import * as eventService from '../../serviceActions/event';


export class Questions extends React.Component {
    static navigationOptions = {
        title: 'Questions'.toUpperCase()
      };
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            questionsForm: [],
            userId: this.props.userId,
            eventId : "",
            responses : [],
            queArray : [],
            isOffline :false,
            isLoading : true
        }
        this.onFormSelectValue = this.onFormSelectValue.bind(this);
        this.onMultiChoiceChange = this.onMultiChoiceChange.bind(this);
    }
    componentWillMount() {
        if(Platform.OS !== 'ios'){
          NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected) {
              this.getForm();
              this.setState({
                isLoading: true
              });
            } else {
              this.setState({
                isLoading: false,
                isOffline : true
              });
            }         
            this.setState({
              isOffline: !isConnected
            });
          });  
        }
        this.getForm();
        NetInfo.addEventListener(
          'connectionChange',
          this.handleFirstConnectivityChange
        );
      }

      handleFirstConnectivityChange = (connectionInfo) => {
        if(connectionInfo.type != 'none') {
          this.getForm();
            this.setState({
              isLoading: true
            });
        } else {
          this.setState({
            isLoading: false,
            isOffline : true
          });
        }
        this.setState({
          isOffline: connectionInfo.type === 'none',
        });
      };   

      componentWillUnmount() {
        NetInfo.removeEventListener(
          'connectionChange',
          this.handleFirstConnectivityChange
        );  
      }
    
    getForm = () => {
        let thisRef = this;
        eventService.getCurrentEvent((eventInfo)=>{
        if(eventInfo){
        let eventId = eventInfo._id;
        this.setState({eventId : eventId})
        questionFormService.getHomeQuestionForm(eventId).then((response)=>{
          if( response  == undefined){
                thisRef.resetNavigation(thisRef.props.navigation, 'HomeMenu');
            }
        else{
            let questionForm = response[0].formData
             thisRef.setState({
                questionsForm: questionForm,
                isLoading :false
            })
             let questionSet = [];
                questionForm.forEach(que => {
                   questionSet.push({ Question: que.question, Answer: new Set() });
                })
                thisRef.setState({
                    queArray: questionSet
                })
        }
      }).catch((error)=>{
            this.setState({ isLoading: false})
       })
       }
    })
    }

    resetNavigation =(navigation, targetRoute) => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: targetRoute, params:{ showHome : true }}),
          ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    onSubmitResponse = () => {
        this.setState({
            isLoading : true
        })
        let blankResponse = false;
        this.state.queArray.forEach(fItem => {
            if (fItem.Answer.size >= 1){
                fItem.Answer = Array.from(fItem.Answer);
            }
            if(fItem.Answer == "" || fItem.Answer.size == 0){
                blankResponse = true;
            }
        });
        if(blankResponse == true){
            this.setState({
                isLoading : false
            })
            Alert.alert("Please fill all the fields");
        }
        else{
            let thisRef = this;
            let formResponse = {
              event : this.state.eventId,
              user : this.props.userId,
              formResponse : this.state.queArray,
              responseTime : new Date()
            }
            questionFormService.submitHomeQuestionForm(formResponse).then((response)=>{
                 thisRef.setState({
                    isLoading : false
                })
                Alert.alert("Thanks for your response");
                thisRef.resetNavigation(thisRef.props.navigation, 'HomeMenu'); 
            }).catch((error)=>{
                Alert.alert("Something went Wrong"); 
            })
        }
    }
    onFormSelectValue = (questionsForm) => {
        if (this.state.questionsForm.length == 0) {
            this.resetNavigation(thisRef.props.navigation, 'HomeMenu');
        }
        else {
            let renderQuestions = this.state.questionsForm.map( (Fitem, queId) => {
                return (
                    <View style={{ marginLeft: 10, marginBottom: 10 }}>
                        <Label style={{ flexDirection: 'row', fontFamily: RkTheme.current.fonts.family.regular, alignItems: 'center', marginTop: 3, marginBottom: 2, fontSize: 14 }}>{Fitem.question}</Label>
                          {this.renderAnswerField(Fitem, queId)} 
                    </View>
                );
            });
            return renderQuestions;
        }
    }
    renderAnswerField = (item, queId) => {
        let answerInput = [];
        if (item.inputType == "Text") {
           answerInput :
            return (
                <RkTextInput type="text" placeholder="Answer" name="Answer" onChangeText={(text) => this.onTextChange(text, queId)} id={queId} />
            )
        } else if (item.inputType == "Check Box") {
            answerInput:
            return (
                <RkChoiceGroup radio style={{ marginTop: 3, marginBottom: 3 }} onChange={(id) => { this.onMultiChoiceChange(item.options, queId , id) }} >
                    {this.onRenderMultiChoice(item.options, queId)}
                </RkChoiceGroup>
            )
        }
        // else if (item.inputType == "Check Box") {
        //     answerInput:
        //     return (
        //         <RkChoiceGroup style={{ marginTop: 0, marginBottom: 3 }}>
        //             {this.onRenderCheckBox(item.value, item.QueId)}
        //         </RkChoiceGroup >
        //     )
        // }
       return  answerInput;
    }
    onRenderMultiChoice = (options, Qid) => {
        let MultiChoice = options.map(fItem => {
            return (
                <TouchableOpacity choiceTrigger >
                    <View style={{ flexDirection: 'row',marginBottom: 3,marginRight :15 ,alignItems: 'center' }}>
                        <RkChoice rkType='radio'
                            style = {{ borderWidth : 2 , borderRadius : 70 ,borderColor : '#c2c4c6'}}
                            id={Qid} value={fItem.value}
                            />
                        <Text style={{fontSize: 13 ,marginLeft : 5}}>{fItem.value}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return MultiChoice;
    }
    onRenderCheckBox = (value, Qid) => {
        let CheckBox1 = value.map(fItem => {
            return (
                <View style={{ flexDirection: 'row', marginBottom: 3,marginRight :15 ,marginTop: 1, alignItems: 'center' }}>
                    <RkChoice rkType='clear' style = {{  borderWidth : 2 ,borderColor : '#c2c4c6' }}
                        id={Qid} value={fItem.Value} 
                        onChange={(id) => {this.onCheckBoxChange(id ,fItem.Value,Qid)}} />
                    <Text style={{fontSize: 13 ,marginLeft : 5}}>{fItem.Value}</Text>
                </View>
            )
        })
        return CheckBox1;
    }
    onCheckBoxChange = (eventValue , value, Qid) => {
        let label = value;
        if(this.state.queArray[Qid].Answer.has(label)){
            this.state.queArray[Qid].Answer.delete(label);
        }
        else{
            this.state.queArray[Qid].Answer.add(label);
        }
    }
    onMultiChoiceChange = (options, Qid, id) => {

        this.state.queArray[Qid].Answer = options[id].value;
    }

    onTextChange(text, Qid) {
        this.state.queArray[Qid].Answer = text;
    }
    render() {
        if (this.state.isLoading == true ){
            return (
                <Container style={[styles.screen]}>
                    <ScrollView>
                        <View style={[styles.loading]} >
                            <ActivityIndicator size='large' />
                        </View>
                    </ScrollView>
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
                    </View>
                </Container>
            );
        }
        else{
            return (
                <Container style={[styles.screen]}> 
                    <ScrollView>
                        {this.onFormSelectValue(this.state.questionsForm)}
                        <GradientButton colors={['#f20505', '#f55050']} text='Submit'
                            style={[styles.Gradbtn]}
                            onPress={() => this.onSubmitResponse()}
                        />
                    </ScrollView>
                    <View style={[styles.footerOffline]}>
                        {
                            this.state.isOffline ? <RkText rkType="small" style={[styles.footerText]}>The Internet connection appears to be offline. </RkText> : null
                        }
                    </View>
                    <View style={[styles.footer]}>
                        <RkText rkType="small" style={[styles.footerText]}>Powered by</RkText>
                        <RkText rkType="small" style={[styles.companyName]}> Eternus Solutions Pvt. Ltd. </RkText>
                    </View>
                </Container>
            );
        }      
    }
}

let styles = RkStyleSheet.create(theme => ({
    screen: {
        backgroundColor: theme.colors.screen.base
      },
      Card: {
        width : Platform.OS === 'ios' ? 320 : 350, 
        alignSelf:'center'
      },
    loading: {
        marginTop: 250,
        left: 0,
        opacity: 0.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      },
      Gradbtn :{
          alignSelf: 'center',
          width: Platform.OS === 'ios' ? 280 : 340,
          marginTop: 3,
          marginBottom: 3
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch', 
        backgroundColor : '#E7060E'
      },
      footerOffline : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch', 
        backgroundColor : '#545454'
      },
      footerText: {
        color : '#f0f0f0',
        fontSize: 11,
      },
      companyName:{
        color : '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
      },
}));