import React from 'react'
import { RobotIcon } from '../../assets'
import './style.scss'

const Loading = () => {
    return (
        <div data-for='Loading'>
            <div className="inner">
                <RobotIcon />
                <div data-for="text">Please stand by, while we are checking your browser...</div>
            </div>
        </div>
    )
}

export default Loading
