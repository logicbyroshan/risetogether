import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dsaApi } from '../api/dsaApi';
import { LeaderboardEntry, LeaderboardResponse } from '../types/dsa';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Trophy, Gem, Sparkles } from 'lucide-react';

type TimeframeType = 'overall' | 'daily' | 'weekly' | 'monthly';

export const LeaderboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [timeframe, setTimeframe] = useState<TimeframeType>('overall');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLeaderboard = useCallback(async (selectedTimeframe: TimeframeType) => {
    try {
      setLoading(true);
      const res = await dsaApi.getLeaderboard(selectedTimeframe);
      setData(res);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(timeframe);
  }, [timeframe, fetchLeaderboard]);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  const topUsers: LeaderboardEntry[] = data?.top_users || [];
  const otherUsers: LeaderboardEntry[] = data?.other_users || topUsers.slice(3);
  const totalCount = data?.total_user_count || 0;
  const currentRank = data?.current_user_rank || '-';

  const player1 = topUsers[0] || null;
  const player2 = topUsers[1] || null;
  const player3 = topUsers[2] || null;

  const timeframeTabs: TabItem[] = [
    { id: 'overall', label: 'All-Time Overall' },
    { id: 'daily', label: 'Daily Sprint' },
    { id: 'weekly', label: 'Weekly Battle' },
    { id: 'monthly', label: 'Monthly Grind' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Badge variant="orange" size="md" className="mb-2">
            GRIND 500 ARENA
          </Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            GLOBAL CODING LEADERBOARD
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Solve algorithm challenges, build daily consistency streaks, earn points based on time & space complexity, and climb the ranks.
          </p>
        </div>

        {/* User Rank Stats Banner */}
        <div className="text-xs text-gray-400 py-3 px-5 rounded-[3px] bg-neutral-950 border border-neutral-800 shadow-sm shrink-0">
          {isAuthenticated ? (
            <span>
              Your Current Rank:{' '}
              <strong className="text-orange-400 font-bold text-base px-1 font-rajdhani">
                #{currentRank}
              </strong>{' '}
              of <span className="text-white font-semibold">{totalCount} coders</span>
            </span>
          ) : (
            <span>
              <Link to="/join" className="text-orange-400 hover:underline font-semibold">
                Sign in
              </Link>{' '}
              to track your daily problem streak and rank.
            </span>
          )}
        </div>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex justify-center">
        <Tabs
          tabs={timeframeTabs}
          activeTab={timeframe}
          onChange={(tabId) => setTimeframe(tabId as TimeframeType)}
          size="sm"
        />
      </div>

      {loading ? (
        <div className="py-24 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* TOP PLAYERS SHOWCASE PODIUM */}
          <div className="pt-12 pb-6">
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-end gap-6 sm:gap-8">
              {/* #2 PLAYER CARD */}
              {player2 ? (
                <div className="w-full max-w-[280px] min-h-[250px] bg-neutral-950/80 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border border-neutral-800 order-2 lg:order-1 hover:border-neutral-700 transition-all">
                  <img
                    src={player2.profile_pic || defaultAvatar}
                    alt={player2.full_name || player2.username}
                    className="w-24 h-24 rounded-[3px] object-cover border-2 border-neutral-700 absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg bg-neutral-900"
                  />
                  <h3 className="text-base font-bold text-white mt-14 mb-1.5 truncate max-w-[220px]">
                    {player2.full_name || player2.username}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-3 bg-neutral-900 px-3 py-1 rounded-[2px] border border-neutral-800">
                    <Trophy className="w-3.5 h-3.5 text-[#f7cd57]" />
                    <span className="font-semibold">Rank #2</span>
                  </div>
                  <div className="flex flex-col items-center font-bold">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Gem className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
                      <span className="text-2xl font-rajdhani">
                        {timeframe === 'daily'
                          ? player2.daily_points
                          : timeframe === 'weekly'
                          ? player2.weekly_points
                          : timeframe === 'monthly'
                          ? player2.monthly_points
                          : player2.total_points}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-normal mt-0.5 font-mono">Points Earned</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[280px] min-h-[220px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border border-dashed border-neutral-800 order-2 lg:order-1">
                  <div className="w-12 h-12 rounded-[2px] bg-neutral-900 flex items-center justify-center text-gray-500 font-mono mb-2">
                    #2
                  </div>
                  <p className="text-xs text-gray-400">Position Open</p>
                </div>
              )}

              {/* #1 TOP PLAYER CARD */}
              {player1 ? (
                <div className="w-full max-w-[310px] min-h-[285px] bg-neutral-950 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border-2 border-orange-500/80 lg:-translate-y-4 order-1 lg:order-2 glow-orange">
                  <img
                    src={player1.profile_pic || defaultAvatar}
                    alt={player1.full_name || player1.username}
                    className="w-28 h-28 rounded-[3px] object-cover border-2 border-orange-500 absolute -top-14 left-1/2 -translate-x-1/2 shadow-xl bg-neutral-900"
                  />
                  <h3 className="text-lg font-bold text-white mt-16 mb-1.5 truncate max-w-[240px]">
                    {player1.full_name || player1.username}
                  </h3>
                  <div className="flex items-center gap-1.5 text-orange-300 text-xs mb-3 bg-orange-500/15 px-3.5 py-1 rounded-[2px] border border-orange-500/30">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-bold uppercase tracking-wider">Top Rank #1</span>
                  </div>
                  <div className="flex flex-col items-center font-bold">
                    <div className="flex items-center gap-1.5 text-yellow-300">
                      <Gem className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_12px_rgba(0,188,212,0.8)] animate-pulse" />
                      <span className="text-3xl font-rajdhani">
                        {timeframe === 'daily'
                          ? player1.daily_points
                          : timeframe === 'weekly'
                          ? player1.weekly_points
                          : timeframe === 'monthly'
                          ? player1.monthly_points
                          : player1.total_points}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 font-normal mt-0.5 font-mono">Points Earned</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[310px] min-h-[250px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border-2 border-dashed border-orange-500/40 order-1 lg:order-2">
                  <div className="w-16 h-16 rounded-[2px] bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 font-bold text-lg mb-2">
                    #1
                  </div>
                  <p className="text-sm text-gray-200 font-semibold">Top Rank Open</p>
                  <p className="text-xs text-gray-400 mt-0.5">Solve problems to claim the crown!</p>
                </div>
              )}

              {/* #3 PLAYER CARD */}
              {player3 ? (
                <div className="w-full max-w-[280px] min-h-[250px] bg-neutral-950/80 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border border-neutral-800 order-3 hover:border-neutral-700 transition-all">
                  <img
                    src={player3.profile_pic || defaultAvatar}
                    alt={player3.full_name || player3.username}
                    className="w-24 h-24 rounded-[3px] object-cover border-2 border-neutral-700 absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg bg-neutral-900"
                  />
                  <h3 className="text-base font-bold text-white mt-14 mb-1.5 truncate max-w-[220px]">
                    {player3.full_name || player3.username}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-3 bg-neutral-900 px-3 py-1 rounded-[2px] border border-neutral-800">
                    <Trophy className="w-3.5 h-3.5 text-[#cd7f32]" />
                    <span className="font-semibold">Rank #3</span>
                  </div>
                  <div className="flex flex-col items-center font-bold">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Gem className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
                      <span className="text-2xl font-rajdhani">
                        {timeframe === 'daily'
                          ? player3.daily_points
                          : timeframe === 'weekly'
                          ? player3.weekly_points
                          : timeframe === 'monthly'
                          ? player3.monthly_points
                          : player3.total_points}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-normal mt-0.5 font-mono">Points Earned</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[280px] min-h-[220px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border border-dashed border-neutral-800 order-3">
                  <div className="w-12 h-12 rounded-[2px] bg-neutral-900 flex items-center justify-center text-gray-500 font-mono mb-2">
                    #3
                  </div>
                  <p className="text-xs text-gray-400">Position Open</p>
                </div>
              )}
            </div>
          </div>

          {/* LEADERBOARD TABLE */}
          <div className="w-full overflow-x-auto rounded-[3px] shadow-2xl border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-neutral-900/90 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-800">
                  <th className="py-3.5 px-6 text-center w-24">Rank</th>
                  <th className="py-3.5 px-6">Developer</th>
                  <th className="py-3.5 px-6 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {otherUsers.length > 0 ? (
                  otherUsers.map((player, idx) => {
                    const rankNumber = idx + 4;
                    const isSelf = isAuthenticated && user && player.user_id === user.id;
                    const points =
                      timeframe === 'daily'
                        ? player.daily_points
                        : timeframe === 'weekly'
                        ? player.weekly_points
                        : timeframe === 'monthly'
                        ? player.monthly_points
                        : player.total_points;

                    return (
                      <tr
                        key={player.user_id}
                        className={`transition-colors hover:bg-neutral-900/60 ${
                          isSelf ? 'bg-orange-500/10 border-l-2 border-orange-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-6 text-center font-bold text-sm text-gray-300 font-rajdhani">
                          #{rankNumber}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={player.profile_pic || defaultAvatar}
                              alt={player.full_name || player.username}
                              className="w-9 h-9 rounded-[3px] object-cover border border-neutral-700 bg-neutral-900"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-white text-sm">
                                {player.full_name || player.username}{' '}
                                {isSelf && (
                                  <span className="text-xs text-orange-400 font-normal">(You)</span>
                                )}
                              </span>
                              <span className="text-xs text-gray-400">@{player.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 text-right font-rajdhani font-bold text-lg text-cyan-400">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Gem className="w-4 h-4" />
                            <span>{points}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-sm text-gray-500">
                      {topUsers.length === 0
                        ? 'No coders ranked yet. Solve algorithmic problems to claim the top spot!'
                        : 'All current ranked players are shown in the top podium.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
