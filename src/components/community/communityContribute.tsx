import React from 'react'

import SectionLayout from './SectionLayout'
import { Card } from '../ui/card';
const CommunityContribute = () => {
    
    return (
        <SectionLayout className='flex flex-row items-center justify-cente'>
            <div className='flex flex-col items-center justify-center space-y-6 text-center'>
                <h1 >How to contribute to OLake</h1>
                <h6 className='text-[20px]'>Are you ready to make your mark on OLake?
                We welcome contributions from everyone, whether you're a seasoned developer or not.</h6>
                <Card className='p-4 justify-center'>
                    <div className='flex flex-col space-y-4 justify-center items-center'>
                        <div className='text-[26px] font-semibold'>Reward program to get <br></br> swag & more</div>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <div>New low-code connector</div>
                                <div>50</div>
                            </div>
                            <div className='flex justify-between '>
                                <div>New tutorial or quick start</div>
                                <div>20</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>15-min interview</div>
                                <div>10</div>
                            </div>
                        </div>
                        <div className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white font-bold'>Check the reward Program</div>
                    </div>  
                </Card>
            </div>
        </SectionLayout>
    )
}


export default CommunityContribute
