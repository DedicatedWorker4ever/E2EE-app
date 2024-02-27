import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ChatItem({item, router, noBorder, currentUser}) {

    const [lastMessage, setLastMessage] = useState(undefined);
    useEffect(()=>{

        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot)=>{
            let allMessages = snapshot.docs.map(doc=>{
                return doc.data();
            });
            setLastMessage(allMessages[0]? allMessages[0]: null);
        });

        return unsub;
    },[]);

    // console.log('last message: ', lastMessage);

    const openChatRoom = ()=>{
        router.push({pathname: '/chatRoom', params: item});
    }

    const renderTime = ()=>{
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    }

    const renderLastMessage = ()=>{
        if(typeof lastMessage == 'undefined') return 'Loading...';
        if(lastMessage){
            if(currentUser?.userId == lastMessage?.userId) return "You: "+lastMessage?.text;
            return lastMessage?.text;
        }else{
            return 'Say Hi 👋';
        }
    }
  return (
    <TouchableOpacity onPress={openChatRoom} style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16, // equivalent to mx-4 in Tailwind
        alignItems: 'center',
        marginBottom: 8, // equivalent to mb-4 in Tailwind
        paddingBottom: 2, // equivalent to pb-2 in Tailwind
        borderBottomWidth: noBorder ? 0 : 1,
        borderBottomColor: 'rgba(74, 85, 104, 0.1)', // color equivalent to border-b-neutral-200 in Tailwind
      }}>
        {/* <Image 
            source={{uri: item?.profileUrl}} 
            style={{height: hp(6), width: hp(6)}}
            className="rounded-full" 
        /> */}

        <Image
            style={{height: hp(6), width: hp(6), borderRadius: 100}}
            source={item?.profileUrl}
            placeholder={blurhash}
            transition={500}
        />


        {/* name and last message */}
        <View style={{ flex: 1, gap: hp(0.3), marginLeft: hp(1) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: hp(2.2), fontWeight: 'bold', color: '#333' }}>{item?.username}</Text>
            <Text style={{ fontSize: hp(1.8), color: '#666' }}>
                {renderTime()}
            </Text>
        </View>
        <Text style={{ fontSize: hp(1.8), color: '#666' }}>
            {renderLastMessage()}
        </Text>
    </View>
</TouchableOpacity>
  )
}