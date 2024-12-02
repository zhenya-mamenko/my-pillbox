import { ComponentProps, useEffect, useState, useRef, } from 'react';
import { Button, Pressable, Text, TextInput, StyleSheet, View, Dimensions, } from 'react-native';
import { DateTimePickerAndroid, AndroidNativeProps } from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { launchCameraAsync, type ImagePickerAsset} from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import SwipeModal, { SwipeModalPublicMethods } from '@birdwingo/react-native-swipe-modal';

import * as db from '@/helpers/sqlite';
import t from '@/helpers/localization';
import { Pill } from '@/helpers/types';
import useThemeColor from '@/hooks/useThemeColor';


interface Props extends ComponentProps<any> {
  pill: Pill;
  provideActions: (actions: Function[]) => void;
  onClose: () => void;
}

export default function PillDialog({ pill, onClose, provideActions }: Props) {

  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: useThemeColor('surface'),
      borderColor: useThemeColor('borderDim'),
      borderStyle: 'solid',
      borderWidth: 1,
      bottom: 0,
      height: '100%',
      position: 'absolute',
      width: '100%',
      zIndex: 1000,
    },
    titleContainer: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: useThemeColor('borderDim'),
      borderStyle: 'solid',
      flexDirection: 'row',
      height: 80,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    title: {
      color: useThemeColor('text'),
      fontSize: 18,
      fontWeight: 'bold',
    },
    photoImage: {
      borderRadius: 10,
      height: '35%',
      margin: 20,
      minHeight: 220,
      padding: 10,
    },
    input: {
      backgroundColor: useThemeColor('background'),
      borderColor: useThemeColor('borderDim'),
      borderRadius: 10,
      borderStyle: 'solid',
      borderWidth: 1,
      color: useThemeColor('text'),
      fontSize: 16,
      marginBottom: 20,
      marginHorizontal: 10,
      minHeight: 45,
      paddingHorizontal: 10,
      textAlignVertical: 'top',
      width: '100%',
    },
    inputsContainer: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
  });

  const modalRef = useRef<SwipeModalPublicMethods>(null);

  const showModal = () => modalRef.current?.show();
  const hideModal = () => modalRef.current?.hide();
  provideActions([showModal, hideModal]);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateBestBefore, setDateBestBefore] = useState(new Date());

  useEffect(() => {
    setImage(pill.imageData);
    setName(pill.name);
    setDescription(pill.description);
    setDateBestBefore(new Date(pill.bestBefore));
  }, [pill]);

  const pickImage = async () => {
    let result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      exif: false,
      quality: 0.85,
    });

    if (!result.canceled) {
      let imageURI = (result.assets[0] as ImagePickerAsset).uri;
      const context = ImageManipulator.manipulate(imageURI);
      context.resize({ width: 320, height: 320 });
      const imageRef = await context.renderAsync();
      imageURI = (await imageRef.saveAsync({ base64: true })).base64 as string;
      setImage(imageURI);
    }
  }

  const textDimColor = useThemeColor('textDim');
  const textColor = useThemeColor('text');
  const openDatePicker = () => {
    const params: AndroidNativeProps = {
      display: 'spinner',
      mode: 'date',
      negativeButton: {
        label: t('cancel'),
        textColor: textDimColor,
      },
      positiveButton: {
        label: t('select'),
        textColor: textColor,
      },
      value: dateBestBefore,
      onChange: (event, newDate) => setDateBestBefore(newDate ?? dateBestBefore),
    }
    DateTimePickerAndroid.open(params);
  }

  const SavePill = () => {
    const data = {
      name,
      description,
      bestBefore: dateBestBefore.toISOString().split('T')[0],
      imageData: image,
    }
    if (pill.id && pill.id !== 0) {
      db.updatePill({
        ...data,
        id: pill.id
      });
    } else {
      db.insertPill(data);
    }
    onClose();
  }

  return (
    <SwipeModal ref={modalRef}
      closeTrigger={'minHeight'}
      closeTriggerValue={500}
      hideKeyboardOnShow={false}
      maxHeight={Dimensions.get('screen').height * 0.75}
      showBar={false}
      useKeyboardAvoidingView={true}
      wrapInGestureHandlerRootView={true}
      onHide={onClose}
    >
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            { (pill.id && pill.id !== 0) ? t('pill_edit') : t('pill_add') }
          </Text>
          <Button
            disabled={!image || !name}
            color={useThemeColor('primary')}
            title={`    ${t('save')}    `}
            onPress={SavePill}
          />
        </View>
        <Pressable onPress={pickImage} style={styles.photoImage}>
          <Image
            contentFit="contain"
            placeholder={require("../assets/images/stub.png")}
            source={{ uri: !image ? null : `data:image/jpg;base64,${image}` }}
            style={{ height: '100%', width: '100%' }}
          />
        </Pressable>
        <View style={styles.inputsContainer}>
          <TextInput style={styles.input}
            defaultValue={name}
            onChangeText={newName => setName(newName)}
            placeholder={ t('pill_name') }
            placeholderTextColor={ useThemeColor('textDim') }
          />
          <TextInput style={{ ...styles.input, height: '40%', }}
            defaultValue={description}
            multiline={true}
            onChangeText={newDescription => setDescription(newDescription)}
            placeholder={ t('pill_description') }
            placeholderTextColor={ useThemeColor('textDim') }
          />
          <Pressable
            style={{ padding: 0, width: '100%', }}
            onPress={openDatePicker}>
            <Text style={{ ...styles.input, height: 45, paddingVertical: 10, marginHorizontal: 0, }}>
              {`${t('pill_best_before')}: ${dateBestBefore.toLocaleDateString()}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </SwipeModal>
  );
}
