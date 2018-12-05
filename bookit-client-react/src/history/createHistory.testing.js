import { createMemoryHistory } from 'history'

// For testing, we cannot use browserHistory since there's no browser
// involved (except in ui/e2e testing) so any tests that rely on
// inspecting history state will fail unless we use an in-memory history
export default createMemoryHistory()
