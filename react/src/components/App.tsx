import { useEffect, useRef } from 'react'
import Header from './Header'
import SubscriptionForm from './SubscriptionForm'
import UnsubscriptionForm from './UnsubscriptionForm'
import SubscriberCount from './SubscriberCount'
import FeaturesPromo from './FeaturesPromo'
import LatestSubscribers from './LatestSubscribers'
import { useAppDispatch } from '../store'
import { fetchLatestSubscribersThunk, fetchSubscribersCountThunk } from '../api'

function App() {
  const dispatch = useAppDispatch()

  const hasFetched = useRef(false)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    dispatch(fetchSubscribersCountThunk())
    dispatch(fetchLatestSubscribersThunk())

  }, [dispatch])


  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchSubscribersCountThunk())
      dispatch(fetchLatestSubscribersThunk())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Header />

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <SubscriptionForm />
              <UnsubscriptionForm />
            </div>

            {/* Statistics Panel */}
            <div className="space-y-6">
              {/* Subscriber Count */}
              <SubscriberCount />

              {/* Latest Subscriber */}
              <LatestSubscribers />

              {/* Features */}
              <FeaturesPromo />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
