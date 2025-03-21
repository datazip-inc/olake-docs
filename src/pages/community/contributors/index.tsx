import React = require('react')
import Layout from '@theme/Layout'
import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/card';

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.github.com/repos/datazip-inc/olake/contributors');
        
        if (!response.ok) {
          throw new Error(`Error fetching contributors: ${response.status}`);
        }
        
        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributors');
        console.error('Error fetching contributors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <Layout title='OLake Contributors' description='OLake Contributors'>
      <div className='container mx-auto items-center px-12 py-12'>
        <h1 className='mb-8 text-4xl font-bold'>Our contributors</h1>
        <h2 className='mb-8'>Here’s the list of our top contributors!</h2>
        
        {loading && <p className="text-center py-8">Loading contributors...</p>}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            <p>Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={contributor.avatar_url} 
                    alt={`${contributor.login}'s avatar`} 
                    className="w-20 h-20 rounded-full mb-3"
                  />
                  <h3 className="font-semibold text-lg">{contributor.login}</h3>
                  <p className="text-sm text-gray-600">{contributor.contributions} contributions</p>
                </a>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && !error && contributors.length === 0 && (
          <p className="text-center py-8">No contributors found.</p>
        )}
      </div>
    </Layout>
  )
}

export default ContributorsPage