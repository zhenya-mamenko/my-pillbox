import { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import Storage from 'expo-sqlite/kv-store';
import { FloatingAction } from 'react-native-floating-action';

import * as db from '@/helpers/sqlite';
import { type Pill } from '@/types';
import PillDialog from '@/components/PillDialog';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import PillInfo from '@/components/PillInfo';
import useThemeColor from '@/hooks/useThemeColor';


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
  /* istanbul ignore next */
  let showModal: Function = () => {};
  /* istanbul ignore next */
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
        barStyle='light-content'
      />

      <FlatList style={styles.list}
        data={pills}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <PillInfo
            imageSize={imageSize}
            pill={item}
            onDelete={/* istanbul ignore next */(pill) => {
              setPill(pill);
              setShowDialog(true);
            }}
            onEdit={/* istanbul ignore next */(pill) => {
              setPill(pill);
              setShowAddPillButton(false);
              showModal();
            }}
            onImageSizeChanged={/* istanbul ignore next */(newValue: number) => {
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
        onPressItem={/* istanbul ignore next */(name) => {
          setPill(emptyPill);
          setShowAddPillButton(false);
          showModal();
        }}
      />

      <PillDialog
        pill={pill}
        provideActions={/* istanbul ignore next */([show, close]) => {
          showModal = show;
          closeModal = close;
        }}
        onClose={/* istanbul ignore next */() => {
          closeModal();
          loadPills();
          setShowAddPillButton(true);
        }}
      />
      <DeleteConfirmationDialog
        showDialog={showDialog}
        onClose={/* istanbul ignore next */() => setShowDialog(false)}
        onDelete={/* istanbul ignore next */() => {
          setShowDialog(false);
          db.deletePill(pill.id as number);
          loadPills();
        }}
      />
    </View>
  );
}
