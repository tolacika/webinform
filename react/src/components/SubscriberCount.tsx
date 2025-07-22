import { useAppSelector } from "../store"
import { selectSubscriberCount } from "../subscribersSlice"

export default function SubscriberCount() {
  const count = useAppSelector(selectSubscriberCount)
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 mb-2">{count}</div>
        <div className="text-gray-600 text-lg">Feliratkozó</div>
        <p className="text-sm text-gray-500 mt-2">
          Csatlakozz a közösségünkhöz!
        </p>
      </div>
    </div>
  )
}
