import type * as Data from './data/mockData';
export type ScreenType = 'home-discover' | 'student-dashboard' | 'careers-roadmap' | 'colleges-admissions' | 'community-feed' | 'community-discussion' | 'account';
export type College = typeof Data.INITIAL_COLLEGES[number];
export type CareerPathway = typeof Data.FEATURED_CAREERS[number];
export type MilestoneStage = typeof Data.FULL_STACK_MILESTONES[number];
type DiscussionSample = typeof Data.INITIAL_DISCUSSIONS[number];
export type CommunityDiscussion = {
 id:string; title:string; body:string; author:DiscussionSample['author']; timeAgo:string; viewsCount:string; tags:string[]; upvotes:number; hasUpvoted?:boolean; answersCount:number; isSaved?:boolean; isPinned?:boolean;
 topAnswerPreview?:DiscussionSample['topAnswerPreview']; metricsHighlight?:DiscussionSample['metricsHighlight']; liveProjectAttachment?:DiscussionSample['liveProjectAttachment'];
};
type AnswerSample = typeof Data.DISCUSSION_1_ANSWERS[number];
export type CommunityAnswer = {
 id:string; author:AnswerSample['author']; timeAgo:string; steps:AnswerSample['steps']; upvotes:number; helpfulCount?:number; nestedCount:number; hasUpvoted?:boolean; hasMarkedHelpful?:boolean;
 endorsedBy?:AnswerSample['endorsedBy']; proTip?:AnswerSample['proTip']; codeSnippet?:AnswerSample['codeSnippet'];
};
export type DeadlineItem = typeof Data.CRITICAL_DEADLINES[number];
export type ResourceItem = typeof Data.RECENT_RESOURCES[number];
export type SpotlightMentor = typeof Data.SPOTLIGHT_MENTORS[number];
