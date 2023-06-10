import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, TextInput } from 'react-native'
import { React, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

const windownWidth = Dimensions.get('screen').width;
const windownHeight = Dimensions.get('screen').height;

export default function CreateScreen({navigation}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTTime] = useState('');
  const [key, setKey] = useState('')
  const router = useRoute();
  const [isBold, setIsBold] = useState(false);
  const [isChangeSize, setIsChangeSize] = useState(false)
  const [isChangeColor, setIsChaneColor] = useState(false)
  const [isAlign, setIsAlign] = useState(false)

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    if(router.params != undefined){
      setTitle(router.params.item.title)
      setDescription(router.params.item.description)
      setTTime(router.params.item.time)
      setKey(router.params.item.key)
    }
    
  },[])

  const save_note = () => {
    if(key != ''){
      let myNote = {
        key: key,
        title: title,
        description: description,
        time: new Date(),
      };
      storeData(myNote.key, myNote);
    }else{
      let myNote = {
        key: Date.now().toFixed(),
        title: title,
        description: description,
        time: new Date(),
      };
      storeData(myNote.key, myNote);
    }

    
  };

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <View style={styles.viewtcbStyle}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../images/arrowBack.png')} />
          </TouchableOpacity>
          <View style={styles.viewtcbStyle1}>
            <TouchableOpacity style={styles.tcb}>
              <Image source={require('../images/link.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tcb}>
              <Image source={require('../images/share.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tcb}>
              <Image source={require('../images/more.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewtcbStyle2}>
          <TouchableOpacity onPress={() => setIsBold(!isBold)}>
            <Image source={require('../images/letter_bold.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsChangeSize(!isChangeSize)}>
            <Image source={require('../images/text_size.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsChaneColor(!isChangeColor)}>
            <Image source={require('../images/font_color.png')} />
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => {
            setIsAlign(!isAlign)
            isAlign
              ? console.log('chua xong')
              : console.log('safaf');
          }}>
            <Image source={require('../images/text_alignment.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../images/number.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../images/bullet.png')} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Title"
          style={styles.tipTitleStyle}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          placeholder="Description"
          style={[
            styles.tipDescriptionStyle,
            isBold ? {fontWeight: '600'} : '',
            isChangeSize ? {fontSize: 18} : '',
            isChangeColor ? {color: 'red'} : {color: 'black'},
          ]}
          
          numberOfLines={20}
          multiline={true}
          value={description}
          onChangeText={text => {
            setDescription(text);
          }}
        />
        <TouchableOpacity
          style={styles.tcbSaveStyle}
          onPress={() => save_note()}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
            Save
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: windownWidth,
    height: windownHeight,
  },
  viewtcbStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windownWidth - 30,
    marginTop: 75,
  },
  viewtcbStyle1: {
    flexDirection: 'row',
  },
  tcb: {
    marginLeft: 30,
  },
  viewtcbStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windownWidth - 30,
    height: 60,
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
  },
  tipTitleStyle: {
    width: windownWidth - 30,
    backgroundColor: '#F1F1F1',
    marginTop: 20,
    fontSize: 15,
    borderRadius: 45,
    paddingStart: 20,
  },
  tipDescriptionStyle: {
    width: windownWidth - 30,
    height: 400,
    backgroundColor: '#F1F1F1',
    marginTop: 20,
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 13,
    borderRadius: 20,
  },
  tcbSaveStyle: {
    width: windownWidth - 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
});