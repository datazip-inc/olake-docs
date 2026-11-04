// src/pages/community/proposal-guidelines/index.tsx
import React from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { PiChatsCircle, PiGitBranch, PiArrowUpRight } from 'react-icons/pi'

import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import Breadcrumbs from '@site/src/components/community/lakeside/Breadcrumbs'
import {
  BulletList,
  Column,
  LinkCard,
  Tick
} from '@site/src/components/community/lakeside/primitives'

const CRITERIA = [
  {
    title: "Clear understanding of OLake's architecture and constraints",
    body: "Show that you've read the docs and understand the Go → gRPC → Java writer flow."
  },
  {
    title: 'A realistic scope for the project size',
    body: 'Small (~90h), Medium (~175h), Large (~350h)—match your plan to the size.'
  },
  {
    title: 'Strong milestone planning',
    body: 'Midterm should show meaningful progress; include buffer time and a "code freeze" period for tests/docs.'
  },
  {
    title: 'Evidence you can ship',
    body: 'Prior OSS work or early OLake contributions (even a small PR or doc fix) strengthen your application.'
  },
  {
    title: 'Good communication habits',
    body: 'Responsive, clear, and collaborative in public channels.'
  }
]

const ProposalGuidelinesPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://olake.io/' },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Community',
        'item': 'https://olake.io/community/'
      },
      { '@type': 'ListItem', 'position': 3, 'name': 'Proposal Guidelines', 'item': canonicalUrl }
    ]
  }

  return (
    <CommunityPage
      title='Proposal Submission Guidelines'
      description='How to engage with OLake mentors and submit a strong GSoC proposal: communicate early, keep technical discussion public and improve your chances.'
      activePath='/community'
      hero={
        <PageHero
          badge='GSoC at OLake'
          breadcrumbs={<Breadcrumbs type='community' title='Proposal Submission Guidelines' />}
          title='Proposal Submission Guidelines'
          description='How to engage with OLake mentors and submit a strong GSoC proposal. Follow these guidelines to increase your chances of acceptance.'
          actions={
            <>
              <Button href='/community/proposal-template' size='lg'>
                Open Proposal Template
              </Button>
              <Button href='/community/ideas' variant='secondary' size='lg'>
                View Project Ideas
              </Button>
              <Button href='/community/gsoc' variant='secondary' size='lg'>
                Back to GSoC
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Proposal Submission Guidelines | OLake GSoC' />
        <meta
          property='og:description'
          content='How to engage with OLake mentors and submit a strong GSoC proposal: communicate early, keep technical discussion public and improve your chances.'
        />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <script type='application/ld+json'>{serializeJsonLd(breadcrumbSchema)}</script>
      </Head>

      <div>
        <Section flush className='pt-[8px]'>
          <SectionHeading
            title='Communicate early and in public'
            body='Start discussions early in the community discussion period and keep technical discussion public.'
            align='center'
          />
          <Column>
            <Card className='p-[24px] lg:p-[32px]'>
              <p className='text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                Use GitHub issues/discussions and public Slack channels. Be respectful and concise.
                Introduce yourself, share your interest in a project, and ask clarifying questions
                before the application window closes.
              </p>
            </Card>
          </Column>
        </Section>

        <Section>
          <SectionHeading
            title='Align with OLake contribution workflow'
            body='If you submit any code before selection:'
            align='center'
          />
          <Column width={680}>
            <BulletList>
              <li>Follow OLake&apos;s PR guide</li>
              <li>
                Target the <strong className='font-medium text-olake-ink'>staging</strong> branch
                (feature branches should be created from staging)
              </li>
              <li>Prefer small, reviewable PRs (docs, tests, bugfixes)</li>
              <li>Link your PR(s) in your proposal</li>
            </BulletList>
          </Column>
          <div className='mt-[28px] flex justify-center lg:mt-[36px]'>
            <Button href='/docs/community/contributing' variant='secondary' size='lg'>
              Contributing Guide <PiArrowUpRight aria-hidden='true' />
            </Button>
          </div>
        </Section>

        <Section>
          <SectionHeading
            title='Demonstrate that you can run OLake locally'
            body='Your proposal should state:'
            align='center'
          />
          <Column width={680}>
            <BulletList>
              <li>Which source + destination you used locally (e.g., Postgres → Iceberg)</li>
              <li>How you reproduced or tested the scenario locally</li>
              <li>Any scripts or docker-compose you used</li>
            </BulletList>
          </Column>
          <div className='mt-[28px] flex justify-center lg:mt-[36px]'>
            <Button href='/docs/community/setting-up-a-dev-env' variant='secondary' size='lg'>
              Dev environment guide
            </Button>
          </div>
        </Section>

        <Section>
          <SectionHeading
            title='Proposal format expectations'
            body='We strongly recommend you follow the official Writing a proposal guide.'
            align='center'
          />
          <Column width={680}>
            <p className='text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
              Your proposal must clearly include:
            </p>
            <BulletList className='mt-[14px]'>
              <li>Required deliverables vs optional stretch goals</li>
              <li>Risks + mitigation</li>
              <li>Testing strategy (unit + integration where relevant)</li>
              <li>Documentation plan</li>
            </BulletList>
          </Column>
          <div className='mt-[28px] flex justify-center lg:mt-[36px]'>
            <Button href='/community/proposal-template' size='lg'>
              Use our Proposal Template
            </Button>
          </div>
        </Section>

        <Section>
          <SectionHeading title='How we evaluate proposals' body='We prioritize:' align='center' />
          <Column>
            <ul className='flex flex-col gap-[12px]'>
              {CRITERIA.map((item) => (
                <Card
                  as='li'
                  key={item.title}
                  className='flex items-start gap-[12px] p-[18px] lg:p-[22px]'
                >
                  <Tick />
                  <div>
                    <strong className='block text-[15px] leading-[1.4] font-normal text-olake-ink'>
                      {item.title}
                    </strong>
                    <p className='mt-[4px] text-[14px] leading-[1.6] text-olake-text-2'>
                      {item.body}
                    </p>
                  </div>
                </Card>
              ))}
            </ul>
          </Column>
        </Section>

        <Section>
          <SectionHeading
            title='Where to ask questions'
            body='Reach out before and during the application period.'
            align='center'
          />
          <div className='mx-auto mt-[28px] grid max-w-[760px] grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[40px] lg:gap-[16px]'>
            <LinkCard
              href='https://olake.io/slack/'
              external
              icon={<PiChatsCircle />}
              title='OLake Slack community'
            />
            <LinkCard
              href='https://github.com/datazip-inc/olake/issues'
              external
              icon={<PiGitBranch />}
              title='GitHub issues / discussions'
            />
          </div>
        </Section>

        <Section>
          <Card className='mx-auto max-w-[760px] px-[24px] py-[36px] text-center lg:px-[48px] lg:py-[48px]'>
            <h2 className='text-[26px] leading-[1.15] font-normal tracking-[-0.01em] text-olake-ink lg:text-[34px]'>
              Submit your proposal
            </h2>
            <p className='mt-[12px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
              Submit your proposal via the GSoC web application before Google&apos;s deadline.
            </p>
            <div className='mt-[24px] flex justify-center'>
              <Button href='https://summerofcode.withgoogle.com/' size='lg' external>
                summerofcode.withgoogle.com <PiArrowUpRight aria-hidden='true' />
              </Button>
            </div>
          </Card>
        </Section>
      </div>
    </CommunityPage>
  )
}

export default ProposalGuidelinesPage
