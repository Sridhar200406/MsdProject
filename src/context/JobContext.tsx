import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  employerId: string;
  applications: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  resume: string;
  coverLetter: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  appliedDate: Date;
}

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'applications'>) => void;
  applyToJob: (application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  getJobById: (id: string) => Job | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $160,000',
      description: 'We are looking for a senior software engineer to join our team...',
      requirements: ['5+ years React experience', 'Node.js proficiency', 'TypeScript knowledge'],
      postedDate: new Date('2024-01-15'),
      employerId: 'emp1',
      applications: []
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      description: 'Join our creative team as a UX/UI designer...',
      requirements: ['3+ years design experience', 'Figma proficiency', 'Portfolio required'],
      postedDate: new Date('2024-01-10'),
      employerId: 'emp2',
      applications: []
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      description: 'Lead product development initiatives...',
      requirements: ['MBA preferred', 'Agile experience', '5+ years product management'],
      postedDate: new Date('2024-01-12'),
      employerId: 'emp3',
      applications: []
    }
  ]);

  const [applications, setApplications] = useState<Application[]>([]);

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate' | 'applications'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date(),
      applications: []
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const applyToJob = (applicationData: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedDate: new Date(),
      status: 'pending'
    };
    
    setApplications(prev => [newApplication, ...prev]);
    setJobs(prev => prev.map(job => 
      job.id === applicationData.jobId 
        ? { ...job, applications: [newApplication, ...job.applications] }
        : job
    ));
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status } : app
    ));
    setJobs(prev => prev.map(job => ({
      ...job,
      applications: job.applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    })));
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      applyToJob,
      updateApplicationStatus,
      getJobById
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}