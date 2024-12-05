import React, { useEffect, type ComponentProps } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView, Gesture, GestureDetector, } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { configureReanimatedLogger, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, } from 'react-native-reanimated';

import t from '@/helpers/localization';
import { Pill } from '@/types';
import ServiceButton from './ServiceButton';
import useThemeColor from '@/hooks/useThemeColor';


configureReanimatedLogger({ strict: false});

interface PillInfoProps extends ComponentProps<any> {
  imageSize: number;
  pill: Pill;
  onDelete: (pill: Pill) => void;
  onEdit: (pill: Pill) => void;
  onImageSizeChanged: (size: number) => void;
  onStartGesture: () => void;
}

const PillInfo: React.FC<PillInfoProps> = ({ imageSize, pill, onDelete, onEdit, onImageSizeChanged, onStartGesture }) => {

  const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      backgroundColor: useThemeColor('background'),
      borderColor: useThemeColor('borderDim'),
      borderRadius: 10,
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 0,
      marginTop: 10,
      padding: 10,
    },
    image: {
      borderColor: useThemeColor('border'),
      borderWidth: 0.5,
      height: '100%',
      marginBottom: 0,
      marginRight: 20,
      width: '100%',
      zIndex: 100,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      width: '100%',
    },
    linesContainer: {
      flexDirection: 'column',
      verticalAlign: 'top',
    },
    title: {
      color: useThemeColor('text'),
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: -5,
    },
    description: {
      color: useThemeColor('text'),
      fontSize: 14,
    },
    bestBefore: {
      alignSelf: 'flex-end',
      color: useThemeColor('textDim'),
      fontSize: 12,
      textAlign: 'right',
    },
    rightAction: {
      alignItems: 'center',
      flex: 1,
      height: 120,
      justifyContent: 'center',
      marginLeft: 0,
      marginTop: 10,
      padding: 10,
      width: 70,
    },
  });

  const { imageData, name, description, bestBefore } = pill;

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>, swipeableMethods: any) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 70 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <View style={styles.rightAction}>
          <ServiceButton
            icon="edit"
            testID={`button-edit-${pill.id}`}
            onPress={() => { swipeableMethods.close(); onEdit(pill); }}
          />
          <ServiceButton
            icon="delete"
            testID={`button-delete-${pill.id}`}
            onPress={() => { swipeableMethods.close(); onDelete(pill); }}
          />
        </View>
      </Reanimated.View>
    );
  }

  const scale = useSharedValue(1);
  const savedSize = useSharedValue(imageSize);
  useEffect(() => {
    savedSize.value = imageSize;
  }, [imageSize, savedSize]);

  /* istanbul ignore next */
  const pinch = Gesture.Pinch()
    .onStart(() => {
      runOnJS(onStartGesture)();
      scale.value = 1;
    })
    .onUpdate((e) => {
      scale.value = e.scale * savedSize.value >= 100 && e.scale * savedSize.value <= 320 ? e.scale : scale.value;
    })
    .onEnd(() => {
      savedSize.value = scale.value * savedSize.value;
      scale.value = 1;
      runOnJS(onImageSizeChanged)(savedSize.value);
    })
    .withTestId(`pill-image-pinch-${pill.id}`);

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      ...styles.image,
      width: scale.value * savedSize.value,
      height: scale.value * savedSize.value,
    };
  });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onEnd(() => {
      savedSize.value = 130;
      runOnJS(onImageSizeChanged)(savedSize.value);
    })
    .withTestId(`pill-image-double-tap-${pill.id}`);

  const composed = Gesture.Simultaneous(pinch, doubleTap);

  /* istanbul ignore next */
  const flexDirection = imageSize < 210 ? 'row' : 'column';
  /* istanbul ignore next */
  const marginTop = imageSize < 210 ? 0 : 20;

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        renderRightActions={RightAction}
      >
        <View
          style={
            { ...styles.container, flexDirection, }
          }
        >
          <GestureDetector gesture={composed}>
            <Reanimated.View style={scaleAnimation}>
              <Image
                source={{ uri: `data:image/jpg;base64,${imageData}` }}
                style={ styles.image }
                testID={`pill-image-${pill.id}`}
              />
            </Reanimated.View>
          </GestureDetector>
          <View style={
            { ...styles.textContainer, marginTop, }
          }>
            <View style={styles.linesContainer}>
              <Text
                style={styles.title}
                testID={`pill-name-${pill.id}`}
              >
                {name}
              </Text>
              <Text
                ellipsizeMode='tail'
                numberOfLines={Math.round(imageSize / 25)}
                style={styles.description}
                testID={`pill-description-${pill.id}`}
              >
                {
                  description
                }
              </Text>
            </View>
            <View>
              <Text
                style={styles.bestBefore}
                testID={`pill-best-before-${pill.id}`}
              >
                {bestBefore &&
                  `${t('pill_best_before')}: ${(new Date(bestBefore)).toLocaleDateString()}`
                }
              </Text>
            </View>
          </View>
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

export default PillInfo;
