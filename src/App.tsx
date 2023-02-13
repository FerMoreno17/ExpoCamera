import React from 'react';
import {Camera} from 'expo-camera';
import {useEffect, useRef, useState} from 'react';
import {Button, Pressable, StyleSheet, Text, View, Alert} from 'react-native';
import {checkCameraPermission} from './cameraPermission';
import * as FaceDetector from 'expo-face-detector';
import {BarCodeScanner} from 'expo-barcode-scanner';

export default function App() {
  const [permited, setPermited] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [scanned, setScanned] = useState(false);
  const [scanQr, setScanQr] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkCameraPermission().then(resp => {
      setPermited(resp);
    });
  }, []);

  useEffect(() => {
    if (!scanQr) {
      const getBarCodeScannerPermissions = async () => {
        const {status} = await BarCodeScanner.requestPermissionsAsync();
        console.log(status);
        setHasPermission(status === 'granted');
      };

      getBarCodeScannerPermissions();
    }
  }, [scanQr]);

  const handleFacesDetected = ({faces}: any) => {
    //console.log(faces);
  };

  const handleBarCodeScanned = ({type, data}: any) => {
    console.log({type});
    console.log({data});
    setScanned(true);
    Alert.alert(
      `Bar code with type ${type} and data ${data} has been scanned!`,
    );
  };

  const handleTakePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current?.takePictureAsync();
        //console.log(data);
        setImage(data?.uri);
      } catch (error) {
        console.log({error});
      }
    }
  };

  if (scanQr && hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (scanQr && hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!permited) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center'}}>
          We need your permission to show the camera
        </Text>
      </View>
    );
  }

  if (scanQr) {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          barCodeTypes={['org.iso.PDF417', 'PDF417']}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          //style={StyleSheet.absoluteFillObject}
          style={styles.camera}>
          {scanned && (
            <Button
              title={'Tap to Scan Again'}
              onPress={() => setScanned(false)}
            />
          )}
          <Pressable onPress={() => setScanQr(!scanQr)} style={styles.button2}>
            <Text>Face</Text>
          </Pressable>
        </BarCodeScanner>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}>
        <Pressable onPress={handleTakePicture} style={styles.button}>
          <Text>TAKE</Text>
        </Pressable>
        <Pressable onPress={() => setScanQr(!scanQr)} style={styles.button2}>
          <Text>QR</Text>
        </Pressable>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: 430,
    height: 570,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    backgroundColor: 'green',
    padding: 10,
  },
  button2: {
    backgroundColor: 'orange',
    padding: 10,
    position: 'absolute',
    bottom: 20,
    left: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
