// frontend/src/pages/LeaderboardPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dsaApi } from '../api/dsaApi';
import { LeaderboardEntry, LeaderboardResponse } from '../types/dsa';
import { Spinner } from '../components/ui/Spinner';
import { Bell, Trophy, Gem } from 'lucide-react';

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
  const userAvatar = user?.profile?.profile_pic || defaultAvatar;

  const topUsers: LeaderboardEntry[] = data?.top_users || [];
  const otherUsers: LeaderboardEntry[] = data?.other_users || topUsers.slice(3);
  const totalCount = data?.total_user_count || 0;
  const currentRank = data?.current_user_rank || '-';

  const player1 = topUsers[0] || null;
  const player2 = topUsers[1] || null;
  const player3 = topUsers[2] || null;

  return (
    <div className="min-h-screen bg-black text-gray-100 font-inter pb-20">
      
      {/* ================= HEADER ================= */}
      <header className="border-b border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/leaderboard" className="flex items-center gap-3">
            <img
              src="/assets/images/rt.png"
              alt="Grind 500 Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-rajdhani font-bold text-2xl tracking-wider text-white">
              GRIND <span className="text-orange-500">500</span>
            </span>
          </Link>

          <nav className="order-3 sm:order-2 w-full sm:w-auto mt-4 sm:mt-0 flex justify-center">
            <ul className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
              <li>
                <Link
                  to="/leaderboard"
                  className="px-3 py-1.5 rounded-[3px] bg-neutral-900 border border-neutral-800 text-white font-semibold"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="px-3 py-1.5 rounded-[3px] text-gray-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
                >
                  Social Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/community/blogs"
                  className="px-3 py-1.5 rounded-[3px] text-gray-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
                >
                  Tech Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/community/projects"
                  className="px-3 py-1.5 rounded-[3px] text-gray-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </nav>

          <div className="order-2 sm:order-3 flex items-center gap-4">
            <Link
              to="/feed"
              aria-label="Notifications"
              className="text-gray-400 hover:text-white transition-colors text-lg"
            >
              <Bell className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center">
                <img
                  src={userAvatar}
                  alt={user?.username || 'User Avatar'}
                  className="w-9 h-9 rounded-[3px] object-cover border border-neutral-700 shadow-sm hover:scale-105 transition-transform"
                />
              </Link>
            ) : (
              <Link
                to="/join"
                className="h-9 px-4 rounded-[3px] bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold tracking-wider transition-colors shadow-md uppercase flex items-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TIMEFRAME TABS */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-black p-1 rounded-[3px] border border-neutral-800 shadow-inner gap-1">
            {(['overall', 'daily', 'weekly', 'monthly'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-5 py-1.5 rounded-[3px] text-xs font-semibold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* TOP PLAYERS SHOWCASE */}
            <div className="mb-16">
              <div className="flex flex-col lg:flex-row justify-center items-center lg:items-end gap-8 pt-16">
                
                {/* #2 PLAYER CARD */}
                {player2 ? (
                  <div className="w-full max-w-[280px] min-h-[255px] bg-neutral-950/80 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border border-neutral-800 order-2 lg:order-1">
                    <img
                      src={player2.profile_pic || defaultAvatar}
                      alt={player2.full_name || player2.username}
                      className="w-[120px] h-[120px] rounded-[3px] object-cover border-2 border-neutral-700 absolute -top-[60px] left-1/2 -translate-x-1/2 shadow-lg"
                    />
                    <h3 className="text-lg font-bold text-white mt-16 mb-2 truncate max-w-[230px]">
                      {player2.full_name || player2.username}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 bg-neutral-900 px-3 py-1 rounded-[3px] border border-neutral-800">
                      <Trophy className="w-3.5 h-3.5 text-[#f7cd57]" />
                      <span>Rank #2</span>
                    </div>
                    <div className="flex flex-col items-center text-[#f7cd57] font-bold">
                      <Gem className="w-6 h-6 text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
                      <span className="text-2xl font-rajdhani">
                        {timeframe === 'daily'
                          ? player2.daily_points
                          : timeframe === 'weekly'
                          ? player2.weekly_points
                          : timeframe === 'monthly'
                          ? player2.monthly_points
                          : player2.total_points}
                      </span>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">Total Points</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[280px] min-h-[240px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border border-dashed border-neutral-800 order-2 lg:order-1">
                    <div className="w-16 h-16 rounded-[3px] bg-neutral-900 flex items-center justify-center text-gray-500 mb-3">
                      #2
                    </div>
                    <p className="text-xs text-gray-400">Position Open</p>
                  </div>
                )}

                {/* #1 MAIN PLAYER CARD */}
                {player1 ? (
                  <div className="w-full max-w-[300px] min-h-[290px] bg-neutral-950 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border-2 border-orange-500/80 lg:-translate-y-5 lg:scale-105 order-1 lg:order-2">
                    <img
                      src={player1.profile_pic || defaultAvatar}
                      alt={player1.full_name || player1.username}
                      className="w-[145px] h-[145px] rounded-[3px] object-cover border-2 border-orange-500 absolute -top-[72px] left-1/2 -translate-x-1/2 shadow-xl"
                    />
                    <h3 className="text-xl font-bold text-white mt-20 mb-2 truncate max-w-[250px]">
                      {player1.full_name || player1.username}
                    </h3>
                    <div className="flex items-center gap-2 text-white text-xs mb-3 bg-orange-500/15 px-3.5 py-1 rounded-[3px] border border-orange-500/30">
                      <Trophy className="w-3.5 h-3.5 text-[#f7cd57]" />
                      <span className="font-semibold text-orange-300">Top Rank #1</span>
                    </div>
                    <div className="flex flex-col items-center text-white font-bold">
                      <Gem className="w-7 h-7 text-cyan-400 mb-1 drop-shadow-[0_0_12px_rgba(0,188,212,0.8)] animate-pulse" />
                      <span className="text-3xl font-rajdhani text-yellow-300">
                        {timeframe === 'daily'
                          ? player1.daily_points
                          : timeframe === 'weekly'
                          ? player1.weekly_points
                          : timeframe === 'monthly'
                          ? player1.monthly_points
                          : player1.total_points}
                      </span>
                      <p className="text-xs text-gray-300 font-normal mt-0.5">Total Points</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[300px] min-h-[270px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border-2 border-dashed border-orange-500/40 order-1 lg:order-2">
                    <div className="w-20 h-20 rounded-[3px] bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 font-bold text-xl mb-3">
                      #1
                    </div>
                    <p className="text-sm text-gray-300 font-semibold">Top Rank Open</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to solve DSA problems!</p>
                  </div>
                )}

                {/* #3 PLAYER CARD */}
                {player3 ? (
                  <div className="w-full max-w-[280px] min-h-[255px] bg-neutral-950/80 rounded-[3px] p-6 text-center flex flex-col justify-end items-center relative shadow-2xl border border-neutral-800 order-3">
                    <img
                      src={player3.profile_pic || defaultAvatar}
                      alt={player3.full_name || player3.username}
                      className="w-[120px] h-[120px] rounded-[3px] object-cover border-2 border-neutral-700 absolute -top-[60px] left-1/2 -translate-x-1/2 shadow-lg"
                    />
                    <h3 className="text-lg font-bold text-white mt-16 mb-2 truncate max-w-[230px]">
                      {player3.full_name || player3.username}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 bg-neutral-900 px-3 py-1 rounded-[3px] border border-neutral-800">
                      <Trophy className="w-3.5 h-3.5 text-[#cd7f32]" />
                      <span>Rank #3</span>
                    </div>
                    <div className="flex flex-col items-center text-[#f7cd57] font-bold">
                      <Gem className="w-6 h-6 text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
                      <span className="text-2xl font-rajdhani">
                        {timeframe === 'daily'
                          ? player3.daily_points
                          : timeframe === 'weekly'
                          ? player3.weekly_points
                          : timeframe === 'monthly'
                          ? player3.monthly_points
                          : player3.total_points}
                      </span>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">Total Points</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[280px] min-h-[240px] bg-neutral-950/50 rounded-[3px] p-6 text-center flex flex-col justify-center items-center border border-dashed border-neutral-800 order-3">
                    <div className="w-16 h-16 rounded-[3px] bg-neutral-900 flex items-center justify-center text-gray-500 mb-3">
                      #3
                    </div>
                    <p className="text-xs text-gray-400">Position Open</p>
                  </div>
                )}

              </div>
            </div>

            {/* USER STATS BANNER */}
            <div className="text-center text-sm text-gray-400 mb-10 py-3 px-6 rounded-[3px] bg-neutral-950 border border-neutral-800 max-w-xl mx-auto">
              {isAuthenticated ? (
                <span>
                  You are ranked{' '}
                  <strong className="text-orange-400 font-bold text-base px-1">
                    {currentRank}
                  </strong>{' '}
                  out of <span className="text-white font-semibold">{totalCount} users</span>
                </span>
              ) : (
                <span>
                  <Link to="/join" className="text-orange-400 hover:underline font-semibold">
                    Create an account
                  </Link>{' '}
                  to climb the leaderboard and track your daily coding rank!
                </span>
              )}
            </div>

            {/* LEADERBOARD TABLE */}
            <div className="w-full overflow-x-auto rounded-[3px] shadow-2xl border border-neutral-800 bg-neutral-950">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-neutral-900 text-gray-300 text-xs font-semibold uppercase tracking-wider border-b border-neutral-800">
                    <th className="py-4 px-6 text-center w-24">Rank</th>
                    <th className="py-4 px-6">User Name</th>
                    <th className="py-4 px-6 text-right">Total Points</th>
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
                          <td className="py-4 px-6 text-center font-bold text-base text-gray-300">
                            {rankNumber}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={player.profile_pic || defaultAvatar}
                                alt={player.full_name || player.username}
                                className="w-10 h-10 rounded-[3px] object-cover border border-neutral-700"
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
                          <td className="py-4 px-6 text-right font-rajdhani font-bold text-xl text-cyan-400">
                            <div className="inline-flex items-center gap-2 justify-end">
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
                          ? 'No players ranked yet. Solve problems to claim the top spot!'
                          : 'All current ranked players are shown in the top podium.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
