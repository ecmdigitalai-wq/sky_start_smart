import React, { useEffect, useCallback, useState } from "react";
import { Alert, BackHandler, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

const BookPreview = ({ navigation, route }) => {
  const { item } = route.params;
  const [isLoading, setIsLoading] = useState(true);
 
  const handleBackPress = useCallback(() => {
    Alert.alert(
      "Close Book",
      "Are you sure you want to close the Book?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {            
             ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
             navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );

    return true; 
  }, [navigation]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync();
    };
  }, [handleBackPress]);

  
  useEffect(() => {
    if (item?.orientation === "landscape") {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    }
  }, [item?.orientation]);
  
  if (!item?.uri) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Error: No Book URL Found</Text>
          </View>
      )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }} edges={['top', 'left', 'right']}>
      
      
      {isLoading && (
          <View style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              justifyContent: 'center', alignItems: 'center', zIndex: 10 
          }}>
              <ActivityIndicator size="large" color="#2563eb" />
          </View>
      )}

      <WebView
        source={{ uri: item.uri }}
        style={{ flex: 1 }} 
        originWhitelist={['*']} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowsFullscreenVideo={true}
        scalesPageToFit={true}
        
        
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setIsLoading(false);
            Alert.alert("Error", "Failed to load book.");
        }}

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