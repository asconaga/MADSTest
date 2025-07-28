import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PhotoListScreen() {
    const [facing, setFacing] = useState('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [photos, setPhotos] = useState([]);
    const cameraRef = useRef(null);

    // 1️⃣ On mount, once media permission is granted, load existing assets
    useEffect(() => {
        if (mediaPermission && mediaPermission.granted) {
            (async () => {
                const { assets } = await MediaLibrary.getAssetsAsync({
                    first: 50,               // how many to fetch
                    sortBy: ['creationTime'],
                    mediaType: ['photo'],
                });
                setPhotos(assets);
            })();
        }
    }, [mediaPermission]);

    if (!cameraPermission || !mediaPermission) {
        return <View />;
    }

    if (!cameraPermission.granted || !mediaPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to use the camera and save photos.</Text>
                <Button onPress={() => {
                    requestCameraPermission();
                    requestMediaPermission();
                }} title="Grant Permissions" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            setPhotos(prev => [asset, ...prev]); // add to list
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                enableZoomGesture
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.text}>Snap</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            <ScrollView contentContainerStyle={styles.photoList}>
                {photos.map((photo, index) => (
                    <Image
                        key={index}
                        source={{ uri: photo.uri }}
                        style={styles.thumbnail}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        height: 400,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    button: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    text: {
        fontSize: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    photoList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
    },
    thumbnail: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
    },
});
