'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { metricsApi, dataApi } from '@/lib/api';
import { FactoryMetrics, WorkerMetrics, WorkstationMetrics } from '@/types';

export default function DashboardPage() {
    const router = useRouter();
    const [factoryMetrics, setFactoryMetrics] = useState<FactoryMetrics | null>(null);
    const [workerMetrics, setWorkerMetrics] = useState<WorkerMetrics[]>([]);
    const [workstationMetrics, setWorkstationMetrics] = useState<WorkstationMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            router.push('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        loadMetrics();
    }, [router]);

    const loadMetrics = async () => {
        try {
            const [factory, workers, workstations] = await Promise.all([
                metricsApi.getFactoryMetrics(),
                metricsApi.getWorkerMetrics(),
                metricsApi.getWorkstationMetrics(),
            ]);

            setFactoryMetrics(factory);
            setWorkerMetrics(workers);
            setWorkstationMetrics(workstations);
        } catch (error) {
            console.error('Failed to load metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        setSeeding(true);
        try {
            await dataApi.seedData();
            await loadMetrics();
        } catch (error) {
            console.error('Failed to seed data:', error);
            alert('Failed to seed data');
        } finally {
            setSeeding(false);
        }
    };

    const handleResetData = async () => {
        if (!confirm('⚠️ This will DELETE all data and reseed with fresh data. Continue?')) {
            return;
        }
        setResetting(true);
        try {
            await dataApi.resetData();
            await loadMetrics();
            alert('✅ Data reset successful! Created 6 workers, 6 stations, 200+ events');
        } catch (error: any) {
            console.error('Failed to reset data:', error);
            if (error.response?.status === 403) {
                alert('❌ Admin access required');
            } else {
                alert('❌ Failed to reset data');
            }
        } finally {
            setResetting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Factory Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button
                                onClick={handleSeedData}
                                disabled={seeding}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                            >
                                {seeding ? 'Seeding...' : 'Seed Data'}
                            </button>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={handleResetData}
                                    disabled={resetting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
                                    title="Delete all data and reseed (Admin only)"
                                >
                                    {resetting ? 'Resetting...' : 'Reset Data'}
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {factoryMetrics && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Factory Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Productive Time"
                                value={`${factoryMetrics.totalProductiveTime.toFixed(1)} min`}
                                color="blue"
                            />
                            <MetricCard
                                title="Total Production"
                                value={factoryMetrics.totalProductionCount.toString()}
                                color="green"
                            />
                            <MetricCard
                                title="Avg Production Rate"
                                value={`${factoryMetrics.averageProductionRate.toFixed(1)} units/hr`}
                                color="purple"
                            />
                            <MetricCard
                                title="Avg Utilization"
                                value={`${factoryMetrics.averageUtilization.toFixed(1)}%`}
                                color="orange"
                            />
                        </div>
                    </div>
                )}

                {workerMetrics.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Worker Metrics</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Worker
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Active Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Idle Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Utilization
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Units
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Units/Hour
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {workerMetrics.map((worker) => (
                                            <tr key={worker.workerId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                                                    <div className="text-xs text-gray-500">{worker.workerId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {worker.totalActiveTime.toFixed(1)} min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {worker.totalIdleTime.toFixed(1)} min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${worker.utilizationPercentage >= 80
                                                        ? 'bg-green-100 text-green-800'
                                                        : worker.utilizationPercentage >= 60
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {worker.utilizationPercentage.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {worker.totalUnits}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {worker.unitsPerHour.toFixed(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {workstationMetrics.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Workstation Metrics</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Workstation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Occupancy Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Utilization
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Units
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Throughput
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {workstationMetrics.map((station) => (
                                            <tr key={station.stationId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{station.name}</div>
                                                    <div className="text-xs text-gray-500">{station.stationId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {station.occupancyTime.toFixed(1)} min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${station.utilizationPercentage >= 80
                                                        ? 'bg-green-100 text-green-800'
                                                        : station.utilizationPercentage >= 60
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {station.utilizationPercentage.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {station.totalUnits}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {station.throughputRate.toFixed(1)} units/hr
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, color }: MetricCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200',
        orange: 'bg-orange-50 border-orange-200',
    };

    const textClasses = {
        blue: 'text-blue-900',
        green: 'text-green-900',
        purple: 'text-purple-900',
        orange: 'text-orange-900',
    };

    return (
        <div className={`${colorClasses[color]} border rounded-lg p-6`}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${textClasses[color]}`}>{value}</p>
        </div>
    );
}
