import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {React, useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const WindowWidth = Dimensions.get('screen').width;
const WindowHeight = Dimensions.get('screen').height;


export default function MainScreen({navigation}) {
  const [data, setData] = useState();
  //const [keys, setKeys] = useState()
  let keys 
  let data1
  let obj 
  let data2 = []
  const router = useRoute();

  const getData = async() => {
    try {
      // setKeys(await AsyncStorage.getAllKeys())
      keys = await AsyncStorage.getAllKeys();
      data1 = (await AsyncStorage.multiGet(keys))
      obj = Object.fromEntries(data1)
      Object.keys(obj).forEach(key => {
        obj[key] = JSON.parse(obj[key])
        data2.push(obj[key]);
      })
      setData(data2);
      return data
    } catch (error) {
      console.log('something wrong: ', error)
    }

  }


  const delData = async (index) => {
    keys = await AsyncStorage.getAllKeys();
    console.log(keys);
     try {
       await AsyncStorage.removeItem(keys[index]).then(getData)
     } catch (e) {
       console.log('wrong when remove',e)
     }
  }

  useEffect( () => {
   
    getData()
    //console.log('getdata')
  },[]);

  const FLRender = ({item, onPress, onPress1}) => (
    <TouchableOpacity onPress={onPress1} >
      <View style={[styles.viewFLRenderStyle, styles.viewFLRenderStyle2]}>
        <Image
          source={require('../images/dot.png')}
          style={{width: 12, height: 12, marginTop: 5}}
        />
        <View style={{marginHorizontal: 10}}>
          <Text style={{fontSize: 16}}>{item.title}</Text>
          <Text style={{fontSize: 12, marginTop: 7}} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={{fontSize: 12, marginTop: 11}}>{item.time}</Text>
        </View>
        <TouchableOpacity style={{position: 'absolute', right: 20, bottom: 15}} onPress={onPress} >
          <Image source={require('../images/delete.png')} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <Text style={styles.myNoteStyle}>My Notes</Text>
        <View style={styles.viewtcbStyle}>
          <TouchableOpacity>
            <Image source={require('../images/menu.png')} />
          </TouchableOpacity>
          <View style={styles.viewtcbStyle1}>
            <TouchableOpacity style={{marginRight: 20}}>
              <Image source={require('../images/search.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../images/more.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal={true} >
          <View>
            <FlatList
              data={data}
              renderItem={({item,index}) => <FLRender item={item} index={index} 
              onPress={() => delData(index)} 
              onPress1={() => {navigation.navigate('CreateNote',{item})}}/>}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.createtcbStyle}
          onPress={() => {
            navigation.navigate('CreateNote');
          }}>
          <Image source={require('../images/create.png')} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
    width: WindowWidth,
    height: WindowHeight,
    alignItems: 'center',
  },
  myNoteStyle: {
    fontSize: 40,
    color: '#404040',
    marginTop: 80
  },
  viewtcbStyle: {
    flexDirection: 'row',
    width: WindowWidth - 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  viewtcbStyle1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createtcbStyle: {
    position: 'absolute',
    right: 15,
    bottom: 125
  },
  viewFLRenderStyle: {
    marginVertical: 10,
    width: WindowWidth - 20,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 15,
    flexDirection: 'row',
  },
  viewFLRenderStyle2: {
    elevation: 5,
  }
});