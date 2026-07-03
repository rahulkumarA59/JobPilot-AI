import React from 'react';
import { motion } from 'framer-motion';

import useJobDiscoveryStore from '@/store/jobDiscoveryStore';

const JobDiscoveryDashboard = () => {
  const {
    totalJobsFoundToday,
    newJobs,
    jobsReadyForMatching,
    duplicateJobsRemoved,
    sourcesActive,
    aiDiscoveryStatus,
    recentJobSources,
    discoveryActivity,
  } = useJobDiscoveryStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Job Discovery Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Example Card Structure */}
        <Card title="Total Jobs Found Today" value={totalJobsFoundToday.toLocaleString()} />
        <Card title="New Jobs" value={newJobs.toLocaleString()} />
        <Card title="Jobs Ready for Matching" value={jobsReadyForMatching.toLocaleString()} />
        <Card title="Duplicate Jobs Removed" value={duplicateJobsRemoved.toLocaleString()} />
        <Card title="Sources Active" value={sourcesActive} />
        <Card title="AI Discovery Status" value={aiDiscoveryStatus} />
      </div>

      {/* Recent Job Sources */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 glassmorphism">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Job Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobSources.map((source) => (
            <SourceCard
              key={source.name}
              name={source.name}
              status={source.status}
              jobsFound={source.jobsFound}
              lastScan={source.lastScan}
              health={source.health}
            />
          ))}
        </div>
      </section>

      {/* Discovery Activity */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 glassmorphism">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Discovery Activity</h2>
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
          {discoveryActivity.map((activity, index) => (
            <TimelineItem
              key={index}
              time={activity.time}
              description={activity.description}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 glassmorphism">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <QuickActionButton label="Scan All Sources" />
          <QuickActionButton label="Pause Discovery" />
          <QuickActionButton label="View Job Queue" />
          <QuickActionButton label="View Analytics" />
        </div>
      </section>

    </motion.div>
  );
};

// Reusable Card Component
interface CardProps {
  title: string;
  value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 glassmorphism flex flex-col justify-between"
  >
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{title}</h3>
    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{value}</p>
  </motion.div>
);

// Source Card Component
interface SourceCardProps {
  name: string;
  status: string;
  jobsFound: number;
  lastScan: string;
  health: string;
}

const SourceCard: React.FC<SourceCardProps> = ({ name, status, jobsFound, lastScan, health }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 glassmorphism flex flex-col justify-between"
  >
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{name}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">Status: <span className={`${status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{status}</span></p>
    <p className="text-sm text-gray-600 dark:text-gray-300">Jobs Found: {jobsFound}</p>
    <p className="text-sm text-gray-600 dark:text-gray-300">Last Scan: {lastScan}</p>
    <p className="text-sm text-gray-600 dark:text-gray-300">Health: <span className={`${health === 'Good' ? 'text-green-500' : 'text-red-500'}`}>{health}</span></p>
  </motion.div>
);

// Timeline Item Component
interface TimelineItemProps {
  time: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ time, description }) => (
  <div className="relative mb-4 last:mb-0">
    <div className="absolute -left-1.5 top-0 mt-1 h-3 w-3 rounded-full bg-blue-600 z-10"></div>
    <div className="ml-6">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{time}</p>
      <p className="text-gray-800 dark:text-gray-100">{description}</p>
    </div>
  </div>
);

// Quick Action Button Component
interface QuickActionButtonProps {
  label: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
  >
    {label}
  </motion.button>
);

export default JobDiscoveryDashboard;