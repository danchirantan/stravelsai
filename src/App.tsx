/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { CommandPalette } from './components/navigation/CommandPalette';
import { HomeDashboard } from './components/home/HomeDashboard';
import { ItineraryView } from './components/itinerary/ItineraryView';
import { InteractiveMap } from './components/map/InteractiveMap';
import { AiPlannerModal } from './components/planner/AiPlannerModal';
import { AiCopilotDrawer } from './components/copilot/AiCopilotDrawer';
import { SmartRecommendations } from './components/recommendations/SmartRecommendations';
import { DestinationExplorer } from './components/destinations/DestinationExplorer';
import { HotelDiscovery } from './components/hotels/HotelDiscovery';
import { RestaurantDiscovery } from './components/restaurants/RestaurantDiscovery';
import { BudgetDashboard } from './components/budget/BudgetDashboard';
import { BookingsHub } from './components/bookings/BookingsHub';
import { DocumentWallet } from './components/documents/DocumentWallet';
import { PackingChecklist } from './components/packing/PackingChecklist';
import { SourceTransitHub } from './components/transit/SourceTransitHub';
import { CompanionsView } from './components/companions/CompanionsView';
import { TravelModeView } from './components/travelmode/TravelModeView';
import { MemoriesView } from './components/memories/MemoriesView';
import { ProfileView } from './components/profile/ProfileView';
import { ShareModal } from './components/sharing/ShareModal';
import { NotificationModal } from './components/notifications/NotificationModal';
import { ExploreIndiaView } from './components/india/ExploreIndiaView';
import { AiCreativeStudioModal } from './components/media/AiCreativeStudioModal';
import { DEMO_TRIP, MOCK_DESTINATIONS, MOCK_NOTIFICATIONS, MOCK_SUGGESTED_ITEMS, MOCK_BOOKINGS } from './data/mockData';
import { RAJASTHAN_DEMO_TRIP } from './data/rajasthanTrip';
import { RAJASTHAN_SUGGESTED_ITEMS } from './data/rajasthanSuggestions';
import { Trip, NotificationItem, SuggestedItineraryItem, Activity, DestinationWeather, WeatherDisruptionAlert, IndianCircuit, Booking } from './types/travel';
import { WeatherClient } from './services/weatherClient';
import {
  auth,
  signInWithGoogle,
  logOut,
  saveUserTrip,
  loadUserTrips,
  FirebaseUser,
} from './services/firebaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [trip, setTrip] = useState<Trip>(RAJASTHAN_DEMO_TRIP);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState<string>('INR');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load saved trips if available
        loadUserTrips(currentUser.uid).then((saved) => {
          if (saved && saved.length > 0) {
            setTrip(saved[0]);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const loggedIn = await signInWithGoogle();
      if (loggedIn) {
        setUser(loggedIn);
        saveUserTrip(loggedIn.uid, trip);
      }
    } catch (err: any) {
      console.warn('Sign-in cancelled or failed:', err.message);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setUser(null);
  };

  const handleUpdateTrip = (updated: Trip) => {
    setTrip(updated);
    if (user) {
      saveUserTrip(user.uid, updated);
    }
  };

  const handleAddBooking = (bk: Booking) => {
    MOCK_BOOKINGS.unshift(bk);
    // Trigger notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Transit Reserved: ${bk.title}`,
      message: `Confirmed for ${bk.date} (${bk.time}). Added to your Bookings Hub and Vault.`,
      timestamp: 'Just now',
      read: false,
      category: 'Bookings',
      actionLabel: 'View Bookings',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Real-time meteorological intelligence and disruption state
  const [liveWeather, setLiveWeather] = useState<Record<string, DestinationWeather>>({});
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherDisruptionAlert[]>([]);
  const [isWeatherRefreshing, setIsWeatherRefreshing] = useState(false);

  // Suggested itinerary items state for companion voting
  const [suggestedItems, setSuggestedItems] = useState<SuggestedItineraryItem[]>(RAJASTHAN_SUGGESTED_ITEMS);

  // Modals & Drawers state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreativeStudioOpen, setIsCreativeStudioOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [plannerInitialDestination, setPlannerInitialDestination] = useState<string>('Rajasthan');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Global keyboard shortcuts (⌘K for command palette, ⌘J for copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Real-time Weather Disruption Fetcher
  const fetchRealTimeWeatherAndDisruptions = async (forceRemote: boolean = false) => {
    setIsWeatherRefreshing(true);
    try {
      if (forceRemote) {
        await WeatherClient.refreshWeather();
      }

      // 1. Detect major disruptions for destinations
      const { alerts, notifications: weatherNotifs } = await WeatherClient.checkDisruptions(trip.destinations);
      setWeatherAlerts(alerts);

      // 2. Merge weather disruptions into notification center avoiding duplicate IDs
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const freshItems = weatherNotifs.filter((n) => !existingIds.has(n.id));
        const updatedPrev = prev.map((n) => {
          if (n.category === 'Weather' && n.weatherAlert) {
            const matchedAlert = alerts.find((a) => a.id === n.weatherAlert?.id);
            if (matchedAlert) {
              return { ...n, weatherAlert: matchedAlert };
            }
          }
          return n;
        });
        return [...freshItems, ...updatedPrev];
      });

      // 3. Fetch comprehensive meteorological data for each destination
      const weatherMap: Record<string, DestinationWeather> = {};
      for (const dest of trip.destinations) {
        const data = await WeatherClient.getWeather(dest);
        if (data) {
          weatherMap[dest.toLowerCase()] = data;
        }
      }
      setLiveWeather(weatherMap);
    } catch (err) {
      console.warn('Real-time weather synchronization error:', err);
    } finally {
      setIsWeatherRefreshing(false);
    }
  };

  // Run on mount and destination shift
  useEffect(() => {
    fetchRealTimeWeatherAndDisruptions(false);
  }, [trip.destinations]);

  const handleSelectNotificationAction = (actionType?: string, weatherAlert?: WeatherDisruptionAlert) => {
    setIsNotificationsOpen(false);

    if (weatherAlert || actionType === 'itinerary') {
      setActiveTab('itinerary');

      if (weatherAlert) {
        // Automatically apply the proactive route shift to avoid rain disruption
        const targetDay = weatherAlert.targetDayNumber || 3;
        const updatedDays = trip.days.map((day) => {
          if (day.dayNumber === targetDay) {
            return {
              ...day,
              weather: {
                ...day.weather,
                temp: weatherAlert.metrics.temp || day.weather.temp,
                advisory: `⚠️ ${weatherAlert.headline} — Indoor masterclass route shift applied.`,
              },
              activities: day.activities.map((act) => {
                if (act.id === 'act-3-4') {
                  return {
                    ...act,
                    time: '14:30',
                    aiReason: 'Shifted to afternoon to bypass morning rain front in Arashiyama.',
                  };
                }
                if (act.id === 'act-3-1') {
                  return {
                    ...act,
                    title: 'Indoor Urasenke Matcha Masterclass & Tea Ceremony (Camellia)',
                    aiReason: 'Proactively substituted for morning outdoor bamboo walk during heavy rain.',
                  };
                }
                return act;
              }),
            };
          }
          return day;
        });

        setTrip((prev) => ({ ...prev, days: updatedDays }));

        // Mark this weather notification as read
        setNotifications((prev) =>
          prev.map((n) =>
            n.weatherAlert?.id === weatherAlert.id ? { ...n, read: true } : n
          )
        );
      }
    } else if (actionType === 'bookings') {
      setActiveTab('bookings');
    }
  };

  const handleApplyWeatherOptimization = () => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber === 3) {
        return {
          ...day,
          weather: {
            ...day.weather,
            advisory: '⚠️ Heavy morning rain front accommodated — bamboo walk shifted to afternoon & matcha masterclass added.',
          },
          activities: day.activities.map((act) => {
            if (act.id === 'act-3-4') {
              return {
                ...act,
                time: '14:30',
                aiReason: 'Shifted to afternoon to bypass morning rain front in Arashiyama.',
              };
            }
            if (act.id === 'act-3-1') {
              return {
                ...act,
                title: 'Indoor Urasenke Matcha Masterclass & Tea Ceremony (Camellia)',
                aiReason: 'Proactively substituted for morning outdoor bamboo walk during heavy rain.',
              };
            }
            return act;
          }),
        };
      }
      return day;
    });
    setTrip((prev) => ({ ...prev, days: updatedDays }));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleTripGenerated = (newTrip: Trip) => {
    setTrip(newTrip);
    setActiveTab('itinerary');
  };

  const handleSelectDestinationForPlanning = (destName: string) => {
    setPlannerInitialDestination(destName);
    setIsPlannerModalOpen(true);
  };

  const handleSelectCircuitForPlanning = (circuit: IndianCircuit) => {
    if (circuit.id === 'circuit-rajasthan-royal') {
      setTrip(RAJASTHAN_DEMO_TRIP);
      setSuggestedItems(RAJASTHAN_SUGGESTED_ITEMS);
      setActiveTab('itinerary');
    } else {
      setPlannerInitialDestination(circuit.title);
      setIsPlannerModalOpen(true);
    }
  };

  const handleAddRecommendationToItinerary = (title: string, category: string, cost: number) => {
    // Add to Day 3
    const newAct: Activity = {
      id: `rec-act-${Date.now()}`,
      time: '15:30',
      title,
      category: category as any,
      duration: '1h 30m',
      cost,
      currency,
      location: 'Curated Proximity Location',
      coordinates: { lat: 35.0116, lng: 135.7681 },
      reservationStatus: 'Recommended',
      aiReason: 'Integrated from TripMind smart recommendations.',
      upvotes: 3,
      downvotes: 0,
      userVote: 'up',
    };

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === 3 ? { ...d, activities: [...d.activities, newAct] } : d
    );
    setTrip({ ...trip, days: updatedDays });
  };

  // Companion Voting Handler
  const handleVoteSuggestion = (id: string, direction: 'up' | 'down') => {
    setSuggestedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let upvotes = item.upvotes;
        let downvotes = item.downvotes;
        let userVote: 'up' | 'down' | null = item.userVote;
        const myCompanionId = 'comp-1';
        let votes = [...item.companionVotes];

        if (direction === 'up') {
          if (userVote === 'up') {
            upvotes = Math.max(0, upvotes - 1);
            userVote = null;
            votes = votes.filter((v) => v.companionId !== myCompanionId);
          } else if (userVote === 'down') {
            downvotes = Math.max(0, downvotes - 1);
            upvotes = upvotes + 1;
            userVote = 'up';
            votes = votes.map((v) =>
              v.companionId === myCompanionId ? { ...v, vote: 'up' as const } : v
            );
          } else {
            upvotes = upvotes + 1;
            userVote = 'up';
            votes.push({
              companionId: myCompanionId,
              companionName: 'Chirantan Dan',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              vote: 'up',
              timestamp: 'Just now',
            });
          }
        } else {
          if (userVote === 'down') {
            downvotes = Math.max(0, downvotes - 1);
            userVote = null;
            votes = votes.filter((v) => v.companionId !== myCompanionId);
          } else if (userVote === 'up') {
            upvotes = Math.max(0, upvotes - 1);
            downvotes = downvotes + 1;
            userVote = 'down';
            votes = votes.map((v) =>
              v.companionId === myCompanionId ? { ...v, vote: 'down' as const } : v
            );
          } else {
            downvotes = downvotes + 1;
            userVote = 'down';
            votes.push({
              companionId: myCompanionId,
              companionName: 'Chirantan Dan',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              vote: 'down',
              timestamp: 'Just now',
            });
          }
        }

        return {
          ...item,
          upvotes,
          downvotes,
          userVote,
          companionVotes: votes,
        };
      })
    );
  };

  // Accept a voted suggestion into the active day itinerary
  const handleAcceptSuggestion = (id: string) => {
    const item = suggestedItems.find((s) => s.id === id);
    if (!item) return;

    // 1. Mark suggestion as accepted
    setSuggestedItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Accepted' as const } : s))
    );

    // 2. Add as an activity into the target day
    const newActivity: Activity = {
      id: `act-accepted-${item.id}`,
      time: item.time,
      title: item.title,
      category: item.category,
      duration: item.duration,
      cost: item.cost,
      currency: item.currency,
      location: item.location,
      coordinates: item.coordinates,
      reservationStatus: 'Confirmed',
      aiReason: `Accepted into master schedule based on group voting (${item.upvotes} Upvotes). Proposed by ${item.suggestedBy.name}.`,
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      userVote: item.userVote,
    };

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === item.dayNumber
        ? {
            ...d,
            activities: [...d.activities, newActivity].sort((a, b) =>
              a.time.localeCompare(b.time)
            ),
          }
        : d
    );

    setTrip({ ...trip, days: updatedDays });

    // 3. Add notification alert
    const newNotif: NotificationItem = {
      id: `notif-vote-${Date.now()}`,
      category: 'AI',
      title: 'Suggestion Approved into Itinerary',
      message: `"${item.title}" reached group consensus and was added to Day 0${item.dayNumber} schedule.`,
      timestamp: 'Just now',
      read: false,
      actionLabel: 'View in Timeline',
      actionType: 'itinerary',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Propose a new suggestion for companion voting
  const handleProposeSuggestion = (
    newProposal: Omit<
      SuggestedItineraryItem,
      'id' | 'upvotes' | 'downvotes' | 'userVote' | 'companionVotes' | 'status'
    >
  ) => {
    const newItem: SuggestedItineraryItem = {
      ...newProposal,
      id: `sug-${Date.now()}`,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      status: 'Pending',
      companionVotes: [
        {
          companionId: 'comp-1',
          companionName: 'Chirantan Dan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          vote: 'up',
          timestamp: 'Just now',
        },
      ],
    };

    setSuggestedItems((prev) => [newItem, ...prev]);
  };

  return (
    <div
      className={`min-h-screen font-sans-ui flex flex-col md:flex-row transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#0B0F12] text-[#F3F4F6]' : 'bg-[#F5F5F4] text-[#1C1917]'
      }`}
    >
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreateTripModal={() => setIsPlannerModalOpen(true)}
          openCopilot={() => setIsCopilotOpen(true)}
          openStudio={() => setIsCreativeStudioOpen(true)}
          tripTitle={trip.title}
          theme={theme}
        />
      </div>

      {/* Mobile Drawer (if toggled) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              openCreateTripModal={() => {
                setIsPlannerModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              openCopilot={() => {
                setIsCopilotOpen(true);
                setIsMobileMenuOpen(false);
              }}
              openStudio={() => {
                setIsCreativeStudioOpen(true);
                setIsMobileMenuOpen(false);
              }}
              tripTitle={trip.title}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          openShareModal={() => setIsShareModalOpen(true)}
          openNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadCount}
          hasWeatherDisruption={weatherAlerts.length > 0}
          tripTitle={trip.title}
          tripSubtitle={trip.subtitle}
          sourceCity={trip.sourceCity || 'New Delhi / NCR'}
          startDate={trip.startDate}
          endDate={trip.endDate}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          theme={theme}
          setTheme={setTheme}
          currency={currency}
          setCurrency={setCurrency}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeDashboard
              trip={trip}
              destinations={MOCK_DESTINATIONS}
              setActiveTab={setActiveTab}
              openCreateTripModal={() => setIsPlannerModalOpen(true)}
              openCopilot={() => setIsCopilotOpen(true)}
              openNotifications={() => setIsNotificationsOpen(true)}
              theme={theme}
              currency={currency}
              liveWeather={liveWeather}
              activeDisruptions={weatherAlerts}
              onTriggerWeatherCheck={() => fetchRealTimeWeatherAndDisruptions(true)}
              onApplyWeatherOptimization={handleApplyWeatherOptimization}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryView
              trip={trip}
              onUpdateTrip={setTrip}
              openCopilot={() => setIsCopilotOpen(true)}
              openNotifications={() => setIsNotificationsOpen(true)}
              theme={theme}
              currency={currency}
              suggestedItems={suggestedItems}
              weatherAlerts={weatherAlerts}
              liveWeather={liveWeather}
              onVoteSuggestion={handleVoteSuggestion}
              onAcceptSuggestion={handleAcceptSuggestion}
              onProposeSuggestion={handleProposeSuggestion}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap trip={trip} theme={theme} currency={currency} />
          )}

          {activeTab === 'india' && (
            <ExploreIndiaView
              onSelectDestinationForPlanning={handleSelectDestinationForPlanning}
              onSelectCircuitForPlanning={handleSelectCircuitForPlanning}
              theme={theme}
              currency={currency}
            />
          )}

          {activeTab === 'recommendations' && (
            <SmartRecommendations
              trip={trip}
              theme={theme}
              currency={currency}
              onAddRecommendationToItinerary={handleAddRecommendationToItinerary}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationExplorer
              onSelectDestinationForPlanning={handleSelectDestinationForPlanning}
              theme={theme}
              currency={currency}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelDiscovery theme={theme} currency={currency} />
          )}

          {activeTab === 'restaurants' && (
            <RestaurantDiscovery theme={theme} currency={currency} />
          )}

          {activeTab === 'budget' && (
            <BudgetDashboard trip={trip} theme={theme} currency={currency} />
          )}

          {activeTab === 'bookings' && (
            <BookingsHub theme={theme} currency={currency} />
          )}

          {activeTab === 'transit' && (
            <SourceTransitHub
              theme={theme}
              trip={trip}
              onUpdateTrip={handleUpdateTrip}
              onAddBooking={handleAddBooking}
              currency={currency}
            />
          )}

          {activeTab === 'documents' && <DocumentWallet theme={theme} trip={trip} />}

          {activeTab === 'packing' && (
            <PackingChecklist
              theme={theme}
              trip={trip}
              currency={currency}
              liveWeather={liveWeather}
              weatherAlerts={weatherAlerts}
            />
          )}

          {activeTab === 'companions' && (
            <CompanionsView
              theme={theme}
              currency={currency}
              suggestedItems={suggestedItems}
              onVoteSuggestion={handleVoteSuggestion}
              onAcceptSuggestion={handleAcceptSuggestion}
              onProposeSuggestion={handleProposeSuggestion}
            />
          )}

          {activeTab === 'travelmode' && (
            <TravelModeView
              trip={trip}
              theme={theme}
              currency={currency}
              onExitTravelMode={() => setActiveTab('home')}
              openCopilot={() => setIsCopilotOpen(true)}
            />
          )}

          {activeTab === 'memories' && (
            <MemoriesView theme={theme} currency={currency} />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              theme={theme}
              setTheme={setTheme}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCopilot={() => setIsCopilotOpen(true)}
        theme={theme}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        openCreateTripModal={() => setIsPlannerModalOpen(true)}
        openCopilot={() => setIsCopilotOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* AI Journey Wizard Modal */}
      <AiPlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        onTripGenerated={handleTripGenerated}
        currency={currency}
        theme={theme}
        initialDestination={plannerInitialDestination}
      />

      {/* AI Travel Copilot Slide-over */}
      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        trip={trip}
        theme={theme}
        currency={currency}
      />

      {/* Shareable Magazine Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
        theme={theme}
        currency={currency}
      />

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectAction={handleSelectNotificationAction}
        onRefreshWeather={() => fetchRealTimeWeatherAndDisruptions(true)}
        theme={theme}
      />

      {/* AI Creative Studio & Voice Lounge Modal */}
      <AiCreativeStudioModal
        isOpen={isCreativeStudioOpen}
        onClose={() => setIsCreativeStudioOpen(false)}
        trip={trip}
        theme={theme}
      />
    </div>
  );
}
