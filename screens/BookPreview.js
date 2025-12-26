import React, { useEffect, useCallback } from "react";
import { Alert, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

const BookPreview = ({ navigation, route }) => {
  const { item } = route.params;

  // ✅ Back press handler (define FIRST)
  const handleBackPress = useCallback(() => {
    Alert.alert(
      "Close Book",
      "Are you sure you want to close the Book?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false }
    );

    return true; // important: prevent default back
  }, [navigation]);

  // ✅ BackHandler setup (RN 0.81 safe)
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      subscription.remove(); // ✅ correct cleanup
      ScreenOrientation.unlockAsync();
    };
  }, [handleBackPress]);

  // ✅ Screen orientation control
  useEffect(() => {
    if (item?.orientation === "landscape") {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.DEFAULT
      );
    }
  }, [item?.orientation]);

  return (
    <SafeAreaView className="flex-1">
      <WebView
        source={{ uri: item.uri }}
        className="flex-1"
        javaScriptEnabled
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        cacheEnabled={false}
        injectedJavaScript={
          item?.orientation === "landscape"
            ? `
              const meta = document.createElement('meta');
              meta.setAttribute('name', 'viewport');
              meta.setAttribute(
                'content',
                'width=device-width, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes'
              );
              document.head.appendChild(meta);
            `
            : ""
        }
      />
    </SafeAreaView>
  );
};

export default BookPreview;
