import { useRef, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Storage from 'expo-sqlite/kv-store';
import { FlatList, GestureHandlerRootView, } from 'react-native-gesture-handler';
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
  const [showAddPillButton, setShowAddPillButton] = useState(true);
  /* istanbul ignore next */
  let showModal: Function = () => {};
  /* istanbul ignore next */
  let closeModal: Function = () => {};

  const loadPills = () => {
    const pills = db.getPills();
    setPills(pills);
  };

  useEffect(() => {
    Storage.setItem('imageSize', imageSize.toString());
  }, [imageSize]);

  const listRef = useRef<FlatList<Pill>>(null);

  const pillOnDelete = /* istanbul ignore next */(pill: Pill) => {
    setPill(pill);
    setShowDialog(true);
  }

  const pillOnEdit = /* istanbul ignore next */(pill: Pill) => {
    setPill(pill);
    setShowAddPillButton(false);
    showModal();
  }

  const pillOnImageSizeChanged = /* istanbul ignore next */(newValue: number) => {
    if (imageSize !== newValue) {
      setImageSize(newValue);
    }
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}
      >
        <StatusBar
          backgroundColor={ useThemeColor('primary') }
          barStyle='light-content'
        />

        <FlatList
          data={pills}
          ref={listRef}
          renderItem={({ item }) => (
            <PillInfo
              imageSize={imageSize}
              listRef={listRef}
              pill={item}
              onDelete={pillOnDelete}
              onEdit={pillOnEdit}
              onImageSizeChanged={pillOnImageSizeChanged}
            />
          )}
          style={styles.list}
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
    </GestureHandlerRootView>
  );
}
