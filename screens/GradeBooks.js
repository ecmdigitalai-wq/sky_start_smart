import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons"; 
import { LinearGradient } from "expo-linear-gradient"; 
import MyBookCard from "../components/MyBookCard";
import useFetch from "../hook/useFetch";

const { width, height } = Dimensions.get("window");

const GradeBooks = ({ route, navigation }) => {
  const { data, isLoading, error, refetch } = useFetch();  
  
  const { item, edition } = route.params || {}; 

  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  const filteredBooks =
    data?.filter(
      (book) => book.grade === item?.grade && book.edition === edition
    ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
        <Text style={styles.errorTitle}>No Grade Data Found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.headerContainer}>
        <LinearGradient
            colors={["#2563eb", "#1e40af"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
        >
             <View style={styles.circle1} />
             <View style={styles.circle2} />

             <View style={styles.navBar}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Available Books</Text>
                <View style={{ width: 40 }} /> 
             </View>

             <View style={styles.headerContent}>
                 <View>
                    <Text style={styles.headerGradeTitle}>{item.grade}</Text>
                    <View style={styles.editionBadge}>
                        <Text style={styles.editionText}>{edition}</Text>
                    </View>
                 </View>
                 <View style={styles.headerIconBg}>
                    <Ionicons name="library" size={28} color="white" />
                 </View>
             </View>
        </LinearGradient>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563eb"]} progressViewOffset={20} />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.listContainer}>
          
          {isLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Fetching books...</Text>
            </View>
          ) : error ? (
            <View style={styles.infoCard}>
              <Ionicons name="cloud-offline-outline" size={48} color="#ef4444" />
              <Text style={styles.infoTitle}>Connection Error</Text>
              <Text style={styles.infoSub}>Unable to load books. Please check your internet.</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredBooks.length === 0 ? (
            <View style={styles.infoCard}>
              <Ionicons name="folder-open-outline" size={50} color="#94a3b8" />
              <Text style={styles.infoTitle}>No Books Found</Text>
              <Text style={styles.infoSub}>
                We couldn't find any books for {item.grade} in {edition}.
              </Text>
            </View>
          ) : (
            <View>
               <View style={styles.resultsHeader}>
                  <Text style={styles.resultsText}>Results ({filteredBooks.length})</Text>
                  <Ionicons name="filter" size={16} color="#94a3b8" />
               </View>

              {filteredBooks.map((bookItem, index) => (
                <MyBookCard
                  key={index}
                  item={bookItem}
                  navigation={navigation}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8fafc" },
  
  headerContainer: { height: height * 0.28, width: '100%' },
  gradientHeader: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 20
  },
  circle1: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  circle2: { position: 'absolute', bottom: -20, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },

  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  navTitle: { fontSize: 18, fontWeight: '600', color: 'white' },

  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, paddingHorizontal: 10 },
  headerGradeTitle: { fontSize: 28, fontWeight: '800', color: 'white', letterSpacing: 0.5 },
  editionBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginTop: 8 },
  editionText: { color: 'white', fontWeight: '700', fontSize: 13, textTransform: 'capitalize' },
  headerIconBg: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 16 },

  scrollContent: { paddingBottom: 30 },
  listContainer: { paddingHorizontal: 4, marginTop: -30 }, 

  centerContent: { marginTop: 60, alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14 },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  errorTitle: { color: '#64748b', marginTop: 16, fontSize: 16, fontWeight: '600' },
  goBackBtn: { marginTop: 20, backgroundColor: '#f1f5f9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  goBackText: { color: '#475569', fontWeight: '600' },

  infoCard: { marginTop: 40, alignItems: 'center', backgroundColor: 'white', padding: 30, borderRadius: 20, marginHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  infoTitle: { color: '#1e293b', fontSize: 18, fontWeight: '700', marginTop: 16 },
  infoSub: { color: '#64748b', textAlign: 'center', fontSize: 14, marginTop: 8, lineHeight: 20 },
  retryBtn: { backgroundColor: '#fef2f2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 20 },
  retryText: { color: '#ef4444', fontWeight: '700' },

  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 20, marginTop: 10 },
  resultsText: { color: '#64748b', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
});

export default GradeBooks;