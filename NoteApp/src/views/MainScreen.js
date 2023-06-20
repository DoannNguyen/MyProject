import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';

import {useRoute} from '@react-navigation/native';

const WindowWidth = Dimensions.get('screen').width;
const WindowHeight = Dimensions.get('screen').height;

const formatDate = fmt => {
  const date = new Date(fmt);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};

export default function MainScreen({navigation}) {
  const [data, setData] = useState({});
  const [sortType, setSortType] = useState();
  const [dataSearch, setDataSearch] = useState()

  let keys;
  let data1;
  let obj;
  let data2 = [];
  const router = useRoute();
  const [isHiddenSearchBar, setIsHiddenSearchBar] = useState(true)

  const getData1 = async (text) => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data1 = await AsyncStorage.multiGet(keys);
      const dataArray = data1.map(item => JSON.parse(item[1]));

      if(text === ''){
        const sortedData = dataArray.sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeB - timeA;
        });

        setData(sortedData);
      }else{
        dataArray.filter(item => {
          if(item.title.match(text)){

            data2.push(item)
          }
        })
        
        setData(data2)
        
      }
      //console.log(dataArray)
    } catch (error) {
      console.log('Error:', error);
    }
  }
  const getData = async () => {
    try {
      keys = await AsyncStorage.getAllKeys();
      data1 = await AsyncStorage.multiGet(keys);
      obj = Object.fromEntries(data1);
      Object.keys(obj).forEach(key => {
        obj[key] = JSON.parse(obj[key]);
        data2.push(obj[key]);
        console.log('DATA:' + obj[key]);
      });
      setData(data2);

      
      return data;
    } catch (error) {
      console.log('Err: ', error);
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getData1('');
  }, [isFocused]);

  const delData = async index => {
    keys = await AsyncStorage.getAllKeys();
    console.log(keys);
    try {
      await AsyncStorage.removeItem(keys[index]).then(getData1);
    } catch (e) {
      console.log('wrong when remove', e);
    }
  };

  const handleDel = index => {
    Alert.alert('Options', 'Delete this note?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: 'Delete', onPress: () => delData(index)},
    ]);
  };

  const FLRender = ({item, onPress, onPress1}) => (
    <TouchableOpacity onPress={onPress1}>
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
          <Text style={{fontSize: 12, marginTop: 11}}>{`Date: ${formatDate(
            item.time,
          )}`}</Text>
        </View>
        <TouchableOpacity
          style={{position: 'absolute', right: 20, bottom: 15}}
          onPress={onPress}>
          <Image
            source={require('../images/delete.png')}
            style={{flex: 1, aspectRatio: 0.4, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.myNoteStyle}>My Notes</Text>
          <View style={styles.viewtcbStyle}>
            <TouchableOpacity>
              <Image
                source={require('../images/menu.png')}
                style={{
                  flex: 1,
                  aspectRatio: 0.4,
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
            <View style={styles.viewtcbStyle1}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 40,
                    alignItems: 'center',
                  },
                  !isHiddenSearchBar
                    ? {width:  WindowWidth - 140, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10,  }
                    : {width: 35},
                ]}>
                <TextInput
                  placeholder="search here..."
                  style={
                    !isHiddenSearchBar ? {width: '90%'} : {width: 0, height: 0}
                  }
                  onChangeText={(text) => getData1(text)}
                />
                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() => setIsHiddenSearchBar(!isHiddenSearchBar)}>
                  <Image
                    source={require('../images/search.png')}
                    style={{flex: 1, aspectRatio: 0.6, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Image
                  source={require('../images/more.png')}
                  style={{flex: 1, aspectRatio: 0.4, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <ScrollView horizontal={true}>
              <FlatList
                data={data}
                renderItem={({item, index}) => (
                  <FLRender
                    item={item}
                    index={index}
                    onPress={() => handleDel(index)}
                    onPress1={() => {
                      navigation.navigate('CreateNote', {item});
                    }}
                  />
                )}
              />
            </ScrollView>
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
    marginTop: 30,
    color: '#404040',
    textAlign: 'center',
  },
  viewtcbStyle: {
    flexDirection: 'row',
    width: WindowWidth - 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    marginLeft: 30,
  },
  viewtcbStyle1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createtcbStyle: {
    position: 'absolute',
    right: 15,
    bottom: 125,
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
  },
});
