import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import RaadpleegPlanningAndReleases from './RaadpleegPlanningAndReleases'

describe('RaadpleegPlanningAndReleases', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegPlanningAndReleases {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Planning & Releases')
        expect(element).toBeTruthy()
    })
})
