import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.ANDREW_MADSON,
  HOSTS.HARSHA_KALBALIA,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Iceberg for Agents: Building AI-Ready Data Pipelines',
    summary: 'AI agents fail in production because they\'re overwhelmed with data but starved for context. LLM models aren\'t the problem. The bottleneck is the data stack: fragmented silos, inconsistent definitions, and logic hidden in tribal knowledge. Agents need structured, reliable, and interpretable context—not just data access. In this session, we\'ll show how Apache Iceberg becomes the backbone of AI-ready pipelines. You\'ll learn how to elevate your Iceberg implementation from a storage format to a live context layer that powers structured retrieval-augmented generation (RAG), schema-aware agents, and autonomous reasoning grounded in truth.',
  };

  return (
    <Layout
      title={webinarData.title}
      description={webinarData.summary}
    >
      <main className="container mx-auto lg:px-36 py-12">
        <CentralizedBreadcrumbs
          type="webinar"
          title={webinarData.title}
        />
        <WebinarTitle
          title={webinarData.title}
          tag="Webinar"
        />

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="duOEjA8P2Qo" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="January 8, 2025"
          time="8:30 PM IST"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Iceberg Foundations for AI - from ACID to Time Travel",
            "From Rows to Relationships - The role of the semantic layer",
            "Structured RAG in Practice - Fully open source",
            "Solving State Skew: How snapshot isolation prevents agents from reasoning across inconsistent data states",
            "The 4 levels of AI-ready data: Raw → Structured → Context → Action",
            "Hybrid retrieval architecture: Combining structured RAG (deterministic) with vector RAG (contextual)",
            "Live demo: Open-source stack with semantic query translation",
            "Architecture diagrams, real code, and production patterns"
          ]}
        />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>
    </Layout>
  );
};

export default WebinarPage;

