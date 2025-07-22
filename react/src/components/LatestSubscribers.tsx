import { useAppSelector } from "../store"
import { selectLatestSubscribers } from "../subscribersSlice"
import type { Subscriber } from "../types"

export function LatestSubscriber({ latestSubscriber }: { latestSubscriber: Subscriber }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-900 font-medium">{latestSubscriber.name}</span>
      </div>
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span className="text-gray-700">{latestSubscriber.email}</span>
      </div>
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <span className="text-gray-500 text-sm">
          {new Date(latestSubscriber.created_at).toLocaleString('hu-HU')}
        </span>
      </div>
    </div>
  )
}

export default function LatestSubscribers() {
  const latestSubscribers = useAppSelector(selectLatestSubscribers)
  console.log("Latest Subscribers:", latestSubscribers)
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Legutóbbi feliratkozók</h3>
      {latestSubscribers.length === 0 ? (
        <p className="text-gray-500">Nincsenek feliratkozók.</p>
      ) : (
        <div className="space-y-4">
          {latestSubscribers.map((subscriber, key) => (
            <LatestSubscriber key={key} latestSubscriber={subscriber} />
          ))}
        </div>
      )}

    </div>
  )
}