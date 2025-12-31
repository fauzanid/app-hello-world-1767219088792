import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: 'rocket-launch',
    iconSet: 'MaterialIcons',
    title: 'Welcome!',
    description: 'Get ready to explore amazing features and capabilities in this beautiful app experience.',
  },
  {
    id: 2,
    icon: 'zap',
    iconSet: 'Feather',
    title: 'Lightning Fast',
    description: 'Built with React Native and Expo for optimal performance and smooth animations.',
  },
  {
    id: 3,
    icon: 'heart',
    iconSet: 'Feather',
    title: 'Made with Love',
    description: 'Crafted with attention to detail and modern design principles for the best user experience.',
  },
];

const dashboardStats = [
  { id: 1, title: 'Users', value: '12.5K', icon: 'users', change: '+12%' },
  { id: 2, title: 'Revenue', value: '$24.8K', icon: 'dollar-sign', change: '+8%' },
  { id: 3, title: 'Orders', value: '1,247', icon: 'shopping-bag', change: '+24%' },
  { id: 4, title: 'Growth', value: '18.2%', icon: 'trending-up', change: '+5%' },
];

const quickActions = [
  { id: 1, title: 'Profile', icon: 'user', color: '#667eea' },
  { id: 2, title: 'Settings', icon: 'settings', color: '#764ba2' },
  { id: 3, title: 'Analytics', icon: 'bar-chart-2', color: '#667eea' },
  { id: 4, title: 'Support', icon: 'help-circle', color: '#764ba2' },
];

const recentActivity = [
  { id: 1, title: 'New user registered', time: '2 min ago', icon: 'user-plus' },
  { id: 2, title: 'Order completed', time: '5 min ago', icon: 'check-circle' },
  { id: 3, title: 'Payment received', time: '12 min ago', icon: 'credit-card' },
  { id: 4, title: 'New message', time: '1 hour ago', icon: 'message-circle' },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('hello'); // 'hello' or 'dashboard'
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dashboardFadeAnim = useRef(new Animated.Value(0)).current;
  const dashboardScaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (!showOnboarding) {
      if (currentScreen === 'hello') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(dashboardFadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(dashboardScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [showOnboarding, currentScreen]);

  const handleScroll = (event) => {
    if (!event?.nativeEvent?.contentOffset) return;
    
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(index, onboardingData.length - 1));
    setCurrentIndex(boundedIndex);
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      setShowOnboarding(false);
    }
  };

  const switchScreen = () => {
    // Reset animations
    if (currentScreen === 'hello') {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      setCurrentScreen('dashboard');
    } else {
      dashboardFadeAnim.setValue(0);
      dashboardScaleAnim.setValue(0.8);
      setCurrentScreen('hello');
    }
  };

  const renderIcon = (item) => {
    if (!item?.icon || !item?.iconSet) return null;
    
    const IconComponent = item.iconSet === 'MaterialIcons' ? MaterialIcons : Feather;
    return <IconComponent name={item.icon} size={80} color="rgba(255, 255, 255, 0.9)" />;
  };

  const renderStatCard = (stat, index) => {
    if (!stat) return null;
    
    return (
      <Animated.View 
        key={`stat-${stat.id}-${index}`}
        style={[
          styles.statCard,
          {
            opacity: dashboardFadeAnim,
            transform: [{ scale: dashboardScaleAnim }],
          },
        ]}
      >
        <View style={styles.statHeader}>
          <Feather name={stat.icon || 'activity'} size={24} color="rgba(255, 255, 255, 0.9)" />
          <Text style={styles.statChange}>{stat.change || ''}</Text>
        </View>
        <Text style={styles.statValue}>{stat.value || '0'}</Text>
        <Text style={styles.statTitle}>{stat.title || 'Stat'}</Text>
      </Animated.View>
    );
  };

  const renderQuickAction = (action, index) => {
    if (!action) return null;
    
    return (
      <TouchableOpacity 
        key={`action-${action.id}-${index}`}
        style={[
          styles.quickActionCard,
          { backgroundColor: action.color ? `${action.color}20` : 'rgba(255, 255, 255, 0.1)' }
        ]}
      >
        <Feather 
          name={action.icon || 'square'} 
          size={28} 
          color={action.color || 'rgba(255, 255, 255, 0.9)'} 
        />
        <Text style={styles.quickActionTitle}>{action.title || 'Action'}</Text>
      </TouchableOpacity>
    );
  };

  const renderActivityItem = (activity, index) => {
    if (!activity) return null;
    
    return (
      <View key={`activity-${activity.id}-${index}`} style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <Feather name={activity.icon || 'circle'} size={16} color="#667eea" />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{activity.title || 'Activity'}</Text>
          <Text style={styles.activityTime}>{activity.time || 'Unknown'}</Text>
        </View>
      </View>
    );
  };

  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {onboardingData.map((item, index) => (
              <View key={`onboarding-${item.id}-${index}`} style={styles.onboardingScreen}>
                <View style={styles.onboardingContent}>
                  <View style={styles.iconContainer}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.onboardingTitle}>{item.title || ''}</Text>
                  <Text style={styles.onboardingDescription}>{item.description || ''}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.bottomContainer}>
            <View style={styles.pagination}>
              {onboardingData.map((_, index) => (
                <View
                  key={`pagination-${index}`}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
            
            <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
              <Text style={styles.nextButtonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Feather 
                name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-right'} 
                size={20} 
                color="#667eea" 
                style={styles.nextButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
        >
          <ScrollView style={styles.dashboardScrollView} showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[
                styles.dashboardHeader,
                {
                  opacity: dashboardFadeAnim,
                  transform: [{ scale: dashboardScaleAnim }],
                },
              ]}
            >
              <Text style={styles.dashboardTitle}>Dashboard</Text>
              <Text style={styles.dashboardSubtitle}>Welcome back! Here's your overview</Text>
            </Animated.View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
              {dashboardStats.map((stat, index) => renderStatCard(stat, index))}
            </View>

            {/* Quick Actions */}
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: dashboardFadeAnim,
                  transform: [{ scale: dashboardScaleAnim }],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => renderQuickAction(action, index))}
              </View>
            </Animated.View>

            {/* Recent Activity */}
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: dashboardFadeAnim,
                  transform: [{ scale: dashboardScaleAnim }],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityContainer}>
                {recentActivity.map((activity, index) => renderActivityItem(activity, index))}
              </View>
            </Animated.View>
          </ScrollView>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab} onPress={switchScreen}>
            <Feather name="home" size={24} color="#667eea" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.text}>Hello World!</Text>
          <Text style={styles.subtitle}>Welcome to React Native</Text>
        </Animated.View>
        
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={switchScreen}>
          <Feather name="grid" size={24} color="#667eea" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  dashboardScrollView: {
    flex: 1,
    paddingTop: 60,
  },
  onboardingScreen: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  onboardingContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    maxWidth: 320,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  onboardingDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
  },
  bottomContainer: {
    paddingBottom: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 32,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
  },
  dashboardHeader: {
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statChange: {
    fontSize: 12,
    color: '#4ade80',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  section: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  quickActionCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});