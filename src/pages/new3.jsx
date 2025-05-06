import Layout from '@theme/Layout'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import DataWarehouseToLakes from '../components/site/DataWarehouseToLakes';
import WorkflowSection from '../components/site/WorkflowSection';
import IcebergHero from '../components/site/IcebergHero';
import BenchmarkSection from '../components/site/BenchmarkSection';
import FeatureShowcase from '../components/site/FeatureShowcase';
import SetupStepsSection from '../components/site/SetupStepsSection';
import RegistrationSection from '../components/site/RegistrationSection';
import BlogShowcase from '../components/site/BlogShowcase';

export default function New3Page() {
    const childRef = useRef()
      const formRef = useRef(null)
      const history = useHistory()
      // const isMobile = useIsMobile()
    
      useEffect(() => {
        if (childRef.current && childRef.current.init) {
          childRef.current.init()
        }
        const script = document.createElement('script')
        script.src = 'https://js.hsforms.net/forms/v2.js'
        script.async = true
        script.onload = () => {
          window.hbspt.forms.create({
            target: '#olake-product-form',
            portalId: '21798546',
            formId: '86391f69-48e0-4b35-8ffd-13ac212d8208'
          })
        }
        document.body.appendChild(script)
      }, [])
    
      useEffect(() => {
        if (window.location.hash === '#olake-product-form') {
          setTimeout(() => {
            window.scrollTo(0, formRef.current.offsetTop)
          }, 0)
          console.log('hereee', window.location.pathname, window.location.search)
          history.replace({
            pathname: window.location.pathname,
            search: window.location.search
          })
        }
      }, [history, history.location.hash])


    return (
        <Layout
            title='OLake'
            description='Fastest Database to Data Lakehouse data replication tool, open sourced'
        >
            <div className=" bg-white dark:bg-white">
                <DataWarehouseToLakes />
                <WorkflowSection />
                <IcebergHero />
                <BenchmarkSection />
                <FeatureShowcase />
                <SetupStepsSection />
                <RegistrationSection />
                <BlogShowcase />
            </div>
        </Layout>
    );
}
