import React from 'react'
import { Container } from '@material-ui/core'
import Meta from './meta'

type Props = {
    children: React.ReactNode
}

const Page = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <Container maxWidth={false}>{children}</Container>
        </>
    )
}

export default Page
