'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Lightbulb, TrendingUp, Shield, Zap, CheckCircle, Clock, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Recommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: string;
  status: 'pending' | 'implemented' | 'dismissed';
  createdAt: string;
  estimatedBenefit: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-600 mt-1">Intelligent suggestions to optimize your IT infrastructure</p>
        </div>
        <Button variant="primary">
          <Lightbulb className="w-4 h-4 mr-2" />
          Generate New Recommendations
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recommendations</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Lightbulb className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <Star className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Implemented</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendation Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                filterCategory === 'performance' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setFilterCategory(filterCategory === 'performance' ? 'all' : 'performance')}
            >
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold">Performance</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Speed improvements</p>
            </div>
            <div
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                filterCategory === 'security' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setFilterCategory(filterCategory === 'security' ? 'all' : 'security')}
            >
              <Shield className="w-8 h-8 text-red-500 mb-2" />
              <h3 className="font-semibold">Security</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Security enhancements</p>
            </div>
            <div
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                filterCategory === 'optimization' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setFilterCategory(filterCategory === 'optimization' ? 'all' : 'optimization')}
            >
              <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold">Optimization</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Resource optimization</p>
            </div>
            <div
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                filterCategory === 'general' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setFilterCategory(filterCategory === 'general' ? 'all' : 'general')}
            >
              <Lightbulb className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="font-semibold">General</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Best practices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Recommendations</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Priority: {filterPriority === 'all' ? 'All' : filterPriority}
              </Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No recommendations yet</p>
              <p className="text-sm mt-2">Run a diagnostic scan to receive AI-powered recommendations</p>
              <Button variant="primary" className="mt-4">
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Recommendations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-6 border-l-4 rounded-lg ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getCategoryIcon(rec.category)}
                        <h3 className="font-semibold text-lg text-gray-900">{rec.title}</h3>
                        <Badge variant={rec.priority === 'HIGH' ? 'danger' : rec.priority === 'MEDIUM' ? 'warning' : 'info'}>
                          {rec.priority} PRIORITY
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{rec.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Impact</p>
                          <p className="font-semibold text-gray-900">{rec.impact}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Effort</p>
                          <p className="font-semibold text-gray-900">{rec.effort}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Estimated Benefit</p>
                          <p className="font-semibold text-green-600">{rec.estimatedBenefit}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Generated: {new Date(rec.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {rec.status === 'ACTIVE' && (
                        <>
                          <Button size="sm" variant="success">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Implement
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="ghost" className="px-2">
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="px-2">
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                      {rec.status === 'implemented' && (
                        <Badge variant="success" className="text-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Implemented
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
