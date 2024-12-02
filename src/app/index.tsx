import { useState, useEffect } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import Dialog from "react-native-dialog";
import Storage from 'expo-sqlite/kv-store';
import { FloatingAction } from 'react-native-floating-action';

import * as db from '@/helpers/sqlite';
import { type Pill } from '@/helpers/types';
import t from '@/helpers/localization'
import PillDialog from '@/components/PillDialog';
import PillInfo from '@/components/PillInfo';
import useThemeColor from '@/hooks/useThemeColor';
import useDynamicColorScheme from '@/hooks/useDynamicColorScheme';


export default function Index() {

  const styles = StyleSheet.create({
    container: {
      backgroundColor: useThemeColor('surface'),
      flex: 1,
    },
    deleteDialog: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    deleteDialogContent: {
      backgroundColor: useThemeColor('background'),
      color: useThemeColor('text'),
    },
    list: {
      height: '100%',
      margin: 0,
      paddingRight: 10,
      width: '100%',
    },
  });

  useEffect(() => {
    db.createDatabase()
    loadPills();
    return () => db.close();
  }, []);

  const emptyPill: Pill = {
    id: undefined,
    name: '',
    description: '',
    bestBefore: (new Date()).toISOString().split('T')[0],
    imageData: '',
  };

  const [showDialog, setShowDialog] = useState(false);
  const [imageSize, setImageSize] = useState(parseFloat(Storage.getItemSync('imageSize') || '130'));
  const [pill, setPill] = useState(emptyPill);
  const [pills, setPills] = useState<Pill[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddPillButton, setShowAddPillButton] = useState(true);
  let showModal: Function = () => {};
  let closeModal: Function = () => {};

  const loadPills = () => {
    setRefreshing(true);
    const pills = db.getPills();
    setPills(pills);
    setRefreshing(false);
  };

  useEffect(() => {
    Storage.setItem('imageSize', imageSize.toString());
  }, [imageSize]);

  return (
    <View style={styles.container}
    >
      <StatusBar
        backgroundColor={ useThemeColor('primary') }
        barStyle={`${useDynamicColorScheme() === 'dark' ? 'light' : 'dark'}-content`}
      />
      <FlatList style={styles.list}
        data={pills}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <PillInfo
            imageSize={imageSize}
            pill={item}
            onDelete={(pill) => {
              setPill(pill);
              setShowDialog(true);
            }}
            onEdit={(pill) => {
              setPill(pill);
              setShowAddPillButton(false);
              showModal();
            }}
            onImageSizeChanged={(newValue: number) => {
              if (imageSize !== newValue) {
                setImageSize(newValue);
              }
            }}
          />
        )}
        onRefresh={loadPills}
      />

      <FloatingAction
        actions={[
          {
            icon: require('../assets/images/add.png'),
            name: 'add',
          },
        ]}
        color={useThemeColor('primary') as string}
        visible={showAddPillButton}
        overrideWithAction={true}
        onPressItem={name => {
          setPill(emptyPill);
          setShowAddPillButton(false);
          showModal();
        }}
      />

      <PillDialog
        pill={pill}
        provideActions={([show, close]) => {
          showModal = show;
          closeModal = close;
        }}
        onClose={() => {
          closeModal();
          loadPills();
          setShowAddPillButton(true);
        }}
      />

      <View style={styles.deleteDialog}>
        <Dialog.Container
          headerStyle={styles.deleteDialogContent}
          contentStyle={styles.deleteDialogContent}
          footerStyle={styles.deleteDialogContent}
          visible={showDialog}
          onBackdropPress={() => setShowDialog(false)}
        >
          <Dialog.Title>{ t('delete_confirmation_header') }</Dialog.Title>
          <Dialog.Description>
            { t('delete_confirmation_description') }
          </Dialog.Description>
          <Dialog.Button
            color={useThemeColor('primary')}
            label={ t('cancel') }
            onPress={() => setShowDialog(false)}
          />
          <Dialog.Button
            bold={true}
            color={useThemeColor('primary')}
            label={ t('delete') }
            onPress={() => {
              setShowDialog(false);
              db.deletePill(pill.id as number);
              loadPills();
            }}
          />
        </Dialog.Container>
        </View>

    </View>
  );
}
