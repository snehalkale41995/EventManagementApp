import React from 'react';
import { RkText, RkStyleSheet } from 'react-native-ui-kitten';
import { Container } from 'native-base';
import {  View, WebView, Text,NetInfo,Platform ,ScrollView,Cont } from 'react-native';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import * as loginService from '../../serviceActions/login';
import QRCode from "react-native-qrcode"; 
import {Loader} from '../../components/loader';
import {Footer} from '../../components/footer'; 
import { GradientButton } from '../../components/gradientButton';
import * as eventService from '../../serviceActions/event';
import {  Tab, TabHeading,Tabs } from "native-base";
import { BackHandler } from 'react-native';

export class SocialFeed extends React.Component {
  static navigationOptions = {
    title: 'Social feed'.toUpperCase()
  };


  constructor(props){
    super(props);
    this.state = {
      isOffline: false,
      eventInfo :{},
      isLoaded: false,
      fnameError:'',
      lnameError:'',
      contactError:'',
      emailError:''
    }

  }

  handleBackPress=()=>{
    //console.log('Here',this.props);
      this.props.navigation.replace('HomeMenu');
      return true;

  }
 
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    if (Platform.OS !== 'ios') {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.getEventInfo();
        } else {
          this.setState({
            isOffline: true
          }); 
        }
        this.setState({
          isOffline: !isConnected
        });
      });
    }
     this.getEventInfo();
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }


  getEventInfo=()=>{
    eventService.getCurrentEvent((eventDetails)=>{
      if(eventDetails){
        this.setState({
          eventInfo : eventDetails,
          isLoaded : true 
        })
       }
      else{
        this.setState({isLoaded:false})
      }
     })
  }
  handleFirstConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type != 'none') {
      this.getEventInfo();
    } else {
      this.setState({
        isOffline: true
      });
    } 
    this.setState({
      isOffline: connectionInfo.type === 'none',
    });
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress);

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  } 
  render() {
    return( 
      <View style={{flex:1}}>
      <WebView
      style={{flex:1}}
      originWhitelist={['*']}
        source={{html: '<a class="twitter-timeline" href="https://twitter.com/TiEPune?ref_src=twsrc%5Etfw">Tweets by TiEPune</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'}}
      />
    </View>  )
    // <Container style={[styles.root]}>
    //                 <Tabs style={{ elevation: 3,width:400}} style={styles.tabContent}
    //                     onChangeTab={() => {
    //                     //this.fetchSessionList(eventId, userId);
    //                     }}
    //                   >
    //     <Tab  
    //       heading={
    //         <TabHeading  style={{backgroundColor : '#fff'}} >
    //           <Text  style={[styles.textColor]} >Twitter</Text> 
    //         </TabHeading>
    //       } style={styles.activeBorder} >        
                 
    //         </Tab>
      //   {/* <Tab
      //     heading={
      //       <TabHeading style={{backgroundColor : '#fff'}}>
      //         <Text  style={[styles.textColor]} >Facebook</Text>
      //       </TabHeading>
      //     } style={styles.activeBorder}>
      //         <View style={{flex:1}}>
      //         <WebView
      //         scalesPageToFit={true}
                            
      //         style={{flex:1}}
      //         originWhitelist={['*']}
      //           source={{uri: '<div style="position: relative;padding-bottom: 1%;padding-top: 1%; height: 100%; width: 100%;  overflow: hidden;"> <iframe src="https://www.facebook.com/tiepune/"  style="position: absolute; top:0;left: 0; width: 100%;height: 100%;" allowfullscreen="true" frameborder="0">  </iframe>  </div>'}}
      //         />
              
      //       </View>        
      //       </Tab>  
      // </Tabs>
      //             <View>
      //             <Footer isOffline ={this.state.isOffline}/>    
      //             </View>
      //   </Container>*/})
   
    // return( 
     
   
    // )
    //  return( 
   //                source={{html: '<div style="position: relative;padding-bottom: 1%;padding-top: 1%; height: 100%; width: 100%;  overflow: hidden;"> <iframe src="https://www.facebook.com/tiepune/"  style="position: absolute; top:0;left: 0; width: 100%;height: 100%;" allowfullscreen="true" frameborder="0">  </iframe>  </div>'}}

      // <WebView
      // scalesPageToFit={true}
      // style={{flex:1,alignContent:'stretch',height:300}}
      // originWhitelist={['*']}
      //   source={{html: '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftiepune%2F&tabs=timeline&width=340&height=400&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId" width="340" height="400" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'}}
      // />
    // )
    // return( 
    //   <View style={{flex:1}}>
    //   <WebView
    //   style={{flex:1,width:'100%',height:'100%'}}
    //   originWhitelist={['*']}
    //     source={{html: '<script src="https://platform.linkedin.com/in.js" type="text/javascript"> lang: en_US</script>   <script type="IN/FollowCompany" data-id="1337" data-counter="top"></script>'}}
    //   />
    //         </View>
   
    // )
    
   }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  section: {
    backgroundColor: theme.colors.screen.base,
    marginTop: 30
  },
 heading: {
      paddingBottom: 12.5
    },
  column: {
    borderColor: theme.colors.border.base,
    alignItems: "flex-start",
    paddingLeft:20,
    paddingRight:20

    },
    profileImageStyle: {
      borderColor: theme.colors.border.base,
      alignItems: "center"  
      },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderColor :'black' 
  },
  text:{
    alignSelf: 'stretch',
    fontSize : 17,
    height:35,
    borderLeftColor: '#fff',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#333',

    borderWidth: 1,
    paddingLeft:4

    },
    screen: {
      backgroundColor: theme.colors.screen.base
    },
    tabContent: {
      backgroundColor: '#FFFFFF',
    },
    textColor : {
      color: '#ed1b24',
      fontSize:11
    },
    activeBorder:{
      borderColor: '#ed1b24', 
    }
}));


