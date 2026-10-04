import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  Shield,
  DollarSign,
  Mail,
  CheckCircle2,
  Share2,
  Sparkles,
  Check,
  Plus,
  Clock,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { MOCK_COMPANIONS } from '../../data/mockData';
import { TravelCompanion, SuggestedItineraryItem } from '../../types/travel';

interface CompanionsViewProps {
  theme: 'dark' | 'light';
  currency: string;
  suggestedItems: SuggestedItineraryItem[];
  onVoteSuggestion: (id: string, direction: 'up' | 'down') => void;
  onAcceptSuggestion: (id: string) => void;
  onProposeSuggestion: (item: Omit<SuggestedItineraryItem, 'id' | 'upvotes' | 'downvotes' | 'userVote' | 'companionVotes' | 'status'>) => void;
}

export const CompanionsView: React.FC<CompanionsViewProps> = ({
  theme,
  currency,
  suggestedItems,
  onVoteSuggestion,
  onAcceptSuggestion,
  onProposeSuggestion,
}) => {
  const isDark = theme === 'dark';
  const [companions, setCompanions] = useState<TravelCompanion[]>(MOCK_COMPANIONS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Co-Planner' | 'Viewer'>('Co-Planner');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Propose suggestion modal state
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState(3);
  const [newTime, setNewTime] = useState('16:30');
  const [newCategory, setNewCategory] = useState<any>('Culture');
  const [newDuration, setNewDuration] = useState('1h 30m');
  const [newCost, setNewCost] = useState('2000');
  const [newLocation, setNewLocation] = useState('Jaipur');
  const [newReason, setNewReason] = useState('Recommended by local companion.');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newComp: TravelCompanion = {
      id: `comp-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      votedActivities: [],
      expensesOwed: 0,
    };

    setCompanions([...companions, newComp]);
    setInviteEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onProposeSuggestion({
      dayNumber: newDay,
      time: newTime,
      title: newTitle,
      category: newCategory,
      duration: newDuration,
      cost: Number(newCost) || 0,
      currency: currency || 'INR',
      location: newLocation,
      coordinates: { lat: 35.0116, lng: 135.7681 },
      suggestedBy: {
        name: 'Chirantan Dan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        role: 'Organizer',
      },
      aiReason: newReason,
    });

    setNewTitle('');
    setShowProposeModal(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>REAL-TIME COLLABORATIVE PLANNING</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Travel Companions & Voting Center
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
          Coordinate stops with your travel party, vote on proposed activities to aid decisions, and automatically balance shared expenses.
        </p>
      </div>

      {/* Invite Member Box */}
      <div
        className={`p-6 rounded-2xl border ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <h3 className="font-editorial text-xl font-bold mb-3">Invite Travel Partner</h3>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter partner or friend email address..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className={`px-3 py-2.5 rounded-xl text-xs border focus:outline-none ${
              isDark ? 'bg-black/20 border-white/10 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}
          >
            <option value="Co-Planner">Can Edit & Suggest</option>
            <option value="Viewer">Read-Only Access</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Send Invitation</span>
          </button>
        </form>

        {inviteSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 font-mono-num">
            <CheckCircle2 className="w-4 h-4" />
            <span>Invitation dispatched with secure join link.</span>
          </div>
        )}
      </div>

      {/* Suggested Itinerary Items Voting Board */}
      <div
        className={`p-6 md:p-8 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-teal-400 mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>COLLECTIVE DECISION-MAKING</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold">Suggested Itinerary Items & Polls</h3>
            <p className="text-xs text-stone-400">
              Companions vote to prioritize or dismiss candidate experiences before adding to the master itinerary.
            </p>
          </div>

          <button
            onClick={() => setShowProposeModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-center whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Propose Suggestion</span>
          </button>
        </div>

        {/* Suggested Items Voting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedItems.map((item) => {
            const netScore = item.upvotes - item.downvotes;
            const isAccepted = item.status === 'Accepted';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isAccepted
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-black/20 border-white/8 hover:border-white/15'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Proposer details & status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.suggestedBy.avatar}
                        alt={item.suggestedBy.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {item.suggestedBy.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono-num">
                          Proposed for Day 0{item.dayNumber} · {item.time}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono-num px-2 py-0.5 rounded border ${
                        isAccepted
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                          : netScore >= 3
                          ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                          : netScore < 0
                          ? 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {isAccepted
                        ? 'Added to Schedule ✓'
                        : netScore >= 3
                        ? 'Consensus Reached'
                        : 'Voting Open'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-xl font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-400 font-mono-num mt-1">
                      <span className="text-emerald-400">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.location}</span>
                      {item.cost > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-300 font-bold">
                            ₹{item.cost.toLocaleString('en-IN')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 font-sans-ui bg-black/30 p-3 rounded-xl border border-white/5">
                    {item.aiReason}
                  </p>

                  {/* Voters avatars & tally */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400">Votes:</span>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {item.companionVotes.map((v, idx) => (
                          <img
                            key={idx}
                            src={v.avatar}
                            alt={v.companionName}
                            title={`${v.companionName}: voted ${v.vote.toUpperCase()}`}
                            className={`inline-block h-5 w-5 rounded-full ring-2 ${
                              v.vote === 'up' ? 'ring-emerald-500' : 'ring-rose-500'
                            } object-cover`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] font-mono-num flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/5">
                      <span className="text-white font-bold">
                        Total: {item.upvotes + item.downvotes} Votes
                      </span>
                      <span className="text-stone-500">·</span>
                      <span className="text-emerald-400 font-semibold">{item.upvotes} Up</span>
                      <span className="text-stone-500">/</span>
                      <span className="text-rose-400 font-semibold">{item.downvotes} Down</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Voting Actions */}
                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVoteSuggestion(item.id, 'up')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-all cursor-pointer border ${
                        item.userVote === 'up'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-stone-300 hover:text-emerald-400 hover:bg-emerald-500/10'
                          : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.upvotes}</span>
                    </button>

                    <button
                      onClick={() => onVoteSuggestion(item.id, 'down')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-all cursor-pointer border ${
                        item.userVote === 'down'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-stone-300 hover:text-rose-400 hover:bg-rose-500/10'
                          : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{item.downvotes}</span>
                    </button>

                    <span
                      className={`text-xs font-mono-num font-bold px-2 py-1 rounded-md ${
                        netScore > 0
                          ? 'text-emerald-400 bg-emerald-950/30'
                          : netScore < 0
                          ? 'text-rose-400 bg-rose-950/30'
                          : 'text-stone-400 bg-black/20'
                      }`}
                    >
                      Net Score: {netScore > 0 ? `+${netScore}` : netScore}
                    </span>
                  </div>

                  {!isAccepted ? (
                    <button
                      onClick={() => onAcceptSuggestion(item.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Add to Trip</span>
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accepted</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Companions List & Expense Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companions.map((comp) => (
          <div
            key={comp.id}
            className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={comp.avatar}
                alt={comp.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-emerald-500/30"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-editorial text-lg font-bold text-white truncate">
                    {comp.name}
                  </h4>
                </div>
                <span className="text-[11px] text-stone-400 block truncate font-mono-num">
                  {comp.email}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs font-mono-num">
              <span className="text-stone-400">Permissions:</span>
              <span className="text-emerald-400 font-semibold">{comp.role}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-num pt-1">
              <span className="text-stone-400">Expense Settlement:</span>
              <span className="font-bold text-white">
                {comp.expensesOwed > 0 ? `Owes ₹${comp.expensesOwed.toLocaleString('en-IN')}` : 'All Settled'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Propose Stop Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-editorial text-xl font-bold">Propose Itinerary Stop</h3>
              <button
                onClick={() => setShowProposeModal(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Title of Proposed Stop</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Fushimi Sake Tasting Workshop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Target Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>
                        Day 0{d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Food">Food</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Nightlife">Nightlife</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Est. Time & Duration</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="16:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Est. Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Location Details</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Johari Bazaar, Old Pink City, Jaipur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Why Companions Should Vote For This</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Heritage rooftop cafe with direct view of glowing fort ramparts..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Submit for Group Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
