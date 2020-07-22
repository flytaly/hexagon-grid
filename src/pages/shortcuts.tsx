import React from 'react'
import { NextPage } from 'next'
import HelpPageContainer from '../components/help/help-page-container'

const HelpPage: NextPage = () => {
    return <HelpPageContainer initTab={1} />
}

export default HelpPage
