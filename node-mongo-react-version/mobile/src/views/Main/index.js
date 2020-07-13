import React,{useState,useEffect} from 'react'
import {Text,TextInput,TouchableOpacity,View} from 'react-native'
import MapView,{Marker,Callout} from 'react-native-maps'
import {MaterialIcons} from '@expo/vector-icons'
import {getCurrentPositionAsync,requestPermissionsAsync} from 'expo-location'

import api from '../../services/api'

import styles from './styles'

export default function Main({navigation}) {
  const [currentRegion,setCurrentRegion] = useState(null)
  const [locations,setLocations] = useState([])
  const [points,setPoints] = useState([])
  const [classifications,setClassifications] = useState('')

  async function loadMarkers(region) {
    const {latitude,longitude,latitudeDelta,longitudeDelta} = region || currentRegion
    const coordinates = [
      `${latitude - latitudeDelta} ${longitude - longitudeDelta}`,
      `${latitude - latitudeDelta} ${longitude + longitudeDelta}`,
      `${latitude + latitudeDelta} ${longitude + longitudeDelta}`,
      `${latitude + latitudeDelta} ${longitude - longitudeDelta}`
    ]
    const {data} = await api.get('/locations',{params:{coordinates}})

    setLocations(data)
    handleClassificationChange(data)
  }

  async function loadCurrentPosition() {
    const {granted} = await requestPermissionsAsync()

    if(!granted) return

    const {coords} = await getCurrentPositionAsync({enableHighAccuracy:true})
    const {latitude,longitude} = coords

    handleRegionChange({latitude,longitude,latitudeDelta:0.04,longitudeDelta:0.04})
  }

  function noTag(label) { return !label || 'Nenhum' === label }

  function handleRegionChange(region) {
    setCurrentRegion(region)
    loadMarkers(region)
  }

  function handleClassificationChange(data) {
    const list = data || locations
    const filters = classifications.split(/,/).map(it => it.trim())

    if(!classifications) setPoints(list)
    else setPoints(list.filter(it => (filters.includes(it.classification))))
  }

  useEffect(() => {loadCurrentPosition()},[])
  useEffect(() => {handleClassificationChange()},[classifications])

  return (
    <>
      <MapView style={styles.map} initialRegion={currentRegion} onRegionChangeComplete={handleRegionChange}>
        {points.map(point => (
          <Marker key={point._id} coordinate={
            {latitude:point.location.coordinates[0], longitude:point.location.coordinates[1]}
          }>
            <MaterialIcons size={32}
              name={noTag(point.classification) ? 'warning' : 'error'}
              color={noTag(point.classification) ? 'darkorange' : 'darkred'}
            />
            <Callout onPress={() => navigation.navigate('Detail',{profile:'krloss'})}>
              <View style={styles.callout}>
                <Text style={styles.address}>{point.address}</Text>
                <Text style={styles.description}>{point.description}</Text>
                <Text style={styles.classification}>{point.classification}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput style={styles.searchInput}
          placeholderTextColor="#999" placeholder="Buscar pontos por classificações..."
          autoCapitalize="words" autoCorrect={false}
          value={classifications} onChangeText={setClassifications} />
                
        <TouchableOpacity onPress={() => navigation.navigate('Detail',{profile:'krloss'})} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  )
}
