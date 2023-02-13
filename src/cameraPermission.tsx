import {Alert, PermissionsAndroid, Platform} from 'react-native';

export async function checkCameraPermission() {
  let permitido: boolean;
  if (Platform.OS === 'android') {
    if (await requestCameraPermission()) {
      permitido = true;
    } else {
      permitido = false;
      Alert.alert('CAMERA permission denied');
    }
  } else {
    permitido = true;
  }

  return permitido;
}

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Banco Piano',
      message: 'Solicitamos acceso a la cámara para validar tu identidad',
      buttonPositive: 'Aceptar',
      buttonNegative: 'Cancelar',
    });
    //if CAMERA Permission is granted
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('Error  Camera_permission ==>', error);
  }
  return false;
}
