import React from 'react';
import '../styles/Conversations.css';
import '../styles/ConversationsSkeleton.css';

const ConversationsSkeleton = () => {
    const SkeletonItem = () => (
        <div className="conversation-item">
            <div className="conversation-avatar">
                <div className="skeleton skeleton-circle"></div>
            </div>
            <div className="conversation-content">
                <div className="conversation-header-info">
                    <div className="skeleton skeleton-line w-40"></div>
                    <div className="skeleton skeleton-line w-20"></div>
                </div>
                <div className="skeleton skeleton-line w-80"></div>
            </div>
        </div>
    );

    return (
        <div className="conversations-page">
            <div className="conversations-container">
                <div className="conversations-header">
                    <div className="header-top">
                        <div className="skeleton skeleton-back-button"></div>
                        <div className="skeleton skeleton-line skeleton-title"></div>
                    </div>
                    <div className="skeleton skeleton-search-bar"></div>
                </div>
                <div className="conversations-list">
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
            </div>
        </div>
    );
};
export default ConversationsSkeleton;