import React from "react";
import { ScrollView, Platform, NetInfo } from "react-native";
import { Text, View, Icon, Container, Label, Input } from "native-base";
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import {
  RkComponent,
  RkTheme,
  RkStyleSheet,
  RkText,
  RkAvoidKeyboard,
  RkButton,
  RkCard,
  RkChoice,
  RkTextInput,
  RkChoiceGroup
} from "react-native-ui-kitten";
import { NavigationActions } from "react-navigation";
import ReactMoment from "react-moment";
import { GradientButton } from "../../components/gradientButton";
import * as questionFormService from "../../serviceActions/questionForm";
import * as eventService from "../../serviceActions/event";
import * as loginService from "../../serviceActions/login";
import { Loader } from "../../components/loader";
import { Footer } from "../../components/footer";
import {EmptyData} from '../../components/emptyData';

export class Survey extends RkComponent {
  static navigationOptions = {
    title: "Feedback".toUpperCase()
  };
  constructor(props) {
    super(props);
    this.navigation = this.props.navigation;
    this.state = {
      questionsForm: [],
      userId: "",
      eventId: "",
      responses: [],
      queArray: [],
      sessionId: this.props.navigation.state.params.sessionDetails.key,
      session: this.props.navigation.state.params.sessionDetails,
      isOffline: false,
      isLoading: true,
      noDataFlag : false
    };
    this.onFormSelectValue = this.onFormSelectValue.bind(this);
  }
  componentWillMount() {
    if (Platform.OS !== "ios") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getCurrentUser();
          this.setState({
            isLoading: true
          });
        } else {
          this.setState({
            isLoading: false,
            isOffline: true
          });
        }
        this.setState({
          isOffline: !isConnected
        });
      });
    }
    this.getCurrentUser();
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type != "none") {
      this.getCurrentUser();
      this.setState({
        isLoading: true
      });
    } else {
      this.setState({
        isLoading: false,
        isOffline: true
      });
    }
    this.setState({
      isOffline: connectionInfo.type === "none"
    });
  };

  componentWillUnmount() {
    NetInfo.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  getCurrentUser() {
    let thisRef = this;
    loginService.getCurrentUser(userDetails => {
      eventService.getCurrentEvent(eventDetails => {
        this.setState({
          userId: userDetails._id,
          eventId: eventDetails._id
        });
        thisRef.getForm();
      });
    });
  }

  getForm = () => {
    let thisRef = this;
    let eventId = this.state.eventId;
    questionFormService
      .getQuestionForm(eventId)
      .then(response => {
        let formResponse = {};
        if (response == undefined || response.length ===0) {
          thisRef.setState({
              isLoading: false,
              noDataFlag : true
            })  
        } else {
          response.forEach(dataObj => {
            if (dataObj.formType === "Feedback Questions") {
              formResponse = dataObj;
            }
          });
         if(Object.getOwnPropertyNames(formResponse).length ==0){
            thisRef.setState({isLoading : false, noDataFlag: true})
         }
        else{
          let questionForm = formResponse.formData;
          thisRef.setState({
            questionsForm: questionForm,
            isLoading: false
          });
          let questionSet = [];
          questionForm.forEach(que => {
            questionSet.push({ Question: que.question, Answer: new Set() });
          });
          thisRef.setState({
            queArray: questionSet
          });
        }
      }
      })
      .catch(error => {
        this.setState({ isLoading: false,  noDataFlag : true});
      });
  };

  onSubmitResponse = () => {
       let thisRef = this;
        thisRef.setState({
            isLoading : true
        })
      setTimeout(function() {
               let blankResponse = false;
        thisRef.state.queArray.forEach(fItem => {
            if (fItem.Answer.size >= 1){
                fItem.Answer = Array.from(fItem.Answer);
            }
            if(fItem.Answer == "" || fItem.Answer.size == 0){
                blankResponse = true;
            }
        });
        if(blankResponse == true){
            Alert.alert("Please fill all the fields");
            let questionArray =  thisRef.state.queArray
            questionArray.forEach(fItem => {
                fItem.Answer = new Set()
             });
            thisRef.setState({
                isLoading : false,
                queArray:questionArray
            })
        }
     else {
      let formResponse = {
        event: thisRef.state.eventId,
        user: thisRef.state.userId,
        session: thisRef.state.sessionId,
        formResponse: thisRef.state.queArray,
        responseTime: new Date()
      };
      questionFormService
        .submitFeedbackForm(formResponse)
        .then(response => {
          thisRef.setState({
            isLoading: false
          });
          Alert.alert("Thanks for your Feedback");
          thisRef.setState({
            responses: [],
            queArray: [],
            isLoading: false
          });
        
         setTimeout(function() {
        thisRef.props.navigation.goBack();
         }, 1000);
        })
        .catch(error => {
         thisRef.setState({isLoading : false})
          Alert.alert("Something went Wrong");
        });
    }
      }, 2000);
  };

  onFormSelectValue = questionsForm => {
    let thisRef = this;
    if (this.state.questionsForm.length == 0) {
      return (
        <View>
          <Text>No data found...</Text>
        </View>
      );
    } else {
      let renderQuestions = this.state.questionsForm.map((Fitem, queId) => {
        return (
          <View style={{ marginLeft: 10, marginBottom: 10 }}>
            <Label
              style={{
                flexDirection: "row",
                fontFamily: RkTheme.current.fonts.family.regular,
                alignItems: "center",
                marginTop: 3,
                marginBottom: 2,
                fontSize: 14
              }}
            >
              {Fitem.question}
            </Label>
            {this.renderAnswerField(Fitem, queId)}
          </View>
        );
      });
      return renderQuestions;
    }
  };

  renderAnswerField = (item, queId) => {
    let answerInput = [];
    if (item.inputType == "Text") {
      answerInput: return (
        <RkTextInput
          type="text"
          placeholder="Answer"
          name="Answer"
          onChangeText={text => this.onTextChange(text, queId)}
          id={queId}
        />
      );
    } else if (item.inputType == "Radio Button") {
      answerInput: return (
        <RkChoiceGroup
          radio
          style={{ marginTop: 3, marginBottom: 3 }}
          onChange={id => {
            this.onRadioButtonChange(item.options, queId, id);
          }}
        >
          {this.onRenderRadioButton(item.options, queId)}
        </RkChoiceGroup>
      );
    } else if (item.inputType == "Check Box") {
      answerInput: return (
        <RkChoiceGroup style={{ marginTop: 0, marginBottom: 3 }}>
          {this.onRenderCheckBox(item.options, queId)}
        </RkChoiceGroup>
      );
    }
    return answerInput;
  };

  onRenderRadioButton = (options, Qid) => {
    let MultiChoice = options.map(fItem => {
      return (
        <TouchableOpacity choiceTrigger>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 3,
              marginRight: 15,
              alignItems: "center"
            }}
          >
            <RkChoice
              rkType="radio"
              style={{
                borderWidth: 2,
                borderRadius: 70,
                borderColor: "#c2c4c6"
              }}
              id={Qid}
              value={fItem.value}
            />
            <Text style={{ fontSize: 13, marginLeft: 5 }}>{fItem.value}</Text>
          </View>
        </TouchableOpacity>
      );
    });
    return MultiChoice;
  };

  onRenderCheckBox = (options, Qid) => {
    let CheckBox1 = options.map(fItem => {
      return (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 3,
            marginRight: 15,
            marginTop: 1,
            alignItems: "center"
          }}
        >
          <RkChoice
            rkType="clear"
            style={{ borderWidth: 2, borderColor: "#c2c4c6" }}
            id={Qid}
            value={fItem.value}
            onChange={id => {
              this.onCheckBoxChange(fItem.value, Qid);
            }}
          />
          <Text style={{ fontSize: 13, marginLeft: 5 }}>{fItem.value}</Text>
        </View>
      );
    });
    return CheckBox1;
  };

  onCheckBoxChange = (value, Qid) => {
    let label = value;
    if(this.state.queArray[Qid].Answer){
      if (this.state.queArray[Qid].Answer.has(label)) {
      this.state.queArray[Qid].Answer.delete(label);
    } else {
      this.state.queArray[Qid].Answer.add(label);
    }
    }
     else {
      this.state.queArray[Qid].Answer.add(label);
    }
  };

  onRadioButtonChange = (options, Qid, id) => {
    this.state.queArray[Qid].Answer = options[id].value;
  };

  onTextChange(text, Qid) {
    this.state.queArray[Qid].Answer = text;
  }

  render() {
   if (!this.state.isLoading && !this.state.noDataFlag) {
      return (
        <Container style={[styles.screen]}>
          <ScrollView>
            {this.onFormSelectValue(this.state.questionsForm)}
            <GradientButton
              colors={["#f20505", "#f55050"]}
              text="Submit"
              style={[styles.Gradbtn]}
              onPress={() => this.onSubmitResponse()}
            />
          </ScrollView>
          <View>
            <Footer isOffline={this.state.isOffline}/>
          </View>
        </Container>
      );
   }
   else if(!this.state.isLoading && this.state.noDataFlag){
           return (<EmptyData isOffline ={this.state.isOffline}/>)
          }
  else{
    return (
      <Container style={[styles.screen]}>
      <Loader/> 
      <View>
      <Footer isOffline ={this.state.isOffline}/> 
      </View>
      </Container>
      )
  }
}

}
let styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base
  },
  Gradbtn: {
    alignSelf: "center",
    width: Platform.OS === "ios" ? 280 : 340,
    marginTop: 3,
    marginBottom: 3
  }
}));
