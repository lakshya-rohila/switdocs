import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ROUTES } from '../../navigation/routes';
import type { RootStackParamList } from '../../types/navigation';
import { PrimaryButton } from '../../components/common/AppHeader';
import { GhostButton } from '../../components/common/AppHeader';
import { persistOnboardingComplete } from '../../utils/onboardingStorage';

export type BoardingProps = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.ROOT_ONBOARDING
>;

const STEPS: {
  id: string;
  image?: ImageSourcePropType;
  title: string;
  subtitle: string;
}[] = [
  {
    id: '1',
    image: require('../../../assets/images/Onboarding1.jpg'),
    title: 'All your doc tools in one place',
    subtitle: 'Sign, convert, compress, merge — everything you need.',
  },
  {
    id: '2',
    image: require('../../../assets/images/Onboarding2.jpg'),
    title: 'Zero ads. Always free.',
    subtitle: 'No popups, banners, or interruptions. Ever.',
  },
  {
    id: '3',
    image: require('../../../assets/images/onboarding3.jpg'),
    title: 'Your files stay yours',
    subtitle:
      'SwiftDocs is frontend-only: no account, no uploads to our servers — your files stay on your device.',
  },
];

/** Must match `styles.padding.paddingHorizontal`. Full-bleed list so item width === page width. */
const ONBOARDING_SCREEN_PAD_X = 12;

export default function OnboardingFlowScreen({ navigation }: BoardingProps) {
  const listRef = useRef<FlatList<(typeof STEPS)[number]> | null>(null);
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const [finishedSlides, setFinishedSlides] = useState(false);

  const finishFlow = useCallback(async () => {
    await persistOnboardingComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.ROOT_MAIN }],
    });
  }, [navigation]);

  const goSkip = () => {
    finishFlow();
  };

  const goNextSlide = () => {
    if (slide < STEPS.length - 1) {
      const next = slide + 1;
      listRef.current?.scrollToOffset({ offset: width * next, animated: true });
      setSlide(next);
      return;
    }
    setFinishedSlides(true);
  };

  const renderSlide = ({ item }: { item: (typeof STEPS)[number] }) => {
    const hasImage = item.image != null;
    return (
      <View style={[styles.slide, { width }]}>
        {hasImage ? (
          <View style={styles.illustration}>
            <Image
              source={item.image}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>
        ) : null}
        <Text style={[styles.title, !hasImage && styles.titleNoImage]}>
          {item.title}
        </Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.hero, styles.padding]}>
      {!finishedSlides ? (
        <>
          {!finishedSlides && slide < STEPS.length - 1 ? (
            <Pressable accessibilityRole="button" style={styles.skip} onPress={goSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : null}
          <FlatList
            ref={listRef}
            style={styles.list}
            horizontal
            pagingEnabled
            data={STEPS}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={evt => {
              const idx = Math.round(evt.nativeEvent.contentOffset.x / width);
              setSlide(Math.max(0, Math.min(STEPS.length - 1, idx)));
            }}
            renderItem={renderSlide}
          />
          <View style={styles.dots}>
            {STEPS.map(step => (
              <View
                key={step.id}
                style={[
                  styles.dot,
                  slide === STEPS.indexOf(step) ? styles.dotFilled : styles.dotQuiet,
                ]}
              />
            ))}
          </View>
          <PrimaryButton label={slide === STEPS.length - 1 ? 'Continue' : 'Next'} onPress={goNextSlide} />
        </>
      ) : (
        <>
          <View style={{ alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center' }}>
            <Text style={styles.word}>
              Swift<Text style={{ color: '#2563EB' }}>Docs</Text>
            </Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>
              Every doc tool. Zero ads. Always free.
            </Text>
          </View>
          <PrimaryButton label="Get started" onPress={finishFlow} />
          <GhostButton
            label="Replay intro"
            onPress={() => {
              listRef.current?.scrollToOffset({ offset: 0, animated: false });
              setSlide(0);
              setFinishedSlides(false);
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  padding: {
    paddingTop: 48,
    paddingBottom: 32,
    gap: 14,
    paddingHorizontal: ONBOARDING_SCREEN_PAD_X,
    justifyContent: 'space-between',
  },
  skip: {
    alignSelf: 'flex-end',
    padding: 12,
    marginBottom: -16,
    zIndex: 2,
  },
  skipText: { fontWeight: '600', color: '#2563EB', fontSize: 15 },
  list: {
    flex: 1,
    marginHorizontal: -ONBOARDING_SCREEN_PAD_X,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    padding: 16,
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 14,
    width: '100%',
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  titleNoImage: { marginTop: 0 },
  subtitle: {
    marginTop: 8,
    width: '100%',
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: '12%',
    marginVertical: 6,
  },
  dot: { height: 8, flex: 1, borderRadius: 999 },
  dotFilled: { backgroundColor: '#2563EB' },
  dotQuiet: { backgroundColor: '#CBD5F5' },
  word: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
  },
});
