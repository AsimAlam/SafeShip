import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AgeVerificationScreen({route, navigation}) {
  const {userId} = route.params;

  const handleVerifyAge = async () => {
    // Dummy verification logic (Replace with actual verification)
    await firestore().collection('users').doc(userId).update({
      ageVerified: true,
    });

    Alert.alert('Age verified successfully');
    navigation.navigate('EmailVerification', {userId: userId});
  };

  return (
    <View>
      <Text>Verify Your Age</Text>
      <Button title="Verify Age" onPress={handleVerifyAge} />
    </View>
  );
}
