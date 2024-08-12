import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');

  const handleSignUp = async () => {
    if (isUnderage(dob)) {
      Alert.alert('You must be 18 years or older to sign up.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: email,
        dob: dob,
        ageVerified: false,
        emailVerified: false,
      });

      navigation.navigate('AgeVerification', {userId: user.uid});
    } catch (error) {
      Alert.alert('Error signing up', error.message);
    }
  };

  const isUnderage = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
