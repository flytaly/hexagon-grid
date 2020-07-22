import React from 'react'
import { NextPage } from 'next'
import HelpPageContainer from '../components/help/help-page-container'

const HelpPage: NextPage = () => {
    return <HelpPageContainer initTab={2} />
}

export default HelpPage
