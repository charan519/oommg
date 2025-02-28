import React from 'react';
import { X, Trophy, Star, Target, Camera } from 'lucide-react';

interface ChallengesPanelProps {
  onClose: () => void;
}

export function ChallengesPanel({ onClose }: ChallengesPanelProps) {
  const challenges = [
    {
      id: 1,
      title: "Heritage Explorer",
      description: "Visit 3 historical monuments",
      progress: 2,
      total: 3,
      reward: "150 points",
      icon: Trophy,
    },
    {
      id: 2,
      title: "Foodie Adventure",
      description: "Try 5 local dishes",
      progress: 3,
      total: 5,
      reward: "200 points",
      icon: Star,
    },
    {
      id: 3,
      title: "Photo Master",
      description: "Capture 10 landmark photos",
      progress: 7,
      total: 10,
      reward: "300 points",
      icon: Camera,
    },
  ];

  return (
    <div className="absolute top-20 right-8 z-[1000] w-96 max-h-[calc(100vh-160px)] bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Travel Challenges</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            const progress = (challenge.progress / challenge.total) * 100;

            return (
              <div
                key={challenge.id}
                className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center group-hover:bg-purple-500/50 transition-colors">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">{challenge.description}</p>

                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="absolute left-0 top-0 h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        {challenge.progress} / {challenge.total}
                      </span>
                      <span className="text-purple-400 font-medium">
                        {challenge.reward}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-purple-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Your Travel Score</span>
            <span className="text-purple-400 font-bold">1,250 pts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-white/70 text-sm">Next reward at 1,500 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}