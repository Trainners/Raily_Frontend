export type { JourneySearch, JourneyStatus, SeatedInfo } from './model/types';
export {
    journeySlice,
    setSearch, selectTrain, boardTrain, takeSeat, notifySeatEviction, releaseSeat, finishJourney,
    selectJourneySearch, selectSelectedTrain, selectJourneyStatus, selectHasJourney,
    selectSeatInfo, selectSeatWatchId, selectAlertMessage,
} from './model/journeySlice';
export { toSearchParams } from './model/toSearchParams';
export { saveRecentSegment, getRecentSegment, type RecentSegment } from './model/recentSegment';