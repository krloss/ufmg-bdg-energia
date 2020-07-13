import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import Main from '../views/Main'
import Detail from '../views/Detail'

const Routes = createAppContainer(createStackNavigator({
    Main:{
        screen:Main,
        navigationOptions:{title:'BDG Energia'}
    },
    Detail:{
        screen:Detail,
        navigationOptions:{title:'Detalhes'}
    }
},{defaultNavigationOptions:{
    headerTintColor:'#FFF',
    headerBackTitleVisible:false,
    headerStyle:{backgroundColor:'#4ED'}
}}))

export default Routes
