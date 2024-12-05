import { type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Dialog from "react-native-dialog";
import t from '@/helpers/localization'
import useThemeColor from '@/hooks/useThemeColor';


interface Props extends ComponentProps<any> {
  showDialog: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteConfirmationDialog({ showDialog, onClose, onDelete }: Props) {

  const styles = StyleSheet.create({
    deleteDialog: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    deleteDialogContent: {
      backgroundColor: useThemeColor('background'),
      color: useThemeColor('text'),
    },
  });

  return (
    <View style={styles.deleteDialog}>
      <Dialog.Container
        headerStyle={styles.deleteDialogContent}
        contentStyle={styles.deleteDialogContent}
        footerStyle={styles.deleteDialogContent}
        visible={showDialog}
        onBackdropPress={onClose}
      >
        <Dialog.Title>{ t('delete_confirmation_header') }</Dialog.Title>
        <Dialog.Description>
          { t('delete_confirmation_description') }
        </Dialog.Description>
        <Dialog.Button
          color={useThemeColor('primary')}
          label={ t('cancel') }
          testID='cancel-button'
          onPress={onClose}
        />
        <Dialog.Button
          bold={true}
          color={useThemeColor('primary')}
          label={ t('delete') }
          testID='delete-button'
          onPress={onDelete}
        />
      </Dialog.Container>
    </View>
  );
}
