// frontend/src/pages/LeaderboardPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dsaApi } from '../api/dsaApi';
import { LeaderboardEntry, LeaderboardResponse } from '../types/dsa';
import { Spinner } from '../components/ui/Spinner';

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

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const userAvatar = user?.profile?.profile_pic || defaultAvatar;

  const topUsers: LeaderboardEntry[] = data?.top_users || [];
  const otherUsers: LeaderboardEntry[] = data?.other_users || [];
  const totalCount = data?.total_user_count || 0;
  const currentRank = data?.current_user_rank || '-';

  const player1 = topUsers[0] || null;
  const player2 = topUsers[1] || null;
  const player3 = topUsers[2] || null;

  return (
    <div className="w-full flex justify-center items-start min-h-[90vh] py-6 px-2 sm:px-4 font-poppins text-gray-200">
      <div className="w-full max-w-[1200px] bg-[#1c212c] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        
        {/* ================= HEADER ================= */}
        <header className="flex flex-wrap justify-between items-center px-6 sm:px-8 py-4 bg-[#151a24] border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/rt.png"
              alt="Grind 500 Logo"
              className="h-10 w-auto rounded-lg shadow-md object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-bold tracking-tight text-white font-rajdhani uppercase">
              Grind 500 Leaderboard
            </span>
          </div>

          <nav className="order-3 sm:order-2 w-full sm:w-auto mt-3 sm:mt-0">
            <ul className="flex justify-center items-center gap-6 text-sm font-medium">
              <li className="relative">
                <button
                  type="button"
                  className="text-white font-semibold pb-1 relative transition-colors focus:outline-none"
                >
                  Leaderboard
                  <span className="absolute bottom-[-10px] left-0 w-full h-[3px] bg-[#ca651d] rounded-full shadow-[0_0_10px_#ca651d]" />
                </button>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Social Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/community/blogs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tech Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/community/projects"
                  className="text-gray-400 hover:text-white transition-colors"
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
              <i className="fas fa-bell" />
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center">
                <img
                  src={userAvatar}
                  alt={user?.username || 'User Avatar'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#ca651d] shadow-sm hover:scale-105 transition-transform"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#ca651d] hover:bg-[#b05315] text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="p-4 sm:p-8 bg-gradient-to-b from-[#0d111b]/90 to-[#1c212c]/95 backdrop-blur-md">
          
          {/* TIMEFRAME TABS */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-[#2d3442] p-1.5 rounded-full shadow-inner border border-white/5 gap-1">
              {(['overall', 'daily', 'weekly', 'monthly'] as TimeframeType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeframe(t)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 cursor-pointer ${
                    timeframe === t
                      ? 'bg-[#ca651d] text-white shadow-[0_4px_15px_rgba(202,101,29,0.45)]'
                      : 'text-gray-400 hover:text-gray-200 bg-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-gray-400">Loading live rankings...</p>
            </div>
          ) : (
            <>
              {/* TOP PLAYERS SHOWCASE */}
              <div className="flex flex-col lg:flex-row justify-center items-center lg:items-end gap-16 lg:gap-8 mt-28 mb-14">
                
                {/* #2 PLAYER CARD */}
                {player2 ? (
                  <div className="w-full max-w-[280px] min-h-[255px] bg-[#1a202c] rounded-2xl p-6 text-center flex flex-col justify-end items-center relative shadow-[0_8px_25px_rgba(0,0,0,0.4)] border border-white/10 order-2 lg:order-1">
                    <img
                      src={player2.profile_pic || defaultAvatar}
                      alt={player2.full_name || player2.username}
                      className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[#ca651d] absolute -top-[60px] left-1/2 -translate-x-1/2 shadow-lg"
                    />
                    <h3 className="text-lg font-bold text-white mt-16 mb-2 truncate max-w-[230px]">
                      {player2.full_name || player2.username}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 bg-[#4c51bf]/20 px-3 py-1 rounded-full border border-purple-500/20">
                      <i className="fas fa-trophy text-[#f7cd57]" />
                      <span>Rank #2</span>
                    </div>
                    <div className="flex flex-col items-center text-[#f7cd57] font-bold">
                      <i className="fas fa-gem text-cyan-400 text-2xl mb-1 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
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
                  <div className="w-full max-w-[280px] min-h-[240px] bg-[#1a202c]/50 rounded-2xl p-6 text-center flex flex-col justify-center items-center border border-dashed border-gray-700 order-2 lg:order-1">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mb-3">
                      #2
                    </div>
                    <p className="text-xs text-gray-400">Position Open</p>
                  </div>
                )}

                {/* #1 MAIN PLAYER CARD */}
                {player1 ? (
                  <div className="w-full max-w-[300px] min-h-[290px] bg-gradient-to-br from-[#2d3748] to-[#1a202c] rounded-2xl p-6 text-center flex flex-col justify-end items-center relative shadow-[0_15px_40px_rgba(202,101,29,0.5)] border-3 border-[#ca651d] lg:-translate-y-5 lg:scale-105 order-1 lg:order-2">
                    <img
                      src={player1.profile_pic || defaultAvatar}
                      alt={player1.full_name || player1.username}
                      className="w-[145px] h-[145px] rounded-full object-cover border-4 border-[#ca651d] absolute -top-[72px] left-1/2 -translate-x-1/2 shadow-[0_0_0_5px_rgba(202,101,29,0.4)]"
                    />
                    <h3 className="text-xl font-bold text-white mt-20 mb-2 truncate max-w-[250px]">
                      {player1.full_name || player1.username}
                    </h3>
                    <div className="flex items-center gap-2 text-white text-xs mb-3 bg-white/10 px-3.5 py-1 rounded-full border border-yellow-500/30">
                      <i className="fas fa-trophy text-[#f7cd57]" />
                      <span className="font-semibold">Top Rank #1</span>
                    </div>
                    <div className="flex flex-col items-center text-white font-bold">
                      <i className="fas fa-gem text-cyan-400 text-3xl mb-1 drop-shadow-[0_0_12px_rgba(0,188,212,0.8)] animate-pulse" />
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
                  <div className="w-full max-w-[300px] min-h-[270px] bg-gradient-to-br from-[#2d3748]/50 to-[#1a202c]/50 rounded-2xl p-6 text-center flex flex-col justify-center items-center border-2 border-dashed border-[#ca651d]/40 order-1 lg:order-2">
                    <div className="w-20 h-20 rounded-full bg-[#ca651d]/20 border border-[#ca651d] flex items-center justify-center text-[#ca651d] font-bold text-xl mb-3">
                      #1
                    </div>
                    <p className="text-sm text-gray-300 font-semibold">Top Rank Open</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to solve DSA problems!</p>
                  </div>
                )}

                {/* #3 PLAYER CARD */}
                {player3 ? (
                  <div className="w-full max-w-[280px] min-h-[255px] bg-[#1a202c] rounded-2xl p-6 text-center flex flex-col justify-end items-center relative shadow-[0_8px_25px_rgba(0,0,0,0.4)] border border-white/10 order-3">
                    <img
                      src={player3.profile_pic || defaultAvatar}
                      alt={player3.full_name || player3.username}
                      className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[#ca651d] absolute -top-[60px] left-1/2 -translate-x-1/2 shadow-lg"
                    />
                    <h3 className="text-lg font-bold text-white mt-16 mb-2 truncate max-w-[230px]">
                      {player3.full_name || player3.username}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 bg-[#4c51bf]/20 px-3 py-1 rounded-full border border-purple-500/20">
                      <i className="fas fa-trophy text-[#cd7f32]" />
                      <span>Rank #3</span>
                    </div>
                    <div className="flex flex-col items-center text-[#f7cd57] font-bold">
                      <i className="fas fa-gem text-cyan-400 text-2xl mb-1 drop-shadow-[0_0_8px_rgba(0,188,212,0.6)]" />
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
                  <div className="w-full max-w-[280px] min-h-[240px] bg-[#1a202c]/50 rounded-2xl p-6 text-center flex flex-col justify-center items-center border border-dashed border-gray-700 order-3">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mb-3">
                      #3
                    </div>
                    <p className="text-xs text-gray-400">Position Open</p>
                  </div>
                )}

              </div>

              {/* USER STATS BANNER */}
              <div className="text-center text-sm text-gray-400 mb-10 py-3 px-6 rounded-xl bg-[#1a202c]/80 border border-white/5 max-w-xl mx-auto">
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
              <div className="w-full overflow-x-auto rounded-xl shadow-lg border border-white/10 bg-[#1a202c]">
                <table className="w-full text-left border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-[#2d3442] text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6 text-center w-24">Rank</th>
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
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
                            className={`transition-colors hover:bg-[#262c3a] ${
                              isSelf ? 'bg-[#ca651d]/15 border-l-4 border-[#ca651d]' : ''
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
                                  className="w-11 h-11 rounded-full object-cover border-2 border-[#ca651d]"
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
                                <i className="fas fa-gem text-sm" />
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
    </div>
  );
};
