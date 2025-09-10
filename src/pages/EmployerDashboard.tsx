import React, { useState } from 'react';
import { Plus, Briefcase, Users, TrendingUp, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import JobPostModal from '../components/JobPostModal';
import type { Application } from '../context/JobContext';

export default function EmployerDashboard() {
  const { jobs, addJob, updateApplicationStatus } = useJobs();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'jobs' | 'applications'>('overview');

  const userJobs = jobs.filter(job => job.employerId === user?.id);
  const allApplications = userJobs.flatMap(job => 
    job.applications.map(app => ({ ...app, jobTitle: job.title }))
  );

  const stats = {
    totalJobs: userJobs.length,
    totalApplications: allApplications.length,
    pendingApplications: allApplications.filter(app => app.status === 'pending').length,
    shortlistedCandidates: allApplications.filter(app => app.status === 'shortlisted').length
  };

  const handleJobPost = (jobData: any) => {
    addJob({
      ...jobData,
      employerId: user!.id
    });
    
    showNotification({
      title: 'Job Posted!',
      message: 'Your job posting is now live',
      type: 'success'
    });
    
    setShowJobModal(false);
  };

  const handleApplicationAction = (applicationId: string, status: Application['status']) => {
    updateApplicationStatus(applicationId, status);
    
    const actionText = status === 'shortlisted' ? 'shortlisted' : 
                     status === 'rejected' ? 'rejected' : 'hired';
    
    showNotification({
      title: 'Application Updated',
      message: `Candidate has been ${actionText}`,
      type: status === 'rejected' ? 'warning' : 'success'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => setShowJobModal(true)}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.shortlistedCandidates}</p>
                <p className="text-gray-600">Shortlisted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('jobs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Jobs ({userJobs.length})
              </button>
              <button
                onClick={() => setSelectedTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({allApplications.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                {allApplications.length > 0 ? (
                  <div className="space-y-4">
                    {allApplications.slice(0, 5).map((application: any) => (
                      <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {application.candidateName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{application.candidateName}</p>
                            <p className="text-sm text-gray-600">Applied for {application.jobTitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {application.appliedDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400">Applications will appear here once candidates start applying</p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'jobs' && (
              <div className="space-y-6">
                {userJobs.length > 0 ? (
                  <div className="space-y-4">
                    {userJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                            <p className="text-gray-600">{job.location} • {job.type}</p>
                            <p className="text-green-600 font-medium">{job.salary}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{job.applications.length} applications</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements.map((req, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Posted on {job.postedDate.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No job postings yet</p>
                    <p className="text-sm text-gray-400 mb-4">Create your first job posting to start receiving applications</p>
                    <button
                      onClick={() => setShowJobModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Post Your First Job
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'applications' && (
              <div className="space-y-6">
                {allApplications.length > 0 ? (
                  <div className="space-y-4">
                    {allApplications.map((application: any) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                {application.candidateName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{application.candidateName}</h4>
                                <p className="text-gray-600">{application.candidateEmail}</p>
                                <p className="text-sm text-gray-500">Applied for: {application.jobTitle}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                            
                            {application.coverLetter && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">Cover Letter:</h5>
                                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}
                            
                            <div className="text-sm text-gray-500">
                              Applied on {application.appliedDate.toLocaleDateString()}
                            </div>
                          </div>
                          
                          {application.status === 'pending' && (
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                              <button
                                onClick={() => handleApplicationAction(application.id, 'shortlisted')}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleApplicationAction(application.id, 'rejected')}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications received</p>
                    <p className="text-sm text-gray-400">Applications will appear here once candidates start applying to your jobs</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Post Modal */}
      {showJobModal && (
        <JobPostModal
          onSubmit={handleJobPost}
          onClose={() => setShowJobModal(false)}
        />
      )}
    </div>
  );
}