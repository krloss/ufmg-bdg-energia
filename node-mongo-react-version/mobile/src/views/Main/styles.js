import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  map:{flex:1},
  callout:{width:260},
  address:{fontWeight:'bold', fontSize:16},
  description:{color:'#666', marginTop:5},
  classification:{marginTop:5},
  searchForm:{
    position:'absolute',
    top:20,
    left:20,
    right:20,
    zIndex:5,
    flexDirection:'row'
  },
  searchInput:{
    flex:1,
    height:50,
    backgroundColor:'#FFF',
    color:'#333',
    borderRadius:25,
    paddingHorizontal:20,
    fontSize:16,
    shadowColor:'#000',
    shadowOpacity:0.2,
    shadowOffset:{width:4, height:4},
    elevation:2
  },
  loadButton:{
    width:50,
    height:50,
    backgroundColor:'#8E4DFF',
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:25
  }
})

export default styles
