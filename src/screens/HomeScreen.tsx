import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import { useUsers } from '../hooks/useUsers';
import { User, TabType } from '../types/user';
import { groupUsersByInitial } from '../utils/helpers';
import { UserListItem } from '../components/UserListItem';
import { SectionHeader } from '../components/SectionHeader';
import { SearchBar } from '../components/SearchBar';
import { TabButton } from '../components/TabButton';
import { Colors } from '../constants/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const TABS: TabType[] = ['All', 'Admin', 'Manager'];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { users, refreshing, refresh, filterUsersByTab } = useUsers();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [tabLayouts, setTabLayouts] = useState<Array<{ x: number; width: number }>>([]);
  
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    const tabIndex = TABS.indexOf(activeTab);
    Animated.spring(indicatorPosition, {
      toValue: tabIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  }, [activeTab]);

  
  /**Get filtered users based on curretn tab and searchQuery */
   
  const getFilteredUsersForTab = (tab: TabType) => {
    let result = filterUsersByTab(tab);

    if (searchQuery.trim()) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  };

  /** Form list data with segregation of users based on initial */
  const getSectionsForTab = (tab: TabType) => {
    const filteredUsers = getFilteredUsersForTab(tab);
    const groupedUsers = groupUsersByInitial(filteredUsers);
    return Object.keys(groupedUsers)
      .sort()
      .map((key) => ({
        title: key,
        data: groupedUsers[key],
      }));
  };

  /** Updates active tab and pagerView */
  const handleTabPress = (tab: TabType) => {
    const newIndex = TABS.indexOf(tab);
    setActiveTab(tab);
    pagerRef.current?.setPage(newIndex);
  };

  const handlePageSelected = (e: any) => {
    const position = e.nativeEvent.position;
    setActiveTab(TABS[position]);
  };

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchQuery('');
    }
    setIsSearchVisible(!isSearchVisible);
  };

  /**
   * Measure actual tab button positions using onLayout
   * - Stores x position and width of each tab
   * - Used for pixel-perfect indicator positioning
   * - Responsive to any screen size
   */
  const handleTabLayout = (index: number, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  /**
   * Calculate animated indicator styles
   * - Uses actual measured tab positions (not hardcoded values)
   * - Interpolates position based on active tab index
   * - Returns dynamic width matching active tab
   * - Hidden until all tabs are measured (prevents flash)
   */
  const getIndicatorStyle = () => {
    if (tabLayouts.length !== TABS.length) {
      return {
        transform: [{ translateX: 0 }],
        width: 0,
        opacity: 0,
      };
    }

    const translateX = indicatorPosition.interpolate({
      inputRange: [0, 1, 2],
      outputRange: tabLayouts.map((layout) => layout.x),
    });

    const activeTabIndex = TABS.indexOf(activeTab);
    const width = tabLayouts[activeTabIndex]?.width || 0;

    return {
      transform: [{ translateX }],
      width,
      height: 36,
      opacity: 1,
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {isSearchVisible ? (
          <View style={styles.searchContainer}>
            <SearchBar 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
              placeholder="Search by name"
              inline
            />
            <TouchableOpacity onPress={handleSearchToggle} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
            <View style={styles.tabRow}>
              <View style={styles.tabContainer}>
                <Animated.View style={[styles.indicator, getIndicatorStyle()]} />
                {TABS.map((tab, index) => (
                  <View
                    key={tab}
                    style={styles.tabWrapper}
                    onLayout={(event) => handleTabLayout(index, event)}
                  >
                    <TabButton
                      tab={tab}
                      active={activeTab === tab}
                      onPress={() => handleTabPress(tab)}
                    />
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={handleSearchToggle} style={styles.searchIcon}>
                <Ionicons name="search" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
        )}
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {TABS.map((tab) => (
          <View key={tab} style={styles.page}>
            <SectionList
              sections={getSectionsForTab(tab)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <UserListItem user={item} onPress={() => navigation.navigate('Profile', { id: item.id })} />}
              renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
              contentContainerStyle={styles.listContent}
              stickySectionHeadersEnabled={true}
            />
          </View>
        ))}
      </PagerView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddUser')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={Colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    backgroundColor: '#F2F3F5',
    borderRadius: 48,
  },
  tabWrapper: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    borderColor: Colors.primary,
    borderWidth:1
  },
  searchIcon: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    padding: 4,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
