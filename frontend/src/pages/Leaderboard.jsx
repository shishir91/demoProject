import React, { useState } from "react";
import { Star, Trophy, Users } from "lucide-react";
import { Paper } from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";

const Leaderboard = () => {
  const [loading, setLoading] = useState(false);
  const leaders = [
    { rank: 1, name: "Alice", points: 2500 },
    { rank: 2, name: "Bob", points: 2300 },
    { rank: 3, name: "Charlie", points: 2100 },
    { rank: 4, name: "David", points: 1900 },
    { rank: 5, name: "Eve", points: 1800 },
  ];

  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 min-h-screen bg-stone-800 text-gray-100 rounded rounded-xl">
      {loading && <LoadingSpinner />}{" "}
      <div className="max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Trophy size={30} className="text-yellow-500" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Leaderboard
              </h2>
            </div>
            <Users size={30} className="text-blue-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{leader.rank}</td>
                    <td className="py-3 px-4">{leader.name}</td>
                    <td className="py-3 px-4">{leader.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
